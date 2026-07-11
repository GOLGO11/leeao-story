const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "白色恐怖述奇";
const SLUG = "baise_kongbu_shuqi";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "BSKBSQ";
const ORIGINAL_EXTRACTION_COUNT = 8;
const PROOFREAD_DROP_COUNT = 0;
const PROOFREAD_ADD_COUNT = 0;
const PROOFREAD_TIGHTENED_COUNT = 1;
const PROOFREAD_TITLE_ADJUSTED_COUNT = 1;
const CORPUS_ROOT = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
const CATEGORY_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT))
  .find((name) => name.startsWith("014."));
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
    prefix: "001",
    paragraphs: [4, 5],
    title: "杨之华回忆瞿秋白临刑时说共产党人杀不尽",
    start: "他的爱人杨之华在《回忆秋白》里写道"
  },
  {
    prefix: "006",
    paragraph: 5,
    title: "丹尼·蓬救回被俘女儿后才知道美国已经独立"
  },
  {
    prefix: "008",
    paragraph: 5,
    title: "陈独秀宁愿留在狱中，也不肯写悔过书"
  },
  {
    prefix: "009",
    paragraph: 3,
    title: "会云讲弟弟认定哥哥道歉后仍在心里骂他"
  },
  {
    prefix: "009",
    paragraph: 8,
    title: "颜异只因反唇表示非议，便以“腹诽”罪被杀"
  },
  {
    prefix: "013",
    paragraphs: [5, 6, 7, 8, 9, 10],
    title: "《中央日报》编造老扒手隔墙偷走晚辈财物的假故事"
  },
  {
    prefix: "028",
    paragraph: 166,
    title: "龚德柏记潘德辉与吴颂阳拒绝用伪证换升赏",
    start: "保密局曾调潘吴两人至南所",
    end: "若昧良心说话，天理难容。”"
  },
  {
    prefix: "028",
    paragraph: 242,
    title: "龚德柏记杜长城用汽油制造“成功雷”骗局"
  }
];

const excludedByStandard = [
  "本书主体是白色恐怖案件、狱中回忆、刑讯记录、司法与监所黑幕、人物生平和文献材料；只收可脱离材料链独立复述，并有明确场景、行动、转折或结果的小故事。",
  "李敖自己的入狱、探监、交往与揭弊经历不单独成条；冤案经过、刑讯清单、受难记录、诉讼与调查过程、人物履历和纯评论均不按故事收入。",
  "转述、回忆、掌故与传说保留原文的来源限定，不把作者引用的说法提升为经独立核实的史实。",
  "同一故事或同一核心正文如已在总库收过，本轮不重复。",
  "李政一、龚德柏、舒家栋等人的长篇狱中经历只取其中能独立成篇、具有明确行动或反转的轶事，不把整段受难史拆成事件条目。",
  "《中央日报》会客室扒窃一则保留李敖的当场拆穿，并在标题明确标作编造的假故事，不把党报说法提升为事实。",
  "丹尼·蓬迷路与离开肯塔基、缇萦救父、孔令侃获宋美龄与蒋介石庇护等同核故事已在总库收录，本轮不重复。"
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
    `- 提取轮原有：${manifest.originalExtractionCount} 条`,
    `- 校对后保留：${manifest.proofreadRetainedCount} 条`,
    `- 校对新增：${manifest.proofreadAddCount} 条`,
    `- 校对删除：${manifest.proofreadDropCount} 条`,
    `- 正文收紧：${manifest.proofreadTightenedCount} 条`,
    `- 上下文补全：${manifest.proofreadContextCompleted.length} 条`,
    `- 标题调整：${manifest.proofreadTitleAdjustedCount} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "校对轮逐条复核故事性、来源限定和原文边界：只保留可脱离白色恐怖案件、狱中回忆、刑讯记录、人物生平和文献材料链独立复述，并有明确场景、行动、转折或结果的小故事；李敖自己的经历、人物履历和案件经过仍不收入。",
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
    `- 提取轮原有 ${manifest.originalExtractionCount} 则，校对后全部保留，不增不删。`,
    "- BSKBSQ006 去掉李敖的评论性引入和两行新闻标题，从党报正文“〔本报讯〕”起录，连续保留至李敖用会客室的墙、玻璃和铁栏杆拆穿假故事。",
    "- BSKBSQ007 只把标题调整为“龚德柏记潘德辉与吴颂阳拒绝用伪证换升赏”，明确二人拒绝之事，正文不动。",
    `- 校对后 ${validation.count} 则正文均为连续原文，没有改写、补句或跨越原文空缺拼接。`,
    "- 白色恐怖案件、刑讯方法、受难经过、诉讼调查、人物生平及李敖自己的入狱与交往仍不按故事收入。",
    "- 总库已有的丹尼·蓬迷路与离开肯塔基、缇萦救父、孔令侃获庇护等同核故事不重复收入。",
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
    proofreadTightenedCount: PROOFREAD_TIGHTENED_COUNT,
    proofreadTitleAdjustedCount: PROOFREAD_TITLE_ADJUSTED_COUNT,
    proofreadRetainedCount: rows.length,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "校对轮逐条复核故事性、来源限定和原文边界；只保留可脱离白色恐怖案件、狱中回忆、刑讯记录、司法与监所黑幕、人物生平和文献材料链独立复述，有明确场景、行动、转折或结果，并用于揭示人物或说明道理的小故事；排除李敖自己的经历、冤案与诉讼经过、刑讯和受难清单、人物履历、薄事实、纯评论和总库已有同核故事。",
    excludedByStandard,
    duplicateChecks: [
      "丹尼·蓬说自己只是昏头转向三天、以及因肯塔基太挤而离开两则，已在《李敖自传与回忆续集》以LZXJ005、LZXJ006收录，本轮不重复。",
      "缇萦上书救父已在《李敖文存二集》以LAWCEJ001收录，本轮不重复。",
      "孔令侃获宋美龄与蒋介石庇护、逃过蒋经国查抄的同核故事，已在《蒋介石评传》以JJSPZ013收录，本轮不重复。",
      "乔家才拒写悔过书的相似但人物与情节不同故事已在《我最难忘的事和人》以WZNW038收录；本书陈独秀拒写悔过书为不同事件，予以保留。"
    ],
    proofreadAdds: [],
    proofreadDrops: [],
    proofreadTightened: [
      {
        id: "BSKBSQ006",
        fromStart: "国民党《中央日报》自吹报导的新闻正确",
        toStart: "〔本报讯〕“盗亦有道”这句古言未必靠得住",
        reason: "去掉评论性引入和两行新闻标题；保留党报假故事正文及李敖的反证。"
      }
    ],
    proofreadTitleAdjusted: [
      {
        id: "BSKBSQ007",
        from: "龚德柏记潘德辉与吴颂阳拒绝作伪证换升赏",
        to: "龚德柏记潘德辉与吴颂阳拒绝用伪证换升赏",
        reason: "明确二人拒绝的是以伪证换取升赏；正文未改。"
      }
    ],
    proofreadContextCompleted: [],
    proofreadNotes: [
      `提取轮原有 ${ORIGINAL_EXTRACTION_COUNT} 条，校对后保留 ${rows.length} 条，不增不删。`,
      "BSKBSQ006 收紧正文边界，删除评论性引入和新闻标题，从党报故事正文起录。",
      "BSKBSQ007 仅调整标题措辞，正文及来源边界不变。",
      "全部正文保持连续原文；既定的案件记录、人物生平、李敖自述事件和同核故事排除项维持不变。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮保留 ${ORIGINAL_EXTRACTION_COUNT} 条，正文均能回到连续原文。`,
      "保留能独立说明人物品格或道理的临刑答话、人物轶事、儿童故事、历史掌故、假新闻拆穿和骗局；来源限定一并保留。",
      "白色恐怖案件、刑讯与受难记录、诉讼调查、人物生平和监所材料链不按故事拆分。",
      "李敖自己的经历不单独成条；总库已有同核故事不重复。"
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
