const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "中国性研究";
const SLUG = "zhongguo_xing_yanjiu";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "ZGXYJ";
const ORIGINAL_EXTRACTION_COUNT = 21;
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;

const selections = [
  {
    prefix: "006",
    paragraph: 21,
    title: "子产借《褰裳》止晋攻郑",
    start: "郑国的子大叔用《褰裳》诗来威胁",
    end: "是同样的手法。"
  },
  {
    prefix: "008",
    paragraph: "8-10",
    title: "醉汉请相士相下部",
    start: "《哈哈笑》书中有“相金加倍”一条：",
    end: "真该收入“古文观止”也！"
  },
  {
    prefix: "013",
    paragraph: 2,
    title: "张宗昌以嫖客婊子骂服部下",
    start: "“张大帅”张宗昌将军",
    end: "都骂服了。"
  },
  {
    prefix: "013",
    paragraph: 3,
    title: "刘玉章以鸡巴鸡巴毛骂服部下",
    start: "“刘光头”刘玉章将军",
    end: "也都骂服了。"
  },
  {
    prefix: "016",
    paragraph: "14-15",
    title: "法院把男议员写成女人",
    start: "可是事实上的“尤世景”是什么人呢？",
    end: "证明了司法人员的不负责任。"
  },
  {
    prefix: "017",
    paragraph: 5,
    title: "武二爷花轿里打手铳",
    start: "北方说书的项目中",
    end: "轿夫惊叫一声，故事落幕。"
  },
  {
    prefix: "019",
    paragraph: 5,
    title: "秦宓给天安上头耳足姓",
    start: "在古书中，为了讨论天的形状",
    end: "却是雄辩滔滔的。"
  },
  {
    prefix: "024",
    paragraph: 10,
    title: "于右任改也门为叶门",
    start: "新生代的国民党是无知的",
    end: "有趣哉，老K！"
  },
  {
    prefix: "030",
    paragraph: 7,
    title: "慈禧唯一归省",
    start: "慈禧既离锡拉胡同家中",
    end: "后其母时时入宫视其女云。"
  },
  {
    prefix: "034",
    paragraph: 4,
    title: "新闻局错禁陆小芬替身乳房",
    start: "陆小芬之露奶也",
    end: "大家相安无事了好一阵子。"
  },
  {
    prefix: "042",
    paragraph: "29-30",
    title: "苏人错喊黄八车",
    start: "《广谐铎》中就有这样的笑话：",
    end: "不复再唤“黄八车”矣。"
  },
  {
    prefix: "044",
    paragraph: 6,
    title: "勾践置寡妇娱军士",
    start: "真正“设娼妓来鼓舞军人”的",
    end: "显然就非营妓莫属了。"
  },
  {
    prefix: "044",
    paragraph: 8,
    title: "李陵搜得随军妇皆斩",
    start: "《万物原始》说",
    end: "不得“携妓行军”的缘故。"
  },
  {
    prefix: "044",
    paragraph: "13a",
    title: "李氏拥醉张邦昌入殿",
    start: "再据《宋史-张邦昌传》",
    end: "李氏仗脊配车营务。”"
  },
  {
    prefix: "044",
    paragraph: 14,
    title: "苏轼判营妓从良",
    start: "《渑水燕谈录》云：苏子瞻通判钱唐",
    end: "其敏捷善谑如此。"
  },
  {
    prefix: "044",
    paragraph: "18-20",
    title: "咸水妹验看医生",
    start: "据《哈哈笑》中“花丛大笑话”，有“医生验看”一则说：",
    end: "殊堪绝倒。"
  },
  {
    prefix: "045",
    paragraph: 260,
    title: "二十三号只爱钱",
    start: "基隆的“军中乐园”",
    end: "没有爱人。”"
  },
  {
    prefix: "045",
    paragraph: 279,
    title: "马祖姑娘赎身后不敢见人",
    start: "乱世情鸯的例子极多。",
    end: "才会产生吧？"
  },
  {
    prefix: "045",
    paragraph: "322b",
    title: "妓女抢连长帽子拉客",
    start: "连长俞克勤告诉我，有一次",
    end: "大喊：“连长，你的鸡巴硬了！”"
  },
  {
    prefix: "047",
    paragraph: "11a",
    title: "孔雀东南飞不西北飞",
    start: "老兄谈及“美国大学读博士学位者",
    end: "正是妙答。"
  },
  {
    prefix: "047",
    paragraph: "11b",
    title: "支那通把管仲乐毅读成管乐",
    start: "胡适就透露过一个，说某支那通考据出“诸葛亮乃音乐家”",
    end: "支那通之不通，可见一斑。"
  },
  {
    prefix: "048",
    paragraph: "34-35",
    title: "采金触怒神明",
    start: "追溯历史，我们知道在荷兰、明郑时期",
    end: "姑妄言之，姑妄听之的神话。"
  }
];

const proofreadDrops = new Map([
  [
    "慈禧唯一归省",
    "宫廷归省实录，场面完整但缺少反转和可提炼寓意，偏历史材料。"
  ],
  [
    "勾践置寡妇娱军士",
    "营妓制度溯源证据，只有古书两句材料，未讲成独立故事。"
  ],
  [
    "李陵搜得随军妇皆斩",
    "制度例外的史料引用，偏事件证据，故事转折不足。"
  ],
  [
    "二十三号只爱钱",
    "只有一句对话笑料，情节过薄，不单列。"
  ],
  [
    "马祖姑娘赎身后不敢见人",
    "社会现象举例，偏悲剧材料和事件说明，不单列。"
  ]
]);

const proofreadSplits = [
  "原“支那通读孔雀与管乐”拆成“孔雀东南飞不西北飞”和“支那通把管仲乐毅读成管乐”两条。"
];

const candidateMarkers = [
  "故事",
  "笑话",
  "有趣",
  "传说",
  "据说",
  "有一次",
  "使我想起",
  "问",
  "答",
  "说",
  "大怒",
  "不料",
  "结果",
  "后来",
  "被",
  "杀",
  "阉",
  "割",
  "抓",
  "判",
  "妓",
  "营妓",
  "嫖",
  "复仇",
  "皇帝",
  "太监",
  "国民党",
  "柏杨",
  "慈禧"
];

const excludedByStandard = [
  "只收李敖讲成可独立复述、带场景、行动、对话、反转或明确后果的小故事；纯训诂、性学说明、书目材料、医学概念、制度统计与政策论证不收。",
  "李敖自己的经历或见闻不以李敖为主角收录，如向林永丰医生求教、与刘家昌上厕所、参观八三一等。",
  "纯色情文本或古书性描写只作为材料，不作为故事收录，如《金瓶梅》性描写、佛经性文字、《易经》性交解释等。",
  "涉及雏妓、未成年人性经历或未成年人卖淫材料不收；新闻血案、临检材料和政策个案若只是事件链或统计证据，也不收。",
  "总表已有同概念故事不重复收录，如尹俊嘉奖哨兵、蒋经国问保险套、张纲埋轮、孙悟空不受弼马温、状元不如鸡巴、英国大学出身的食人蛮人、老兵数钱买老婆等。",
  "柏杨慈禧三百年复仇说在本文中是被李敖斥为胡说的对象，不作为李敖认可或讲述的故事收录。"
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("009."));
  if (!categoryDir) throw new Error("Cannot find history category directory");
  const bookDir = fs
    .readdirSync(path.join(ROOT, corpusDir, categoryDir))
    .find((name) => name.startsWith("005.") && name.includes(BOOK));
  if (!bookDir) throw new Error(`Cannot find source book directory for ${BOOK}`);
  return path.join(ROOT, corpusDir, categoryDir, bookDir);
}

const SOURCE_ROOT = findSourceRoot();

function decodeText(filePath) {
  return new TextDecoder("gb18030").decode(fs.readFileSync(filePath));
}

function stripFooter(text) {
  return text.replace(/\s*李敖影音E书[\s\S]*$/u, "").trim();
}

function readSource(fileName) {
  return stripFooter(decodeText(path.join(SOURCE_ROOT, fileName))).replace(/\r\n/g, "\n");
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^\d{3}\./u.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function splitParagraphs(source) {
  return source
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!fileName) throw new Error(`Cannot find source file for prefix ${prefix}`);
  return fileName;
}

function lineNumberAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

function selectText(source, selection) {
  const startIndex = source.indexOf(selection.start);
  if (startIndex < 0) throw new Error(`Start marker not found: ${selection.title}`);
  const endIndex = source.indexOf(selection.end, startIndex);
  if (endIndex < 0) throw new Error(`End marker not found: ${selection.title}`);
  return {
    text: source.slice(startIndex, endIndex + selection.end.length).trim(),
    lineRange: `${lineNumberAt(source, startIndex)}-${lineNumberAt(
      source,
      endIndex + selection.end.length
    )}`
  };
}

function storyId(index) {
  return `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`;
}

function sourceId(selection) {
  return `${ID_PREFIX}_${selection.prefix}_${String(selection.paragraph).replace(/-/g, "_")}`;
}

function buildRows() {
  const cache = new Map();
  return selections
    .filter((selection) => !proofreadDrops.has(selection.title))
    .map((selection, index) => {
      const sourceFile = fileForPrefix(selection.prefix);
      if (!cache.has(sourceFile)) cache.set(sourceFile, readSource(sourceFile));
      const selected = selectText(cache.get(sourceFile), selection);
      return {
        id: storyId(index),
        book: BOOK,
        book_slug: SLUG,
        title: selection.title,
        source_ids: sourceId(selection),
        source_file: sourceFile,
        source_lines: selected.lineRange,
        char_count: Array.from(selected.text).length,
        story_text: selected.text
      };
    });
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
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
  fs.writeFileSync(
    filePath,
    `${[
      headers.join(","),
      ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
    ].join("\n")}\n`,
    "utf8"
  );
}

function writeTxt(filePath, rows) {
  fs.writeFileSync(
    filePath,
    `${rows
      .map((row) =>
        [
          `【${row.id}】${row.title}`,
          `书名：${row.book}`,
          `来源：${row.source_file}:${row.source_lines}`,
          "",
          row.story_text
        ].join("\n")
      )
      .join("\n\n---\n\n")}\n`,
    "utf8"
  );
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
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
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [rawHeaders, ...body] = rows;
  if (!rawHeaders) return [];
  const headers = rawHeaders.map((header, index) =>
    index === 0 ? header.replace(/^\uFEFF/u, "") : header
  );
  return body
    .filter((values) => values.some((value) => value !== ""))
    .map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))
    );
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, "");
}

function duplicateTextPairs(rows) {
  const seen = new Map();
  const duplicates = [];
  for (const row of rows) {
    const key = normalizeText(row.story_text);
    if (seen.has(key)) duplicates.push([seen.get(key), row.id]);
    else seen.set(key, row.id);
  }
  return duplicates;
}

function existingBookOrder() {
  const webPath = path.join(ROOT, "web", "stories.js");
  if (!fs.existsSync(webPath)) return [];
  const raw = fs.readFileSync(webPath, "utf8");
  try {
    return JSON.parse(raw.replace(/^window\.STORY_DATA = /u, "").replace(/;\s*$/u, "")).books.map(
      (book) => book.slug
    );
  } catch {
    return [];
  }
}

function compareBookFiles(a, b) {
  const order = existingBookOrder();
  if (!order.includes(SLUG)) order.push(SLUG);
  const slugA = path.basename(path.dirname(a));
  const slugB = path.basename(path.dirname(b));
  const orderA = order.indexOf(slugA);
  const orderB = order.indexOf(slugB);
  if (orderA !== -1 || orderB !== -1) {
    if (orderA === -1) return 1;
    if (orderB === -1) return -1;
    return orderA - orderB;
  }
  return slugA.localeCompare(slugB);
}

function normalizeAggregateRow(row, fallbackSlug) {
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || fallbackSlug,
    title: row.title,
    source_ids: row.source_ids,
    source_file: row.source_file,
    source_lines:
      row.source_lines ||
      [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count,
    story_text: row.story_text
  };
}

function writeAggregate() {
  const csvFiles = fs
    .readdirSync(path.join(ROOT, "data", "books"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(ROOT, "data", "books", entry.name, `${ROUND}.csv`))
    .filter((filePath) => fs.existsSync(filePath))
    .sort(compareBookFiles);
  const rows = csvFiles.flatMap((filePath) => {
    const bookSlug = path.basename(path.dirname(filePath));
    return parseCsv(fs.readFileSync(filePath, "utf8")).map((row) =>
      normalizeAggregateRow(row, bookSlug)
    );
  });
  const seenIds = new Set();
  const duplicateIds = rows.filter((row) => {
    if (seenIds.has(row.id)) return true;
    seenIds.add(row.id);
    return false;
  });
  if (duplicateIds.length) {
    throw new Error(`Duplicate story ids: ${duplicateIds.map((row) => row.id).join(", ")}`);
  }
  writeCsv(path.join(ROOT, "data", "all_stories.csv"), rows);
  writeTxt(path.join(ROOT, "data", "all_stories.txt"), rows);
  const books = Array.from(
    rows
      .reduce((map, row) => {
        const current = map.get(row.book_slug) || { book: row.book, slug: row.book_slug, count: 0 };
        current.count += 1;
        map.set(row.book_slug, current);
        return map;
      }, new Map())
      .values()
  );
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
  if (/故事|笑话|有趣|传说|据说|有一次|使我想起/u.test(paragraph)) score += 6;
  if (/问|答|说|大怒|不料|结果|后来/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”‘’]/gu) || []).length >= 4) score += 2;
  if (/被|杀|阉|割|抓|判|妓|营妓|嫖|复仇|皇帝|太监|国民党/u.test(paragraph)) {
    score += 2;
  }
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphs(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.includes(marker));
      const quoteHeavy = (paragraph.match(/[“”‘’]/gu) || []).length >= 6;
      const actionHeavy = /被|杀|阉|割|抓|判|妓|营妓|嫖|复仇|大怒|不料|结果|后来/u.test(
        paragraph
      );
      if (!found.length && !quoteHeavy && !actionHeavy) return;
      const score = candidateScore(paragraph, found);
      if (score < 5 && !quoteHeavy) return;
      rows.push({
        file: fileName,
        paragraph: index + 1,
        score,
        markers: found.join("|"),
        text: paragraph.replace(/\s+/gu, " ").slice(0, 900)
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
  return Math.max(0, fs.readFileSync(candidatePath, "utf8").trim().split(/\r?\n/u).length - 1);
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const proofreadDropLines = Array.from(proofreadDrops, ([title, reason]) => `- ${title}：${reason}`);
  const lines = [
    "# 中国性研究故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮入选：${manifest.originalExtractionCount} 条`,
    `- 校对轮拆分：${manifest.proofreadSplitCount} 处`,
    `- 校对轮删除：${manifest.proofreadDropCount} 条`,
    `- 校对轮入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《中国性研究》包含大量性文字训诂、古书材料、政治讽刺、军中乐园资料与社会政策论证。校对轮继续压缩，只收李敖明确讲成小故事、笑话或古书轶事的段落，要求有可复述的场景、行动、对话、反转或后果，并用于说明假道学、官迷、训诂误读、司法荒唐、制度荒谬或旧文化惯性；删去偏制度证据、历史材料、社会现象举例和只有一句话笑料的条目。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 校对轮删除",
    "",
    ...proofreadDropLines,
    "",
    "## 校对轮拆分与截短",
    "",
    ...proofreadSplits.map((item) => `- ${item}`),
    "- 陆小芬、苏人误喊黄八车、咸水妹验看医生三条截短到故事本体，删去前后论证铺垫或评论尾巴。",
    "",
    "## 提取与校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，得到 ${manifest.candidateCount} 条候选。`,
    `- 提取轮入选 ${manifest.originalExtractionCount} 条；校对轮拆分 ${manifest.proofreadSplitCount} 处，删除 ${manifest.proofreadDropCount} 条，保留 ${validation.count} 条。`,
    "- 故事正文未改写，均按源文原句截取；跨段条目保留原文换行。",
    "- 校对轮重点复查了军中乐园材料、营妓制度材料、现代社会事件与李敖自述边界。",
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
    selectionCount: selections.length,
    originalExtractionCount: ORIGINAL_EXTRACTION_COUNT,
    proofreadDropCount: proofreadDrops.size,
    proofreadSplitCount: proofreadSplits.length,
    proofreadDrops: Array.from(proofreadDrops, ([title, reason]) => ({ title, reason })),
    proofreadSplits,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "校对轮只收李敖讲成可独立复述、带场景、行动、对话、反转或明确后果，并用来说明假道学、官迷、训诂误读、司法荒唐、制度荒谬或旧文化惯性的小故事、笑话和古书轶事；排除纯性描写、医学/训诂/制度材料、李敖自身事件、未成年人/雏妓材料、新闻血案、政策统计、偏制度证据或社会现象举例的事件材料，以及前书已有同一概念故事。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `提取轮入选 ${ORIGINAL_EXTRACTION_COUNT} 条；校对轮拆分 ${proofreadSplits.length} 处，删除 ${proofreadDrops.size} 条，保留 ${rows.length} 条。`,
      "故事正文未改写，均按源文原句截取。",
      "已主动排除总表已有的尹俊嘉奖哨兵、蒋经国问保险套、张纲埋轮、孙悟空不受弼马温、状元不如鸡巴、英国大学出身的食人蛮人、老兵数钱买老婆等同一概念故事。",
      "校对轮删除偏制度证据、历史材料、社会现象举例和只有一句话笑料的条目。",
      "陆小芬、苏人误喊黄八车、咸水妹验看医生三条已截短到故事本体；原支那通合并条拆成两则笑话。"
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
  if (!validation.ok) throw new Error(`Validation failed: ${JSON.stringify(validation)}`);
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
        sourceFileCount: sourceFiles().length,
        candidateCount: candidateCount(),
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
