const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖全集";
const SLUG = "li_ao_quanji";
const ROUND = "story_round1";
const ID_PREFIX = "LAQJ";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "002.精品散文类",
  "007.李敖全集"
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
  "li_ao_wencun",
  "li_ao_wencun_erji",
  "bobo_song",
  "li_ao_quanji"
];

const selections = [
  {
    file: "003.发网恢恢·法网恢恢.txt",
    title: "张敞给妻画眉",
    paragraphs: [6],
    end: "还精彩的呢！）”"
  },
  {
    file: "015.副不副，副哉？副哉？.txt",
    title: "商人千金哭宝玉",
    paragraphs: [8],
    start: "清朝陈子庄写《庸闲斋笔记》",
    end: "登时气绝。"
  },
  {
    file: "017.宁肯让犯人逃掉.txt",
    title: "梁启超宁让犯人逃掉",
    paragraphs: [4]
  },
  {
    file: "022.伏虎有术，手法亦有异同.txt",
    title: "林森劝青年不必好脾气",
    paragraphs: [3]
  },
  {
    file: "022.伏虎有术，手法亦有异同.txt",
    title: "林森请袁世凯解下武装",
    paragraphs: [5]
  },
  {
    file: "029.一个真实的故事.txt",
    title: "高德源扶养弟妹",
    paragraphs: [3]
  },
  {
    file: "029.一个真实的故事.txt",
    title: "富翁拉起窗帘继续吃饭",
    paragraphs: [9]
  },
  {
    file: "030.邱吉尔论艾登辞职.txt",
    title: "艾登辞职使邱吉尔失眠",
    paragraphs: [4]
  },
  {
    file: "031.孙悟空和我.txt",
    title: "孙悟空进八卦炉",
    paragraphs: [6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    file: "031.孙悟空和我.txt",
    title: "孙悟空没有跳出如来掌心",
    paragraphs: [
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49
    ]
  },
  {
    file: "031.孙悟空和我.txt",
    title: "孙悟空变花鸨难住二郎神",
    paragraphs: [52],
    start: "想当年孙悟空跟二郞神斗法"
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山暂不剪小辫",
    paragraphs: [11],
    end: "否则实无益也！”"
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山被门警误作工人",
    paragraphs: [15],
    end: "你不要害怕，我绝不打你呢！”"
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山反对哥哥做都督",
    paragraphs: [29],
    end: "知兄者莫若弟，文爱吾粤，即以爱兄也。”"
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山不赞成暗杀",
    paragraphs: [41],
    start: "在革命时代",
    end: "不待于暗杀也。”"
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山坚持改用阳历",
    paragraphs: [51]
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山让后裔供祖宗",
    paragraphs: [55],
    start: "民国七八年间",
    end: "请汝给钱也！”"
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山劝从物理化学用功",
    paragraphs: [57],
    start: "1918年1月",
    end: "不得从古说附会！”"
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山拒绝为书品题",
    paragraphs: [59],
    start: "当林正煊等十四个人",
    end: "至于品题，不敢附和！”"
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山谢绝写序",
    paragraphs: [61],
    start: "例如1920年5月",
    end: "求序当谢不敏。”"
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山不收门生",
    paragraphs: [63],
    start: "1919年",
    end: "则胜形式多矣！”"
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山不替人推荐",
    paragraphs: [65],
    start: "有刘季谋者",
    end: "已劝同志另作别图。”"
  },
  {
    file: "034.被歪曲的革命家.txt",
    title: "孙中山临终仍信西医",
    paragraphs: [67],
    end: "服药与否再由先生决定。’”"
  }
];

const proofreadDrops = new Set([
  "高德源扶养弟妹",
  "富翁拉起窗帘继续吃饭",
  "孙中山暂不剪小辫",
  "孙中山不赞成暗杀",
  "孙中山坚持改用阳历",
  "孙中山劝从物理化学用功",
  "孙中山拒绝为书品题",
  "孙中山谢绝写序",
  "孙中山不收门生",
  "孙中山不替人推荐"
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
    .map((entry) => path.join(dataBooksDir, entry.name, `${ROUND}.csv`))
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
    status: "校对轮",
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
      "李敖自己的生活事件、交游场景、书信往来和后事处理",
      "制度案例、法律或教育争议、史料目录和整段文件引录",
      "只有观念说明、人物评价或历史资料罗列而没有故事转折的段落",
      "孙中山实例中仅保留有问答、误会、拒绝、冲突或反讽转折的小故事"
    ],
    reviewNotes: [
      "高德源扶养弟妹：偏新闻苦难事件，缺少故事转折，校对轮删除",
      "富翁拉起窗帘继续吃饭：与《波波颂》已保留的同一故事近重复，校对轮删除本书异文",
      "孙中山组：删除批信、政策、题序、推荐等实例合集感较强的条目，只保留最像小故事的四条"
    ],
    proofreadTrimmed: [
      "张敞给妻画眉",
      "商人千金哭宝玉",
      "艾登辞职使邱吉尔失眠",
      "孙悟空没有跳出如来掌心",
      "孙悟空变花鸨难住二郎神",
      "孙中山临终仍信西医"
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
