import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  AUTH_TOKEN_COOKIE,
  clearAuthCookies,
} from "../_lib/authCookie";
import { getSpringApiBaseUrl } from "../_lib/spring";

// このファイルは、フロントエンドからの /api/... リクエストを
// Next.js経由でSpring Boot APIへ中継するための共通プロキシです。
// ブラウザにはJWTを渡さず、HttpOnly Cookie内のJWTをAuthorizationヘッダーに変換します。

type ApiRouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const publicApiPaths = new Set([
  // ログイン前でも呼び出せるAPIだけを登録します。
  // ここにないAPIは、HttpOnly CookieにJWTがある場合だけSpring Bootへ中継します。
  "auth/register",
]);

const proxyToSpring = async (
  request: NextRequest,
  context: ApiRouteContext
) => {
  const { path } = await context.params;
  const pathText = path.join("/");
  const isPublicApi = publicApiPaths.has(pathText);
  // JWTはHttpOnly Cookieからサーバー側で取り出します。
  // クライアントJavaScriptにはJWTを触らせず、XSS時の流出リスクを下げます。
  const token =
    request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token && !isPublicApi) {
    // 保護APIに未ログイン状態でアクセスした場合は、Spring Bootへ送らずここで止めます。
    return NextResponse.json(
      {
        message: "ログインが必要です",
      },
      { status: 401 }
    );
  }

  const requestUrl = new URL(request.url);
  // Next.js側の /api/foo?bar=baz を、Spring Boot側の /api/foo?bar=baz に変換します。
  // 検索条件などのクエリ文字列も落とさずそのまま引き継ぎます。
  const targetUrl =
    `${getSpringApiBaseUrl()}/api/${pathText}` +
    requestUrl.search;

  // GET/HEADリクエストは仕様上bodyを持てないため、fetchへ渡す前に除外します。
  // POST/PUT/PATCH/DELETEでは、受け取った本文をそのままSpring Bootへ渡します。
  const hasRequestBody =
    request.method !== "GET" &&
    request.method !== "HEAD";

  const springResponse = await fetch(targetUrl, {
    method: request.method,
    headers: {
      // ブラウザから来たAccept/Content-Typeをできるだけ維持し、
      // 認証済みの場合だけAuthorizationヘッダーを追加します。
      Accept:
        request.headers.get("Accept") ||
        "application/json",
      ...(request.headers.get("Content-Type")
        ? {
            "Content-Type":
              request.headers.get("Content-Type") ||
              "",
          }
        : {}),
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
    body: hasRequestBody
      ? await request.arrayBuffer()
      : undefined,
  });

  const responseBody =
    springResponse.status === 204
      ? null
      : await springResponse.arrayBuffer();

  // Spring Bootのレスポンス本文、ステータス、Content-Typeを保ったままブラウザへ返します。
  // JSON以外のレスポンスにも対応できるよう、本文はarrayBufferで扱います。
  const response = new NextResponse(responseBody, {
    status: springResponse.status,
    headers: {
      "Content-Type":
        springResponse.headers.get("Content-Type") ||
        "application/json",
    },
  });

  if (springResponse.status === 401) {
    // Spring Boot側でJWT期限切れなどの401が返った場合は、
    // Next.js側に残っている認証Cookieも破棄して状態のズレを防ぎます。
    clearAuthCookies(response);
  }

  return response;
};

// Route Handlerで扱うHTTPメソッドを、すべて同じプロキシ処理へ接続します。
export const GET = proxyToSpring;
export const POST = proxyToSpring;
export const PUT = proxyToSpring;
export const PATCH = proxyToSpring;
export const DELETE = proxyToSpring;
