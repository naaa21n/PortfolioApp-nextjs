import { NextResponse } from "next/server";
import {
  AUTH_TOKEN_COOKIE,
  AUTH_USER_COOKIE,
  parseAuthUserCookie,
} from "../../_lib/authCookie";

// このファイルは、現在のブラウザがログイン済みかを確認するRoute Handlerです。
// HttpOnly Cookie内のJWT有無をサーバー側で確認し、画面表示用のユーザー情報だけを返します。

export async function GET(request: Request) {
  // Requestのcookieヘッダーを、Cookie名から値を引ける簡易Mapに変換します。
  // ここではJWTの存在確認と、保存済みユーザー情報の復元に使います。
  const cookieHeader =
    request.headers.get("cookie") || "";

  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .filter(([key]) => key)
  );

  const token = cookies[AUTH_TOKEN_COOKIE];

  if (!token) {
    // JWT Cookieがなければ未ログインとして扱います。
    // 401を返すことで、AuthGuard側がログインページへ戻せるようにします。
    return NextResponse.json(
      {
        authenticated: false,
        user: {},
      },
      { status: 401 }
    );
  }

  // JWT自体は返さず、ログイン済みフラグと表示用ユーザー情報だけを返します。
  // 実際のAPI呼び出し時のJWT付与は、共通プロキシ側で行います。
  return NextResponse.json({
    authenticated: true,
    user: parseAuthUserCookie(
      cookies[AUTH_USER_COOKIE]
    ),
  });
}
