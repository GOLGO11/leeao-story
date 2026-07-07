const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "快意还乡——李敖神州文化之旅";
const SLUG = "kuaiyi_huanxiang_li_ao_shenzhou_wenhua_zhilv";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "KYHX";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "010.节目演讲类",
  "013.快意还乡——李敖神州文化之旅"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "003",
    paragraph: 7,
    title: "女厕所里背演讲稿",
    start: "前天晚上我编了一个故事：",
    end: "女孩子说，你不紧张你到女厕所来干什么？"
  },
  {
    prefix: "008",
    paragraph: 17,
    title: "卡斯利书中父子论天堂",
    start: "有一个匈牙利作家卡斯利",
    end: "你们休想硬把天堂造出来。"
  },
  {
    prefix: "008",
    paragraph: 26,
    title: "艾博特父子算名词之争",
    start: "美国有一个办报的人叫ABBOTT。",
    end: "原来最后那10%也是名词之争。"
  },
  {
    prefix: "010",
    paragraph: 30,
    title: "林肯被骂不辩",
    start: "我记得过去美国林肯总统",
    end: "十个天使出来证明我清白都没有用。"
  },
  {
    prefix: "010",
    paragraph: 30,
    title: "杰弗逊不辩护言论自由",
    start: "再举例子，美国第三任总统杰弗逊",
    end: "我就不能够促使美国有言论自由。"
  },
  {
    prefix: "011",
    paragraph: 8,
    title: "蔡元培立刻招女生",
    start: "蔡元培担任北京大学校长时",
    end: "他很聪明、很技巧地达到了这个效果。"
  },
  {
    prefix: "011",
    paragraph: 10,
    title: "蔡元培留香港不合作",
    start: "他说，蔡先生埋在香港",
    end: "成果被同是浙江人的蒋介石偷走了。"
  }
];

const excludedByStandard = [
  "报道李敖登机、抵达、参访、演讲、受访、题字、宴请等行程本身，不按故事收。",
  "李敖谈自己的飞行、腿疼、返乡、访校、政治态度、媒体互动等经历，只作为事件材料，不按故事收。",
  "主持人、记者、现场人士的问答与转述，若不是李敖讲出的独立故事，不列入。",
  "纯历史判断、政治论证、人物评价、口号式比喻、书名解释，缺少人物行动或情节转折的，排除。",
  "同一段中若含故事和评论，只截取故事本体与必要收束语，正文保持源文原字。",
  "校对轮复查候选表，已排除与既有总表重复的胡适受害女子、香港人笑话、王安石墓前、蔡元培阅报、林则徐关岳束手、马克吐温电话、朝三暮四等故事。"
];

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((name) => /^0\d{2}\..+\.txt$/u.test(name))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function readSource(fileName) {
  return decoder.decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName)));
}

function splitParagraphObjects(text) {
  const lines = text.replace(/\r/gu, "").split("\n");
  const paragraphs = [];
  let buffer = [];
  let startLine = 1;
  let endLine = 1;

  function flush() {
    if (!buffer.length) return;
    paragraphs.push({
      text: buffer.join("").trim(),
      startLine,
      endLine
    });
    buffer = [];
  }

  lines.forEach((line, index) => {
    if (line.trim()) {
      if (!buffer.length) startLine = index + 1;
      buffer.push(line.trim());
      endLine = index + 1;
    } else {
      flush();
    }
  });
  flush();
  return paragraphs.filter((item) => item.text);
}

function fileByPrefix(prefix) {
  const file = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!file) throw new Error(`Missing source file for prefix ${prefix}`);
  return file;
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/gu, "");
}

function charCount(text) {
  return Array.from(String(text || "")).length;
}

function excerpt(paragraph, selection) {
  const source = paragraph.text;
  if (!selection.start && !selection.end) return source;

  const startIndex = selection.start ? source.indexOf(selection.start) : 0;
  if (startIndex < 0) {
    throw new Error(`Start marker not found for ${selection.title}: ${selection.start}`);
  }
  const afterStart = selection.start ? startIndex + selection.start.length : 0;
  let endIndex = source.length;
  if (selection.end) {
    const foundEnd = source.indexOf(selection.end, afterStart);
    if (foundEnd < 0) throw new Error(`End marker not found for ${selection.title}: ${selection.end}`);
    endIndex = foundEnd + selection.end.length;
  }
  return source.slice(startIndex, endIndex).trim();
}

function buildRows() {
  return selections.map((selection, index) => {
    const sourceFile = fileByPrefix(selection.prefix);
    const paragraph = splitParagraphObjects(readSource(sourceFile))[selection.paragraph - 1];
    if (!paragraph) throw new Error(`Missing paragraph ${selection.paragraph} in ${sourceFile}`);
    const storyText = excerpt(paragraph, selection);
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: `${selection.prefix}#P${selection.paragraph}`,
      source_file: sourceFile,
      source_lines: `${paragraph.startLine}-${paragraph.endLine}`,
      char_count: charCount(storyText),
      story_text: storyText
    };
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/u.test(text) ? `"${text.replace(/"/gu, '""')}"` : text;
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
  const body = rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","));
  fs.writeFileSync(filePath, `${headers.join(",")}\n${body.join("\n")}${body.length ? "\n" : ""}`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const ch = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/u, ""));
  return rows
    .filter((cells) => cells.some((cell) => cell !== ""))
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])));
}

function readRowsFromCsv(filePath) {
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function writeTxt(filePath, rows) {
  const text = rows
    .map(
      (row) =>
        `【${row.id}】${row.title}\n` +
        `书名：${row.book}\n` +
        `来源：${row.source_file}:${row.source_lines}\n` +
        `字数：${row.char_count}\n\n` +
        `${row.story_text}\n---`
    )
    .join("\n\n");
  fs.writeFileSync(filePath, `${text}${text ? "\n" : ""}`, "utf8");
}

function normalizeAggregateRow(row, slug) {
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || slug,
    title: row.title,
    source_ids: row.source_ids || row.source_id || "",
    source_file: row.source_file,
    source_lines:
      row.source_lines || [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count || charCount(row.story_text),
    story_text: row.story_text
  };
}

function duplicateTextPairs(rows) {
  const seen = new Map();
  const duplicates = [];
  rows.forEach((row) => {
    const normalized = normalizeText(row.story_text);
    if (seen.has(normalized)) duplicates.push([seen.get(normalized), row.id]);
    else seen.set(normalized, row.id);
  });
  return duplicates;
}

function existingBookOrder() {
  const aggregatePath = path.join(ROOT, "data", "all_stories.csv");
  if (!fs.existsSync(aggregatePath)) return [];
  const order = [];
  readRowsFromCsv(aggregatePath).forEach((row) => {
    const slug = row.book_slug;
    if (slug && !order.includes(slug)) order.push(slug);
  });
  return order;
}

function buildAggregateRows() {
  const booksRoot = path.join(ROOT, "data", "books");
  const slugs = fs
    .readdirSync(booksRoot)
    .filter((slug) => fs.existsSync(path.join(booksRoot, slug, `${ROUND}.csv`)));
  const order = existingBookOrder();
  const orderedSlugs = [
    ...order.filter((slug) => slugs.includes(slug)),
    ...slugs.filter((slug) => !order.includes(slug)).sort()
  ];
  return orderedSlugs.flatMap((slug) =>
    readRowsFromCsv(path.join(booksRoot, slug, `${ROUND}.csv`)).map((row) =>
      normalizeAggregateRow(row, slug)
    )
  );
}

function writeAggregate() {
  const rows = buildAggregateRows();
  const books = [];
  rows.forEach((row) => {
    let book = books.find((item) => item.slug === row.book_slug);
    if (!book) {
      book = { book: row.book, slug: row.book_slug, count: 0 };
      books.push(book);
    }
    book.count += 1;
  });

  writeCsv(path.join(ROOT, "data", "all_stories.csv"), rows);
  writeTxt(path.join(ROOT, "data", "all_stories.txt"), rows);

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

const candidateMarkers = [
  "故事",
  "笑话",
  "典故",
  "掌故",
  "逸事",
  "传说",
  "寓言",
  "我讲",
  "讲一个",
  "举一个",
  "举例",
  "例子",
  "有一个",
  "有一次",
  "从前",
  "过去",
  "当年",
  "后来",
  "最后",
  "问",
  "答",
  "说：",
  "他说",
  "她说",
  "拒绝",
  "逃",
  "救",
  "骗",
  "骂",
  "打",
  "抓",
  "哭",
  "杀",
  "死",
  "写信",
  "题字",
  "皇帝",
  "和尚",
  "孔子",
  "老子",
  "胡适",
  "蒋介石",
  "宋美龄",
  "毛泽东",
  "周恩来",
  "康有为",
  "梁启超"
];

function candidateScore(paragraph, found) {
  let score = found.length;
  if (/故事|笑话|典故|掌故|寓言|我讲|讲一个|举一个|举例|有一个|有一次/u.test(paragraph)) score += 6;
  if (/他说|她说|问|答|拒绝|逃|骗|救|杀|死|哭|骂|打|抓/u.test(paragraph)) score += 3;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/记者|主持人|网友|凤凰网|问：|答：/u.test(paragraph)) score -= 2;
  if (/李敖：/u.test(paragraph)) score += 1;
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphObjects(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.text.includes(marker));
      const quoteHeavy = (paragraph.text.match(/[“”]/gu) || []).length >= 6;
      if (!found.length && !quoteHeavy) return;
      const score = candidateScore(paragraph.text, found);
      if (score < 8 && !quoteHeavy) return;
      rows.push({
        file: fileName,
        paragraph: index + 1,
        lines: `${paragraph.startLine}-${paragraph.endLine}`,
        score,
        markers: found.join("|"),
        text: paragraph.text.replace(/\s+/gu, " ").slice(0, 1000)
      });
    });
  }
  rows.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file, "zh-Hans-CN"));
  fs.mkdirSync(path.dirname(path.join(ROOT, CANDIDATE_SCAN)), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, CANDIDATE_SCAN),
    `${[
      ["file", "paragraph", "lines", "score", "markers", "text"].join("\t"),
      ...rows.map((row) =>
        [row.file, row.paragraph, row.lines, row.score, row.markers, row.text]
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
  const text = fs.readFileSync(candidatePath, "utf8").trim();
  return text ? Math.max(0, text.split(/\r?\n/u).length - 1) : 0;
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    `# ${BOOK}故事校对轮`,
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 校对保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书以报道、现场记录和访谈为主。本轮只收李敖在其中讲出的、可以独立复述、带人物行动或问答转折、并用来说明一层意思的小故事；李敖自己的返乡行程、演讲场面、媒体问答和政治判断不直接收。",
    "",
    "## 入选条目",
    "",
    ...(rows.length
      ? rows.map(
          (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
        )
      : ["- 无"]),
    "",
    "## 排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 校对轮复核保留 ${validation.count} 条；正文均来自源文原段或段内原文截取，没有改写。`,
    "- 校对轮复查了高分候选和强故事标记候选；疑似漏收条目多为既有总表重复、行程报道、资料解释或非李敖讲述，未补入。",
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
  if (!fs.existsSync(SOURCE_ROOT)) throw new Error(`Missing source root: ${SOURCE_ROOT}`);
  writeCandidateScan();
  if (process.argv.includes("--scan-only")) {
    console.log(
      JSON.stringify(
        {
          book: BOOK,
          sourceRoot: path.relative(ROOT, SOURCE_ROOT),
          sourceFileCount: sourceFiles().length,
          candidateScan: CANDIDATE_SCAN,
          candidateCount: candidateCount()
        },
        null,
        2
      )
    );
    return;
  }

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
    status: STATUS,
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    sourceFileCount: sourceFiles().length,
    candidateScan: CANDIDATE_SCAN,
    candidateCount: candidateCount(),
    originalExtractionCount: selections.length,
    selectionCount: selections.length,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖讲出的、可独立复述、带人物行动或问答转折、并用于说明道理的小故事；排除李敖自身行程事件、节目流程、纯时政论证、资料展示和无情节概念。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `校对轮复核 ${selections.length} 条，保留 ${rows.length} 条。`,
      "正文均按源文原段或段内原文截取。",
      "校对轮已复查候选扫描，继续排除事件化、语录化、重复条目。"
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

  console.log(
    JSON.stringify(
      {
        book: BOOK,
        slug: SLUG,
        status: STATUS,
        count: rows.length,
        totalChars: validation.totalChars,
        aggregateCount: aggregate.rows.length,
        validationOk: validation.ok,
        candidateCount: candidateCount(),
        outDir: path.relative(ROOT, OUT_DIR),
        notes: path.relative(ROOT, NOTES_PATH)
      },
      null,
      2
    )
  );
}

main();
