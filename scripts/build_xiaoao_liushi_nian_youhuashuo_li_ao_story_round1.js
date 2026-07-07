const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "笑傲六十年·有话说李敖";
const SLUG = "xiaoao_liushi_nian_youhuashuo_li_ao";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "XALS";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "002",
    paragraphs: [8, 9],
    title: "尹俊奖赏打手铳士兵",
    start: "军队里面有很多有趣的事情",
    end: "赏他两百块钱。"
  },
  {
    prefix: "002",
    paragraphs: [19, 20],
    title: "老徐返乡分三百万",
    start: "譬如说我住在台北市金兰大厦",
    end: "他们有不同的辛苦的生活。"
  },
  {
    prefix: "002",
    paragraphs: [21, 22],
    title: "李师科抢银行为女孩留钱",
    start: "有名的一个老兵叫做李师科",
    end: "可是呢，他们有他们的正义。"
  },
  {
    prefix: "002",
    paragraph: 36,
    title: "洪炎秋怕朋友替他辩护",
    start: "我骂他以后啊",
    end: "因为你们顶嘴就是害了我。"
  },
  {
    prefix: "004",
    paragraphs: [7, 8],
    title: "成大共产党致敬假共产党",
    start: "吴荣元他们十七个人",
    end: "只是跟北京没有联络而已。"
  },
  {
    prefix: "003",
    paragraph: 40,
    title: "罗永黎自称神仙老虎狗",
    start: "事后我选所谓“总统”的时候",
    end: "后来他死掉了。"
  },
  {
    prefix: "005",
    paragraphs: [4, 5],
    title: "苏秋镇憋尿守预算",
    start: "我的好朋友苏秋镇",
    end: "这是小便过少的方法，来做立法委员。"
  },
  {
    prefix: "005",
    paragraph: 6,
    title: "陈水扁上厕所记预算",
    start: "还有一个人我们不要埋没他",
    end: "好像得了淋病一样。"
  },
  {
    prefix: "006",
    paragraph: 5,
    title: "熊十力用蒋介石照片擦裤子",
    start: "我想到大哲学家熊十力",
    end: "可是这种方法也太粗糙了，不是吗？"
  }
];

const ORIGINAL_EXTRACTION_COUNT = selections.length;
const proofreadDrops = [
  {
    title: "洪炎秋怕朋友替他辩护",
    reason: "主干仍是李敖自己骂洪炎秋及其朋友反应，属于李敖个人论战事件，不作独立故事保留。"
  },
  {
    title: "罗永黎自称神仙老虎狗",
    reason: "只是罗永黎一句自我分类式笑话，情节动作不足，且嵌在李敖个人参选相遇回忆中，校对轮删除。"
  }
];
const proofreadAdds = [];
const proofreadTrims = [];
const proofreadDropTitles = new Set(proofreadDrops.map((item) => item.title));

const excludedByStandard = [
  "李敖自己的抵台、军中、办刊、坐牢、官司、家庭和节目回顾经历不直接收，除非段内转述的是独立外部故事。",
  "主持人提问、人物评价、书籍资料、政治材料和新闻论证，缺少完整人物行动或情节反转的，不列为故事。",
  "同一段里的多个故事拆成可独立阅读的小条；只保留故事本体和必要的原文收束语。",
  "只是一句典故、比喻、概念判断或口号式引文的，排除。",
  "低俗笑话只在情节完整且明显服务李敖论证时保留；单纯插科打诨排除。"
];

const candidateMarkers = [
  "故事",
  "笑话",
  "典故",
  "有趣",
  "有一次",
  "有一天",
  "忽然",
  "结果",
  "后来",
  "最后",
  "问",
  "回答",
  "说"
];

const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖导航站",
  "油管/抖音"
];

function findSourceRoot() {
  const editionRoot = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!editionRoot) throw new Error("Missing 大李敖全集6.0 source directory");
  const editionPath = path.join(ROOT, editionRoot);
  const categoryDir = fs
    .readdirSync(editionPath, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.startsWith("010."));
  if (!categoryDir) throw new Error("Missing 010.节目演讲类 source directory");
  const categoryRoot = path.join(editionPath, categoryDir.name);
  const bookDir = fs
    .readdirSync(categoryRoot, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.startsWith("010."));
  if (!bookDir) throw new Error("Missing 010.笑傲六十年·有话说李敖 source directory");
  return path.join(categoryRoot, bookDir.name);
}

const SOURCE_ROOT = findSourceRoot();

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((name) => /^\d{3}\..*\.txt$/u.test(name))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));
}

function stripFooter(text) {
  const lines = text.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n").split("\n");
  const footerIndex = lines.findIndex((line) =>
    footerPatterns.some((pattern) => line.includes(pattern))
  );
  return (footerIndex >= 0 ? lines.slice(0, footerIndex) : lines).join("\n").trim();
}

function readSource(fileName) {
  return stripFooter(
    decoder.decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName))).replace(/^\uFEFF/u, "")
  );
}

function splitParagraphObjects(text) {
  const lines = text.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n").split("\n");
  const paragraphs = [];
  let buffer = [];
  let startLine = 0;

  const flush = (endLine) => {
    const paragraph = buffer
      .map((line) => line.trim())
      .join(" ")
      .replace(/\s+/gu, " ")
      .trim();
    if (paragraph) paragraphs.push({ text: paragraph, startLine, endLine });
    buffer = [];
    startLine = 0;
  };

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    if (!line.trim()) {
      if (buffer.length) flush(lineNo - 1);
      return;
    }
    if (!buffer.length) startLine = lineNo;
    buffer.push(line);
  });
  if (buffer.length) flush(lines.length);
  return paragraphs;
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!fileName) throw new Error(`Missing source file for prefix ${prefix}`);
  return fileName;
}

function paragraphForSelection(selection) {
  const fileName = fileForPrefix(selection.prefix);
  const paragraphs = splitParagraphObjects(readSource(fileName));
  const pick = (number) => {
    const paragraph = paragraphs[Number(number) - 1];
    if (!paragraph) throw new Error(`Missing paragraph ${number} in ${fileName}`);
    return { paragraphNumber: Number(number), ...paragraph };
  };

  if (Array.isArray(selection.paragraphs)) {
    const picked = selection.paragraphs.map(pick);
    return {
      fileName,
      sourceId: picked.map((paragraph) => `${selection.prefix}#P${paragraph.paragraphNumber}`).join(";"),
      sourceLines: picked.map((paragraph) => `${paragraph.startLine}-${paragraph.endLine}`).join(";"),
      text: picked.map((paragraph) => paragraph.text).join("\n\n")
    };
  }

  const paragraph = pick(selection.paragraph);
  return {
    fileName,
    sourceId: `${selection.prefix}#P${selection.paragraph}`,
    sourceLines: `${paragraph.startLine}-${paragraph.endLine}`,
    text: paragraph.text
  };
}

function selectedText(selection, paragraphText) {
  let text = paragraphText;
  if (selection.start) {
    const startIndex = text.indexOf(selection.start);
    if (startIndex < 0) throw new Error(`Start marker not found for ${selection.title}`);
    text = text.slice(startIndex);
  }
  if (selection.end) {
    const endIndex = text.indexOf(selection.end);
    if (endIndex < 0) throw new Error(`End marker not found for ${selection.title}`);
    text = text.slice(0, endIndex + selection.end.length);
  }
  return text.trim();
}

function charCount(text) {
  return Array.from(text).length;
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/gu, "");
}

function buildRows() {
  return [...selections, ...proofreadAdds]
    .filter((selection) => !proofreadDropTitles.has(selection.title))
    .map((selection, index) => {
      const paragraph = paragraphForSelection(selection);
      const storyText = selectedText(selection, paragraph.text);
      return {
        id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
        book: BOOK,
        book_slug: SLUG,
        title: selection.title,
        source_ids: paragraph.sourceId,
        source_file: paragraph.fileName,
        source_lines: paragraph.sourceLines,
        char_count: charCount(storyText),
        story_text: storyText
      };
    });
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (/[",\r\n]/u.test(stringValue)) return `"${stringValue.replace(/"/gu, '""')}"`;
  return stringValue;
}

function writeCsv(filePath, rows) {
  const columns = [
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
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const body = rows
    .map((row) =>
      [
        `【${row.id}】${row.title}`,
        `书名：${row.book}`,
        `来源：${row.source_file}:${row.source_lines}`,
        `字数：${row.char_count}`,
        "",
        row.story_text,
        "---"
      ].join("\n")
    )
    .join("\n\n");
  fs.writeFileSync(filePath, `${body}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') inQuotes = true;
    else if (char === ",") {
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
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...records] = rows.filter((item) => item.length > 1 || item[0]);
  if (!header) return [];
  const columns = header.map((column) => column.replace(/^\uFEFF/u, ""));
  return records.map((record) =>
    Object.fromEntries(columns.map((column, index) => [column, record[index] ?? ""]))
  );
}

function readRowsFromCsv(filePath) {
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function normalizeAggregateRow(row, bookSlug) {
  const storyText = row.story_text || row.text || "";
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || bookSlug || "",
    title: row.title,
    source_ids: row.source_ids || row.source_id || "",
    source_file: row.source_file,
    source_lines:
      row.source_lines || [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count || charCount(storyText),
    story_text: storyText
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

function candidateScore(paragraph, found) {
  let score = found.length;
  if (/故事|笑话|轶事|趣闻|典故|寓言|成语|电影|小说/u.test(paragraph)) score += 6;
  if (/问|答|说|讲/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/哭|笑|杀|逃|打|骗|偷|抓|跪|求|死|嫁|娶|抢|跑|问|答|赏/u.test(paragraph)) {
    score += 2;
  }
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
        score,
        markers: found.join("|"),
        text: paragraph.text.replace(/\s+/gu, " ").slice(0, 900)
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
  const text = fs.readFileSync(candidatePath, "utf8").trim();
  return text ? Math.max(0, text.split(/\r?\n/u).length - 1) : 0;
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 笑傲六十年·有话说李敖故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮初选：${manifest.originalExtractionCount} 条`,
    `- 校对删除：${manifest.proofreadDropCount} 条`,
    `- 校对补入：${manifest.proofreadAddCount} 条`,
    `- 校对修边：${manifest.proofreadTrimCount} 条`,
    `- 校对保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《笑傲六十年·有话说李敖》主要是六十年自述与节目回顾，李敖自己的抵台、军中、坐牢、办刊、家庭和政治事件很多。本轮继续按故事集口径收窄：只收李敖讲出来、可以独立复述、带人物行动或荒诞反转、并用来说明一层意思的小故事、笑话、历史掌故；李敖自己的事件和纯材料说明不收。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 校对删除",
    "",
    ...(manifest.proofreadDrops.length
      ? manifest.proofreadDrops.map((item) => `- ${item.title}：${item.reason}`)
      : ["- 无"]),
    "",
    "## 校对补入",
    "",
    ...(manifest.proofreadAdds.length
      ? manifest.proofreadAdds.map((item) => `- ${item.title}：${item.reason}`)
      : ["- 无"]),
    "",
    "## 校对修边",
    "",
    ...(manifest.proofreadTrims.length
      ? manifest.proofreadTrims.map((item) => `- ${item.title}：${item.reason}`)
      : ["- 无"]),
    "",
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 提取轮初选 ${manifest.originalExtractionCount} 条；校对轮删除 ${manifest.proofreadDropCount} 条、补入 ${manifest.proofreadAddCount} 条、修边 ${manifest.proofreadTrimCount} 条，保留 ${validation.count} 条。`,
    "- 故事正文均来自源文原段或段内原文截取，没有改写。",
    "- 本册入选较少是口径收紧的结果；校对轮继续排除了李敖个人论战事件和故事性不足的自我分类笑话。",
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
    originalExtractionCount: ORIGINAL_EXTRACTION_COUNT,
    selectionCount: selections.length,
    proofreadDropCount: proofreadDrops.length,
    proofreadDrops,
    proofreadTrimCount: proofreadTrims.length,
    proofreadTrims,
    proofreadAddCount: proofreadAdds.length,
    proofreadAdds,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖亲自讲成可独立复述、带人物行动或问答反转、并用于说明道理的小故事、笑话、历史掌故；排除李敖自身事件、节目流程、纯时政连续叙述、资料展示和无情节概念。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮初选 ${ORIGINAL_EXTRACTION_COUNT} 条；校对轮删除 ${proofreadDrops.length} 条，补入 ${proofreadAdds.length} 条，修边 ${proofreadTrims.length} 条，保留 ${rows.length} 条。`,
      "正文均按源文原段或段内原文截取。",
      "本册自传回顾密度高，校对轮继续按故事集口径收窄。"
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
