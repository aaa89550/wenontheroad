# 個人部落格

這是一個使用 Next.js 14 建立的個人部落格網站，具備前台展示和後台文章管理功能。

## 功能特色

### 前台功能
- **首頁**：展示網站概覽和快速導航
- **關於我**：個人介紹和背景資訊（可自行編輯內容）
- **作品集**：展示個人作品和專案
- **個人書寫**：部落格文章列表和詳細內容
- **訂閱電子報**：訪客可以訂閱電子報（需串接第三方服務）
- **Header & Footer**：全站統一的導航列和頁尾

### 後台功能
- **文章上傳**：透過表單上傳新文章
- **分類選擇**：可選擇發布到「作品集」或「個人書寫」
- **Markdown 支援**：使用 Markdown 格式撰寫文章
- **即時預覽**：支援 Markdown 語法的文章展示

## 技術架構

- **框架**：Next.js 14 (App Router)
- **語言**：TypeScript
- **樣式**：Tailwind CSS
- **內容管理**：檔案系統（Markdown 檔案）
- **Markdown 解析**：react-markdown, gray-matter

## 專案結構

```
├── app/                      # Next.js App Router 頁面
│   ├── about/               # 關於我頁面
│   ├── admin/               # 後台管理頁面
│   ├── api/                 # API 路由
│   │   └── articles/        # 文章 API
│   ├── blog/                # 個人書寫
│   │   └── [slug]/         # 動態文章頁面
│   ├── newsletter/          # 訂閱電子報
│   ├── portfolio/           # 作品集
│   │   └── [slug]/         # 動態作品頁面
│   ├── globals.css         # 全域樣式
│   ├── layout.tsx          # 根佈局
│   └── page.tsx            # 首頁
├── components/              # React 元件
│   ├── Header.tsx          # 導航列
│   └── Footer.tsx          # 頁尾
├── content/                 # Markdown 文章檔案
│   ├── blog/               # 個人書寫文章
│   └── portfolio/          # 作品集文章
├── lib/                     # 工具函數
│   └── articles.ts         # 文章處理邏輯
├── next.config.js          # Next.js 設定
├── package.json            # 專案依賴
├── tailwind.config.js      # Tailwind 設定
└── tsconfig.json           # TypeScript 設定
```

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 3. 建置生產版本

```bash
npm run build
npm start
```

## 使用說明

### 編輯靜態頁面內容

1. **關於我頁面**：編輯 [app/about/page.tsx](app/about/page.tsx)
2. **Footer 資訊**：編輯 [components/Footer.tsx](components/Footer.tsx)
3. **Header 標題**：編輯 [components/Header.tsx](components/Header.tsx)

### 發布新文章

1. 訪問後台管理頁面：`http://localhost:3000/admin`
2. 填寫文章標題、摘要和內容
3. 選擇分類（作品集或個人書寫）
4. 點擊「上傳文章」

文章會自動儲存為 Markdown 檔案在 `content/` 目錄下。

### Markdown 語法支援

文章支援完整的 Markdown 語法：

- 標題：`# H1`, `## H2`, `### H3`
- 粗體：`**文字**`
- 斜體：`*文字*`
- 連結：`[文字](網址)`
- 圖片：`![說明](圖片網址)`
- 列表：`- 項目` 或 `1. 項目`
- 程式碼：`` `code` `` 或 ` ```language ` 區塊

### 手動新增文章

你也可以直接在 `content/blog/` 或 `content/portfolio/` 目錄下建立 `.md` 檔案：

```markdown
---
title: 文章標題
date: 2024-01-15T00:00:00.000Z
excerpt: 文章摘要
---

# 文章內容

這裡是文章的內容...
```

## 自訂設定

### 修改網站標題和描述

編輯 [app/layout.tsx](app/layout.tsx) 中的 `metadata`：

```typescript
export const metadata: Metadata = {
  title: '你的網站標題',
  description: '你的網站描述',
}
```

### 修改樣式主題

編輯 [tailwind.config.js](tailwind.config.js) 來自訂顏色、字型等樣式。

### 串接電子報服務

在 [app/newsletter/page.tsx](app/newsletter/page.tsx) 的 `handleSubmit` 函數中，串接你選擇的電子報服務（如 Mailchimp、ConvertKit、Substack 等）。

## 部署

### Vercel（推薦）

1. 將專案推送到 GitHub
2. 在 [Vercel](https://vercel.com) 匯入專案
3. 自動部署完成

### 其他平台

此專案可部署到任何支援 Next.js 的平台：
- Netlify
- Cloudflare Pages
- AWS Amplify
- 自架伺服器

## 待開發功能建議

- [ ] 後台登入驗證系統
- [ ] 文章編輯和刪除功能
- [ ] 圖片上傳功能
- [ ] 標籤系統
- [ ] 搜尋功能
- [ ] 留言系統
- [ ] RSS 訂閱
- [ ] SEO 優化
- [ ] 暗色模式
- [ ] 多語言支援

## 授權

MIT License

## 聯絡方式

如有問題或建議，歡迎聯繫。