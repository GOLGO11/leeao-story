const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖写的信";
const SLUG = "li_ao_xie_de_xin";
const ROUND = "story_round1";
const ID_PREFIX = "LAXDX";
const STATUS = "校对轮";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;

const selections = [
  {
    prefix: "021",
    paragraph: "5-7",
    title: "高旭一夜伪作石达开诗",
    start: "原稿中扉页“我志未酬人亦苦",
    end: "指出梁启超与高旭是作伪诗的“真凶”。"
  },
  {
    prefix: "027",
    paragraph: 5,
    title: "歌德被厨子用烟草熏书房",
    start: "文人中莎士比亚是否抽烟",
    end: "把他的书房用烟草薰了个够！"
  },
  {
    prefix: "027",
    paragraph: 6,
    title: "托尔斯泰戒烟后追吸余烟",
    start: "但是歌德还算是好的",
    end: "追吸客人吐出的余烟！"
  },
  {
    prefix: "054",
    paragraph: 17,
    title: "哈伯重金挖人成就芝加哥大学",
    start: "提到“重金精选”，你记得1891年洛氏基金会创办芝加哥大学的事吗？",
    end: "此皆“重金精选”之效也！"
  },
  {
    prefix: "054",
    paragraph: 17,
    title: "蔡元培请爱因斯坦因重金不足未成",
    start: "中华民国10至20年代的洋人讲学风",
    end: "颇不满意于爱氏）。"
  }
];

const candidateMarkers = [
  "故事",
  "小故事",
  "笑话",
  "寓言",
  "典故",
  "掌故",
  "传说",
  "史事一则",
  "有一次",
  "有一回",
  "有一个",
  "曾经",
  "曾言",
  "曾声言",
  "开玩笑",
  "伪作",
  "问他",
  "他说",
  "答道",
  "写道",
  "结果",
  "后来",
  "歌德",
  "托尔斯泰",
  "高旭",
  "石达开",
  "梁启超",
  "芝加哥大学",
  "哈伯",
  "洛氏",
  "蔡元培",
  "爱因斯坦",
  "浑沌",
  "医生",
  "皇帝",
  "总统",
  "太太"
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
    .find((name) => name.startsWith("012.") && name.includes(BOOK));
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

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^\d{3}\./u.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function splitParagraphs(source) {
  return source
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
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
    `${[
      headers.join(","),
      ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
    ].join("\n")}\n`,
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

function candidateScore(paragraph, found) {
  let score = found.length;
  if (/故事|小故事|笑话|寓言|典故|掌故|传说|史事一则/u.test(paragraph)) score += 6;
  if (/问|说|答|曰|道|写道/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/歌德|托尔斯泰|高旭|石达开|芝加哥大学|哈伯|蔡元培|爱因斯坦/u.test(paragraph)) {
    score += 3;
  }
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphs(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.includes(marker));
      const quoteHeavy = (paragraph.match(/[“”]/gu) || []).length >= 4;
      const dialogueHeavy = (paragraph.match(/：/gu) || []).length >= 2 && /问|说|答|曰|道/u.test(paragraph);
      if (!found.length && !quoteHeavy && !dialogueHeavy) return;
      rows.push({
        file: fileName,
        paragraph: index + 1,
        score: candidateScore(paragraph, found),
        markers: found.join("|"),
        text: paragraph.replace(/\s+/gu, " ").slice(0, 800)
      });
    });
  }
  rows.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file, "zh-Hans-CN"));
  fs.mkdirSync(path.dirname(path.join(ROOT, CANDIDATE_SCAN)), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, CANDIDATE_SCAN),
    `${[
      ["file", "paragraph", "score", "markers", "text"].join("\t"),
      ...rows.map((row) =>
        [row.file, row.paragraph, row.score, row.markers, row.text]
          .map((value) => String(value).replace(/\t/gu, " "))
          .join("\t")
      )
    ].join("\n")}\n`,
    "utf8"
  );
}

function candidateCount() {
  const candidatePath = path.join(ROOT, CANDIDATE_SCAN);
  if (!fs.existsSync(candidatePath)) return 0;
  return Math.max(0, fs.readFileSync(candidatePath, "utf8").trim().split(/\r?\n/u).length - 1);
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 李敖写的信故事校对轮",
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
    "本书是李敖写给师友、机关和读者的信，材料性、论辩性和现实事件很多。校对轮只保留李敖在信中讲出来、能脱离通信背景独立复述、并用于说明伪作、伪善、文化基金运作等道理的小故事或历史掌故；不收李敖本人办事、打官司、书信往来、出版查禁、读者求助、制度材料和单句典故提示。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 公车表扬、借钱、还钱、打官司、买书卖书、约饭、治病求援、查禁和公开信签名等，属于现实事件或材料，不作故事条目。",
    "- 《新约》“医生治自己”、灵芝祥瑞、五星会聚、浑沌之死、莫德惠劝进袁世凯、克里蒙梭改刊名等，只是典故名、材料提示或一句比喻，未展开成独立故事。",
    "- 王云五嘉新讲座自占名额、科学促进会和长期发展科学委员会流变等，偏制度案例，不作小故事收录。",
    "- 王讚源来信、唯英病情自述、尚勤信片段等，虽有情节，但不是李敖讲给读者用来说明道理的小故事。",
    "",
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，按“故事、笑话、寓言、史事一则、伪作、歌德、托尔斯泰、高旭、芝加哥大学、蔡元培、爱因斯坦”等词和高密度引号段落横扫，得到 ${manifest.candidateCount} 条候选。`,
    "- 提取轮入选 5 条；校对轮复核后保留 5 条，没有删除。",
    "- 保留项集中在历史伪作、反烟伪善和文化基金“重金精选”的说明故事。",
    "- 故事正文未改写，均按源文原句截取；跨段条目保留原文换行。",
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
  writeCandidateScan();
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
      "校对轮信件中只保留被李敖讲出来、能独立复述、且用于说明伪作、伪善、文化基金运作等道理的小故事或历史掌故；排除李敖本人现实事件、普通通信、制度材料、读者求助、单句典故提示和纯思想论述。",
    excludedByStandard: [
      "李敖自己的办事、打官司、借钱还钱、约饭、出版查禁和书信往来不收。",
      "制度案例、名单材料、读者病情自述、机关往返信件不收。",
      "只有一句典故名或格言提示、没有故事动作和转折的不收。",
      "同一主题若总表已有同文故事，不重复收录。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      "提取轮入选 5 条；校对轮复核后保留 5 条，没有删除。",
      "保留项覆盖历史伪作、烟草伪善和文化基金重金精选三类小故事。",
      "故事正文未改写，均按源文原句截取。",
      "本书通信和制度材料很多，本轮主动排除多数事件案例。"
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
  writeNotes(rows, validation, aggregate, manifest);
  if (!validation.ok) throw new Error(`Validation failed: ${JSON.stringify(validation)}`);
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
        sourceFileCount: sourceFiles().length,
        candidateCount: candidateCount(),
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
