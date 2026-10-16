# 城市裡隱形的鳥類殺手

依照 `assest/海報2 1.png` 與使用者提供的 SVG 製作的互動資訊海報。React + Vite + TypeScript；原海報使用 CSS 動畫與 Intersection Observer，開場使用 GSAP ScrollTrigger，沒有後端或 UI 套件。

## 啟動與建置

建議 Node.js 20.19+ 或 22.12+。

```sh
npm install
npm run dev
```

開啟終端機顯示的本機網址。正式版本：

```sh
npm run build
npm run preview
```

輸出在 `dist/`。Vercel、Netlify 的 Build command 設為 `npm run build`，Output directory 設為 `dist`。GitHub Pages 請將 `dist/` 內容透過 Pages Actions 部署；Vite 已設 `base: './'`，支援 repository 子路徑，不需要後端或 SPA rewrite。

## 捲動開場

第一次完成介紹或按「跳過介紹」後，同一 session 的後續造訪直接顯示海報。使用 `?intro=replay` 強制測試開場、`?intro=off` 暫時停用，或按右下角「重播介紹」。減少動態效果偏好優先於重播；帶有 `#traps-title` 等 fragment 的網址直接進入海報。

設定集中在 `src/config/opening.ts`：`enabled`、`oncePerSession`、`scrollScreens`。技術說明、檔案清單與測試步驟見 [OPENING.md](OPENING.md)。執行 `npm run test:e2e` 可驗證捲動、組裝、互動交接、響應式版面與無障礙行為；Windows 使用已安裝的 Edge，其他平台先執行 `npx playwright install chromium`。

## 修改內容

- 所有可見文案：`src/data/content.ts`。Hero 副標題與介紹段落完全依照需求原文。
- 所有網址：`src/config/links.ts`。填入完整的 `https://...` 網址即啟用；空字串或非 HTTP(S) 網址顯示普通文字，不會跳頁、不會回頂端。外部連結已設定 `target="_blank"` 與 `rel="noopener noreferrer"`。
- 色票及動畫時間：`src/styles/variables.css`。
- 燕子速度：調整 `--bird-one-duration: 16s`、`--bird-two-duration: 23s`；數字越大飛得越慢。
- 燕子路線：桌面版在 `src/styles/animations.css` 的 `fly-one`、`fly-two`，手機版在 `src/styles/responsive.css`。飛行層不接收點擊，使用遮罩讓鳥從主要文字後方淡出，維持閱讀清楚。
- Scroll 動畫：`src/styles/animations.css`，時間與 easing 在 `variables.css`。觸發門檻在 `src/config/animation.ts`（預設 0.15）；各元件的 `ScrollReveal delay` 調整順序與間隔。
- 響應式版面：`src/styles/responsive.css`。桌面雙欄／陷阱四欄；768–1023px 陷阱兩欄；767px 以下垂直單欄。

## 動畫及無障礙

`ScrollReveal` 以 Intersection Observer 監測每個元素，首次進場後斷開觀察，不會在回捲時消失。沒有 Observer 時正常顯示內容。Hero 的副標題、介紹段落沒有 Reveal 包裝，也不套動畫。

`prefers-reduced-motion: reduce` 停止所有動畫，所有文字與插畫保持可見；切換偏好時也會揭示尚未進場的內容。標題、段落、按鈕名稱及組織名稱全部是 HTML。裝飾圖片使用空 alt；已設定的連結支援鍵盤操作與 focus 外框。

## 原稿文字待人工確認

下列三處直接依原稿轉錄，未自行補字。在 `content.ts` 的 `editorialReview` 有 `TODO_REVIEW` 標記：

1. 誘拍：「有些人會用食物為鳥吸引」疑似誤字。
2. 餵食禽鳥：「人為餵食會鳥逐漸依賴」疑似缺少「讓」。
3. 人為垃圾：「鳥類時無法分辨」疑似缺少「有」。

組織名稱依使用者提供的清單。救傷電話保留原稿的 1959、1999；本專案只轉錄原稿，未額外查核教育內容或聯絡資訊。

## 素材核對與限制

完整素材表見 `ASSETS.md`。原始檔保留在 `assest/`，網站檔案在 `public/assets/`。

- 未使用整張海報當背景。
- `title.svg` 在開場組裝時顯示，再淡入原有 HTML 標題；海報仍保留可存取的 HTML 標題。`map.svg` 保持原有 HTML 實作。字型使用本機 fallback，沒有額外遠端字型請求。
- `leftMiddle.svg` 內嵌一張 PNG，且貓頭鷹面部與海報 PNG 有差異；保留提供的 SVG。平板及手機將它拆為背景與貓頭鷹兩層，原有 path、fill 不變，避免插畫壓字。
- 新增的 `poison.svg`、`leftFlower.svg`、`rightFlower.svg` 已取代老鼠藥與兩個主要花朵 PNG，沿用原位置。其餘小花 PNG 保留；原始檔位於 `assest/`，網站使用的相同副本位於 `public/assets/`。
- `rightMiddle.svg` 的 viewBox 下方有大量留白，容器只裁去留白，不改路徑、不拉伸圖片。背景高度不足時向下延伸相同純色。

## 驗證

實測 320、375、390、430、768、1024、1440px，檢查 document 的 scrollWidth 未超過 clientWidth、四／二／一欄切換、圖片載入及靜態介紹的 opacity/animation。瀏覽器 Console 未見錯誤。TypeScript 與 Vite 正式建置通過。Reduced motion 已做程式與樣式規則檢查；未在實體 iOS／Android 裝置測試。
