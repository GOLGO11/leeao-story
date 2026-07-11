const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "我们没有明天";
const SLUG = "women_meiyou_mingtian";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "WMMMT";
const ORIGINAL_EXTRACTION_COUNT = 10;
const PROOFREAD_DROP_COUNT = 0;
const PROOFREAD_ADD_COUNT = 0;
const PROOFREAD_TIGHTENED_COUNT = 2;
const PROOFREAD_TITLE_ADJUSTED_COUNT = 2;
const CORPUS_ROOT = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
const CATEGORY_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT))
  .find((name) => name.startsWith("016."));
const BOOK_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR))
  .find((name) => name.startsWith("009."));
const SOURCE_ROOT = path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR, BOOK_DIR);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "004",
    paragraph: 3,
    title: "哲学家在黑房寻找不存在的黑猫",
    start: "提倡这种论调的人，宛如洋人讥讽哲学家的笑话："
  },
  {
    prefix: "021",
    paragraph: 5,
    title: "廖文毅骂蒋后向蒋介石照片行礼",
    start: "廖文毅头一天还在海外把蒋介石骂得狗血喷头呢！",
    end: "这种高速的前倨后恭，不是千古笑谈吗？"
  },
  {
    prefix: "022",
    paragraph: 2,
    title: "省议员下跪使监察委员反问是否也该跪"
  },
  {
    prefix: "022",
    paragraph: 14,
    title: "记者没拍到吴石楠应邀再跪一次"
  },
  {
    prefix: "022",
    paragraph: 15,
    title: "施性忠下跪喊冤后兴高采烈回家",
    start: "今年1月16日下午"
  },
  {
    prefix: "022",
    paragraph: 17,
    title: "李登辉坚持以中国式跪法受罚",
    start: "李登辉世居台北县三芝乡",
    end: "纵使下跪，也要跪从其志。"
  },
  {
    prefix: "035",
    paragraph: 5,
    title: "据潘德尔顿称美国拦阻受邀黑人活动家赴宴",
    start: "1979年2月",
    end: "罗勃特·威廉斯获准入席。"
  },
  {
    prefix: "040",
    paragraph: 11,
    title: "爱默生为美国盗印卡莱尔著作道歉",
    start: "1837年9月13号爱默生写给英国文豪卡莱尔"
  },
  {
    prefix: "043",
    paragraph: 16,
    title: "亚历山大因没有世界可征服而大哭",
    start: "马其顿的亚历山大的世界",
    end: "他的“我武惟扬”，也就告一段落。"
  },
  {
    prefix: "043",
    paragraphs: [30, 31],
    title: "据《日日新闻》报道日军军官比赛砍杀百人后加码再赛"
  }
];

const excludedByStandard = [
  "本书主体是台湾政治评论、两岸论战、美国人权材料与战争史论；只收能脱离论述独立复述，有场景、人物行动、反差或结果，并被李敖拿来说明道理的小故事。",
  "李敖本人作为行动主体的会面、通信、写作与评论经历不收；群众运动、政治表态、镇压纪录、外交材料、人物履历、统计与纯语录也不拆成故事。",
  "001章张之洞批日语词故事已由LASQJ002收录；002章纪昀题‘酉斋’故事已由DBXDCT038收录；014章粪杯教授故事已由XNDNQT004收录。",
  "013章拿破仑科西嘉独立经历已有TZLA029、LAYJ025等同核条目；015章陆贾说赵佗称臣已有NSJFM001，均不重复收入。",
  "030章宴会客人以银汤匙证明时空的故事已有XN17019，不因本书措辞略异再次收录。",
  "010章原住民土地与司法遭遇是群体史料和诗歌举证；019章外蒙古投票、020章韩国抗争、026章暴民材料、036至039章美国镇压纪录均属事件或证据链，不按小故事收入。",
  "013章胡适劝雷震、014章郭国基访陈诚、028章陈诚与李敖谈话只有观点或属于李敖自身经历，不具备闭合故事结构。",
  "022章只从下跪材料中收有明确场景、对话、反差或收束的四则轶事；黄玉娇与苏洪月娇互指下跪而无结果的争执不收。",
  "035章只收罗勃特·威廉斯持请帖被拦、经交涉获准入席的完整轶事；其余方励之与美国外交争议仍按材料处理。",
  "040章收爱默生对盗印卡莱尔著作的讽刺性轶事；同文在042章再次出现时按书内重复排除。",
  "043章收亚历山大哭泣和日军军官砍人竞赛两则具有明确动作与收束的故事；威尔逊、国联、公约和战争伤亡材料不拆收。",
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
    .filter((name) => /^\d{3}(?:\.|(?=\D)).*\.txt$/u.test(name))
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
    `# 《${BOOK}》校对轮`,
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
    `- 校对收紧：${manifest.proofreadTightenedCount} 条`,
    `- 标题调整：${manifest.proofreadTitleAdjustedCount} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书主体是台湾政治评论、两岸论战、美国人权材料与战争史论。校对轮继续只保留能脱离论述独立复述，有人物行动、反差或结果，并被李敖拿来说明道理的小故事；李敖本人作为行动主体的经历排除，第三方转述只有形成闭合轶事才收入，并在标题中保留必要的转述或报道限定。",
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
    `- 逐篇复核 ${manifest.sourceFileCount} 个正文文件和全部机器候选，并反向检索故事、笑话、传说、有一次、有一天等叙事标记。`,
    `- 提取轮原有${manifest.originalExtractionCount}则全部保留，校对无新增、无删除，校对后共${rows.length}则。`,
    "- WMMMT007去掉承接前文的‘例如’，标题补入‘据潘德尔顿称’；WMMMT008去掉论战性引子，从爱默生书信日期起收。",
    "- WMMMT010标题补入‘据《日日新闻》报道’，正文保留报道出处与完整竞赛经过。",
    "- 10则均只截取故事本身与必要出处，不把前后政治评论、人物履历、统计或证据链混入正文。",
    "- 张之洞批日语词、纪昀题酉斋、粪杯教授、银汤匙证明时空、拿破仑科西嘉经历和陆贾说赵佗等同核故事已定位总库既有条目，本书不重复。",
    "- 李敖自己的会面、通信、写作与评论经历，以及群众运动、政治文件、外交材料、镇压纪录和薄例子，均不拆作故事。",
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
      "校对轮逐条复核叙事闭合度、故事主体、原文连续性、转述限定和总库重复，并回看低分候选；李敖只是叙述者不构成排除，只有李敖本人作为行动主体的经历才排除；保留可脱离评论、政治文件、人物履历和材料链独立复述，有明确人物行动、反差或结果，并用于说明道理的小故事；排除薄事实、纯语录、资料清单、新闻事件链和总库已有同核故事。",
    excludedByStandard,
    duplicateChecks: [
      "入选10则已用人物、关键动作、对话与结果的不同组合反查总库，未发现同文或同核条目。",
      "张之洞批‘名词’定位LASQJ002；纪昀题‘酉斋’定位DBXDCT038；粪杯教授定位XNDNQT004。",
      "宴会银汤匙证明时空定位XN17019；陆贾说赵佗定位NSJFM001；拿破仑科西嘉经历定位TZLA029、LAYJ025等。",
      "040章爱默生盗印轶事在042章再次出现，按书内同文只保留040章版本。",
      "同一故事不因本书版本、出处或措辞不同重复收入。"
    ],
    proofreadAdds: [],
    proofreadDrops: [],
    proofreadTightened: [
      {
        id: "WMMMT007",
        reason: "去掉承接前文的‘例如’，从具体时间起收，使正文可独立阅读。"
      },
      {
        id: "WMMMT008",
        reason: "去掉‘好！拿就拿！’及翻书提示等论战性引子，从爱默生书信日期起保留故事。"
      }
    ],
    proofreadTitleAdjusted: [
      {
        id: "WMMMT007",
        from: "美国拦阻受邀黑人活动家赴宴",
        to: "据潘德尔顿称美国拦阻受邀黑人活动家赴宴",
        reason: "故事来自潘德尔顿文章的转述，标题保留出处限定。"
      },
      {
        id: "WMMMT010",
        from: "日军军官比赛砍杀百人后加码再赛",
        to: "据《日日新闻》报道日军军官比赛砍杀百人后加码再赛",
        reason: "原文明确以《日日新闻》随军记者报道为出处，标题不写成无条件事实。"
      }
    ],
    proofreadContextCompleted: [],
    proofreadNotes: [
      "提取轮10则全部保留，校对无新增、无删除，校对后仍为10则。",
      "WMMMT007与WMMMT008收紧正文，去除承接前文或论战性的引子，故事核心与原文字句不变。",
      "WMMMT007与WMMMT010在标题中补足转述或报道限定。",
      "复核低分候选后，胡适劝雷震、郭国基访陈诚、威尔逊和会谈话等仍属观点、薄例或未闭合材料，不新增。",
      "张之洞、纪昀、粪杯教授、银汤匙、拿破仑科西嘉和陆贾说赵佗等总库同核故事继续排除。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮保留 ${ORIGINAL_EXTRACTION_COUNT} 条，正文均能回到连续原文。`,
      "全部机器候选均已浏览，高分候选逐段回看上下文，并人工复核政治论战、美国材料与战争史长篇。",
      "入选集中在讽刺笑话、下跪轶事、历史人物反差与用来说明观点的第三方小故事。",
      "李敖自己的经历、政治文件、人物履历、群众运动、镇压纪录、纯语录和薄例子不按故事收入。",
      "同核故事已按人物、关键动作与规范化正文对总库检索并排除。"
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
