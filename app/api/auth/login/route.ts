import { NextResponse } from "next/server";
import {
  setAuthCookies,
  type AuthCookieUser,
} from "../../_lib/authCookie";
import {
  getLoginToken,
  getLoginUser,
  getSpringApiBaseUrl,
} from "../../_lib/spring";

// このファイルは、ログインフォームからのリクエストをSpring Bootへ中継し、
// 返ってきたJWTをHttpOnly Cookieへ保存するログイン用Route Handlerです。

export async function POST(request: Request) {
  // リクエスト本文は一度読むと再利用できないため、文字列として保持します。
  // Spring Bootへ同じ本文を転送しつつ、emailだけはユーザー情報のfallback用に取り出します。
  const bodyText = await request.text();
  const bodyData = JSON.parse(bodyText) as {
    email?: string;
  };

  const springResponse = await fetch(
    `${getSpringApiBaseUrl()}/api/auth/login`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: bodyText,
    }
  );

  const responseText = await springResponse.text();

  if (!springResponse.ok) {
    // HTTPステータス上の失敗は、Spring Bootが返した本文とステータスをそのまま返します。
    // これにより、バックエンド側のエラーメッセージをログイン画面で扱いやすくします。
    return new NextResponse(responseText, {
      status: springResponse.status,
      headers: {
        "Content-Type":
          springResponse.headers.get("Content-Type") ||
          "application/json",
      },
    });
  }

  const data = JSON.parse(responseText);

  if (data.success === false) {
    // HTTP 200でも、レスポンス内のsuccessがfalseならログイン失敗として扱います。
    // この場合はJWT Cookieを保存せず、画面側へ失敗内容だけを返します。
    return NextResponse.json({
      success: false,
      message:
        data.message || "ログインに失敗しました",
    });
  }

  const token = getLoginToken(data);

  if (!token) {
    // ログイン成功扱いなのにJWTが含まれていない場合は、通常の認証失敗ではなく
    // バックエンドレスポンス形式の不整合として502を返します。
    return NextResponse.json(
      {
        success: false,
        message:
          "Spring Bootのログインレスポンスにtokenが含まれていません",
      },
      { status: 502 }
    );
  }

  const user = getLoginUser(
    data,
    bodyData.email
  ) as AuthCookieUser;

  // クライアントへは認証済み状態と表示用ユーザーだけを返します。
  // JWT本体はこの後setAuthCookiesでHttpOnly Cookieへ保存し、localStorageには置きません。
  const response = NextResponse.json({
    success: data.success ?? true,
    message: data.message || "ログインしました",
    authenticated: true,
    user,
  });

  setAuthCookies(response, token, user);

  return response;
}
