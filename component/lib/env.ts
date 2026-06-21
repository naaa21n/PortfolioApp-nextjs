export const env = {
  apiBaseUrl: process.env.SPRING_API_URL ?? "",
};

if (!env.apiBaseUrl) {
  throw new Error("SPRING_API_URLが見つかりません");
}
