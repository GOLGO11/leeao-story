const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "给国民党难看";
const SLUG = "gei_guomindang_nankan";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "GGMDNK";
const ORIGINAL_EXTRACTION_COUNT = 13;
const PROOFREAD_DROP_COUNT = 2;
const PROOFREAD_ADD_COUNT = 0;
const PROOFREAD_TIGHTENED_COUNT = 0;
const PROOFREAD_TITLE_ADJUSTED_COUNT = 4;
const CORPUS_ROOT = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
const CATEGORY_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT))
  .find((name) => name.startsWith("013."));
const BOOK_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR))
  .find((name) => name.startsWith("005."));
const SOURCE_ROOT = path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR, BOOK_DIR);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "005",
    paragraph: 3,
    title: "张国焘向雷啸岑解释陈寒波为何遭暗杀",
    start: "到一九五〇年冬，有陈寒波其人者",
    end: "你不是这块料，放心罢！”"
  },
  {
    prefix: "005",
    paragraphs: [5, 6],
    title: "张国焘借祭黄陵离开延安",
    start: "张国焘不但告诉了雷啸岑",
    end: "改乘飞机到达武汉了。"
  },
  {
    prefix: "006",
    paragraph: 4,
    title: "孙中山说炮击广州只是“还魂炮”"
  },
  {
    prefix: "006",
    paragraph: 7,
    title: "孙中山炮击督军署后莫荣新派人道歉"
  },
  {
    prefix: "012",
    paragraph: 18,
    title: "王陵基把囚室称为“四望楼”",
    start: "就在这篇传记发表的第二年",
    end: "晚上‘望’睡觉”。"
  },
  {
    prefix: "012",
    paragraph: 18,
    title: "宋希濂肯让兵团司令却不肯让棋",
    start: "宋希濂在“四望楼”中似乎不太望",
    end: "那是两回事！”"
  },
  {
    prefix: "024",
    paragraph: 9,
    title: "黄少谷送密码本要黄雪邨报告李宗仁动态",
    end: "自是千真万确。"
  },
  {
    prefix: "026",
    paragraph: 6,
    title: "谷正纲把念过的讲稿又念了一遍"
  },
  {
    prefix: "028",
    paragraph: 6,
    title: "魏道明回家才由妻子告知被调职"
  },
  {
    prefix: "038",
    paragraph: 2,
    title: "国王没穿衣服却向百姓炫耀新衣",
    start: "我想到《国王的新衣》那个故事。",
    end: "却根本不知道自己正在一丝不挂。"
  },
  {
    prefix: "042",
    paragraph: 4,
    title: "殷洪乔把百姓托带的一大批信倒进水里",
    start: "《世说新语》记晋朝豫章太守殷羡",
    end: "殷洪乔不能作致书邮！”"
  }
];

const excludedByStandard = [
  "本书主体是国民党史政论战、暗杀与撤退史料、法规争议、报刊批评和人物评价；只收可脱离论证链独立复述，并有场景、行动、转折或结果的小故事。",
  "李敖自己的经历不单独成条；政治案件、战争过程、党史沿革、法规条文、报刊争论、演说摘录、名单和薄事实均不按故事收入。",
  "转述、掌故与传说保留原文的来源限定，不把作者引用的材料提升为经独立核实的史实。",
  "同一故事或同一核心正文如已在总库收过，本轮不重复。",
  "刘峙被安排做文天祥、谷正纲在迪斯尼想演说、伊索毒蛇献花、项羽无颜见江东父老及《笑府》‘第一声最像’等故事已在总库收录，本轮不重复。",
  "林肯在奴隶市场立誓、王国维靠妻子唠叨写作及寇准服何首乌使须发变白三则，原文均明确指出其可靠性有问题、纯属虚构或记载有误，不作为准确故事收入。",
  "萧同兹送机回来才知社长已被撤换的核心情节，已包含在《挑战李敖》现有故事中，校对轮删除本书重复条目。"
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
    `- 校对新增：${manifest.proofreadAddCount} 条`,
    `- 校对删除：${manifest.proofreadDropCount} 条`,
    `- 校对收短：${manifest.proofreadTightenedCount} 条`,
    `- 校对改题：${manifest.proofreadTitleAdjustedCount} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书大量篇幅是国民党史政论战、暗杀与撤退史料、法规争议、报刊批评和人物评价。校对轮继续只保留李敖在论述中讲出的、可脱离材料链独立复述，并有明确场景、行动、转折或结果的小故事；李敖自己的事件仍不收入，原文明示失实的故事也不收入。",
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
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 提取轮 ${manifest.originalExtractionCount} 条，校对轮保留 ${validation.count} 条；删除 ${manifest.proofreadDropCount} 条，未新增、未收短，改题 ${manifest.proofreadTitleAdjustedCount} 条。`,
    "- 删除寇准服何首乌使须发变白一则：原文《旧闻证误》明确判定‘此所记皆误’，不符合故事准确性要求。",
    "- 删除萧同兹送机回来才知被撤换一则：同核情节已包含在《挑战李敖》现有故事中。",
    "- 四个标题改用‘解释’‘炮击后’‘报告动态’‘一大批信’等原文尺度，正文均未改动。",
    "- 校对保留的十一则均为连续原文，没有改写、补句或跨越原文空缺拼接。",
    "- 张国焘、孙中山、宋希濂等长段只截取能独立成篇的问答、脱身、反转或笑话场景，不把前后政治史料并入。",
    "- 林肯奴隶市场立誓和王国维靠妻子唠叨写作两则，原文已明确质疑或否定其真实性，故不作为准确故事收入。",
    `- 总库语义去重记录：${manifest.duplicateChecks.length} 组。`,
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
    proofreadAddCount: PROOFREAD_ADD_COUNT,
    proofreadDropCount: PROOFREAD_DROP_COUNT,
    proofreadRetainedCount: rows.length,
    proofreadTightenedCount: PROOFREAD_TIGHTENED_COUNT,
    proofreadTitleAdjustedCount: PROOFREAD_TITLE_ADJUSTED_COUNT,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "校对轮只保留可脱离国民党史政论战、政治案件与史料证据链独立复述，有明确场景、行动、转折或结果，并用于揭示人物或说明道理的小故事；排除李敖自己的事件、战争与案件经过、法规条文、报刊争论、薄事实、纯评论、原文明示失实的故事和总库已有同核故事。",
    excludedByStandard,
    duplicateChecks: [
      "刘峙被安排做文天祥却未死成的故事已在《中国现代史定论》收录，本轮不重复。",
      "谷正纲在迪斯尼乐园也想演说的故事已在《千秋万岁乌鸦求是合集》收录，本轮不重复。",
      "伊索毒蛇口含玫瑰送礼的寓言已在《千秋万岁乌鸦求是合集》收录，本轮不重复。",
      "项羽无颜见江东父老的故事已在《中国现代史正论》收录，本轮不重复。",
      "《笑府》主人放屁后拉椅子、客人说‘还是第一声最像’的故事已在《为自由招魂》等书收录，本轮不重复。",
      "孙中山答记者不再炮击须附条件一则已在《孙中山研究》收录，本轮不重复。",
      "萧同兹送董显光出国、回来才知自己被撤换的情节已包含在《挑战李敖》故事中，校对轮删除。"
    ],
    proofreadAdds: [],
    proofreadDrops: [
      {
        extractionId: "GGMDNK010",
        title: "萧同兹送机回来才知社长已被撤换",
        reason: "同核情节已包含在《挑战李敖》现有故事中。"
      },
      {
        extractionId: "GGMDNK011",
        title: "传说寇准服何首乌使须发变白以求拜相",
        reason: "原文明确以‘此所记皆误’否定该记载，不符合准确性要求。"
      }
    ],
    proofreadTightened: [],
    proofreadTitleAdjusted: [
      {
        extractionId: "GGMDNK001",
        from: "雷啸岑问张国焘共产党为何暗杀陈寒波",
        to: "张国焘向雷啸岑解释陈寒波为何遭暗杀"
      },
      {
        extractionId: "GGMDNK004",
        from: "孙中山炮击督军署逼莫荣新道歉",
        to: "孙中山炮击督军署后莫荣新派人道歉"
      },
      {
        extractionId: "GGMDNK007",
        from: "黄少谷送密码本要黄雪邨监视李宗仁",
        to: "黄少谷送密码本要黄雪邨报告李宗仁动态"
      },
      {
        extractionId: "GGMDNK013",
        from: "殷洪乔把百姓托带的信全部倒进水里",
        to: "殷洪乔把百姓托带的一大批信倒进水里"
      }
    ],
    proofreadContextCompleted: [],
    proofreadNotes: [
      `提取轮 ${ORIGINAL_EXTRACTION_COUNT} 条，校对轮删除 ${PROOFREAD_DROP_COUNT} 条，最终保留 ${rows.length} 条。`,
      "删除一条原文明示有误的寇准传说，以及一条总库已有同核情节的萧同兹故事。",
      `调整 ${PROOFREAD_TITLE_ADJUSTED_COUNT} 个标题，使动作、因果和数量不超过原文。`,
      "其余正文边界通过复核，未新增、未收短、未改写。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮保留 ${rows.length} 条，正文均能回到连续原文。`,
      "保留问答、掌故、讽刺笑话和带明确反转的人物轶事；排除案件、战争、法规、报刊与党史材料链。",
      "对原文明示不可靠或虚构的林肯、王国维故事不收入；对总库已有同核故事不重复。"
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
