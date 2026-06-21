import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_TOKEN_COOKIE } from "../../_lib/authCookie";
import { getSpringApiBaseUrl } from "../../_lib/spring";

// このファイルは、現在のブラウザがログイン済みかを確認するRoute Handlerです。
// HttpOnly Cookie内のJWTをサーバー側で確認し、Springから現在ユーザー情報を取得します。

export async function GET(request: NextRequest) {
  const token =
    request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      { status: 401 }
    );
  }

  const springResponse = await fetch(
    `${getSpringApiBaseUrl()}/api/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!springResponse.ok) {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      { status: 401 }
    );
  }

  const user = await springResponse.json();

  return NextResponse.json({
    authenticated: true,
    user,
  });
}