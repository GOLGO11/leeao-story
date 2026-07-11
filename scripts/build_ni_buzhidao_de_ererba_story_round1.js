const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "你不知道的二二八";
const SLUG = "ni_buzhidao_de_ererba";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "NBZDEEB";
const ORIGINAL_EXTRACTION_COUNT = 13;
const PROOFREAD_DROP_COUNT = 0;
const PROOFREAD_ADD_COUNT = 7;
const PROOFREAD_TIGHTENED_COUNT = 0;
const PROOFREAD_TITLE_ADJUSTED_COUNT = 1;
const CORPUS_ROOT = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
const CATEGORY_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT))
  .find((name) => name.startsWith("014."));
const BOOK_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR))
  .find((name) => name.startsWith("007."));
const SOURCE_ROOT = path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR, BOOK_DIR);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "003",
    paragraph: 96,
    title: "吴新荣记点心客用猪肝谐音挖苦陈仪",
    start: "在台南的夜市",
    end: "‘猪肝（猪官）啦，快快！’"
  },
  {
    prefix: "003",
    paragraph: 96,
    title: "吴新荣记乘客拿车椅谐音大骂陈仪",
    start: "一日梦鹤在火车内",
    end: "害我这条新裤被钉子穿破了！ ’"
  },
  {
    prefix: "003",
    paragraph: 222,
    title: "陈重光称亲见外省人把水龙头插墙后向店家索赔"
  },
  {
    prefix: "003",
    paragraph: 224,
    title: "林衡道转述接收人员误把金槌当贵重物，并称故事是编造的"
  },
  {
    prefix: "003",
    paragraph: 228,
    title: "李筱峰记军人凭百元收据退掉五十元商品"
  },
  {
    prefix: "003",
    paragraph: 230,
    title: "江好锵记军人埋尸后把棺材退回店里要钱"
  },
  {
    prefix: "003",
    paragraph: 232,
    title: "林衡道记台籍将军拒绝排队并打护士耳光"
  },
  {
    prefix: "003",
    paragraph: 712,
    title: "杨炽昌记翁金护保护外省人反被控拘禁"
  },
  {
    prefix: "003",
    paragraph: 724,
    title: "唐贤龙记王姓台湾人堵门救友，遭殴身亡"
  },
  {
    prefix: "003",
    paragraph: 728,
    title: "曾重郎记辛志平以藏匿相报救命之恩"
  },
  {
    prefix: "003",
    paragraph: 764,
    title: "柯旗化记国军救出外省人后剥走他们的手表"
  },
  {
    prefix: "003",
    paragraph: 846,
    title: "蔡阳昆转述农民给穿掌者送水，自己也被穿起来"
  },
  {
    prefix: "003",
    paragraph: 954,
    title: "蔡信重记安然打麻将的同事互保领到抚恤"
  },
  {
    prefix: "003",
    paragraph: 578,
    title: "《行政院二二八研究报告》记谢雪红独自入宅止火缴枪"
  },
  {
    prefix: "003",
    paragraph: 734,
    title: "李捷勋记三人把郭主任夫妇藏进榻榻米躲过搜索"
  },
  {
    prefix: "003",
    paragraph: 738,
    title: "朱文伯记吴深潭救人后拒收两万元"
  },
  {
    prefix: "003",
    paragraph: 814,
    title: "《自由时报》记李白娘跪求白崇禧释放被捕民众"
  },
  {
    prefix: "003",
    paragraph: 816,
    title: "林衡道记歌仔戏班掩护避难者"
  },
  {
    prefix: "003",
    paragraph: 1300,
    title: "林可楫记客家人靠日语说清身份获释"
  },
  {
    prefix: "003",
    paragraph: 1326,
    title: "高菊花、高英洋记父亲保护县长反被疑为窝藏匪谍"
  }
];

const excludedByStandard = [
  "本书主体是关于二二八的一千组问答，绝大多数答案是访问记录、档案、伤亡数字、政治主张和相互矛盾的史料摘录；只收能脱离问答材料独立复述，并有明确场景、行动、反转或结果的小故事。",
  "李敖自己的经历不单独成条；事件时间线、抓捕与枪决记录、刑讯与受难清单、人数统计、人物履历、政治责任争论、薄事实和纯评论均不按故事收入。",
  "转述、回忆、掌故与传说保留原文的来源限定，不把作者引用的说法提升为经独立核实的史实。",
  "同一故事或同一核心正文如已在总库收过，本轮不重复。",
  "水龙头与金槌两组材料各有‘笑话’和‘实话’两种相反说法；只取叙事较完整的一版，并在标题保留陈重光的亲见主张或林衡道的编造判断。",
  "保护、伤害、逮捕和救援材料只在有明确人物选择、反差或闭合结果时收入，不把一般善行、恶行和受难记录逐条事件化。",
  "同段两则挖苦陈仪的谐音故事分别按连续首尾锚点提取，不把两个独立故事合成一条。"
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
    `- 正文收紧：${manifest.proofreadTightenedCount} 条`,
    `- 标题调整：${manifest.proofreadTitleAdjustedCount} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书主体是关于二二八的一千组问答，绝大多数答案是访问记录、档案、伤亡数字、政治主张和相互矛盾的史料摘录。校对轮逐条复核叙事闭合度、来源限定、原文连续性与总库重复，只保留可独立复述，并有明确场景、人物选择、反转或结果的小故事；李敖自己的经历和一般历史事件仍不收入。",
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
    "- 提取轮原有十三则全部保留；它们均有明确场景、行动、反差或结果，未把一般伤亡和政治材料当作故事。",
    "- 新增七则：谢雪红独自入宅止火缴枪、郭主任夫妇藏入榻榻米、吴深潭拒收救人报酬、李白娘跪求放人、歌仔戏班掩护避难者、客家人靠日语说明身份、保护县长反被疑为窝藏匪谍。",
    "- NBZDEEB012 只调整标题为‘自己也被穿起来’，贴近原文措辞；正文未改。",
    `- 校对后 ${validation.count} 则均为连续原文，没有改写、补句或跨越原文空缺拼接。`,
    "- 水龙头与‘金槌’的相反来源判断继续保留在标题和去重说明中，不把传闻提升为事实。",
    "- 其余伤亡、刑讯、枪决、逮捕、保护行动、人数统计、政治责任和史料矛盾继续按事件或材料排除。",
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
      "校对轮逐条复核叙事闭合度、来源限定、原文连续性与总库重复；只保留可脱离二二八问答、访问记录、档案与政治材料链独立复述，有明确场景、人物选择、反转或结果，并用于揭示人物或说明道理的小故事；排除李敖自己的经历、事件时间线、抓捕枪决与刑讯清单、人数统计、人物履历、政治责任争论、薄事实、纯评论和总库已有同核故事。",
    excludedByStandard,
    duplicateChecks: [
      "水龙头插墙索赔的同核传闻在本书另有林衡道所述‘恶意编造’版本；本轮只保留陈重光声称亲见、叙事更完整的一版。",
      "‘金槌’误会另有王子樵所述朋友差点被枪毙的同核短记；本轮只保留林衡道转述且明确注明编造判断的一版。",
      "两则陈仪谐音段子、水龙头与金槌误会、收据退款、退棺材、将军打护士、互救、抢表、送水受罚和冒领抚恤等核心情节均未在总库检出同核故事。"
    ],
    proofreadAdds: [
      {
        id: "NBZDEEB014",
        title: "《行政院二二八研究报告》记谢雪红独自入宅止火缴枪",
        sourceIds: "003#P578",
        reason: "有群众备油纵火、谢雪红独自入宅、说服放下武器并缴枪的完整行动与结果。"
      },
      {
        id: "NBZDEEB015",
        title: "李捷勋记三人把郭主任夫妇藏进榻榻米躲过搜索",
        sourceIds: "003#P734",
        reason: "有抢先到达、藏人、应付搜查并留下守护的完整避难过程。"
      },
      {
        id: "NBZDEEB016",
        title: "朱文伯记吴深潭救人后拒收两万元",
        sourceIds: "003#P738",
        reason: "吴深潭救护多人，事后拒收报酬并说明人道动机，人物选择与结尾明确。"
      },
      {
        id: "NBZDEEB017",
        title: "《自由时报》记李白娘跪求白崇禧释放被捕民众",
        sourceIds: "003#P814",
        reason: "有民众被捕、李白娘迎接跪求、白崇禧协助放人的连续过程。"
      },
      {
        id: "NBZDEEB018",
        title: "林衡道记歌仔戏班掩护避难者",
        sourceIds: "003#P816",
        reason: "避难者进入戏班做工随团流动，戏班出面掩护，最终度过危险，叙事闭合。"
      },
      {
        id: "NBZDEEB019",
        title: "林可楫记客家人靠日语说清身份获释",
        sourceIds: "003#P1300",
        reason: "因语言不通被误抓，争辩无效后改用日语说明身份而获释，具有清楚反转。"
      },
      {
        id: "NBZDEEB020",
        title: "高菊花、高英洋记父亲保护县长反被疑为窝藏匪谍",
        sourceIds: "003#P1326",
        reason: "派人保护县长上山避难，县长后来潜逃升官，救人者反遭怀疑，结果具有明确反差。"
      }
    ],
    proofreadDrops: [],
    proofreadTightened: [],
    proofreadTitleAdjusted: [
      {
        id: "NBZDEEB012",
        from: "蔡阳昆转述农民给穿掌者送水，自己也被穿掌",
        to: "蔡阳昆转述农民给穿掌者送水，自己也被穿起来",
        reason: "改用原文‘被穿起来’的谨慎表述，避免把转述细节说得更确定；正文未改。"
      }
    ],
    proofreadContextCompleted: [],
    proofreadNotes: [
      "提取轮原有十三则全部保留，校对新增七则，未删除或收紧正文。",
      "二十则正文均为连续原文，标题保留访问记录、回忆录和报刊来源限定。",
      "既有NBZDEEB001至NBZDEEB013编号不变；新增故事追加为NBZDEEB014至NBZDEEB020。",
      "一般保护行动、受难记录、刑讯枪决、数字统计和政治责任材料继续排除。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮保留 ${ORIGINAL_EXTRACTION_COUNT} 条，正文均能回到连续原文。`,
      "保留有场景、人物行动、反转或结果的民间段子、生活轶事和互救故事；访问记录与回忆来源限定一并保留。",
      "二二八伤亡、逮捕、刑讯、枪决、政治组织、人数统计和责任争论不按事件拆分。",
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
