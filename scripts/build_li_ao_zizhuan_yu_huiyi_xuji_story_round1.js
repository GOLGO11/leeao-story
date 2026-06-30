const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖自传与回忆续集";
const SLUG = "li_ao_zizhuan_yu_huiyi_xuji";
const ROUND = "story_round1";
const ID_PREFIX = "LZXJ";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "001.自传回忆类",
  "002.李敖自传与回忆续集"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);

const selections = [
  { file: "002.乱世母女泪.txt", title: "爸爸分四批逃难", paragraphs: [4] },
  { file: "002.乱世母女泪.txt", title: "大姐二姐留在北平", paragraphs: [5] },
  { file: "002.乱世母女泪.txt", title: "张松涵劝我们去台湾", paragraphs: [7] },
  { file: "002.乱世母女泪.txt", title: "香港母女重逢", paragraphs: [11] },
  { file: "002.乱世母女泪.txt", title: "三十五年后的母女记忆", paragraphs: [16] },
  { file: "003.我给我画帽子.txt", title: "给照片画童军帽", paragraphs: [2] },
  { file: "004.“一朝眉羽成，钻破亦在我”.txt", title: "徐武军带我见钱穆", paragraphs: [13] },
  { file: "004.“一朝眉羽成，钻破亦在我”.txt", title: "钱穆问梁启超出处", paragraphs: [15] },
  { file: "005.我与胡适的“微妙关系”.txt", title: "台中车站递信", paragraphs: [3] },
  { file: "005.我与胡适的“微妙关系”.txt", title: "胡适说我比他了解胡适", paragraphs: [4] },
  { file: "007.《恶法录及其他》新版前言.txt", title: "陆啸钊看出我不会收钱", paragraphs: [5] },
  { file: "008.我怎样给王尚义擦屁股.txt", title: "王尚义要我向朋友借钱", paragraphs: [9] },
  { file: "008.我怎样给王尚义擦屁股.txt", title: "尚勤哭着要我出版遗著", paragraphs: [15] },
  { file: "009.关于《王尚义与李敖》.txt", title: "父亲丧礼改革", paragraphs: [63] },
  { file: "010.“谁是涂咪咪？”.txt", title: "谁是涂咪咪", paragraphs: [2] },
  { file: "010.“谁是涂咪咪？”.txt", title: "孟绝子不知道银霞甄珍", paragraphs: [3] },
  { file: "010.“谁是涂咪咪？”.txt", title: "梦莲露", paragraphs: [4] },
  { file: "011.为《文星》招魂.txt", title: "朱婉坚被拦到书展闭幕", paragraphs: [85] },
  { file: "013.软禁中的通讯.txt", title: "刘绍唐劝我和解", paragraphs: [65] },
  { file: "014.我才“妨害军机”呢！.txt", title: "马丁登门，楼下像个警察局", paragraphs: [15, 16] },
  { file: "014.我才“妨害军机”呢！.txt", title: "孟绝子不问名单怎么用", paragraphs: [24] },
  { file: "014.我才“妨害军机”呢！.txt", title: "讯问室里的泰源名单", paragraphs: [27] },
  { file: "015.“太轻了，不算！”.txt", title: "太轻了不算", paragraphs: [2] },
  { file: "015.“太轻了，不算！”.txt", title: "丹尼蓬三天昏头转向", paragraphs: [6] },
  { file: "015.“太轻了，不算！”.txt", title: "丹尼蓬说太挤了", paragraphs: [10] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "吴彰炯问爆炸案凶手", paragraphs: [3] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "秘密审判时第一次见刘辰旦", paragraphs: [5] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "高窗哨音", paragraphs: [7] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "生力面袋传纸条", paragraphs: [8] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "刘辰旦送生日蛋糕", paragraphs: [11] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "母亲被逼写信", paragraphs: [21] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "用女朋友要挟吴彰炯", paragraphs: [23] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "逼供里的杀猪", paragraphs: [24] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "吴彰炯的气喘被当成装病", paragraphs: [25] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "半夜被叫进侦讯室", paragraphs: [27] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "灌水和汽油桶", paragraphs: [29] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "踢后心", paragraphs: [30] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "刘辰旦看到同案被刑求", paragraphs: [32] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "调查员说我们无罪后不见了", paragraphs: [34] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "疲劳轰炸和背剑", paragraphs: [35] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "睡在钢丝弹簧上", paragraphs: [36] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "面糊和冷气", paragraphs: [38] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "黄衣人现场表演", paragraphs: [42] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "楼梯间的一脚", paragraphs: [45] },
  { file: "017.刘辰旦——患难见真情的朋友.txt", title: "遗腹子长大了", paragraphs: [76] },
  { file: "019.我是我自己的保人.txt", title: "王诚七年刑坐十五年", paragraphs: [4] },
  { file: "019.我是我自己的保人.txt", title: "没有保人的哑巴政治犯", paragraphs: [7] },
  { file: "019.我是我自己的保人.txt", title: "工保买保人", paragraphs: [72] },
  { file: "020.新醒世姻缘.txt", title: "朱婉坚从美国回来没了家", paragraphs: [40] },
  { file: "020.新醒世姻缘.txt", title: "五个大男人", paragraphs: [43] },
  { file: "022.好个“桃园结义”.txt", title: "蒲斯陶的罗伯特李", paragraphs: [50] },
  { file: "022.好个“桃园结义”.txt", title: "桃园结义给五百块", paragraphs: [51] },
  { file: "022.好个“桃园结义”.txt", title: "桃园监狱里的桃园结义", paragraphs: [52] },
  { file: "023.“谍海浮尸”与“法海浮书”.txt", title: "王伟珍读了不存在的书", paragraphs: [4] },
  { file: "023.“谍海浮尸”与“法海浮书”.txt", title: "萧孟能列出不存在的书名", paragraphs: [6] },
  { file: "023.“谍海浮尸”与“法海浮书”.txt", title: "萧孟能再列错书名", paragraphs: [16] },
  { file: "027.彼以熊来，吾以熊往.txt", title: "胡母送饭的传闻", paragraphs: [10] },
  { file: "027.彼以熊来，吾以熊往.txt", title: "用熊皮包沙发", paragraphs: [14] },
  { file: "028.监狱学土城？.txt", title: "为找信延长放封", paragraphs: [13] },
  { file: "028.监狱学土城？.txt", title: "许性德慢慢刮马桶", paragraphs: [18] },
  { file: "028.监狱学土城？.txt", title: "所长也调不动我", paragraphs: [21] },
  { file: "028.监狱学土城？.txt", title: "卡片房的特权", paragraphs: [25] },
  { file: "028.监狱学土城？.txt", title: "洪炳麟被无罪放回", paragraphs: [27] },
  { file: "028.监狱学土城？.txt", title: "杨宗才带儿子入所", paragraphs: [28] },
  { file: "028.监狱学土城？.txt", title: "狗班防睡觉", paragraphs: [34] },
  { file: "028.监狱学土城？.txt", title: "王纯被打醒逼供", paragraphs: [36] },
  { file: "028.监狱学土城？.txt", title: "吊烟", paragraphs: [37] },
  { file: "028.监狱学土城？.txt", title: "槟榔走私", paragraphs: [41] },
  { file: "028.监狱学土城？.txt", title: "夜里打人", paragraphs: [44] },
  { file: "028.监狱学土城？.txt", title: "天亮以前打完", paragraphs: [45] },
  { file: "028.监狱学土城？.txt", title: "绑在担架上", paragraphs: [47] },
  { file: "028.监狱学土城？.txt", title: "找人代打", paragraphs: [49] },
  { file: "028.监狱学土城？.txt", title: "节日不打人", paragraphs: [53] },
  { file: "028.监狱学土城？.txt", title: "李聪明暴毙真相", paragraphs: [56, 57] },
  { file: "028.监狱学土城？.txt", title: "金鼎被打死", paragraphs: [59] },
  { file: "028.监狱学土城？.txt", title: "林志新煎蛋八十六天", paragraphs: [61] },
  { file: "028.监狱学土城？.txt", title: "妇产科医生当全科", paragraphs: [67] },
  { file: "028.监狱学土城？.txt", title: "剥橘子", paragraphs: [84] },
  { file: "028.监狱学土城？.txt", title: "走廊里的野餐", paragraphs: [87] },
  { file: "028.监狱学土城？.txt", title: "杜医生检查肛门", paragraphs: [98] },
  { file: "028.监狱学土城？.txt", title: "李文荣跳房子", paragraphs: [106] },
  { file: "028.监狱学土城？.txt", title: "朱婉坚找不到人", paragraphs: [109] },
  { file: "028.监狱学土城？.txt", title: "隔着玻璃会客", paragraphs: [114] },
  { file: "028.监狱学土城？.txt", title: "特别会客室", paragraphs: [116] },
  { file: "028.监狱学土城？.txt", title: "女管理员强索探监财物", paragraphs: [127] },
  { file: "028.监狱学土城？.txt", title: "我拒绝上报告", paragraphs: [129] },
  { file: "028.监狱学土城？.txt", title: "战争与和平被退回", paragraphs: [130] },
  { file: "028.监狱学土城？.txt", title: "我就是耶稣", paragraphs: [132] },
  { file: "028.监狱学土城？.txt", title: "死刑犯挂镣打篮球", paragraphs: [145] },
  { file: "028.监狱学土城？.txt", title: "陈庆堂交摘要被打耳光", paragraphs: [153] },
  { file: "028.监狱学土城？.txt", title: "古永城挂镣出庭", paragraphs: [154] },
  { file: "028.监狱学土城？.txt", title: "便当只敢挖中间吃", paragraphs: [163] },
  { file: "028.监狱学土城？.txt", title: "热水袋要问所长", paragraphs: [169] },
  { file: "028.监狱学土城？.txt", title: "卫生衣还要缴回", paragraphs: [173] },
  { file: "028.监狱学土城？.txt", title: "保雄威胁官员", paragraphs: [177] },
  { file: "028.监狱学土城？.txt", title: "死囚房补屋顶", paragraphs: [181] },
  { file: "028.监狱学土城？.txt", title: "我一到看守所就吃得开", paragraphs: [186] },
  { file: "032.“洁本”云乎哉？.txt", title: "警察偷走了文稿", paragraphs: [6] },
  { file: "037.告李敖的下场.txt", title: "十天官司债", paragraphs: [28] },
  { file: "039.资料大王小谈.txt", title: "胡金铨护身符和老虎魂", paragraphs: [4] }
];

const STRICT_STORY_TITLES = new Set([
  "谁是涂咪咪",
  "孟绝子不知道银霞甄珍",
  "梦莲露",
  "太轻了不算",
  "丹尼蓬三天昏头转向",
  "丹尼蓬说太挤了",
  "用女朋友要挟吴彰炯",
  "逼供里的杀猪",
  "吴彰炯的气喘被当成装病",
  "灌水和汽油桶",
  "睡在钢丝弹簧上",
  "面糊和冷气",
  "黄衣人现场表演",
  "王诚七年刑坐十五年",
  "没有保人的哑巴政治犯",
  "王伟珍读了不存在的书",
  "许性德慢慢刮马桶",
  "杨宗才带儿子入所",
  "王纯被打醒逼供",
  "吊烟",
  "槟榔走私",
  "林志新煎蛋八十六天",
  "杜医生检查肛门",
  "李文荣跳房子",
  "死刑犯挂镣打篮球",
  "陈庆堂交摘要被打耳光",
  "古永城挂镣出庭",
  "便当只敢挖中间吃",
  "保雄威胁官员",
  "死囚房补屋顶"
]);

function readGb18030(filePath) {
  const bytes = fs.readFileSync(filePath);
  return new TextDecoder("gb18030").decode(bytes);
}

function stripNoise(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n\s*好读书柜《典藏版》，网址：.*$/gmu, "")
    .replace(/\n\s*扫描校对制作：.*$/gmu, "")
    .replace(/\n\s*本书由.*$/gmu, "")
    .trim();
}

function splitParagraphs(text) {
  const normalized = stripNoise(text);
  const lines = normalized.split("\n");
  const paragraphs = [];
  let buffer = [];
  let start = 1;

  function flush(endLine) {
    const raw = buffer.join("\n").trim();
    if (raw) {
      paragraphs.push({
        index: paragraphs.length + 1,
        text: raw.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n"),
        lineStart: start,
        lineEnd: endLine
      });
    }
    buffer = [];
  }

  lines.forEach((line, idx) => {
    if (/^\s*$/.test(line)) {
      flush(idx);
      start = idx + 2;
      return;
    }
    if (buffer.length === 0) start = idx + 1;
    buffer.push(line);
  });
  flush(lines.length);
  return paragraphs;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function getParagraphMap(fileName, cache) {
  if (!cache.has(fileName)) {
    const fullPath = path.join(SOURCE_ROOT, fileName);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Source file not found: ${fileName}`);
    }
    const paragraphs = splitParagraphs(readGb18030(fullPath));
    cache.set(fileName, new Map(paragraphs.map((paragraph) => [paragraph.index, paragraph])));
  }
  return cache.get(fileName);
}

function buildRows() {
  const cache = new Map();
  const activeSelections = selections.filter((selection) => STRICT_STORY_TITLES.has(selection.title));
  return activeSelections.map((selection, index) => {
    const paragraphMap = getParagraphMap(selection.file, cache);
    const parts = selection.paragraphs.map((paragraphIndex) => {
      const paragraph = paragraphMap.get(paragraphIndex);
      if (!paragraph) {
        throw new Error(`${selection.file} has no paragraph ${paragraphIndex}`);
      }
      return paragraph;
    });

    const text = parts.map((part) => part.text).join("\n\n");
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: selection.paragraphs.map((paragraphIndex) => `${selection.file}#P${paragraphIndex}`).join(";"),
      source_file: selection.file,
      source_lines: `${Math.min(...parts.map((part) => part.lineStart))}-${Math.max(...parts.map((part) => part.lineEnd))}`,
      char_count: [...text].length,
      story_text: text
    };
  });
}

function writeCsv(filePath, rows) {
  const headers = [
    "id",
    "book",
    "book_slug",
    "title",
    "source_ids",
    "source_file",
    "source_lines",
    "char_count",
    "story_text"
  ];
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  });
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const blocks = rows.map((row) => {
    return [
      `【${row.id}】${row.title}`,
      `书名：${row.book}`,
      `出处：${row.source_file}，${row.source_lines}行`,
      `字数：${row.char_count}`,
      "",
      row.story_text
    ].join("\n");
  });
  fs.writeFileSync(filePath, `${blocks.join("\n\n---\n\n")}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const headers = (rows.shift() || []).map((header, index) =>
    index === 0 ? header.replace(/^\uFEFF/, "") : header
  );
  return rows
    .filter((item) => item.some((value) => value !== ""))
    .map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index] ?? ""])));
}

function normalizeAggregateRow(row, bookSlug) {
  const storyText = row.story_text || row.text || "";
  const sourceLines = row.source_lines || [row.source_line_start, row.source_line_end].filter(Boolean).join("-");
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || bookSlug,
    title: row.title,
    source_ids: row.source_ids,
    source_file: row.source_file,
    source_lines: sourceLines,
    char_count: row.char_count || [...storyText].length,
    story_text: storyText
  };
}

function writeAggregate() {
  const dataBooksDir = path.join(ROOT, "data", "books");
  const csvFiles = fs
    .readdirSync(dataBooksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dataBooksDir, entry.name, "story_round1.csv"))
    .filter((filePath) => fs.existsSync(filePath))
    .sort();

  const rows = csvFiles.flatMap((filePath) => {
    const bookSlug = path.basename(path.dirname(filePath));
    return parseCsv(fs.readFileSync(filePath, "utf8")).map((row) => normalizeAggregateRow(row, bookSlug));
  });
  const seenIds = new Set();
  const duplicateIds = rows.filter((row) => {
    if (seenIds.has(row.id)) return true;
    seenIds.add(row.id);
    return false;
  });
  if (duplicateIds.length) {
    throw new Error(`Duplicate story ids in aggregate: ${duplicateIds.map((row) => row.id).join(", ")}`);
  }

  writeCsv(path.join(ROOT, "data", "all_stories.csv"), rows);
  writeTxt(path.join(ROOT, "data", "all_stories.txt"), rows);

  const books = Array.from(
    rows.reduce((map, row) => {
      const current = map.get(row.book_slug) || { book: row.book, slug: row.book_slug, count: 0 };
      current.count += 1;
      map.set(row.book_slug, current);
      return map;
    }, new Map()).values()
  );

  const webPayload = {
    book: "李敖故事",
    slug: "all",
    round: ROUND,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + Number(row.char_count || 0), 0),
    books,
    sources: Array.from(new Set(rows.map((row) => `${row.book}｜${row.source_file}`))),
    stories: rows.map((row) => ({
      id: row.id,
      book: row.book,
      bookSlug: row.book_slug,
      title: row.title,
      sourceIds: row.source_ids,
      sourceFile: row.source_file,
      sourceLines: row.source_lines,
      charCount: Number(row.char_count || 0),
      text: row.story_text
    }))
  };
  fs.writeFileSync(
    path.join(ROOT, "web", "stories.js"),
    `window.STORY_DATA = ${JSON.stringify(webPayload, null, 2)};\n`,
    "utf8"
  );

  return { rows, books };
}

function validate(rows) {
  const textHashes = new Map();
  const duplicateTextIds = [];
  for (const row of rows) {
    const normalized = row.story_text.replace(/\s+/g, "");
    if (textHashes.has(normalized)) {
      duplicateTextIds.push([textHashes.get(normalized), row.id]);
    } else {
      textHashes.set(normalized, row.id);
    }
  }

  return {
    ok: duplicateTextIds.length === 0 && rows.every((row) => row.char_count > 0),
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + row.char_count, 0),
    minChars: Math.min(...rows.map((row) => row.char_count)),
    maxChars: Math.max(...rows.map((row) => row.char_count)),
    duplicateTextIds
  };
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(ROOT, "notes"), { recursive: true });

  const rows = buildRows();
  writeCsv(path.join(OUT_DIR, "story_round1.csv"), rows);
  writeTxt(path.join(OUT_DIR, "story_round1.txt"), rows);

  const validation = validate(rows);
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
  fs.writeFileSync(
    path.join(OUT_DIR, "story_manifest.json"),
    `${JSON.stringify(
      {
        book: BOOK,
        slug: SLUG,
        round: ROUND,
        sourceRoot: path.relative(ROOT, SOURCE_ROOT),
        outputs: ["story_round1.csv", "story_round1.txt", "story_manifest.json", "story_validation.json"],
        criteria:
          "只保留李敖文中讲出来的故事；主角不是李敖本人，且有具体人物、动作、转折或收束；李敖自身经历、制度说明、法律材料、背景说明、单纯论辩和目录式资料从严剔除；正文保留原文。"
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(ROOT, "notes", "li_ao_zizhuan_yu_huiyi_xuji_story_round1.md"),
    [
      "# 李敖自传与回忆续集 story_round1",
      "",
      `- 输出条目：${rows.length}`,
      `- 总字数：${validation.totalChars}`,
      `- 最短/最长：${validation.minChars}/${validation.maxChars}`,
      "- 口径：保留李敖文中讲出来的故事；主角不是李敖本人，且有具体人物、动作、转折或收束；描述文字为原文。",
      "- 从严剔除：李敖自身经历、制度说明、法律材料、背景说明、单纯论辩、文星史料和目录式资料。"
    ].join("\n") + "\n",
    "utf8"
  );

  const aggregate = writeAggregate();
  console.log(
    JSON.stringify(
      {
        book: BOOK,
        rows: rows.length,
        validationOk: validation.ok,
        aggregateRows: aggregate.rows.length,
        aggregateBooks: aggregate.books
      },
      null,
      2
    )
  );
}

main();
