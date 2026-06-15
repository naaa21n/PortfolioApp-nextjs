import type { NextResponse } from "next/server";

// このファイルは、Next.jsのRoute Handlerで使う認証Cookie操作をまとめた共通部品です。
// JWTはHttpOnly Cookieに保存し、画面表示用のユーザー情報もCookieとして同時に管理します。

export const AUTH_TOKEN_COOKIE =
  "habit_app_auth_token";

export const AUTH_USER_COOKIE =
  "habit_app_auth_user";

export type AuthCookieUser = {
  id?: string;
  name?: string;
  email?: string;
};

const maxAge = 60 * 60 * 24;

export const setAuthCookies = (
  response: NextResponse,
  token: string,
  user: AuthCookieUser
) => {
  // productionではHTTPS通信だけにCookieを送るsecure属性を有効にします。
  // ローカル開発ではhttp接続でも確認できるよう、production以外ではfalseにします。
  const secure =
    process.env.NODE_ENV === "production";

  // JWT本体を保存するCookieです。
  // httpOnly: true にすることで、ブラウザのJavaScriptからは読めない状態にします。
  response.cookies.set(AUTH_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge,
  });

  // 画面表示やセッション確認で使うユーザー情報を保存します。
  // JSON文字列には記号が含まれるため、Cookie値として安全に扱えるようURLエンコードします。
  response.cookies.set(
    AUTH_USER_COOKIE,
    encodeURIComponent(JSON.stringify(user)),
    {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge,
    }
  );
};

export const clearAuthCookies = (
  response: NextResponse
) => {
  // maxAge: 0を返すことで、ブラウザ側に保存済みCookieの即時削除を指示します。
  // ログアウト時や認証切れ検知時に、JWTとユーザー情報の両方を消します。
  response.cookies.set(AUTH_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(AUTH_USER_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
};

export const parseAuthUserCookie = (
  value?: string
) => {
  if (!value) {
    return {};
  }

  try {
    // 保存時にencodeURIComponentしているため、復元時はdecodeしてからJSON化します。
    // 壊れたCookie値が入っていた場合はcatchで握り、未ログイン相当の空オブジェクトを返します。
    return JSON.parse(
      decodeURIComponent(value)
    ) as AuthCookieUser;
  } catch (error) {
    console.error("Auth User Cookie Parse Error", error);
    return {};
  }
};
