const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖秘藏日记";
const SLUG = "li_ao_micang_riji";
const ROUND = "story_round1";
const ID_PREFIX = "LAMCRJ";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "li_ao_micang_riji_story_round1.md");

const selections = [
  {
    prefix: "001",
    paragraph: "81",
    title: "吕端劝太宗留李继迁母",
    start: "十四、临睡前，得宋时一故事",
    end: "子竟纳款。”"
  },
  {
    prefix: "003",
    paragraph: "5",
    title: "鲁迅劝三郎不要入党",
    start: "这本书里面几封信值得看看",
    end: "那个时候的周起应。"
  },
  {
    prefix: "003",
    paragraph: "22",
    title: "奴仆爱妻儿被穿耳服事主人",
    start: "古往今来，显然有给人爱情却不给人自由的所在",
    end: "他就永远服事主人。”"
  },
  {
    prefix: "008",
    paragraph: "13",
    title: "吴祖光笑称中专毕业",
    start: "但祖光是严肃的",
    end: "还是有一种不服输的气概。"
  },
  {
    prefix: "010",
    paragraph: "145",
    title: "穆罕默德断袖护猫",
    start: "由波波想起穆罕默德爱猫",
    end: "精彩多矣！"
  },
  {
    prefix: "011",
    paragraph: "86",
    title: "阿登纳说智慧每天增加",
    start: "西德总理阿登纳有一次演说后",
    end: "可以人而不如龙虾乎？"
  }
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("006."));
  if (!categoryDir) throw new Error("Cannot find diary category directory");
  const bookDir = fs
    .readdirSync(path.join(ROOT, corpusDir, categoryDir))
    .find((name) => name.startsWith("006."));
  if (!bookDir) throw new Error("Cannot find source book directory");
  return path.join(ROOT, corpusDir, categoryDir, bookDir);
}

const SOURCE_ROOT = findSourceRoot();

function decodeText(filePath) {
  return new TextDecoder("gb18030").decode(fs.readFileSync(filePath));
}

function stripFooter(text) {
  return text.replace(/\s*李敖影音E书[\s\S]*$/u, "").trim();
}

function readSource(fileName) {
  return stripFooter(decodeText(path.join(SOURCE_ROOT, fileName))).replace(/\r\n/g, "\n");
}

function fileForPrefix(prefix) {
  const fileName = fs
    .readdirSync(SOURCE_ROOT)
    .find((name) => name.startsWith(`${prefix}.`) && name.endsWith(".txt"));
  if (!fileName) throw new Error(`Cannot find source file for prefix ${prefix}`);
  return fileName;
}

function lineNumberAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

function selectText(source, selection) {
  const startIndex = source.indexOf(selection.start);
  if (startIndex < 0) throw new Error(`Start marker not found for ${selection.title}`);
  const endIndex = source.indexOf(selection.end, startIndex);
  if (endIndex < 0) throw new Error(`End marker not found for ${selection.title}`);
  const text = source.slice(startIndex, endIndex + selection.end.length).trim();
  return {
    text,
    lineRange: `${lineNumberAt(source, startIndex)}-${lineNumberAt(
      source,
      endIndex + selection.end.length
    )}`
  };
}

function storyId(index) {
  return `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`;
}

function sourceId(selection) {
  return `${ID_PREFIX}_${selection.prefix}_${String(selection.paragraph).replace(/-/g, "_")}`;
}

function buildRows() {
  const cache = new Map();
  return selections.map((selection, index) => {
    const sourceFile = fileForPrefix(selection.prefix);
    if (!cache.has(sourceFile)) cache.set(sourceFile, readSource(sourceFile));
    const selected = selectText(cache.get(sourceFile), selection);
    return {
      id: storyId(index),
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: sourceId(selection),
      source_file: sourceFile,
      source_lines: selected.lineRange,
      char_count: Array.from(selected.text).length,
      story_text: selected.text
    };
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
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
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const text = rows
    .map((row) =>
      [
        `【${row.id}】${row.title}`,
        `书名：${row.book}`,
        `来源：${row.source_file}：${row.source_lines}`,
        "",
        row.story_text
      ].join("\n")
    )
    .join("\n\n---\n\n");
  fs.writeFileSync(filePath, `${text}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [rawHeaders, ...body] = rows;
  if (!rawHeaders) return [];
  const headers = rawHeaders.map((header, index) =>
    index === 0 ? header.replace(/^\uFEFF/u, "") : header
  );
  return body
    .filter((values) => values.some((value) => value !== ""))
    .map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))
    );
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, "");
}

function duplicateTextPairs(rows) {
  const seen = new Map();
  const duplicates = [];
  for (const row of rows) {
    const key = normalizeText(row.story_text);
    if (seen.has(key)) duplicates.push([seen.get(key), row.id]);
    else seen.set(key, row.id);
  }
  return duplicates;
}

function existingBookOrder() {
  const webPath = path.join(ROOT, "web", "stories.js");
  if (!fs.existsSync(webPath)) return [];
  const raw = fs.readFileSync(webPath, "utf8");
  const json = raw.replace(/^window\.STORY_DATA = /u, "").replace(/;\s*$/u, "");
  try {
    return JSON.parse(json).books.map((book) => book.slug);
  } catch {
    return [];
  }
}

function compareBookFiles(a, b) {
  const order = existingBookOrder();
  if (!order.includes(SLUG)) order.push(SLUG);
  const slugA = path.basename(path.dirname(a));
  const slugB = path.basename(path.dirname(b));
  const orderA = order.indexOf(slugA);
  const orderB = order.indexOf(slugB);
  if (orderA !== -1 || orderB !== -1) {
    if (orderA === -1) return 1;
    if (orderB === -1) return -1;
    return orderA - orderB;
  }
  return slugA.localeCompare(slugB);
}

function normalizeAggregateRow(row, fallbackSlug) {
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || fallbackSlug,
    title: row.title,
    source_ids: row.source_ids,
    source_file: row.source_file,
    source_lines:
      row.source_lines ||
      [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count,
    story_text: row.story_text
  };
}

function writeAggregate() {
  const csvFiles = fs
    .readdirSync(path.join(ROOT, "data", "books"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(ROOT, "data", "books", entry.name, `${ROUND}.csv`))
    .filter((filePath) => fs.existsSync(filePath))
    .sort(compareBookFiles);

  const rows = csvFiles.flatMap((filePath) => {
    const bookSlug = path.basename(path.dirname(filePath));
    return parseCsv(fs.readFileSync(filePath, "utf8")).map((row) =>
      normalizeAggregateRow(row, bookSlug)
    );
  });

  const seenIds = new Set();
  const duplicateIds = rows.filter((row) => {
    if (seenIds.has(row.id)) return true;
    seenIds.add(row.id);
    return false;
  });
  if (duplicateIds.length) {
    throw new Error(
      `Duplicate story ids in aggregate: ${duplicateIds.map((row) => row.id).join(", ")}`
    );
  }

  writeCsv(path.join(ROOT, "data", "all_stories.csv"), rows);
  writeTxt(path.join(ROOT, "data", "all_stories.txt"), rows);

  const books = Array.from(
    rows
      .reduce((map, row) => {
        const current = map.get(row.book_slug) || { book: row.book, slug: row.book_slug, count: 0 };
        current.count += 1;
        map.set(row.book_slug, current);
        return map;
      }, new Map())
      .values()
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

function validateSourceMatches(rows) {
  const sourceCache = new Map();
  return rows
    .filter((row) => {
      if (!sourceCache.has(row.source_file)) {
        sourceCache.set(row.source_file, normalizeText(readSource(row.source_file)));
      }
      return !sourceCache.get(row.source_file).includes(normalizeText(row.story_text));
    })
    .map((row) => row.id);
}

function validate(rows) {
  const duplicateTextIds = duplicateTextPairs(rows);
  const missingSourceTextIds = validateSourceMatches(rows);
  return {
    ok:
      duplicateTextIds.length === 0 &&
      missingSourceTextIds.length === 0 &&
      rows.every((row) => Number(row.char_count) > 0),
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + Number(row.char_count || 0), 0),
    minChars: rows.length ? Math.min(...rows.map((row) => Number(row.char_count || 0))) : 0,
    maxChars: rows.length ? Math.max(...rows.map((row) => Number(row.char_count || 0))) : 0,
    duplicateTextIds,
    missingSourceTextIds
  };
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function writeNotes(rows, validation, aggregate) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 李敖秘藏日记故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    "- 候选扫描：notes/li_ao_micang_riji_candidate_scan.tsv",
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖秘藏日记》包含软禁残记、闭居札记、时评日记和若干文章。提取轮只收李敖文中转述的外部小故事、掌故、笑话或可独立复述的引用故事；不收李敖自己的软禁、官司、访问、电话、朋友往来和政治事件材料链。",
    "",
    "## 保留条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 李敖自己的软禁、跟监、诉讼、电话、访友、旅行和党外政治往来不收。",
    "- 政治新闻、法院判决、查禁令、党外组织过程、江南案材料和阎锡山五百完人材料链不收。",
    "- 只提到故事、笑话、剧目或读后灵感而未给出故事正文的不收。",
    "- 吴汉“差强人意”故事已在总表《李敖议坛哀思录》收录，本轮不重复收入。",
    "- 善书怪谈、统计数字、格言、单句妙语和概念类比不收，除非原文有完整动作转折。",
    "",
    "## 校对处理",
    "",
    "- 提取轮 7 条，校对轮保留 6 条。",
    "- 删去“赌徒富豪假牌杀人”：该条是《步步惊魂》的观影剧情摘记，不是李敖用来说明道理的外部小故事。",
    "- 保留吕端、鲁迅、《旧约》奴仆、吴祖光、穆罕默德、阿登纳 6 条；这些条目都有外部人物、动作转折或引文主体，可独立复述。",
    "",
    "## 提取说明",
    "",
    "- 候选扫描覆盖全书 18 个正文文件，自动候选 104 条。",
    "- 校对后保留吕端、鲁迅、旧约奴仆、吴祖光、穆罕默德、阿登纳等外部掌故。",
    "- 鲁迅条只截取胡风问三郎入党及鲁迅答复部分，去掉前后对鲁迅的长篇评价。",
    "- 《旧约》条只截取奴仆因爱妻儿不愿自由、被穿耳永服主人的故事主体。",
    "",
    "## 校验",
    "",
    `- 单书重复正文：${JSON.stringify(validation.duplicateTextIds)}`,
    `- 单书正文回源失败：${JSON.stringify(validation.missingSourceTextIds)}`,
    `- 汇总重复正文：${JSON.stringify(aggregate.duplicateTextIds)}`
  ];
  fs.writeFileSync(NOTES_PATH, `${lines.join("\n")}\n`, "utf8");
}

function main() {
  const rows = buildRows();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  writeCsv(path.join(OUT_DIR, `${ROUND}.csv`), rows);
  writeTxt(path.join(OUT_DIR, `${ROUND}.txt`), rows);

  const validation = validate(rows);
  const aggregate = writeAggregate();
  const aggregateDuplicatesForThisBook = aggregate.duplicateTextIds.filter((pair) =>
    pair.some((id) => id.startsWith(ID_PREFIX))
  );
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
    criteria:
      "沉思日记类只保留未在总表出现、能独立复述的外部小故事、笑话、掌故；排除李敖自身日记事件、交游、恋爱片段、政治材料链、新闻判决和纯议论。",
    excludedByStandard: [
      "李敖自己的软禁、官司、访问、电话、旅行和党外政治事件不收。",
      "新闻、法院判决、查禁令、组织过程和历史材料链不收，除非段落本身形成独立小故事。",
      "只提到故事或笑话而没有故事正文的不收。",
      "总表已有的同质故事不重复收入。"
    ],
    extractionNotes: [
      "候选扫描覆盖全书 18 个正文文件，自动候选 104 条。",
      "提取轮曾保留吕端劝宋太宗、电影赌局反讽、鲁迅劝三郎勿入党、旧约奴仆穿耳、吴祖光中专毕业、穆罕默德断袖护猫、阿登纳智慧每天增加等 7 条。",
      "吴汉差强人意故事已见总表 LAYT002，本轮排除。",
      "阎锡山五百完人、江南案、查禁令、法院判决、党外组织与李敖自身交游均作为材料链或自身事件排除。"
    ],
    proofreadNotes: [
      "校对轮由 7 条缩为 6 条。",
      "删去《步步惊魂》赌徒富豪假牌杀人条：原段是电影剧情/观影摘记，未构成李敖讲出来用以说明道理的外部小故事。",
      "保留吕端、鲁迅、《旧约》奴仆、吴祖光、穆罕默德、阿登纳 6 条，均有明确外部叙事主体和可复述的动作转折。"
    ],
    aggregateDuplicateTextIds: aggregate.duplicateTextIds,
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(OUT_DIR, "story_manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "story_validation.json"),
    `${JSON.stringify(validation, null, 2)}\n`,
    "utf8"
  );
  writeNotes(rows, validation, aggregate);

  if (!validation.ok) {
    throw new Error(`Validation failed for ${BOOK}: ${JSON.stringify(validation)}`);
  }
  if (aggregateDuplicatesForThisBook.length) {
    throw new Error(
      `Duplicate story text for ${BOOK}: ${JSON.stringify(aggregateDuplicatesForThisBook)}`
    );
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
