// 教育內文依海報轉錄；Hero 與組織名稱依需求原文。
// TODO_REVIEW 項目集中於下方 editorialReview，不自行補寫無法辨識的內容。
export const content = {
  hero: {
    title: ['城市裡', '隱形的', '鳥類殺手'],
    subtitle: '一場強迫鳥類參與的生存遊戲',
    introduction: '氣派的玻璃大廈、在圍牆上慵懶愜意的野貓、公園水池邊正在餵鴨子的小情侶、在大草地讓狗狗恣意探索的飼主、還有山林邊看起來很學術的攝影師。對人類來說習以為常的生活，卻是鳥類生活中的隱形殺手，危機四伏且防不勝防，究竟這些行為會造成甚麼後果呢…?',
  },
  human: {
    title: '人為干擾',
    photography: {
      title: '誘拍', subtitle: '不當攝影行為',
      paragraphs: ['為了拍攝到好的照片，有些人會用食物為鳥吸引。不僅會干擾鳥類覓食，使鳥類消耗體力，甚至誤食固定餌料的工具受傷。請尊重野鳥自然習性，', '賞鳥攝影五不：不驚嚇、不引誘、不追逐、不破壞、不捕捉。'],
    },
    feeding: {
      title: '餵食', subtitle: '禽鳥',
      paragraphs: ['人為餵食會鳥逐漸依賴人類食物，集中餵食更容易增加疾病傳播與遭天敵捕食的風險。讓野鳥自己覓食，才是對牠們最好的保護。'],
    },
  },
  roaming: {
    title: '遊蕩的威脅', action: '餵食', subtitle: '遊蕩貓狗',
    paragraphs: ['餵食浪浪看似好心，卻可能帶來更多問題。食物增加會使犬貓繁殖、聚集，造成車禍、環境髒亂與噪音，也增加傳播疾病的風險。還可能獵食野生動物，甚至造成農作物損失。'],
  },
  rescue: {
    title: '錯誤的救援與互動', eyebrow: '撿到', subject: '幼鳥',
    paragraphs: ['發現幼鳥先別急著帶回家，請「先觀察，後通報」。', '羽毛大致長齊、會跳動的幼鳥多半在學飛，親鳥通常就在附近。', '若幼鳥有明顯外傷、虛弱，再尋求專業協助。', '請勿自行帶回家飼養，應聯繫1959、1999或各地區的救傷單位。'],
    mapLabel: '台灣野生動物救傷地圖',
  },
  traps: {
    title: '人類環境中的陷阱',
    items: [
      { id: 'glue', title: '黏鼠板', asset: 'stickyRat.svg', width: 236, height: 122, description: '不要在戶外放置黏鼠板，可能黏住野生動物。若發現鳥類遭黏，請先用紙或布覆蓋黏膠，一起放入紙箱，並儘速送往野生動物救傷單位處理。' },
      { id: 'poison', title: '老鼠藥', asset: 'poison.svg', width: 177, height: 172, description: '鼠藥不只會毒死老鼠，也可能沿著食物鏈，讓捕食老鼠的野生動物誤食中毒。應從環境管理著手，減少食物來源、妥善處理垃圾與廚餘，優先使用物理防治。' },
      { id: 'garbage', title: '人為垃圾', asset: 'garbage.svg', width: 353, height: 263, description: '鳥類時無法分辨塑膠繩、釣魚線、尼龍線等人為垃圾，將它們當成巢材帶回。容易纏住鳥類的腳、翅膀或頸部，使牠們無法掙脫，造成死亡。' },
      { id: 'window', title: '窗殺', asset: 'windowBird.svg', width: 353, height: 263, description: '鳥類無法辨識透明或反光的玻璃，可能將窗戶倒映的天空、樹木誤認為可以飛行的空間，因而撞上玻璃，造成骨折、內傷甚至死亡。' },
    ],
  },
  footer: {
    title: '參考資料',
    organizations: [
      { key: 'wbst', name: '台北鳥會 WBST' },
      { key: 'raptorResearch', name: '台灣猛禽研究會' },
      { key: 'wildOne', name: '野灣野生動物保育協會' },
      { key: 'taipeiParks', name: '臺北市政府工務局公園處' },
      { key: 'birdRescue', name: '台灣野生鳥類緊急救助平台' },
    ],
  },
} as const;

export const editorialReview = [
  { id: 'TODO_REVIEW_PHOTOGRAPHY', text: '原稿「有些人會用食物為鳥吸引」疑似誤字，先保留原文，請確認是否應為「用食物將鳥吸引」。' },
  { id: 'TODO_REVIEW_FEEDING', text: '原稿「人為餵食會鳥逐漸依賴」疑似缺字，先保留原文，請確認是否為「會讓鳥逐漸依賴」。' },
  { id: 'TODO_REVIEW_GARBAGE', text: '原稿「鳥類時無法分辨」疑似缺字，先保留原文，請確認是否為「鳥類有時無法分辨」。' },
] as const;
