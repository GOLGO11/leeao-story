const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖文存";
const SLUG = "li_ao_wencun";
const ROUND = "story_round1";
const ID_PREFIX = "LAWC";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "002.精品散文类",
  "004.李敖文存"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const BOOK_ORDER = [
  "li_ao_zizhuan_yu_huiyi",
  "li_ao_zizhuan_yu_huiyi_xuji",
  "wo_zui_nanwang_de_shi_he_ren",
  "li_ao_huiyilu",
  "li_ao_kuaiyi_enchoulu",
  "li_ao_yitan_aisi_lu",
  "li_ao_fengliu_zizhuan",
  "li_ao_xiangguan",
  "chuantong_xia_de_dubai",
  "chuantong_xia_de_zaibai",
  "dubai_xia_de_chuantong",
  "li_ao_wencun"
];

const selections = [
  {
    file: "004.“我中华尚有人耶？”.txt",
    title: "李鸿章吃洋人爱犬",
    paragraphs: [2],
    start: "洋鬼子不喜欢人家问他私事"
  },
  { file: "004.“我中华尚有人耶？”.txt", title: "利玛窦送钟闹虚惊", paragraphs: [7] },
  { file: "004.“我中华尚有人耶？”.txt", title: "利玛窦画像不是回回", paragraphs: [9] },
  { file: "004.“我中华尚有人耶？”.txt", title: "咸丰不让洋人见面", paragraphs: [11] },
  { file: "006.当年老子如何如何.txt", title: "罗素遇见自称凯撒的人", paragraphs: [15] },
  {
    file: "006.当年老子如何如何.txt",
    title: "朱屋大佐与赵先生的胜利妄想",
    paragraphs: [18],
    end: "奄忽而逝！”"
  },
  { file: "008.床上功夫.txt", title: "任安田仁与管宁华歆割席", paragraphs: [11] },
  {
    file: "008.床上功夫.txt",
    title: "刘邦箕踞见郦食其",
    paragraphs: [15],
    start: "刘邦接见郦食其",
    end: "刘邦认错。"
  },
  {
    file: "008.床上功夫.txt",
    title: "宋太祖卧榻之侧",
    paragraphs: [18],
    start: "宋太祖伐南唐",
    end: "岂容他人鼾睡？”"
  },
  { file: "009.论和尚吃肉.txt", title: "和尚素面里吃肉", paragraphs: [6] },
  {
    file: "009.论和尚吃肉.txt",
    title: "周泽斋病关妻",
    paragraphs: [8],
    start: "《汉书》里记周泽",
    end: "罪名是“干犯斋禁”。"
  },
  {
    file: "009.论和尚吃肉.txt",
    title: "不吃肉向阎王讨寿",
    paragraphs: [9],
    start: "《乐生集》里记福建一个教书匠"
  },
  { file: "009.论和尚吃肉.txt", title: "梁武帝让祖宗吃素", paragraphs: [14], start: "直到梁武帝出来" },
  { file: "009.论和尚吃肉.txt", title: "破山和尚吃肉救城", paragraphs: [16] },
  { file: "009.论和尚吃肉.txt", title: "周世宗毁佛铸钱", paragraphs: [17] },
  {
    file: "010.写在居浩然《义和团思想和文化沙文主义》的后面.txt",
    title: "史太林旅馆谎言露馅",
    paragraphs: [185],
    start: "譬如史太林",
    end: "甚或妓院！”"
  },
  { file: "011.黄帝子孙的黄金观.txt", title: "眼里只有黄金的小偷", paragraphs: [2, 3] },
  { file: "011.黄帝子孙的黄金观.txt", title: "萧应问黄金能吃吗", paragraphs: [21] },
  { file: "011.黄帝子孙的黄金观.txt", title: "梁毗退黄金止斗", paragraphs: [22] },
  { file: "011.黄帝子孙的黄金观.txt", title: "汉武帝金屋藏娇", paragraphs: [35] },
  {
    file: "011.黄帝子孙的黄金观.txt",
    title: "宋太宗问黄金为何难得",
    paragraphs: [37],
    start: "有一天，宋太宗问学士杜镐说"
  },
  { file: "011.黄帝子孙的黄金观.txt", title: "秦惠王金牛开路", paragraphs: [43], start: "秦惠王打蜀国" },
  { file: "012.中华大赌特赌史.txt", title: "邱比特赌掉双眼", paragraphs: [3] },
  {
    file: "012.中华大赌特赌史.txt",
    title: "武则天双陆梦问狄仁杰",
    paragraphs: [8],
    end: "故意扯进了政治问题。"
  },
  { file: "012.中华大赌特赌史.txt", title: "杨贵妃掷出红四点", paragraphs: [11] },
  { file: "012.中华大赌特赌史.txt", title: "朱元璋骰子掷出十九点", paragraphs: [12] },
  { file: "012.中华大赌特赌史.txt", title: "土地财神帮朱元璋作弊", paragraphs: [13] },
  { file: "012.中华大赌特赌史.txt", title: "王钦若孤注一掷毁寇准", paragraphs: [14, 15] },
  {
    file: "013.且从青史看青楼.txt",
    title: "齐雅秀讽三杨公侯",
    paragraphs: [25, 26],
    start: "《尧山堂外记》收有明朝三“杨”开泰的宰相"
  },
  { file: "015.这样笨，还要做强盗！.txt", title: "阿苏史光屁股骗强盗", paragraphs: [2, 3, 4, 5] },
  { file: "015.这样笨，还要做强盗！.txt", title: "吉田茂统计不好才打仗", paragraphs: [24] },
  { file: "015.这样笨，还要做强盗！.txt", title: "广岛投弹无数", paragraphs: [39] },
  { file: "016.《蒋廷黻选集》序.txt", title: "蒋廷黻反问司马迁张骞", paragraphs: [16, 17] },
  { file: "020.为他有那样的敌人而爱他.txt", title: "认识对手的人比较多", paragraphs: [3] }
];

const proofreadDrops = new Set([
  "宋太宗问黄金为何难得",
  "广岛投弹无数"
]);

const decoder = new TextDecoder("gb18030");
const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖导航站",
  "油管/抖音"
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function readSource(fileName) {
  const filePath = path.join(SOURCE_ROOT, fileName);
  return decoder.decode(fs.readFileSync(filePath)).replace(/\r\n/g, "\n");
}

function stripFooter(text) {
  const lines = text.split("\n");
  const footerIndex = lines.findIndex((line) =>
    footerPatterns.some((pattern) => line.includes(pattern))
  );
  return (footerIndex >= 0 ? lines.slice(0, footerIndex) : lines).join("\n").trim();
}

function splitParagraphs(text) {
  const blocks = [];
  let current = [];
  let startLine = 1;
  const lines = text.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim()) {
      if (!current.length) startLine = index + 1;
      current.push(line);
    } else if (current.length) {
      blocks.push({
        index: blocks.length + 1,
        lineStart: startLine,
        lineEnd: index,
        text: current.join("\n").trim()
      });
      current = [];
    }
  }

  if (current.length) {
    blocks.push({
      index: blocks.length + 1,
      lineStart: startLine,
      lineEnd: lines.length,
      text: current.join("\n").trim()
    });
  }

  return blocks;
}

function getParagraphs(fileName, cache) {
  if (!cache.has(fileName)) {
    cache.set(fileName, splitParagraphs(stripFooter(readSource(fileName))));
  }
  return cache.get(fileName);
}

function sourceId(selection, paragraph) {
  const fileIndex = (selection.file.match(/^(\d{3})\./) || [null, "000"])[1];
  return `${ID_PREFIX}_${fileIndex}_${paragraph.index}`;
}

function sliceText(text, selection) {
  let startIndex = 0;
  if (selection.start) {
    startIndex = text.indexOf(selection.start);
    if (startIndex < 0) {
      throw new Error(`Start marker not found for ${selection.title}: ${selection.start}`);
    }
  }

  let endIndex = text.length;
  if (selection.end) {
    const found = text.indexOf(selection.end, startIndex);
    if (found < 0) {
      throw new Error(`End marker not found for ${selection.title}: ${selection.end}`);
    }
    endIndex = found + selection.end.length;
  }

  return text.slice(startIndex, endIndex).trim();
}

function buildRows() {
  const cache = new Map();
  return selections.filter((selection) => !proofreadDrops.has(selection.title)).map((selection, index) => {
    const paragraphs = getParagraphs(selection.file, cache).filter((paragraph) =>
      selection.paragraphs.includes(paragraph.index)
    );
    if (paragraphs.length !== selection.paragraphs.length) {
      throw new Error(`Paragraph lookup failed for ${selection.title}`);
    }

    const storyText = sliceText(paragraphs.map((paragraph) => paragraph.text).join("\n\n"), selection);
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: paragraphs.map((paragraph) => sourceId(selection, paragraph)).join(";"),
      source_file: selection.file,
      source_lines: `${paragraphs[0].lineStart}-${paragraphs[paragraphs.length - 1].lineEnd}`,
      char_count: [...storyText].length,
      story_text: storyText
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
  for (const row of rows) lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const blocks = rows.map((row) =>
    [
      `【${row.id}】${row.title}`,
      `书名：${row.book}`,
      `出处：${row.source_file}，${row.source_lines}行`,
      `字数：${row.char_count}`,
      "",
      row.story_text
    ].join("\n")
  );
  fs.writeFileSync(filePath, rows.length ? `${blocks.join("\n\n---\n\n")}\n` : "", "utf8");
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
    if (char === '"') inQuotes = true;
    else if (char === ",") {
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
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || bookSlug,
    title: row.title,
    source_ids: row.source_ids,
    source_file: row.source_file,
    source_lines: row.source_lines || [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count || [...storyText].length,
    story_text: storyText
  };
}

function bookSortKey(filePath) {
  const slug = path.basename(path.dirname(filePath));
  const index = BOOK_ORDER.indexOf(slug);
  return index >= 0 ? index : BOOK_ORDER.length + slug;
}

function duplicateTextPairs(rows) {
  const textHashes = new Map();
  const duplicateTextIds = [];
  for (const row of rows) {
    const normalized = String(row.story_text || "").replace(/\s+/g, "");
    if (textHashes.has(normalized)) duplicateTextIds.push([textHashes.get(normalized), row.id]);
    else textHashes.set(normalized, row.id);
  }
  return duplicateTextIds;
}

function writeAggregate() {
  const dataBooksDir = path.join(ROOT, "data", "books");
  const csvFiles = fs
    .readdirSync(dataBooksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dataBooksDir, entry.name, "story_round1.csv"))
    .filter((filePath) => fs.existsSync(filePath))
    .sort((a, b) => {
      const left = bookSortKey(a);
      const right = bookSortKey(b);
      return typeof left === "number" && typeof right === "number"
        ? left - right
        : String(left).localeCompare(String(right));
    });

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

  return {
    rows,
    books,
    duplicateTextIds: duplicateTextPairs(rows)
  };
}

function validate(rows) {
  const duplicateTextIds = duplicateTextPairs(rows);
  return {
    ok: duplicateTextIds.length === 0 && rows.every((row) => Number(row.char_count) > 0),
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + Number(row.char_count || 0), 0),
    minChars: rows.length ? Math.min(...rows.map((row) => Number(row.char_count || 0))) : 0,
    maxChars: rows.length ? Math.max(...rows.map((row) => Number(row.char_count || 0))) : 0,
    duplicateTextIds
  };
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function main() {
  const rows = buildRows();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  writeCsv(path.join(OUT_DIR, `${ROUND}.csv`), rows);
  writeTxt(path.join(OUT_DIR, `${ROUND}.txt`), rows);

  const validation = validate(rows);
  const aggregate = writeAggregate();
  const manifest = {
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    selectionCount: selections.length,
    proofreadDropCount: proofreadDrops.size,
    proofreadDrops: Array.from(proofreadDrops),
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    excludedByStandard: [
      "李敖自己的生活事件、交游场景和写作姿态",
      "纯论述、史料目录、文献校勘和观念归纳",
      "义和团长篇论战中没有独立故事转折的引文",
      "战争、外交、政治事件中只有资料性陈述而无故事形态的段落"
    ],
    proofreadTrimmed: [
      "李鸿章吃洋人爱犬",
      "朱屋大佐与赵先生的胜利妄想",
      "刘邦箕踞见郦食其",
      "宋太祖卧榻之侧",
      "周泽斋病关妻",
      "不吃肉向阎王讨寿",
      "史太林旅馆谎言露馅",
      "武则天双陆梦问狄仁杰",
      "齐雅秀讽三杨公侯"
    ],
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");

  if (!validation.ok) {
    throw new Error(`Validation failed for ${BOOK}`);
  }
  if (aggregate.duplicateTextIds.length) {
    throw new Error(`Duplicate story text in aggregate: ${JSON.stringify(aggregate.duplicateTextIds)}`);
  }

  console.log(
    JSON.stringify(
      {
        book: BOOK,
        rows: rows.length,
        aggregateRows: aggregate.rows.length,
        sourceFileCount: manifest.sourceFiles.length,
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
