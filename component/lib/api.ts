// lib/api.ts

import { clearAuthSession } from "./auth";

/**
 * API通信を共通化するための関数
 *
 * 例:
 * apiFetch("/api/learnings")
 * apiFetch("/api/learnings", { method: "POST", body: JSON.stringify(data) })
 */
export const apiFetch = async (
  // APIのパス部分を受け取る
  // 例: "/api/learnings"
  path: string,

  // fetchに渡す追加設定
  // method, headers, body などを指定できる
  // 何も指定されなかった場合は空のオブジェクトになる
  options: RequestInit = {}
) => {
  // body が指定されているかどうかを判定する
  // POST / PUT / PATCH など、データを送る通信では body が入る
  // GET / DELETE では body がないことが多い
  const hasBody = options.body !== undefined;

  // 実際にAPI通信を行う
  // Next.jsのRoute Handlerへ送る
  // Spring BootへはNext.jsサーバー側から中継する
  const res = await fetch(path, {
    // 呼び出し側から渡されたfetch設定を展開する
    // 例: method: "POST", body: JSON.stringify(...) など
    ...options,

    // HTTPヘッダーを設定する
    headers: {
      // サーバーに対して「JSON形式のレスポンスを受け取りたい」と伝える
      // GETでもPOSTでも基本的に付けて問題ない
      Accept: "application/json",

      // body がある場合だけ Content-Type を付ける
      // Content-Type は「送信するデータの形式」を表す
      // JSON.stringify(...) でJSONを送る場合は application/json を指定する
      ...(hasBody ? { "Content-Type": "application/json" } : {}),

      // 呼び出し側で追加のheadersが指定されていれば、それも反映する
      // 例: 特別なヘッダーを追加する場合
      //
      // ここを最後に書くことで、呼び出し側のheadersで上書きもできる
      ...options.headers,
    },
  });

  // HTTPステータスが成功ではない場合
  // 例: 400, 401, 404, 500 など
  if (!res.ok) {
    if (
      res.status === 401 &&
      typeof window !== "undefined"
    ) {
      clearAuthSession();
      window.location.href = "/login";
    }

    // エラーを発生させる
    // 呼び出し元の catch で受け取れる
    throw new Error(`API request failed: ${res.status}`);
  }

  // 成功したレスポンスを呼び出し元へ返す
  // 呼び出し元で await res.json() などを行う
  return res;
};
