"use client";

// このファイルは、クライアント側で使う表示用の認証セッションをlocalStorageに保存するヘルパーです。
// JWT本体はHttpOnly Cookieに保存するため、ここではユーザー名やメールなど画面表示用の情報だけ扱います。

// =========================
// Auth Storage Key
// =========================

const AUTH_STORAGE_KEY = "habit_app_auth";

// =========================
// Type
// =========================

export type LoginUser = {
  id?: string;
  name?: string;
  email?: string;
};

export type AuthSession = {
  authenticated: boolean;
  user: LoginUser;
};

type LoginResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  jwt?: string;
  user?: LoginUser;
  id?: string;
  name?: string;
  email?: string;
};

// =========================
// Auth Helper
// =========================

export const getAuthSession = (): AuthSession | null => {
  if (typeof window === "undefined") {
    // localStorageはブラウザ専用APIです。
    // SSR中に参照するとエラーになるため、サーバー側ではセッションなしとして扱います。
    return null;
  }

  const savedSession =
    window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!savedSession) {
    return null;
  }

  try {
    const session =
      JSON.parse(savedSession) as AuthSession;

    if (!session.authenticated) {
      // 保存データがあってもauthenticatedがtrueでなければ、有効なセッションとは見なしません。
      return null;
    }

    return session;
  } catch (error) {
    // JSONとして壊れている値が保存されていた場合は、ログを出して保存情報を消します。
    // 不正なlocalStorageを残したままだと、以後も毎回パースエラーになるためです。
    console.error("Auth Session Parse Error", error);
    clearAuthSession();
    return null;
  }
};

export const saveAuthSession = (
  loginData: LoginResponse,
  fallbackEmail: string
) => {
  // ログインAPIやセッションAPIのレスポンスから、画面表示に必要なユーザー情報だけを組み立てます。
  // JWT/token/accessToken/jwtが含まれていても、localStorageには保存しません。
  const user: LoginUser = {
    id: loginData.user?.id || loginData.id,
    name: loginData.user?.name || loginData.name,
    email:
      loginData.user?.email ||
      loginData.email ||
      fallbackEmail,
  };

  const session: AuthSession = {
    authenticated: true,
    user,
  };

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(session)
  );

  return session;
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") {
    // サーバー側ではlocalStorageに触れないため、そのまま終了します。
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};
