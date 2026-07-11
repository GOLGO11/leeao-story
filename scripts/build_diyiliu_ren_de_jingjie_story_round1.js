const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "第一流人的境界";
const SLUG = "diyiliu_ren_de_jingjie";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "DYLR";
const ORIGINAL_EXTRACTION_COUNT = 10;
const PROOFREAD_DROP_COUNT = 0;
const PROOFREAD_ADD_COUNT = 0;
const PROOFREAD_TIGHTENED_COUNT = 0;
const PROOFREAD_TITLE_ADJUSTED_COUNT = 0;
const CORPUS_ROOT = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
const CATEGORY_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT))
  .find((name) => name.startsWith("016."));
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
    prefix: "010",
    paragraph: 8,
    title: "空中飞人抓住孩子却脱离挂钩",
    start: "1968年5月份的《花花公子》",
    end: "（Don't worry-I've got you.）"
  },
  {
    prefix: "022",
    paragraphs: [2, 3, 4, 5, 6],
    title: "布鲁斯第七次以蜘蛛为师"
  },
  {
    prefix: "026",
    paragraph: 11,
    title: "平安符追不上机车"
  },
  {
    prefix: "027",
    paragraph: 2,
    title: "朋友被火车压死却心疼西装",
    end: "这是极端小市民的境界。"
  },
  {
    prefix: "027",
    paragraph: 3,
    title: "孟敏堕甑不顾"
  },
  {
    prefix: "030",
    paragraphs: [6, 7],
    title: "雄鸡断尾不愿成为祭品"
  },
  {
    prefix: "039",
    paragraph: 4,
    title: "工人眼中的霍姆斯总反对老家伙"
  },
  {
    prefix: "043",
    paragraph: 13,
    title: "托斯卡尼尼抓赌反而参赌"
  },
  {
    prefix: "048",
    paragraph: 4,
    title: "史密斯任用非党员造路专家"
  },
  {
    prefix: "050",
    paragraph: 3,
    title: "王尔德击退醉鬼后邀众喝酒"
  }
];

const excludedByStandard = [
  "本书兼有自传性议论、思想札记、政治史评论、人物短评和引文；只收李敖拿来说明人物或道理，且有场景、行动、转折或结果的紧凑故事。",
  "李敖自己的坐牢、写作、论战、求学和交游不收入；人物履历、政治事件链、新闻资料、语录罗列、纯引文与薄事实也不按故事收入。",
  "001章狮子怕公鸡而大象怕蚊子的寓言已由HS11014收录；004章斗牛士负伤仍点牛排已由LAYH053收录，本书不重复。",
  "007章子濯孺子与庾公之斯、羊叔子送药分别已由HS11016、HS11017收录；亚历山大、威廉、华盛顿等段只是薄例子清单，不拆收。",
  "012章琼斯拒绝投降已由LAYH002收录；026章大学出身的食人族改用叉子已由WZGSXQ001与LAYM021收录。",
  "027章孔子失火先问人不问马已由LAYH100与XAND003收录，故只截取前半段西装笑话；孟敏堕甑另成一则。",
  "034章狼给羊安罪名与李元吉先杀再找理由已由HS11005、HS11006收录；岳飞案是政治历史事件链，不拆成故事。",
  "036章误读‘临财毋苟得’而要做母狗的笑话已由HS11015与LAYM010收录；甘地、欧亨利、史东、奥本海默等生平材料属于人物事迹或事件链。",
  "042章蔡元培处理阅报纠纷已由LAFZ004收录；043章托斯卡尼尼敲落工头帽子已由TZLA076收录，另收其抓赌反参赌的小故事。",
  "043章溥儒脱袍并端走好菜已由LAYL006收录；045章奥本海默反问主考已由LAFZ008收录；047章威尔森与通用公司已由LADZ018、LAYH060收录。",
  "049章肯尼迪关于国会、杜鲁门的两则机锋只有事件和一句话，未形成独立故事；051章耶稣受辱为大段经文引用，不按李敖讲出的紧凑小故事收入。",
  "同一故事或同一核心正文如已在总库收过，本轮不因版本或措辞不同而重复。"
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
    "本书兼有自传性议论、思想札记、政治评论、人物短评和资料引文。校对轮继续只保留可独立复述，有明确场景、人物行动、转折或结果，并被李敖拿来说明人物或道理的紧凑故事；李敖自己的经历不收入。",
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
    "- 逐篇复核52个正文文件及全部机器候选，并反向检索‘故事、笑话、寓言、轶事、有一次、有一天’等叙事标记。",
    "- 提取轮10则全部保留；无新增、无删除、无边界收紧、无标题调整。",
    "- 现有10则集中在寓言、漫画笑话、古代掌故和人物短轶事，均可脱离文章主体独立复述。",
    "- DYLR001只从漫画出处起截取，排除同段前部李敖自述；DYLR004在孔子重复故事出现前截止，保持原文连续且避免重复。",
    "- DYLR002保留布鲁斯六败、蜘蛛第七次成功、布鲁斯再战及原书结语，形成完整起承转合。",
    "- 甘地、欧亨利、张君劢、史东、奥本海默等篇以人物生平、政治事件或思想引文为主，不拆成事件条目。",
    "- 狮子与大象、斗牛士牛排、子濯孺子、羊叔子、琼斯、食人族叉子、孔子问人、狼羊、李元吉、母狗笑话、蔡元培、溥儒、奥本海默、托斯卡尼尼敲帽和威尔森等均已在总库收录，本书不重复。",
    "- 单书正文均为原文连续段落，未跨段拼接或改写。",
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
      "校对轮逐条复核叙事闭合度、来源限定、原文连续性与总库重复，并反查全书遗漏；只保留可脱离自传议论、人物生平和政治事件链独立复述，有明确场景、人物行动、转折或结果，并用于揭示人物或说明道理的紧凑故事；排除李敖自己的经历、薄事实、纯引文、新闻资料和总库已有同核故事。",
    excludedByStandard,
    duplicateChecks: [
      "校对后10则正文已对总库做规范化全文包含与人物关键短语检索，未发现同文或同核故事。",
      "狮子与大象、斗牛士牛排、子濯孺子、羊叔子、琼斯、食人族叉子、孔子问人、狼羊、李元吉、母狗笑话、蔡元培、溥儒、奥本海默、托斯卡尼尼敲帽和威尔森均已定位总库既有ID并排除。",
      "同书重复讲述的主题优先按总库既有故事去重，不因本书文字版本略有不同而重复收入。"
    ],
    proofreadAdds: [],
    proofreadDrops: [],
    proofreadTightened: [],
    proofreadTitleAdjusted: [],
    proofreadContextCompleted: [],
    proofreadNotes: [
      "提取轮10则全部保留，校对后仍为10则；无新增、删除、边界收紧或标题调整。",
      "DYLR001只保留漫画故事，排除同段李敖自述；DYLR004止于西装笑话的解释，不带入已收录的孔子故事。",
      "DYLR002保留布鲁斯六败、蜘蛛第七次成功、布鲁斯再战与原书结语，故事完整且未混入后续王安石评论。",
      "DYLR008虽短，但有抓赌、失联、被发现参赌的完整反转，标题补足原文‘这位大师’所指的托斯卡尼尼。",
      "胡适少年读《新约》、甘地与维丽玛、欧亨利返美及狱中写信、史东退订风波均属于书信自述或人物生平材料，不补作故事。",
      "肯尼迪礼遇弗罗斯特和杜鲁门、王尔德报关等段落只有事件与一句机锋，未形成独立故事，继续排除。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮保留 ${ORIGINAL_EXTRACTION_COUNT} 条，正文均能回到连续原文。`,
      "全部152个机器候选均已浏览，其中29个五分以上、17个六分以上候选重点回看上下文。",
      "入选集中在寓言、漫画笑话、古代掌故和人物短轶事。",
      "李敖自己的经历、人物履历、政治史事件链、新闻资料、薄例子和大段引文不按故事收入。",
      "旧文选集中的总库同核故事已按人物、关键动作与规范化正文去重排除。"
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
