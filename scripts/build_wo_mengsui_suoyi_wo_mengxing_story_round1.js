const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "我梦碎，所以我梦醒";
const SLUG = "wo_mengsui_suoyi_wo_mengxing";
const ROUND = "story_round1";
const ID_PREFIX = "WMSYWMX";
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
  "li_ao_quanji",
  "jiaoyu_yu_lianpu",
  "wenhua_lunzhan_danhuolu",
  "wei_zhongguo_sixiang_quxiang_qiu_daan",
  "shangxia_gujin_tan",
  "shilun_xinyu",
  "qiushi_xinyu",
  "woshi_tiananmen",
  "ni_shi_jingfumen",
  "wei_ziyou_zhaohun",
  "ni_bendan_ni_bendan",
  "wo_mengsui_suoyi_wo_mengxing"
];

const selections = [
  {
    prefix: "005",
    title: "陈布雷说和尚做不成",
    paragraphs: [18]
  },
  {
    prefix: "005",
    title: "志公塔坏梁武帝亡国",
    paragraphs: [19],
    start: "梁武帝天监13年",
    end: "就“亡国”了。"
  },
  {
    prefix: "013",
    title: "列宁忍签布列斯特条约",
    paragraphs: [12],
    start: "想想列宁签下",
    end: "满载而归。"
  },
  {
    prefix: "033",
    title: "毛泽东说国民党自己打败自己",
    paragraphs: [2],
    start: "陈诚应邀做了两个小时讲话",
    end: "而是它们自己打败自己。’"
  },
  {
    prefix: "042",
    title: "谷正纲在南美人地不分三则",
    paragraphs: [8],
    start: "去南美时候",
    end: "正坐在他身旁。"
  },
  {
    prefix: "042",
    title: "谷正纲认台北是安顺又说是门打的",
    paragraphs: [9],
    start: "他下飞机时候",
    end: "是门打的！”"
  },
  {
    prefix: "042",
    title: "谷正纲梦见蒋介石托话",
    paragraphs: [10],
    start: "国民党一次核心会议中"
  },
  {
    prefix: "048",
    title: "朱屋大佐听到巴黎被围而死",
    paragraphs: [4],
    start: "朱屋大佐是拿破仑",
    end: "绝望死在面朝凯旋门的窗台上。"
  },
  {
    prefix: "061",
    title: "殷海光吃饭想到蒋介石摔筷子",
    paragraphs: [52],
    start: "李敖说，殷海光是气死的",
    end: "你输了嘛。"
  },
  {
    prefix: "061",
    title: "马寅初活过毛泽东等到平反",
    paragraphs: [52],
    start: "以前北大校长马寅初",
    end: "他成功了。"
  }
];

const decoder = new TextDecoder("gb18030");
const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖导航站",
  "油管/抖音"
];

function findDirectory(parent, predicate, label) {
  const entry = fs
    .readdirSync(parent, { withFileTypes: true })
    .find((item) => item.isDirectory() && predicate(item.name));
  if (!entry) throw new Error(`Directory not found: ${label}`);
  return path.join(parent, entry.name);
}

const SOURCE_ROOT = findDirectory(
  findDirectory(
    findDirectory(ROOT, (name) => name.includes("6.0"), "source corpus"),
    (name) => name.startsWith("003."),
    "category 003"
  ),
  (name) => name.startsWith("011."),
  "book 011"
);

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function resolveSourceFile(prefix) {
  const file = fs.readdirSync(SOURCE_ROOT).find((name) => name.startsWith(`${prefix}.`));
  if (!file) throw new Error(`Source file not found for prefix ${prefix}`);
  return file;
}

function readSource(fileName) {
  return decoder.decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName))).replace(/\r\n/g, "\n");
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

function sourceId(prefix, paragraph) {
  return `${ID_PREFIX}_${prefix}_${paragraph.index}`;
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
  return selections.map((selection, index) => {
    const fileName = resolveSourceFile(selection.prefix);
    const paragraphs = getParagraphs(fileName, cache).filter((paragraph) =>
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
      source_ids: paragraphs.map((paragraph) => sourceId(selection.prefix, paragraph)).join(";"),
      source_file: fileName,
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
      `# ${row.id} ${row.title}`,
      `book: ${row.book}`,
      `source: ${row.source_file}:${row.source_lines}`,
      "",
      row.story_text
    ].join("\n")
  );
  fs.writeFileSync(filePath, `${blocks.join("\n\n---\n\n")}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
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

function bookSortParts(filePath) {
  const slug = path.basename(path.dirname(filePath));
  const index = BOOK_ORDER.indexOf(slug);
  return index >= 0 ? [0, index, slug] : [1, BOOK_ORDER.length, slug];
}

function compareBookFiles(leftFile, rightFile) {
  const left = bookSortParts(leftFile);
  const right = bookSortParts(rightFile);
  if (left[0] !== right[0]) return left[0] - right[0];
  if (left[1] !== right[1]) return left[1] - right[1];
  return String(left[2]).localeCompare(String(right[2]));
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
    .sort(compareBookFiles);

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
    sources: Array.from(new Set(rows.map((row) => `${row.book}|${row.source_file}`))),
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
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    excludedByStandard: [
      "公投、台独、受降、外蒙古、建国百年、军购、美国等章节大多是政治事件链、政策论证或史料摘录；即使有对话和转折，也不拆成故事收入。",
      "李敖竞选、演讲、会见林青霞、与宋楚瑜或陈良埙等人的互动，属于李敖自身场景或当代政治材料，本轮不收。",
      "孙中山道统问答、徐复观人物评论、陈仪治台和孙传芳扣押陈仪等段落，偏思想史/党史材料，故事主体被论证吞没，暂不收。",
      "雷震问胡适为什么说真话反被围剿已在总表中以 LAFZ010 收录，本轮不重复收入。",
      "表格、预算、宪法条文、议会表决和报刊材料只作论证证据，不作为故事收入。"
    ],
    extractionNotes: [
      "《我梦碎，所以我梦醒》共 61 篇正文，另有序与目录；候选扫描 259 段，本轮先收入 13 条。",
      "本书政治论证密度很高，本轮只收能离开论证链独立成立的掌故、笑话、文学故事和寓言式短故事。",
      "提取轮曾将谷正纲老态笑话拆成多条；校对轮将同段笑点合并，避免条目过碎。"
    ],
    proofreadDropCount: 0,
    proofreadDrops: [],
    proofreadMergeCount: 3,
    proofreadMerges: [
      {
        keptTitle: "谷正纲在南美人地不分三则",
        mergedFrom: [
          "谷正纲南美问胡宗南为何不接",
          "谷正纲当面骂王昇是坏蛋",
          "谷正纲握麦克风揭梁永章"
        ],
        reason: "同在一个原文段落内，分拆后过碎，校对轮合并为一条笑话组。"
      },
      {
        keptTitle: "谷正纲认台北是安顺又说是门打的",
        mergedFrom: ["谷正纲认台北是安顺", "谷正纲说是门打的"],
        reason: "同在一个原文段落内，且都服务于谷正纲辨识力丧失的同一笑话组。"
      }
    ],
    proofreadNotes: [
      "校对轮从 13 条收紧为 10 条，未新增、未实质删除故事，只合并谷正纲系列中过碎的同段笑话。",
      "陈布雷、列宁、陈诚转述毛泽东三条虽接近历史材料，但原文具有明确故事/笑话触发和转折，暂保留。",
      "殷海光与马寅初两条出自《梦醒时分》演讲/访谈材料，都是李敖讲出的短故事，用来说明活过敌人的道理，暂保留。",
      "继续排除公投、受降、外蒙古、军购、宪法、预算表等事件链和材料汇编。"
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
