const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖生死书";
const SLUG = "li_ao_shengsishu";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "LASS";
const ORIGINAL_EXTRACTION_COUNT = 10;
const PROOFREAD_DROP_COUNT = 1;
const PROOFREAD_ADD_COUNT = 0;
const PROOFREAD_TIGHTENED_COUNT = 2;
const PROOFREAD_TITLE_ADJUSTED_COUNT = 1;
const CORPUS_ROOT = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
const CATEGORY_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT))
  .find((name) => name.startsWith("016."));
const BOOK_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR))
  .find((name) => name.startsWith("010."));
const SOURCE_ROOT = path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR, BOOK_DIR);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "001",
    paragraph: 3,
    title: "韩凭夫妇死后两坟生木并有双鸟悲鸣"
  },
  {
    prefix: "004",
    paragraph: 5,
    title: "路易十六不相信自己被判死刑",
    end: "表示愿退隐国外、不问国事。"
  },
  {
    prefix: "004",
    paragraph: 8,
    title: "明英宗为使复辟有名而杀于谦",
    end: "意思是说，不杀他，则反证我们复辟的理由，师出无名了。"
  },
  {
    prefix: "006",
    paragraph: 71,
    title: "据郑彦棻回忆戴传贤把燃烟头放入口中",
    start: "在那一次常会开会前",
    end: "好似已失了控制力一样。"
  },
  {
    prefix: "008",
    paragraph: 7,
    title: "据杨怀丰回忆阎锡山摆毒药拍照后逃走",
    start: "阎锡山说",
    end: "接到行政接管组通知，才出来办交代。"
  },
  {
    prefix: "008",
    paragraph: 8,
    title: "据韩如松回忆杨贞吉听劝扔掉毒药",
    start: "杨贞吉“对我说",
    end: "他听了之后，将毒药扔掉了。”"
  },
  {
    prefix: "008",
    paragraph: 8,
    title: "据朱崇廉回忆吴绍之比划泼掉药酒后假装喝下",
    start: "“不久，阎锡山在一次",
    end: "我们二人相视而笑。”"
  },
  {
    prefix: "011",
    paragraphs: [30, 31, 32],
    title: "杜九森不获准见亡父遗容后服毒",
    start: "今年9月13日"
  },
  {
    prefix: "017",
    paragraphs: [119, 120, 121, 122, 123, 124, 125, 126],
    title: "纪实小说《碧血黄沙》写张琴秋唱葬歌后跳楼",
    start: "小说着力描写了陈昌浩夫人张琴秋的坎坷一生。",
    end: "十一年之后中共为她开了追悼会。"
  }
];

const excludedByStandard = [
  "本书主体是自杀写真、死亡档案、政治案件与西路军史料；只收能脱离材料独立复述，有人物行动、转折或结果，并被李敖用来说明道理的小故事。",
  "李敖本人调查戴传贤死因、交游送行和写作经历不收；自杀经过、死亡名册、刑案证据链、人物履历、新闻剪报和战争行动也不因有死伤就拆成故事。",
  "001章庄周梦蝶已由LAYH025收录，只收韩凭、何氏殉情后两坟生木并有双鸟悲鸣的传说。",
  "004章校对后保留路易十六不信死刑与于谦因复辟须有名而被杀两则故事；圣法哥被刺只有一句结果，按薄事实删除。",
  "006章只收郑彦棻回忆戴传贤说‘油尽灯枯’并误含燃烟头的闭合轶事，其余自杀调查、争议证词与李敖调查过程不收。",
  "007章叶德辉夹春宫画防火已由LAYL005收录；王国维生平、自杀过程、遗书、死因论证与学术评价属于人物材料。",
  "008章只收阎锡山摆毒药拍照却逃走、杨贞吉扔毒药、吴绍之比划泼掉药酒后三则讽刺性轶事；五百完人名单与调查报告属于证据材料。",
  "010章淡江英专一日假基金已由LASHXJ003收录；居瀛玖、居浩然家史与自杀材料不按故事拆收。",
  "011章只收杜九森设法见亡父、遭拒后服毒又被送回香港的完整故事；012章张铁石事件是连续新闻、法律与政治材料链。",
  "016章丁慰慈被打到说出五十万卢布已由LADG043收录，李斯被假特使骗到不敢翻供已由LADG051收录；其余新疆刑案与酷刑材料不收。",
  "017章只收明确标作纪实小说的张琴秋葬歌故事，并在标题与正文保留出处；西路军指挥争议、战役经过、死伤和文革迫害清单不收。",
  "018章《水浒传》《红楼梦》段落用于考证‘结果’词义，不作为李敖讲道理的小故事收入；019至021章是甘地家族新闻、生平与风俗评论。",
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
    "本书主体是自杀写真、死亡档案、政治案件与西路军史料。校对轮继续只保留能脱离材料独立复述，有人物行动、转折或结果，并被李敖用来说明道理的小故事；一句式死亡事实即使有反差也不收入，第三方转述保留回忆、传说或纪实小说等出处限定。",
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
    `- 提取轮原有${manifest.originalExtractionCount}则，校对删除${manifest.proofreadDropCount}则、无新增，校对后保留${rows.length}则。`,
    "- 删除圣法哥投赞成死刑票后被军官刺死一则：原文只有一句结果，缺少足够场景与展开，属于薄事实。",
    "- 阎锡山毒药故事去掉承接回忆材料的外层引号；张琴秋故事去掉刊物出版与作者背景，从小说人物交代起收。",
    "- 吴绍之条目把标题改为‘泼掉药酒后假装喝下’，准确表达桌下手势的先后动作。",
    "- 校对保留的9则均只截取故事本身、必要出处与真实性限定，不把前后人物履历、案件材料、统计或战争论述混入正文。",
    "- 庄周梦蝶、叶德辉夹春宫画防火、淡江英专一日假基金、丁慰慈五十万卢布和李斯不敢翻供等同核故事已定位总库既有条目，本书不重复。",
    "- 李敖自己的调查、交游、送行与写作经历，以及自杀档案、死亡名册、新闻链、刑案证据和战役经过，均不拆作故事。",
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
      "校对轮逐条复核叙事闭合度、故事主体、原文连续性、转述限定和总库重复，并回看低分候选；李敖只是叙述者不构成排除，只有李敖本人作为行动主体的经历才排除；保留可脱离自杀档案、人物履历、案件与战争材料独立复述，有明确人物行动、转折或结果，并用于说明道理的小故事；删除一句式死亡事实、薄事实、纯语录、资料清单、连续新闻链和总库已有同核故事。",
    excludedByStandard,
    duplicateChecks: [
      "校对保留9则已用人物、关键动作、对话与结果的不同组合反查总库，未发现同文或同核条目。",
      "庄周梦蝶定位LAYH025；叶德辉夹春宫画防火定位LAYL005；淡江英专一日假基金定位LASHXJ003。",
      "丁慰慈被打到说出五十万卢布定位LADG043；李斯被假特使骗到不敢翻供定位LADG051。",
      "韩凭夫妇、路易十六、于谦、戴传贤、太原毒药、杜九森和张琴秋等入选故事均未发现总库同核条目。",
      "同一故事不因本书版本、出处或措辞不同重复收入。"
    ],
    proofreadAdds: [],
    proofreadDrops: [
      {
        title: "赞成处死路易十六的议员被军官刺死",
        sourceIds: "004#P4",
        reason: "原文只有一句刺杀结果，没有足够场景、人物互动或展开，属于薄事实。"
      }
    ],
    proofreadTightened: [
      {
        id: "LASS005",
        reason: "去掉承接杨怀丰回忆的‘当时’与外层引号，只保留阎锡山摆毒药、逃走及部属躲避自杀的完整故事。"
      },
      {
        id: "LASS009",
        reason: "去掉《当代》出版信息和作家背景，从小说对张琴秋的交代起收，保留纪实小说属性与完整结局。"
      }
    ],
    proofreadTitleAdjusted: [
      {
        id: "LASS007",
        from: "据朱崇廉回忆吴绍之比划泼掉药酒再喝",
        to: "据朱崇廉回忆吴绍之比划泼掉药酒后假装喝下",
        reason: "原文只是桌下手势，标题需明确先泼掉再假装喝下。"
      }
    ],
    proofreadContextCompleted: [],
    proofreadNotes: [
      "提取轮10则，校对删除1则、无新增，校对后保留9则。",
      "删除圣法哥被刺一则，因为只有一句死亡事实，不具备足够故事展开。",
      "LASS005与LASS009收紧正文，分别去掉外层引号和出版背景；故事核心、出处限定与结局不变。",
      "LASS007标题改为‘泼掉药酒后假装喝下’，不把手势写成真实饮酒。",
      "复核低分候选后，居瀛玖秘密写信、戴传贤死前表态、张铁石连续新闻等仍属人物生平或事件材料，不新增。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮保留 ${ORIGINAL_EXTRACTION_COUNT} 条，正文均能回到连续原文。`,
      "全部机器候选均已浏览，高分候选逐段回看上下文，并人工复核自杀写真、政治案件与西路军长篇材料。",
      "入选集中在古代掌故、政治反差、回忆录轶事及有明确出处限定的纪实小说场景。",
      "李敖自己的调查和交游经历、自杀档案、人物履历、死亡名册、新闻链、刑案证据与战争材料不按故事收入。",
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
