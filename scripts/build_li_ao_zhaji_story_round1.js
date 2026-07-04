const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖札记";
const SLUG = "li_ao_zhaji";
const ROUND = "story_round1";
const ID_PREFIX = "LAZJ";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "li_ao_zhaji_story_round1.md");

const selections = [
  {
    prefix: "005",
    paragraph: "2-4",
    title: "施世纶怪相做能吏",
    start: "顾公燮《消夏闲记》说",
    end: "民号曰‘青天’”。"
  },
  {
    prefix: "011",
    paragraph: "3",
    title: "丘吉尔广播输给一镑",
    start: "有一个笑话说，英国首相丘吉尔",
    end: "管他妈的丘吉尔！”"
  },
  {
    prefix: "012",
    paragraph: "2",
    title: "妇女节洗碗留到明天",
    start: "一个笑话说，妇女节那天",
    end: "留着明天一起洗吧。”"
  },
  {
    prefix: "017",
    paragraph: "4",
    title: "颜斶让齐宣王趋士",
    start: "《战国策》记齐宣王见颜斶",
    end: "对曰：“士贵耳！王者不贵。”"
  },
  {
    prefix: "022",
    paragraph: "3",
    title: "浸族高台弃老",
    start: "缅人恶俗极多",
    end: "莫大之荣幸云。"
  },
  {
    prefix: "052",
    paragraph: "2",
    title: "袁世凯暗杀后灭口",
    start: "中华民国总统袁世凯",
    end: "以后谁肯为总统做事！”"
  },
  {
    prefix: "064",
    paragraph: "2",
    title: "小狗偷物不认罗马法",
    start: "罗马法中小偷偷东西",
    end: "盖不知罗马法者也。"
  },
  {
    prefix: "068",
    paragraph: "2",
    title: "蒋介石徐复观迁怒电器",
    start: "使我联想到蒋介石当年",
    end: "却都性好此道也。"
  },
  {
    prefix: "070",
    paragraph: "3",
    title: "黄炎培记陶成章被刺",
    start: "辛亥革命写完了吗",
    end: "同盟会会员名单上的。"
  },
  {
    prefix: "080",
    paragraph: "3",
    title: "上官批畏难要钱",
    start: "某路局一员司",
    end: "遂如此引用也。"
  },
  {
    prefix: "093",
    paragraph: "2",
    title: "戒烟妙盒飞出匕首",
    start: "一个漫画，有戒烟妙盒",
    end: "正此之谓也。"
  },
  {
    prefix: "097",
    paragraph: "2",
    title: "李建成元吉无功夺权",
    start: "唐朝玄武门之变",
    end: "自然招祸。"
  },
  {
    prefix: "101",
    paragraph: "3",
    title: "韩信量敌背水破赵",
    start: "韩信袭赵",
    end: "漫见于此。"
  },
  {
    prefix: "106",
    paragraph: "2",
    title: "侯赢北向自刭送信陵君",
    start: "侯赢望风刎颈",
    end: "隐而不退的大豪杰啊！"
  },
  {
    prefix: "116",
    paragraph: "2",
    title: "小男孩拔牙后追加眼泪",
    start: "小女生拔牙回来",
    end: "真是有趣。"
  },
  {
    prefix: "119",
    paragraph: "2",
    title: "盗印者抱怨搬书辛苦",
    start: "王小痴告人盗印他的文章成书",
    end: "还该慰劳呢！"
  },
  {
    prefix: "122",
    paragraph: "2",
    title: "胡翡翠想埋照片吓千年",
    start: "中国小姐选拔",
    end: "由此可鉴。"
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
    .find((name) => name.startsWith("007."));
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
    "# 李敖札记故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    "- 候选扫描：notes/li_ao_zhaji_candidate_scan.tsv",
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖札记》多为短札、政治讽刺、读书摘记和日常片段。本轮只收李敖文中讲出的外部小故事、掌故、笑话、寓言式短段或可独立复述的历史轶事；不收李敖自己的交游、官司、出版、访客、电话、日常妙语和纯政治新闻材料链。",
    "",
    "## 保留条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 李敖本人的访问、电话、官司、饭局、朋友往来、出版争执、打趣自况不收。",
    "- 政治短评、剪报材料、通电全文、人物履历、概念解释、格言和单句类比不收。",
    "- 丽塔海华丝、辜振甫、梵高、马科斯夫人等长新闻或时事材料，虽有叙事性，但更像材料链或新闻摘评，本轮不收。",
    "- 宋太祖卧榻故事总表已有同质故事，本轮不重复收入《一榻内外》一条。",
    "- 《抢夷齐与抢荷马》偏知识材料与诗句对照，不作为故事收入。",
    "",
    "## 校对处理",
    "",
    "- 提取轮 24 条，校对轮保留 17 条。",
    "- 删去“国民党一撤千里”：该条更像政治名句与老兵短评，故事动作不足。",
    "- 删去“沙门岛溢额投海”：该条偏地理制度材料，不是完整小故事。",
    "- 删去“魏道明被赶仍演说”：原文只是比较用的单句旧事，截取后故事性太弱。",
    "- 删去“林觉民家属抗战饿死”：该条偏历史材料与供养制度结果，未形成独立故事。",
    "- 删去“谢灵运说天下才一石”：该条是名言/才气夸口，不是故事。",
    "- 删去“北洋议员痰盂墨盒齐飞”：该条是泛举议会动武场面，不是具体故事。",
    "- 删去“日本兵拿鸡鸭会留钱”：该条是泛化比较材料，不是具体故事。",
    "",
    "## 提取说明",
    "",
    "- 候选扫描覆盖全书 135 个正文文件，自动候选 144 条。",
    "- 校对后保留施世纶、丘吉尔、妇女节洗碗、颜斶趋士、浸族弃老、袁世凯灭口、黄炎培记陶成章、韩信背水、侯赢自刭等外部故事。",
    "- 对长段短札只截取故事主体，例如妇女节笑话、狗与罗马法、蒋介石徐复观迁怒电器等，去掉前后李敖自己的日记场景或评论扩展。",
    "- 对同段中有明显论断收束的短故事，保留原文中的收束句；未改写故事正文。",
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
      "沉思日记类短札只保留未在总表出现、能独立复述的外部小故事、笑话、掌故、寓言式短段；排除李敖自身事件、交游、官司、出版片段、纯新闻材料链、概念解释和单句议论。",
    excludedByStandard: [
      "李敖自己的访问、电话、官司、饭局、朋友往来、出版争执和自我打趣不收。",
      "政治短评、剪报材料、通电全文、人物履历、概念解释、格言和单句类比不收。",
      "长新闻和时事材料链不收，除非段落中有可独立截取的小故事或笑话主体。",
      "总表已有的同质故事不重复收入。"
    ],
    extractionNotes: [
      "候选扫描覆盖全书 135 个正文文件，自动候选 144 条。",
      "提取轮曾保留施世纶、丘吉尔、颜斶、弃老高台、沙门岛、袁世凯灭口、黄炎培记刺陶、韩信、侯赢、戒烟漫画、小偷逻辑等 24 条。",
      "妇女节笑话、狗与罗马法、蒋介石徐复观迁怒电器等只截取故事主体。",
      "丽塔海华丝、辜振甫、梵高、马科斯夫人等长新闻或时事材料链不收。",
      "宋太祖卧榻故事已有总表 LAWC009，本轮不重复收入《一榻内外》相关条目。"
    ],
    proofreadNotes: [
      "校对轮由 24 条缩为 17 条。",
      "删去国民党一撤千里、沙门岛溢额投海、魏道明被赶仍演说、林觉民家属抗战饿死、谢灵运说天下才一石、北洋议员痰盂墨盒齐飞、日本兵拿鸡鸭会留钱等 7 条。",
      "删除原因集中在：偏材料链、泛化比较、单句名言、政治短评或故事动作不足。",
      "保留条目均有较明确人物行动、转折、笑点或故事收束，并可脱离李敖自身事件独立复述。"
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
