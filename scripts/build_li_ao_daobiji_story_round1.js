const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖刀笔集";
const SLUG = "li_ao_daobiji";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "LADBJ";
const ORIGINAL_EXTRACTION_COUNT = 1;
const PROOFREAD_DROP_COUNT = 0;
const PROOFREAD_ADD_COUNT = 0;
const PROOFREAD_TIGHTENED_COUNT = 0;
const PROOFREAD_TITLE_ADJUSTED_COUNT = 0;
const CORPUS_ROOT = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
const CATEGORY_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT))
  .find((name) => name.startsWith("015."));
const BOOK_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR))
  .find((name) => name.startsWith("002."));
const SOURCE_ROOT = path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR, BOOK_DIR);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "001",
    paragraph: 66,
    title: "王平借维尔弗反训告状者说明坏法官逼出复仇",
    start: "记得《基督山恩仇记》里",
    end: "于是原告乃立志报复。"
  }
];

const excludedByStandard = [
  "本书主体是李敖与徐复观、萧孟能、《自由时报》等人的诉讼、证词、判决与行政文书；只收书中另外讲出、可脱离案件材料独立复述，并有场景、人物行动、转折或结果的小故事。",
  "李敖自己的告人、被告、坐牢、房产与新闻更正经历不单独成条；诉状、答辩、判决、函件、法条论证、证据链、案件时间线和纯评论均不按故事收入。",
  "001#P66 的维尔弗故事出现在王平致李敖的来信中，具备告状、反被训斥威胁与立志复仇的完整因果；标题保留来信作者限定。",
  "003、004、006、008各章围绕徐复观案和台中法院判决展开，所谓‘笑话’多是对裁判与法律知识的批评，并非叙事性笑话。",
  "009至015章的胡茵梦证词、萧孟能诬告与李敖应诉，均属李敖自身案件和证据链，不拆成故事。",
  "017至022章《自由时报》误报、特制更正、新闻评议与控告过程，属于李敖自身事件及连续案件材料。",
  "023章‘一国两制’从孙中山、蒋介石到当代制度的材料，是政治与法律论证链，不是小故事。",
  "024、025章行政处分与司法积弊实例，仍为李敖自己的检举、诉讼和评论。",
  "同一故事或同一核心正文如已在总库收过，本轮仍不重复。"
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

function writeBroadCandidateScan() {
  execFileSync(
    process.execPath,
    [path.join(ROOT, "scripts", "scan_book_story_candidates.js"), SOURCE_ROOT, path.join(ROOT, CANDIDATE_SCAN)],
    { stdio: "inherit" }
  );
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
    `- 校对后保留：${validation.count} 条`,
    `- 校对新增：${manifest.proofreadAddCount} 条`,
    `- 校对删除：${manifest.proofreadDropCount} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书主体是李敖与徐复观、萧孟能、《自由时报》等人的诉讼、证词、判决与行政文书。校对轮继续只保留书中另外讲出、可脱离案件材料独立复述，并有具体场景、人物行动、转折或结果的小故事；李敖自己的诉讼与交涉经历不收入。",
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
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    "- 提取轮一则全部保留，校对轮无新增或删除：王平来信借《基督山恩仇记》中的维尔弗说明坏法官会逼告状者走向复仇。",
    "- 校对轮复核全部 120 个机器候选，其中 6 个五分以上、4 个六分以上候选均未形成新的第三方小故事。",
    "- 该则有告状、法官反向训斥威胁和原告立志报复的完整因果，并被来信用来说明司法不公的后果。",
    "- 标题明确保留王平来信的来源限定，不把小说情节写成李敖亲历或独立史实。",
    "- 其余候选中的问答、引语和时间推进均已回到上下文复核，主要来自诉状、函件、判决、证据链或连续案件经过。",
    `- 校对后 ${validation.count} 则为连续原文，没有改写、补句或跨越原文空缺拼接。`,
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
  writeBroadCandidateScan();
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
      "校对轮逐条复核叙事闭合度、来源限定、原文连续性与总库重复；只保留可脱离诉讼、证词、判决和行政文书独立复述，有明确场景、人物行动、转折或结果，并用于揭示人物或说明道理的小故事；排除李敖自己的诉讼事件、法律文书、案件时间线、证据链、薄事实和纯评论。",
    excludedByStandard,
    duplicateChecks: [
      "以‘维尔弗’‘基督山恩仇记 法官’‘哥哥被杀 告状’‘原告乃立志报复’检索总库，未发现同核故事。",
      "徐复观案、胡茵梦证词、萧孟能诬告和自由时报更正等叙事均因李敖自身事件或案件材料属性排除。"
    ],
    proofreadAdds: [],
    proofreadDrops: [],
    proofreadTightened: [],
    proofreadTitleAdjusted: [],
    proofreadContextCompleted: [],
    proofreadNotes: [
      "提取轮一则全部保留，无新增、删除、正文收紧或标题调整。",
      "全部120个机器候选已复核，其中6个五分以上、4个六分以上候选没有形成新的第三方小故事。",
      "LADBJ001 来源为王平来信，标题保留作者限定；正文为连续小说情节，没有并入后续案件评论。",
      "以维尔弗、维尔福、基督山、告状复仇等变体复查总库，未发现同核故事。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮保留 ${ORIGINAL_EXTRACTION_COUNT} 条，正文均能回到连续原文。`,
      "高分候选与含‘故事、笑话、有一次、有一个、回忆、听说、从前’的段落均已复核。",
      "保留王平来信转述的小说情节；标题保留来源限定，正文截取到故事结局。",
      "诉状、答辩、判决、函件、法条论证、证据链和案件时间线不按故事拆分。",
      "李敖自己的诉讼与交涉经历不单独成条；总库已有同核故事不重复。"
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
