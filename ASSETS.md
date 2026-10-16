# SVG 素材盤點

所有原始 SVG 都沒有 `<text>`，但 title、map 含文字輪廓。以下尺寸同時為原始 width/height 與 viewBox 寬高，起點皆為 0 0。

| 檔案 | 尺寸 | 實際內容與使用方式 |
| --- | --- | --- |
| bird1.svg | 214 × 154 | 藍綠燕子；第一條持續飛行路線 |
| bird2.svg | 150 × 107 | 藍綠燕子；第二條路線 |
| birdSong.svg | 353 × 263 | 白色鳥、相機與音符；誘拍 |
| feedBird.svg | 353 × 263 | 白色鳥與餵食的手；餵食禽鳥 |
| dogEatFood.svg | 353 × 263 | 橘色犬與食盆；遊蕩貓狗 |
| littleBird.svg | 353 × 263 | 白色幼鳥與巢；救援 |
| leftUpGreen.svg | 901 × 512 | 淺綠色有機植物背景與點綴 |
| rightUpGreen.svg | 705 × 492 | 深綠色有機植物背景與點綴 |
| leftMiddle.svg | 1008 × 1196 | 深綠背景、藍鳥、貓頭鷹及內嵌 PNG；桌面完整使用 |
| rightMiddle.svg | 1100 × 1324 | 藍綠背景與紫鳥；有效圖形主要位於 y=0–816 |
| hand.svg | 1670 × 747 | 完整白色手形背景；Hero |
| garbage.svg | 353 × 263 | 垃圾桶及垃圾袋 |
| windowBird.svg | 353 × 263 | 窗框、裂紋與飛鳥 |
| stickyRat.svg | 236 × 122 | 黏鼠板與老鼠 |
| title.svg | 862 × 557 | 開場組裝時出現，再淡入原有 HTML 標題，完成後隱藏 |
| map.svg | 410 × 59 | 搜尋圖案、白色膠囊與救傷地圖文字輪廓；改用 HTML |
| cat.svg | 542 × 811 | 開場第二個威脅；原海報的遊蕩貓狗構圖不變 |
| poison.svg | 177 × 172 | 新增原稿；開場中毒威脅與原海報老鼠藥插畫 |
| leftFlower.svg | 156 × 131 | 新增原稿；開場前景與原左側主要白花位置 |
| rightFlower.svg | 503 × 412 | 新增原稿；開場前景與原右側主要粉花位置 |

衍生素材 `leftMiddle-background.svg`、`owl.svg` 只拆分原 SVG 子節點及設定取景範圍，不修改 path 或 fill。`ratPoison.png` 與五個 flower PNG 是原海報的局部擷取；周圍純色背景設為透明，用途與來源如檔名所示。

新增 SVG 已取代 `ratPoison.png`、`flowerWhiteLarge.png`、`flowerPinkLarge.png` 的顯示用途；舊檔保留但不再載入。開場暫用圖片層與海報共用相同資產網址，瀏覽器可共用快取，不包含另一份海報 DOM。
