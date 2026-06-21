import { NextResponse } from "next/server";
import { clearAuthCookies } from "../../_lib/authCookie";

// このファイルは、ログアウト時にNext.js側の認証Cookieを削除するRoute Handlerです。
// Spring Bootへ問い合わせず、ブラウザに保存済みのJWTとユーザー情報だけを破棄します。

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "ログアウトしました",
  });

  // Cookie削除はレスポンスヘッダーとして返す必要があるため、
  // JSONレスポンスを作ってから、そのレスポンスに削除指示を追加します。
  clearAuthCookies(response);

  return response;
}
