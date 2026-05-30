"use client";

// =========================
// Next.js のページ遷移
// =========================

import Link from "next/link";

// =========================
// トップページ
// =========================

export default function HomePage() {
  return (
    // =========================
    // 全体レイアウト
    // =========================

    <main className="min-h-screen bg-[#f8f7fc] text-gray-900">
      {/* ========================= */}
      {/* Header */}
      {/* ========================= */}

      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm">
        {/* 中央寄せコンテナ */}

        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          {/* ロゴ */}

          <h1 className="text-3xl font-bold">
            習慣の民 ✨
          </h1>

          {/* ナビゲーション */}

          <nav className="flex items-center gap-10">
            <a className="font-semibold hover:text-violet-500 transition">
              タスクとメモ帳
            </a>

            <a className="font-semibold hover:text-violet-500 transition">
              学習と読書の記録
            </a>

            <a className="font-semibold hover:text-violet-500 transition">
              健康と日記
            </a>

            {/* ログインボタン */}

            <Link href="/login">
              <button className="px-5 py-3 rounded-2xl border border-gray-300 font-bold hover:bg-gray-100 transition">
                ログイン
              </button>
            </Link>

            {/* 会員登録ボタン */}

            <Link href="/register">
              <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold shadow-lg hover:scale-105 transition">
                登録
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ========================= */}
      {/* Hero Section */}
      {/* ========================= */}

      <section className="max-w-7xl mx-auto grid grid-cols-2 gap-12 items-center px-8 py-20">
        {/* ========================= */}
        {/* 左側テキスト */}
        {/* ========================= */}

        <div>
          {/* メインタイトル */}

          <h2 className="text-7xl leading-tight font-bold mb-8">
            選ばれたのは、
            <br />
            <span className="text-violet-500">
              習慣
            </span>
            でした。
          </h2>

          {/* サブテキスト */}

          <p className="text-2xl leading-loose text-gray-700 mb-10">
            何をしても長く続くことのない人生に
            <br />
            終わりを告げよう。
          </p>

          {/* メッセージカード */}

          <div className="inline-flex items-center gap-5 bg-white rounded-3xl px-8 py-6 shadow-xl">
            {/* アイコン */}

            <div className="text-5xl">🏆</div>

            {/* テキスト */}

            <div className="text-lg font-semibold leading-relaxed">
              小さな一歩の積み重ねが、
              <br />
              未来のあなたを作ります。
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* 右側画像 */}
        {/* ========================= */}

        <div>
          <img
            src="/hero.png"
            alt="hero"
            className="w-full rounded-[36px] object-cover shadow-2xl"
          />
        </div>
      </section>

      {/* ========================= */}
      {/* Features */}
      {/* ========================= */}

      <section className="max-w-7xl mx-auto px-8 pb-24 flex flex-col gap-16">
        {/* ========================= */}
        {/* Feature 1 */}
        {/* ========================= */}

        <div className="grid grid-cols-2 gap-10 items-center">
          {/* 左画像 */}

          <img
            src="/task.png"
            alt="task"
            className="w-full h-[420px] object-cover rounded-[36px] shadow-xl"
          />

          {/* 右説明 */}

          <div className="bg-violet-50 rounded-[36px] p-14 h-[420px] flex flex-col justify-center">
            {/* アイコン */}

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-4xl mb-8">
              📝
            </div>

            {/* タイトル */}

            <h3 className="text-5xl font-bold mb-8">
              タスクとメモ帳
            </h3>

            {/* 説明 */}

            <p className="text-2xl leading-loose text-gray-700">
              習慣化の最初の一歩は
              <br />
              目につくところに目標や予定を掲げること。
              <br />
              <br />
              予定、行動、考えを
              <br />
              シンプルに書き留めておけます。
            </p>
          </div>
        </div>

        {/* ========================= */}
        {/* Feature 2 */}
        {/* ========================= */}

        <div className="grid grid-cols-2 gap-10 items-center">
          {/* 左説明 */}

          <div className="bg-violet-50 rounded-[36px] p-14 h-[420px] flex flex-col justify-center">
            {/* アイコン */}

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-4xl mb-8">
              📖
            </div>

            {/* タイトル */}

            <h3 className="text-5xl font-bold mb-8">
              学習と読書の記録
            </h3>

            {/* 説明 */}

            <p className="text-2xl leading-loose text-gray-700">
              習慣化の中で身につけたことや
              <br />
              活字に触れたらここに残しましょう。
              <br />
              <br />
              学習記録と読書記録を
              <br />
              感覚的に残せます。
            </p>
          </div>

          {/* 右画像 */}

          <img
            src="/study.png"
            alt="study"
            className="w-full h-[420px] object-cover rounded-[36px] shadow-xl"
          />
        </div>

        {/* ========================= */}
        {/* Feature 3 */}
        {/* ========================= */}

        <div className="grid grid-cols-2 gap-10 items-center">
          {/* 左画像 */}

          <img
            src="/health.png"
            alt="health"
            className="w-full h-[420px] object-cover rounded-[36px] shadow-xl"
          />

          {/* 右説明 */}

          <div className="bg-violet-50 rounded-[36px] p-14 h-[420px] flex flex-col justify-center">
            {/* アイコン */}

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-4xl mb-8">
              🤍
            </div>

            {/* タイトル */}

            <h3 className="text-5xl font-bold mb-8">
              健康と記録
            </h3>

            {/* 説明 */}

            <p className="text-2xl leading-loose text-gray-700">
              散歩を毎日することで頭の整理ができます。
              <br />
              <br />
              習慣化したことを日記につければ
              <br />
              自分の変化を確認することができます。
            </p>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* CTA Section */}
      {/* ========================= */}

      <section className="max-w-7xl mx-auto mb-24 px-8">
        <div className="rounded-[40px] bg-gradient-to-r from-rose-50 to-violet-50 p-14 flex items-center justify-between shadow-xl">
          {/* 左側 */}

          <div className="flex items-center gap-8">
            {/* アイコン */}

            <div className="text-7xl">🎉</div>

            {/* テキスト */}

            <div>
              <h3 className="text-4xl font-bold mb-2">
                あなたの習慣を
              </h3>

              <h3 className="text-4xl font-bold">
                もっと気軽に。
              </h3>
            </div>
          </div>

          {/* 会員登録ボタン */}

          <Link href="/register">
            <button className="px-14 py-6 rounded-3xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-2xl font-bold shadow-xl hover:scale-105 transition">
              会員登録はこちら
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}