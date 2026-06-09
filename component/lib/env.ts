export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
};

if (!env.apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URLが見つかりません");
}