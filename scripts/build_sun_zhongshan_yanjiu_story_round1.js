const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "孙中山研究";
const SLUG = "sun_zhongshan_yanjiu";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "SZSYJ";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "012.人物研究类",
  "005.孙中山研究"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "002",
    paragraph: 139,
    title: "孙中山更上一层楼被锁"
  },
  {
    prefix: "002",
    paragraph: 153,
    title: "孙中山跪下叩头求申雪"
  },
  {
    prefix: "002",
    paragraph: 182,
    title: "柯尔煤篓递信救孙中山",
    start: "翌晨，柯尔取煤来",
    end: "不日即可见释。’"
  },
  {
    prefix: "002",
    paragraph: 185,
    title: "孙中山不治邓廷铿只不予官"
  },
  {
    prefix: "008",
    paragraph: 25,
    title: "孙中山向陈炯明要委任"
  },
  {
    prefix: "008",
    paragraph: 51,
    title: "孙中山怒喊杀赖世璜",
    start: "时赖世璜于开大会时",
    end: "参谋长部次长蒋伯器出而保免之。"
  },
  {
    prefix: "008",
    paragraph: 98,
    title: "陈炯明可倒赌不可开",
    start: "前方吃紧，部下向陈炯明要求",
    end: "此公讲原则、守初志的作风，由此可见。"
  },
  {
    prefix: "010",
    paragraph: 4,
    title: "孙中山说炮教须附条件",
    start: "孙中山事后对人说",
    end: "孙中山答称：“是也。但须附以粤军不击予之条件。”"
  },
  {
    prefix: "010",
    paragraphs: [7, 8, 9],
    title: "国民党判大炮封口"
  },
  {
    prefix: "011",
    paragraphs: [6, 7],
    title: "林肯自认葛底斯堡演说失败"
  },
  {
    prefix: "012",
    paragraph: 22,
    title: "殷海光答三民主义后被挡演讲",
    start: "讲演完毕以后，照例由学生提出问题。",
    end: "便是说“题目不行”，而给打消掉了。"
  },
  {
    prefix: "014",
    paragraph: 3,
    title: "孙中山说最爱革命女人书"
  },
  {
    prefix: "014",
    paragraphs: [15, 16],
    title: "陈粹芬重逢请吃饭"
  },
  {
    prefix: "014",
    paragraph: 17,
    title: "陈粹芬传密件不害怕"
  },
  {
    prefix: "014",
    paragraphs: [25, 26],
    title: "宫崎民藏称陈夫人为女杰"
  }
];

const excludedByStandard = [
  "本书多为孙中山史事辨伪、国民党史料批判、政治道德评论和大段档案引文；只有能独立复述且有场景、行动、问答或转折的小故事收录。",
  "梁寒操转述的“国父见李鸿章”小故事，李敖明判为国民党改写出的捏造，所以不收入故事库。",
  "《乱党之真相》中宋女、日妇、中山姓氏等传闻，虽有故事外形，但来源多属攻击材料且未能在本书中互证，准确性不足，不收入。",
  "桂太郎密谈、孙中山对日条件、陈炯明长信、阎锡山太原起义、外交文件和年谱纠谬等，多为政治论证链或史料材料，不按故事收。",
  "校对轮删去“孙中山被强挽出总统府”，理由是它虽有场景动作，但主体是政治历史事件摘录，独立小故事味道不足。",
  "同一故事已在总库出现的继续排除；本轮特别排除上一册已收的孙中山行医、西医、中药、让后裔供祖宗、翻译议事法则等重复故事。",
  "只收李敖在文中转述、引用或点明其意义的故事；薄事实、纯语录、单句名言、病例清单、人物小传、制度沿革和纯资料索引排除。"
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
    const joined = paragraphObjects.map((paragraph) => paragraph.text).join("\n");
    const storyText = excerpt(joined, selection);

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

const candidateMarkers = [
  "故事",
  "小故事",
  "典故",
  "掌故",
  "逸事",
  "传说",
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
  "问",
  "答",
  "说",
  "他说",
  "她说",
  "写道",
  "自述",
  "追忆",
  "趣闻",
  "拒绝",
  "逃",
  "杀",
  "死",
  "哭",
  "笑",
  "请",
  "治",
  "跪",
  "叩头",
  "流泪",
  "强挽",
  "发炮",
  "炮教",
  "封口",
  "女杰",
  "孙中山",
  "孙逸仙",
  "孙文",
  "国父",
  "先生",
  "邓廷铿",
  "柯尔",
  "霍维太太",
  "康德黎",
  "马格里",
  "陈炯明",
  "赖世璜",
  "蒋伯器",
  "雪曼",
  "永丰舰",
  "陈粹芬",
  "陈夫人",
  "陈四姑",
  "犬养毅",
  "宫崎",
  "刘成禺",
  "殷海光",
  "林肯",
  "葛底斯堡",
  "李鸿章",
  "桂太郎",
  "阎锡山",
  "伦敦",
  "使馆",
  "总统府",
  "广州",
  "三民主义",
  "革命",
  "女人",
  "book",
  "revolution"
];

function candidateScore(paragraph, found) {
  let score = found.length;
  if (/故事|典故|掌故|我讲|讲一个|举一个|举例|例子|有一个|有一次|有一天/u.test(paragraph)) {
    score += 6;
  }
  if (/他说|她说|问|答|拒绝|逃|杀|死|跪|叩头|强挽|封口|女杰/u.test(paragraph)) score += 3;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/主旨|收件者|寄件者|报导|全文如下|年谱|专档|条约|外务省|论文集/u.test(paragraph)) score -= 2;
  if (/这个故事|以上.*故事/u.test(paragraph)) score += 3;
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
    "本书多为孙中山史事辨伪、国民党史料批判、政治道德评论和大段档案引文。校对轮继续收紧，只留李敖在文中转述、引用或点明其意义的、能独立复述、带人物行动或问答转折的小故事；纯资料引文、人物小传、制度沿革、书目考订、政治论证链、未能互证的传闻和既有总库重复故事不收。",
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
    "## 校对调整",
    "",
    "- 删除：孙中山被强挽出总统府。理由：更像政治历史事件摘录，不是独立小故事。",
    "- 收短：柯尔煤篓递信救孙中山。理由：去掉前半大段说理和宗教类比，保留煤篓递信的行动转折。",
    "- 收短：陈炯明可倒赌不可开。理由：去掉后半政治对比，只留部下求开赌、陈复电的故事核心。",
    "- 收短：孙中山说炮教须附条件。理由：去掉炮击背景和后续战局，只留“炮教”解释与记者问答。",
    "- 收短：殷海光答三民主义后被挡演讲。理由：去掉任教背景，只留学生提问、回答和之后被挡演讲的故事链。",
    "",
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 校对轮保留 ${validation.count} 条；提取轮 16 条中删 1 条、收短 4 条。`,
    "- 正文均来自源文原段或段内原文截取，没有改写。",
    "- 已复核候选表、源码段落和总库关键短语；排除重复故事、薄事实、未能互证的传闻、人物小传、制度沿革、史料索引和政治论证链。",
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
    originalExtractionCount: 16,
    selectionCount: selections.length,
    proofreadDropCount: 1,
    proofreadTightenedCount: 4,
    proofreadDrops: ["孙中山被强挽出总统府"],
    proofreadTightened: [
      "柯尔煤篓递信救孙中山",
      "陈炯明可倒赌不可开",
      "孙中山说炮教须附条件",
      "殷海光答三民主义后被挡演讲"
    ],
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖在文中转述、引用或点明其意义的、可独立复述、带人物行动或问答转折的小故事；排除文献资料堆砌、人物小传、制度沿革、病例清单、政治论证链、纯语录、伪传闻和总库已有重复故事。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `校对轮保留 ${rows.length} 条；提取轮 16 条中删 1 条、收短 4 条。`,
      "正文均按源文原段或段内原文截取。",
      "已用总库短语检索排除上一册已收的孙中山行医、西医、中药、让后裔供祖宗、翻译议事法则等重复故事；同时排除李鸿章见面伪故事、未能互证的传闻、政治论证链和大段史料材料。"
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
