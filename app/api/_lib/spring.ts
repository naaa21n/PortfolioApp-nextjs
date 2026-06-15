// このファイルは、Next.js側からSpring Boot APIへ接続する時の小さな変換処理をまとめています。
// APIのベースURL取得や、ログインレスポンスの形の違いを吸収する役割を持ちます。

export const getSpringApiBaseUrl = () => {
  // サーバー側だけで使うAPI_BASE_URLを優先します。
  // 既存設定との互換性のため、未設定ならNEXT_PUBLIC_API_BASE_URLも参照します。
  const apiBaseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "API_BASE_URLまたはNEXT_PUBLIC_API_BASE_URLが見つかりません"
    );
  }

  return apiBaseUrl.replace(/\/$/, "");
};

// Spring Boot側のログインレスポンスで使われうるJWT名を吸収します。
// token/accessToken/jwt のどれで返ってきても、呼び出し元は同じ扱いができます。
export const getLoginToken = (data: {
  token?: string;
  accessToken?: string;
  jwt?: string;
}) => data.token || data.accessToken || data.jwt || "";

// userオブジェクト形式とトップレベル形式のどちらでも画面用ユーザーを作ります。
// emailがレスポンスにない場合は、ログインフォームで入力したメールアドレスをfallbackとして使います。
export const getLoginUser = (
  data: {
    user?: {
      id?: string;
      name?: string;
      email?: string;
    };
    id?: string;
    name?: string;
    email?: string;
  },
  fallbackEmail = ""
) => ({
  id: data.user?.id || data.id,
  name: data.user?.name || data.name,
  email:
    data.user?.email ||
    data.email ||
    fallbackEmail,
});
