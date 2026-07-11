const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "蒋家臭史";
const SLUG = "jiang_jia_choushi";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "JJCS";
const ORIGINAL_EXTRACTION_COUNT = 5;
const PROOFREAD_DROP_COUNT = 0;
const PROOFREAD_TIGHTENED_COUNT = 2;
const CORPUS_ROOT = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
const CATEGORY_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT))
  .find((name) => name.startsWith("012."));
const BOOK_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR))
  .find((name) => name.startsWith("026."));
const SOURCE_ROOT = path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR, BOOK_DIR);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    title: "冯玉祥把控告呈文当作结婚礼物",
    prefix: "002",
    paragraph: 15
  },
  {
    title: "戴传贤用照片和镜子回答生父问题",
    prefix: "011",
    paragraph: 2,
    start: "今早报上，登出蒋纬国昨天讲演",
    end: "让蒋纬国自己决定“是像这边，还是像那边？”"
  },
  {
    title: "戴传贤劝人别谈男女问题",
    prefix: "011",
    paragraph: 6,
    end: "所以我不愿意说它！’”"
  },
  {
    title: "蒋纬国撞翻点心后赔礼",
    prefix: "014",
    paragraphs: [26, 27]
  },
  {
    title: "周亚夫被诬为死后在地下造反",
    prefix: "020",
    paragraph: 7,
    start: "这段的大意是：过了不久"
  }
];

const excludedByStandard = [
  "本书混有李敖评论、蒋氏家族考据、情史传闻、调查记录和政治材料；只收可独立复述、有起因、互动与结果，并借以揭示人物性格或说明道理的小故事。",
  "家族身世、死亡经过、政治事件、书信考证、调查过程、证据链、传闻清单、政策评论和纯骂战，不按故事收入。",
  "同一故事或同一核心正文如已在总库收过，本轮不重复。",
  "李敖或材料作者自己的行程与经历不单独成条；纯语录、薄事实、未经展开的桃色传闻、价值判断和长篇政论也不拆成故事。",
  "涉及私生活与家族秘闻的材料必须保留原文中的据说、传闻、疑案等限定，不把故事扩写成已经独立核实的史实。"
];

const candidateMarkers = [
  "故事",
  "小故事",
  "典故",
  "掌故",
  "逸事",
  "传说",
  "笑话",
  "讲故事",
  "举一个",
  "举例",
  "例子",
  "有一个",
  "有一次",
  "有一天",
  "当年",
  "后来",
  "最后",
  "原来",
  "忽然",
  "结果",
  "问",
  "答",
  "说",
  "他说",
  "她说",
  "写道",
  "自述",
  "回忆",
  "追忆",
  "哭",
  "笑",
  "骂",
  "骗",
  "逃",
  "跑",
  "杀",
  "死",
  "枪毙",
  "活捉",
  "强奸",
  "奸杀",
  "跪",
  "求",
  "请",
  "打电话",
  "请我吃饭",
  "龙应台",
  "龙爸爸",
  "蒋介石",
  "蒋经国",
  "宋美龄",
  "马英九",
  "彭明敏",
  "彭克立",
  "张灵甫",
  "杜聿明",
  "黄维",
  "刘峙",
  "雷震",
  "潘毓刚",
  "钱复",
  "余光中",
  "齐邦媛",
  "王尚义",
  "张乐平",
  "萧乾",
  "三毛",
  "国民党",
  "共产党",
  "外省人",
  "台湾人",
  "一九四九",
  "二二八",
  "长春",
  "太原",
  "人头",
  "密码",
  "人质",
  "说客",
  "监牢",
  "血祭",
  "逃难",
  "投降",
  "叛变"
];

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((name) => /^\d{3}\..+\.txt$/u.test(name))
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
    paragraphs.push({ text: buffer.join("").trim(), startLine, endLine });
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

function excerpt(text, selection) {
  if (!selection.start && !selection.end) return text.trim();

  const startIndex = selection.start ? text.indexOf(selection.start) : 0;
  if (startIndex < 0) {
    throw new Error(`Start marker not found for ${selection.title}: ${selection.start}`);
  }
  const afterStart = selection.start ? startIndex + selection.start.length : 0;
  let endIndex = text.length;
  if (selection.end) {
    const foundEnd = text.indexOf(selection.end, afterStart);
    if (foundEnd < 0) throw new Error(`End marker not found for ${selection.title}: ${selection.end}`);
    endIndex = foundEnd + selection.end.length;
  }
  return text.slice(startIndex, endIndex).trim();
}

function buildRows() {
  return selections.map((selection, index) => {
    const sourceFile = fileByPrefix(selection.prefix);
    const paragraphs = splitParagraphObjects(readSource(sourceFile));
    const paragraphNumbers = selection.paragraphs || [selection.paragraph];
    const paragraphObjects = paragraphNumbers.map((paragraphNumber) => {
      const paragraph = paragraphs[paragraphNumber - 1];
      if (!paragraph) throw new Error(`Missing paragraph ${paragraphNumber} in ${sourceFile}`);
      return paragraph;
    });
    const storyText = excerpt(
      paragraphObjects.map((paragraph) => paragraph.text).join("\n"),
      selection
    );

    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: paragraphNumbers.map((paragraphNumber) => `${selection.prefix}#P${paragraphNumber}`).join(";"),
      source_file: sourceFile,
      source_lines: paragraphObjects.map((paragraph) => `${paragraph.startLine}-${paragraph.endLine}`).join(";"),
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

function candidateScore(paragraph, found) {
  let score = found.length;
  if (/故事|典故|掌故|我讲|讲一个|举一个|举例|例子|有一个|有一次|有一天/u.test(paragraph)) {
    score += 6;
  }
  if (/他说|她说|问|答|拒绝|逃|跑|杀|死|坐牢|抓|骗|哭|笑|骂|枪毙|活捉|强奸|奸杀/u.test(paragraph)) {
    score += 3;
  }
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/目录|注释|档案|资料|表格|名单|新闻|访问|采访|调查|日记|电文|公文|原文如下/u.test(paragraph)) {
    score -= 2;
  }
  if (/这个故事|以上.*故事|这件事|这段话/u.test(paragraph)) score += 2;
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
        text: paragraph.text.replace(/\s+/gu, " ").slice(0, 1200)
      });
    });
  }
  rows.sort(
    (a, b) =>
      b.score - a.score ||
      a.file.localeCompare(b.file, "zh-Hans-CN") ||
      a.paragraph - b.paragraph
  );
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
    `- 提取轮原保留：${manifest.originalExtractionCount} 条`,
    `- 校对保留：${validation.count} 条`,
    `- 校对删除：${manifest.proofreadDropCount} 条`,
    `- 校对收短：${manifest.proofreadTightenedCount} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书兼收家族身世、政治评论、历史考据、情史传闻和调查材料。校对轮逐条确认入选内容能脱离人物生平和证据链独立复述，并借人物行动、对话、反差或结果揭示性格、说明道理；猎奇秘闻和政治事件不因有戏剧性就自动视为故事。",
    "",
    "## 入选条目",
    "",
    ...(rows.length
      ? rows.map((row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`)
      : ["- 无"]),
    "",
    "## 排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 校对调整",
    "",
    "- 收短：戴传贤劝人别谈男女问题，保留丁文渊回忆中的批评、劝告与理由，删去后接的戴传贤恋爱和妻妾履历评论。",
    "- 收短：周亚夫被诬为死后在地下造反，删去与白话复述重复的《史记》原文，从李敖‘这段的大意是’起保留完整故事。",
    "",
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 提取轮 ${manifest.originalExtractionCount} 条，校对保留 ${validation.count} 条；删除 ${manifest.proofreadDropCount} 条，收短 ${manifest.proofreadTightenedCount} 条。`,
    "- 收短只调整连续原文的截取边界，没有改写、补句或跨段拼接。",
    ...(manifest.proofreadNotes || []).map((item) => `- ${item}`),
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
  if (!CORPUS_ROOT || !CATEGORY_DIR || !BOOK_DIR) throw new Error("Missing source directory");
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
    selectionCount: selections.length,
    originalExtractionCount: ORIGINAL_EXTRACTION_COUNT,
    proofreadDropCount: PROOFREAD_DROP_COUNT,
    proofreadTightenedCount: PROOFREAD_TIGHTENED_COUNT,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "校对轮只保留可脱离人物生平、政治沿革与证据链独立复述，有行动、对话、反差或结果，并用于揭示人物性格或说明道理的小故事；排除家族身世、情史传闻、死亡疑案、政策政争、调查过程、史料论证链、名单、薄事实、纯评论和总库已有同核故事。",
    excludedByStandard,
    duplicateChecks: [
      "颜驷三朝不遇的故事，已在《李敖放电集》收录，本轮不重复。",
      "克利夫兰以私生子竞选口号化解攻击的故事，已在《李敖笑傲江湖》收录，本轮不重复。"
    ],
    proofreadDrops: [],
    proofreadTightened: [
      "戴传贤劝人别谈男女问题",
      "周亚夫被诬为死后在地下造反"
    ],
    proofreadContextCompleted: [],
    proofreadNotes: [
      "校对后5条均有明确的互动、反转或结果，可以脱离整篇人物研究独立成立。",
      "冯玉祥的结婚礼物、照片与镜子的回答、男女问题的劝告、撞翻点心后的赔礼，均按人物轶事保留。",
      "周亚夫一则保留李敖的完整白话复述，说明权力如何借荒谬罪名逼死人。",
      "颜驷三朝不遇与克利夫兰私生子竞选口号虽符合故事标准，但总库已有同核故事，故不重复收入。",
      "章亚若疑案、蒋纬国情史调查、蒋孝武死因推测与蒋氏接班政治，均按秘闻、证据链或历史事件排除。",
      "戴传贤男女问题一则保留丁文渊回忆的完整原段，只表示本书转述该回忆，不提升为已独立核实的事实。"
    ],
    aggregateDuplicateTextIds: aggregate.duplicateTextIds,
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
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
