const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖书启集";
const SLUG = "li_ao_shuqiji";
const ROUND = "story_round1";
const ID_PREFIX = "LASQJ";
const STATUS = "校对轮";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "li_ao_shuqiji_story_round1.md");
const CANDIDATE_SCAN = "notes/li_ao_shuqiji_candidate_scan.tsv";

const selections = [
  {
    prefix: "001",
    paragraph: 28,
    title: "罗素学欧氏几何只好屈服",
    start: "罗素回忆他小时候刚学欧氏几何",
    end: "他只好屈服。"
  },
  {
    prefix: "001",
    paragraph: 28,
    title: "张之洞批名词也是日本货",
    start: "张之洞批公文，看到属下引进外来语",
    end: "就是日本货。"
  },
  {
    prefix: "032",
    paragraph: 3,
    title: "猎兔人只剩两条兔腿",
    start: "一个笑话说某人去猎兔",
    end: "我射中了两条兔腿吧？"
  },
  {
    prefix: "033",
    paragraph: 16,
    title: "傅斯年要杀丁文江后成好友",
    start: "第一个故事是一个很老很老的故事。",
    end: "做成为最最要好的朋友。"
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
    .find((name) => name.startsWith("009.") && name.includes(BOOK));
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
    "# 李敖书启集故事校对轮",
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
    "《李敖书启集》多为公开信、邻里纠纷、法务材料、出版往来和亲友通信。本轮只收文中被李敖讲出来、可独立复述、并用来说明观点的小故事、笑话或压缩轶事；不收李敖自己的邻里、官司、亲友、节目、出版和政治行动材料，不收别人写给李敖的个人回忆，不收单句典故式引用。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 金兰大厦、程灝、CD座、管理费、车位、违建、法务部调查局、法院、调解委员会、新闻更正等材料，虽然有叙事过程，但主要是现实争议和证据链，不作小故事收录。",
    "- 邓丽君吊唁澄清、给周荃节目邀约、李敖女儿求学、父辈赙金往还、刘九庵看藏品等，属于李敖自身或亲友现实事件，不收。",
    "- 删除“斯德哥尔摩女职员回护强盗”：它主要是心理学概念说明和案例材料，用来解释“拘禁反应”，不是李敖展开讲出的独立小故事。",
    "- 孔子与程子倾盖、约翰生与鲍斯威尔、章太炎不写信史等偏单句典故或史论材料，未展开为独立小故事，本轮不收。",
    "- 《从“冷淡”到“偷笑”》后半多为正凡/雪儿对李敖的观察与申论，不是李敖讲故事，不收。",
    "",
    "## 提取说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，通用候选 ${manifest.candidateCount} 条；另以“故事、笑话、有一次、不料、记载、曾经”等关键词横扫低分漏网项。`,
    "- 提取轮原入选 5 条；校对轮删除斯德哥尔摩银行女职员一条，保留 4 条。",
    "- 保留罗素学欧氏几何、张之洞批“名词”、兔子腿笑话、傅斯年与丁文江由成见到好友：均有可独立复述的动作、转折或讽刺点。",
    "- 故事正文未改写，均按源文原句截取；同一段中只截取故事本体或与故事不可分割的说明。",
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
      "书信类校对轮只收文中被李敖讲出来、可独立复述、并用来说明观点的小故事、笑话或压缩轶事；排除李敖自己的邻里、官司、亲友、节目、出版和政治行动材料，排除别人写给李敖的个人回忆、证据链、概念案例和单句典故。",
    excludedByStandard: [
      "李敖自己的邻里纠纷、官司、亲友往来、节目邀约、出版事务和政治行动材料不收。",
      "法务证据链、新闻更正、法规说明、人物履历、单句典故和纯评论材料不收。",
      "别人写给李敖或评论李敖的个人回忆，除李敖转述为独立故事外，不收。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      "提取轮保留 5 条：罗素学欧氏几何、张之洞批“名词”、斯德哥尔摩女职员回护强盗、兔子腿笑话、傅斯年与丁文江由成见到好友。",
      "校对轮删除斯德哥尔摩女职员回护强盗：偏心理学概念说明和案例材料，不作为本项目的小故事收录。",
      "校对轮保留 4 条：罗素学欧氏几何、张之洞批“名词”、兔子腿笑话、傅斯年与丁文江由成见到好友。",
      "金兰大厦、法务、新闻更正、政治书信和亲友现实事件材料已按事件/证据链排除。",
      "孔子倾盖、约翰生/鲍斯威尔、章太炎不写信史等偏单句典故或史论材料，暂不收入。",
      "故事正文未改写，均按源文原句截取。"
    ],
    proofreadNotes: [
      "保留罗素学欧氏几何：虽短，但有质疑、被要求接受前提、屈服的完整小轶事，用来说明阅读小说需接受必要设定。",
      "保留张之洞批“名词”：讽刺结构完整，用来说明外来语早已进入中文语境。",
      "保留兔子腿笑话和傅斯年/丁文江故事：一个是明确笑话，一个在原文中明称“第一个故事”。",
      "删除斯德哥尔摩女职员回护强盗：偏心理学案例和概念说明，不是独立小故事。"
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
