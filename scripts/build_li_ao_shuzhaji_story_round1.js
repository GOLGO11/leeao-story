const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖书札集";
const SLUG = "li_ao_shuzhaji";
const ROUND = "story_round1";
const ID_PREFIX = "LASZJ";
const STATUS = "校对轮";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "li_ao_shuzhaji_story_round1.md");
const CANDIDATE_SCAN = "notes/li_ao_shuzhaji_candidate_scan.tsv";

const selections = [
  {
    prefix: "004",
    paragraph: "4-5",
    title: "索菲亚罗兰说再也不回牢里",
    start: "〔美联社纽约19日电〕索菲亚罗兰说",
    end: "即使我杀了人，我也绝不回去。”"
  },
  {
    prefix: "017",
    paragraph: 9,
    title: "曾子临死换大夫席",
    start: "曾子临死的时候",
    end: "还没躺好，就死了！"
  },
  {
    prefix: "017",
    paragraph: 11,
    title: "娜妲丽华不打扰金凯利",
    start: "记得过去看过一部电影",
    end: "娜妲丽华听了同伴的话，含泪而去了。"
  },
  {
    prefix: "033",
    paragraph: 12,
    title: "猪鬃也可算反共猪鬃",
    start: "〔附记〕今天《联合报》上说",
    end: "真是愈来愈好玩了！（1983年12月1日夜）"
  }
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("008."));
  if (!categoryDir) throw new Error("Cannot find letters category directory");
  const bookDir = fs
    .readdirSync(path.join(ROOT, corpusDir, categoryDir))
    .find((name) => name.startsWith("005.") && name.includes(BOOK));
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
  if (startIndex < 0) throw new Error(`Start marker not found: ${selection.title}`);
  const endIndex = source.indexOf(selection.end, startIndex);
  if (endIndex < 0) throw new Error(`End marker not found: ${selection.title}`);
  return {
    text: source.slice(startIndex, endIndex + selection.end.length).trim(),
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
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
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
  fs.writeFileSync(
    filePath,
    `${[headers.join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join(
      "\n"
    )}\n`,
    "utf8"
  );
}

function writeTxt(filePath, rows) {
  fs.writeFileSync(
    filePath,
    `${rows
      .map((row) =>
        [
          `【${row.id}】${row.title}`,
          `书名：${row.book}`,
          `来源：${row.source_file}:${row.source_lines}`,
          "",
          row.story_text
        ].join("\n")
      )
      .join("\n\n---\n\n")}\n`,
    "utf8"
  );
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
  try {
    return JSON.parse(raw.replace(/^window\.STORY_DATA = /u, "").replace(/;\s*$/u, "")).books.map(
      (book) => book.slug
    );
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
    throw new Error(`Duplicate story ids: ${duplicateIds.map((row) => row.id).join(", ")}`);
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
  return { rows, books, duplicateTextIds: duplicateTextPairs(rows) };
}

function validateSourceMatches(rows) {
  const cache = new Map();
  return rows
    .filter((row) => {
      if (!cache.has(row.source_file)) {
        cache.set(row.source_file, normalizeText(readSource(row.source_file)));
      }
      return !cache.get(row.source_file).includes(normalizeText(row.story_text));
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
    status: STATUS,
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
    .filter((entry) => entry.isFile() && /^\d{3}\./u.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function candidateCount() {
  const candidatePath = path.join(ROOT, CANDIDATE_SCAN);
  if (!fs.existsSync(candidatePath)) return 0;
  return Math.max(0, fs.readFileSync(candidatePath, "utf8").trim().split(/\r?\n/u).length - 1);
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 李敖书札集故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖书札集》以公开信、政论通信、党外往来和现实事件评论为主，正文中大量是李敖自己的官司、出版、坐牢、党外纠纷、人物评论和政治材料链。校对轮只保留文中被讲成一个可独立复述、并用来说明观点的小故事、笑话、掌故或外部轶事；不收李敖自己的事件合集、现实案情链、人物履历、单句典故、比喻句和纯评论材料。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 阿登纳拒纳粹并后来出任西德总理，总表在《李敖对话录》已有同质版本，本轮不重复收录。",
    "- 明末赵先生靠假捷报吃饭，总表在《李敖文存》已有版本，本轮不重复收录。",
    "- 林义雄家难、方素敏与孩子、殷海光身后事务、李敖查禁/官司/出版材料、党外人物往来等属于现实事件或档案链，不作故事收入。",
    "- 鲍勃·霍伯说里根有人替他说谎、威尔逊被讥发疯、梁令娴保存梁启超遗札等偏单句掌故或人物材料，故事展开不足，暂不收入。",
    "",
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，通用候选 ${manifest.candidateCount} 条。`,
    "- 提取轮入选 4 条；校对轮复核后保留 4 条，没有删除。",
    "- 索菲亚罗兰虽为新闻引语，但有入狱、牢中感受、决绝不回去的完整小场景，并被李敖用来说明“假戏”遇到真实人生的落差，保留。",
    "- 曾子易箦、金凯利/娜妲丽华电影故事、反共猪鬃均有清楚人物、转折和用意，保留。",
    "- 对边界项继续按不重复、可独立复述、非李敖自身事件三条线处理；疑似案情链或已有同质版本的故事已排除。",
    "- 故事正文未改写，均按源文原句截取。",
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
    status: STATUS,
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    sourceFileCount: sourceFiles().length,
    candidateScan: CANDIDATE_SCAN,
    candidateCount: candidateCount(),
    selectionCount: selections.length,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "书信类校对轮只收文中被讲成一个可独立复述、并用来说明观点的小故事、笑话、掌故或外部轶事；排除李敖自己的事件合集、现实案情链、人物履历、单句典故、比喻句和纯评论材料。",
    excludedByStandard: [
      "李敖自己的坐牢、官司、出版、通信、人际往来和政治论战材料原则上不收。",
      "案情链、人物履历、现实政治材料、单句典故和纯评论材料不收。",
      "总表已有同质或更完整版本的故事不重复收入。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      "提取轮保留 4 条：索菲亚罗兰牢狱噩梦、曾子易箦、金凯利/娜妲丽华电影故事、反共猪鬃。",
      "阿登纳拒纳粹、赵先生假捷报等总表已有同质版本，故不重复收录。",
      "林义雄家难、殷海光身后事务、查禁/官司/出版等现实事件链不收入。",
      "故事正文未改写，均按源文原句截取。"
    ],
    proofreadNotes: [
      "校对轮复核后保留 4 条，没有删除。",
      "索菲亚罗兰牢狱噩梦虽来自新闻引语，但具备可复述小场景，并服务于李敖对假戏/真事的辨析，保留。",
      "曾子易箦、娜妲丽华不打扰金凯利、反共猪鬃三条均有独立情节和明确用意，保留。",
      "阿登纳拒纳粹、赵先生假捷报等已有同质版本，继续排除。"
    ],
    aggregateDuplicateTextIds: aggregate.duplicateTextIds,
    generatedAt: new Date().toISOString()
  };
  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
  writeNotes(rows, validation, aggregate, manifest);
  if (!validation.ok) throw new Error(`Validation failed: ${JSON.stringify(validation)}`);
  if (aggregateDuplicatesForThisBook.length) {
    throw new Error(`Duplicate story text for ${BOOK}: ${JSON.stringify(aggregateDuplicatesForThisBook)}`);
  }
  console.log(
    JSON.stringify(
      {
        book: BOOK,
        rows: rows.length,
        aggregateRows: aggregate.rows.length,
        sourceFileCount: manifest.sourceFileCount,
        candidateCount: manifest.candidateCount,
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
