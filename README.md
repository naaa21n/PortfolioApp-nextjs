# 🧩 Portfolio App（タスク・学習・健康管理アプリ）

このプロジェクトは、自分の生活管理を目的としたフルスタックWebアプリです。  
タスク管理・学習管理・健康管理を1つのアプリに統合しています。

---

## 🚀 使用技術

### フロントエンド
- Next.js（React）
- TypeScript
- Tailwind CSS

### バックエンド
- Spring Boot
- Spring Data JPA
- REST API

### データベース
- PostgreSQL（Dockerで構築）

### その他
- Git / GitHub（バージョン管理）
- Render（デプロイ予定）
- IntelliJ IDEA

---

## 📱 機能

### 📝 タスク管理
- タスク追加
- 完了処理
- 削除

### 📚 学習管理（開発予定）
- 学習内容の記録
- 学習進捗管理

### 🏃 健康管理（開発予定）
- 体重記録
- 運動ログ管理

---

## 🔗 API設計（Spring Boot）

GET    /api/hello
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/{id}/done
DELETE /api/tasks/{id}

---

## 🧠 工夫した点

- フロントエンドとバックエンドを分離した構成
- REST APIを用いたデータ通信
- Dockerを使ったPostgreSQL環境構築
- useEffectによる非同期データ取得

---

## 🖥 起動方法

### フロントエンド

npm install  
npm run dev

---

### バックエンド

./mvnw spring-boot:run

---

### データベース（Docker）

docker-compose up -d

---

## 📷 スクリーンショット
（ここに画面画像を追加）

---

## 🎯 今後の改善

- ログイン機能の追加
- ユーザーごとのデータ管理
- 学習・健康機能の完成
- デプロイ（Vercel + Render）

---

## 👤 作者
ポートフォリオ用個人開発プロジェクト