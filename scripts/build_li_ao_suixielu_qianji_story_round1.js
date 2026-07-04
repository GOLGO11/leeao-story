const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖随写录前集";
const SLUG = "li_ao_suixielu_qianji";
const ROUND = "story_round1";
const ID_PREFIX = "LASXLQJ";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "li_ao_suixielu_qianji_story_round1.md");

const selections = [
  {
    prefix: "026",
    paragraph: "2",
    title: "政变失败众独裁者哭",
    start: "法新社北京十日电：本周",
    end: "全球一致兴高采烈庆祝。"
  },
  {
    prefix: "041",
    paragraph: "2",
    title: "龟头上三民主义统一中国",
    start: "自立晚报登：现在民间流行一则",
    end: "“三民主义统一中国”了。"
  },
  {
    prefix: "046",
    paragraph: "8",
    title: "陈毅拿语录护身",
    start: "当时还传说，当外语学院",
    end: "“最高指示：陈毅是个好同志！”"
  },
  {
    prefix: "046",
    paragraph: "9",
    title: "陈毅胡同口问都好吗",
    start: "1967年10月，刘少奇、邓小平两家的孩子",
    end: "最后一次见到陈伯伯。"
  },
  {
    prefix: "112",
    paragraph: "3",
    title: "宋美龄拜师不肯磕头",
    start: "宋美龄学画",
    end: "光此一事可知。"
  },
  {
    prefix: "157",
    paragraph: "2",
    title: "寺泽国子一人办报",
    start: "剪到7月间《纽约侨报》一则",
    end: "得到许多老年读者的拥护。"
  },
  {
    prefix: "161",
    paragraph: "4",
    title: "白崇禧浇花等回大陆",
    start: "白崇禧在家浇花",
    end: "“浇什么花，就要回大陆了！”"
  },
  {
    prefix: "170",
    paragraph: "2",
    title: "马连良被改马速良",
    start: "刘绍唐电话中言一趣事",
    end: "马跑得快才是好马也！"
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
    .find((name) => name.startsWith("009."));
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
    "# 李敖随写录前集故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    "- 候选扫描：notes/li_ao_suixielu_qianji_candidate_scan.tsv",
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖随写录前集》多为短札、剪报、政论和日常见闻。本轮只收李敖文中讲出的、可独立复述的外部小故事、掌故、笑话、漫画式讽刺和人物趣事；不收李敖自己的交游、电话、办报、官司、看电视看报后的单句评论、纯新闻材料链和政治事件经过。",
    "",
    "## 保留条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 李敖自己的坐车、吃饭、电话、访客、书店应答、电视节目和朋友交游不收。",
    "- 黄圣良案、黄水枝案、憋尿战、陈水扁自首、胡茵梦闭关、邓朴方受难、乱世浩劫二例等，虽有叙事性，但主要是新闻事件或材料链，本轮不收。",
    "- 《卧窗惊魂》只是电影剧情梗概，不作为李敖讲故事收入。",
    "- 《此马来头大》中“马氏文通”故事总表已有同质条目，本轮不重复收入。",
    "- 单句妙语、人物评价、政治口号和概念说明不收。",
    "",
    "## 提取说明",
    "",
    "- 候选扫描覆盖全书 189 个正文文件，自动候选 291 条。",
    "- 提取轮保留政治笑话、讽刺漫画、陈毅掌故、宋美龄拜师、白崇禧浇花、齐白石儿子谈假画、一人办报、马连良误改等 12 条。",
    "- 校对轮删去私人趣闻、单句机锋和秘辛材料片段 4 条，保留 8 条。",
    "- 故事正文未改写，均按源文原句截取。",
    "",
    "## 校对处理",
    "",
    "- 提取轮 12 条，校对轮保留 8 条。",
    "- 删去“周太太赢牌凑整”：来源是中仪嫂转述的私人牌桌趣闻，故事说明性偏弱。",
    "- 删去“齐白石儿子谈假画”：更像一句含意甚深的话，缺少完整故事动作。",
    "- 删去“游建文败屋清晨拔草”：出自宋美龄秘辛条列，偏人物秘辛材料片段。",
    "- 删去“王企祥台上沉默”：出自席间秘辛条列，偏熟人见闻，故事独立性不足。",
    "- 保留条目集中在政治笑话、漫画讽刺、陈毅掌故、宋美龄拜师、一人办报、白崇禧浇花和马连良误改等有明确转折或收束的小故事。",
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
      "随写录类短札只保留未在总表出现、能独立复述的外部小故事、掌故、笑话、漫画式讽刺和人物趣事；排除李敖自身事件、交游、官司、办报、纯新闻材料链、政治事件经过、概念说明和单句评论。",
    excludedByStandard: [
      "李敖自己的坐车、吃饭、电话、访客、书店应答、电视节目和朋友交游不收。",
      "新闻事件或案件材料链不收，除非段落中可截出独立小故事或笑话主体。",
      "电影剧情梗概不收。",
      "总表已有的同质故事不重复收入。",
      "单句妙语、人物评价、政治口号和概念说明不收。"
    ],
    extractionNotes: [
      "候选扫描覆盖全书 189 个正文文件，自动候选 291 条。",
      "提取轮保留政治笑话、讽刺漫画、陈毅掌故、宋美龄拜师、白崇禧浇花、齐白石儿子谈假画、一人办报、马连良误改等 12 条。",
      "黄圣良案、黄水枝案、憋尿战、陈水扁自首、胡茵梦闭关、邓朴方受难、乱世浩劫二例等主要作为新闻材料链排除。",
      "《此马来头大》中马氏文通故事总表已有 QSXY007，本轮不重复收入。",
      "对含日记入口的段落，只截取故事主体，未改写正文。"
    ],
    proofreadNotes: [
      "校对轮由 12 条缩为 8 条。",
      "删去周太太赢牌凑整：私人牌桌趣闻，故事说明性偏弱。",
      "删去齐白石儿子谈假画：更像一句含意甚深的话，缺少完整故事动作。",
      "删去游建文败屋清晨拔草：偏宋美龄秘辛材料片段。",
      "删去王企祥台上沉默：偏熟人见闻和秘辛条列，故事独立性不足。",
      "保留条目均有较明确人物行动、转折、笑点或收束，并可脱离李敖自身日记现场复述。"
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
