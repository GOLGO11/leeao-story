const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖随写录后集";
const SLUG = "li_ao_suixielu_houji";
const ROUND = "story_round1";
const ID_PREFIX = "LASXLHJ";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "li_ao_suixielu_houji_story_round1.md");

const selections = [
  {
    prefix: "013",
    paragraph: "2",
    title: "拦路抽考背唐诗",
    start: "报导说，一位退居二线的领导干部",
    end: "岂不令人深省？"
  },
  {
    prefix: "014",
    paragraph: "5",
    title: "扁鹊饮上池水透视五脏",
    start: "扁鹊者，勃海郡郑人也",
    end: "在赵者名扁鹊。"
  },
  {
    prefix: "037",
    paragraph: "3",
    title: "俞大维与蒋介石语言不通",
    start: "今日《中央日报》登俞大维有一段谈话最有趣",
    end: "讲电话更是一分钟就讲不下去了。”"
  },
  {
    prefix: "052",
    paragraph: "3-7",
    title: "余秋里断臂走长征",
    start: "余秋里在红军时期最后一次负伤",
    end: "一周后就又随部队出发了。"
  },
  {
    prefix: "080",
    paragraph: "2",
    title: "包公在太后与弃妇之间",
    start: "京戏《铡美案》中包公夹于护婿之皇太后",
    end: "很不错。"
  },
  {
    prefix: "089",
    paragraph: "3",
    title: "秦始皇陵机关水银殉工",
    start: "按《史记·秦始皇本纪》",
    end: "可见当年的设计、气派与残忍。"
  },
  {
    prefix: "122",
    paragraph: "13",
    title: "张作霖六姨太以金付牙医",
    start: "张作霖六姨太在台湾给同乡牙医治牙",
    end: "你可以吃一辈子。”"
  },
  {
    prefix: "122",
    paragraph: "14",
    title: "宋美龄劝杨西崑做民族英雄",
    start: "杨西崑回忆说：中美断交时",
    end: "只是高调、只是风凉话而已。"
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
    .find((name) => name.startsWith("010."));
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
    "# 李敖随写录后集故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    "- 候选扫描：notes/li_ao_suixielu_houji_candidate_scan.tsv",
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖随写录后集》仍以短札、剪报、政治评论和私人往来为主。校对轮继续收紧为李敖文中讲出的、可脱离原文语境复述的小故事、掌故、笑话、历史轶事或戏曲故事；同一故事已在总表出现者不重复收；李敖自己的日常事件、电话、饭局、访客、住户事务、宠猫趣事、单句机锋、案件资料链、纯新闻经过和新闻奇闻例子不收。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 已在总表收入的“杨西崑替王世杰翻译”不重复收，本书对应《四分之一世纪后》只记为重复排除。",
    "- 《巴基斯坦的怪判决》《扭曲义士》《乱世情鸯又二例》《陆晋德的观点》《谢聪敏反暴力却被暴力相向》《台大怪火案》《张灵甫死事异说》等，主要是新闻事件、案情材料或历史异说链，本轮不收入。",
    "- 校对轮删去“林庚申抱怨立法院风水”“女立委请茅山道士作法”“陈守山参禅七日落泪”：三条虽有奇闻性，但更像报纸材料里的现象例子，缺少足够完整的故事转折。",
    "- 劳思光电玩店、张隆延“五绝七绝”、周才蔚谈赌博、熊向晖旧交笑话等，虽有趣味，但偏李敖现场交游或单句机锋，暂不收入。",
    "- 宠猫江江、电风扇、牙线棒、金兰大厦住户事务、购书买画、书店广告等属李敖自己的日常见闻，不收。",
    "- 林云密宗“聚宝盆”等是术法说明或新闻材料，不形成独立故事，不收。",
    "",
    "## 提取说明",
    "",
    "- 候选扫描覆盖全书 158 个正文文件，自动候选 269 条；另以目录和低分段落复核包公、参禅、典故等短段。",
    "- 提取轮原保留 11 条；校对轮删去新闻奇闻型条目 3 条，保留 8 条。",
    "- 入选文本均按源文原句截取，只压缩标题，不改写故事正文。",
    "- 新闻来源段落只有在内部存在可独立复述的故事动作、转折或收束时才收入；纯事件材料链仍排除。",
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
      "随写录类短札只保留未在总表出现、能独立复述的小故事、掌故、笑话、历史轶事或戏曲故事；排除李敖自身日常事件、交游、官司、办报、住户事务、纯新闻材料链、政治事件经过、概念说明和单句机锋。",
    excludedByStandard: [
      "李敖自己的日常事件、电话、饭局、访客、住户事务、宠物趣事、购书买画和广告文案不收。",
      "新闻事件或案件材料链不收，除非可截出独立小故事主体。",
      "已在总表收入的同质故事不重复收入。",
      "单句妙语、人物评价、政治口号、概念说明和术法说明不收。"
    ],
    extractionNotes: [
      "候选扫描覆盖全书 158 个正文文件，自动候选 269 条。",
      "提取轮人工复核后保留唐诗抽考、扁鹊上池水、俞大维语言不通、余秋里断臂、立法院风水迷信、包公矛盾、秦始皇陵、陈守山参禅、张作霖六姨太、宋美龄劝杨西崑等 11 条。",
      "杨西崑替王世杰翻译一条已在《李敖风流自传》收入为 LAFZ016，本轮排除重复。",
      "《巴基斯坦的怪判决》《张灵甫死事异说》等偏材料链，不收入。",
      "故事正文未改写，均按源文原句截取。"
    ],
    proofreadNotes: [
      "校对轮由 11 条缩为 8 条。",
      "删去林庚申抱怨立法院风水：偏新闻现象例子，故事动作与转折不足。",
      "删去女立委请茅山道士作法：偏新闻奇闻和传闻材料，独立故事性不足。",
      "删去陈守山参禅七日落泪：偏宗教新闻摘录，缺少完整故事收束。",
      "保留唐诗抽考、扁鹊、俞大维、余秋里、包公、秦始皇陵、张作霖六姨太、宋美龄劝杨西崑等有较明确情节或掌故性质的条目。"
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
