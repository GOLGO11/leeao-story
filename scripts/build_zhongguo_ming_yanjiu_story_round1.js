const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "中国命研究";
const SLUG = "zhongguo_ming_yanjiu";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "ZGMYJ";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;

const selections = [
  {
    prefix: "004",
    paragraphs: [2, 3],
    title: "狐偃献白璧提醒重耳"
  },
  {
    prefix: "005",
    paragraphs: [11, 12, 13, 14, 15],
    title: "颛顼命重黎绝地天通"
  },
  {
    prefix: "006",
    paragraphs: [106],
    title: "郑镒靠泰山丈人升官"
  },
  {
    prefix: "006",
    paragraphs: [135, 136, 137, 138, 139],
    title: "孙悟空强销死籍"
  },
  {
    prefix: "006",
    paragraphs: [151],
    title: "蔡支误入泰山府复妻"
  },
  {
    prefix: "008",
    paragraphs: [8],
    title: "孔融儿女覆巢就刑"
  },
  {
    prefix: "009",
    paragraphs: [11, 12],
    title: "东海孝妇被婆婆自尽牵连"
  },
  {
    prefix: "009",
    paragraphs: [15, 16],
    title: "上虞寡妇被小姑诬死"
  },
  {
    prefix: "010",
    paragraphs: [5],
    title: "黄蜂与蛇同归于尽"
  },
  {
    prefix: "014",
    paragraphs: [14, 15, 16],
    title: "陈后主亡国投井"
  },
  {
    prefix: "014",
    paragraphs: [17, 18],
    title: "萧摩诃探望囚主"
  },
  {
    prefix: "016",
    paragraphs: [22],
    title: "慈禧为太监逼罚守门人"
  },
  {
    prefix: "020",
    paragraphs: [2, 3, 4],
    title: "邵伯温祖母梦见死女"
  },
  {
    prefix: "021",
    paragraphs: [5],
    title: "合肥老妈子说全家死"
  },
  {
    prefix: "025",
    paragraphs: [16],
    title: "嫦娥偷吃不死药"
  },
  {
    prefix: "025",
    paragraphs: [35],
    title: "庄子临死论厚葬"
  },
  {
    prefix: "026",
    paragraphs: [15],
    title: "杨秀清争喊万岁"
  },
  {
    prefix: "026",
    paragraphs: [16],
    title: "万安只会喊万岁"
  },
  {
    prefix: "026",
    paragraphs: [21],
    title: "梁君出猎得善言"
  },
  {
    prefix: "027",
    paragraphs: [3, 4],
    title: "石秀骂梁中书奴才"
  },
  {
    prefix: "027",
    paragraphs: [10],
    title: "田崧骂杨难敌被杀"
  },
  {
    prefix: "027",
    paragraphs: [25],
    title: "乔照称臣被乾隆申饬"
  },
  {
    prefix: "028",
    paragraphs: [2, 3, 4, 5, 6],
    title: "赵高假官逼李斯自白"
  },
  {
    prefix: "029",
    paragraphs: [7, 8, 9],
    title: "狄仁杰招反保命"
  },
  {
    prefix: "029",
    paragraphs: [11, 12, 13, 14],
    title: "李逵招做妖人李二"
  },
  {
    prefix: "030",
    paragraphs: [6, 7],
    title: "假奏本换两条人命"
  },
  {
    prefix: "030",
    paragraphs: [8],
    title: "郭老四四次杀人仍免死"
  },
  {
    prefix: "030",
    paragraphs: [9],
    title: "姓李囚犯出狱又想回监"
  },
  {
    prefix: "030",
    paragraphs: [19, 20],
    title: "方苞临死仍读礼经"
  },
  {
    prefix: "030",
    paragraphs: [25],
    title: "龚梦熊替刑部狱开窗"
  },
  {
    prefix: "030",
    paragraphs: [33],
    title: "马公逸姿护方苞"
  },
  {
    prefix: "030",
    paragraphs: [35],
    title: "张丙厚当众护方苞"
  },
  {
    prefix: "030",
    paragraphs: [36],
    title: "杨三炯买通狱吏护方苞"
  },
  {
    prefix: "031",
    paragraphs: [5, 6],
    title: "富民买佃户顶罪"
  },
  {
    prefix: "031",
    paragraphs: [7, 8, 9],
    title: "福建少年宰白鸭"
  },
  {
    prefix: "039",
    paragraphs: [3, 4],
    title: "魔王怖菩萨"
  },
  {
    prefix: "040",
    paragraphs: [9, 10, 11, 12],
    title: "郭坚给病敌送钱"
  },
  {
    prefix: "041",
    paragraphs: [3, 4, 5],
    title: "刘邦白登贿阏氏"
  },
  {
    prefix: "041",
    paragraphs: [8, 9, 10],
    title: "向栩读孝经退黄巾"
  },
  {
    prefix: "041",
    paragraphs: [11, 12, 13],
    title: "官兵用妓女退王伦兵"
  },
  {
    prefix: "041",
    paragraphs: [14, 15, 16, 17, 18],
    title: "义和团发疏破洋楼"
  },
  {
    prefix: "042",
    paragraphs: [7, 8, 9, 10, 11],
    title: "乾隆出版史可法敌书"
  },
  {
    prefix: "045",
    paragraphs: [21],
    title: "通天犀冻死蛮人哭"
  }
];

const proofreadDrops = new Map([
  [
    "颛顼命重黎绝地天通",
    "主体是神人秩序和巫史制度说明，虽有传说骨架，但校对轮按故事性收紧后不单列。"
  ],
  [
    "乔照称臣被乾隆申饬",
    "多为清代称臣称奴才制度辨析，乔照只是制度案例，故事场景和转折不足。"
  ],
  [
    "方苞临死仍读礼经",
    "人物节操小传加后续仕途材料，情节较薄，校对轮不作为独立故事。"
  ],
  [
    "马公逸姿护方苞",
    "长段主要是方苞受难材料链和人物义行证据，较像传记材料；方苞组保留更有现场感的张丙厚、杨三炯、龚梦熊。"
  ],
  [
    "义和团发疏破洋楼",
    "主体是告白文本和退敌方法归纳，缺少可复述人物情节，校对轮删除。"
  ],
  [
    "乾隆出版史可法敌书",
    "段落以御批、史料链和统治者度量论证为主，过长且偏历史材料，不单列为小故事。"
  ]
]);

const candidateMarkers = [
  "故事",
  "笑话",
  "传说",
  "有一次",
  "有一天",
  "一天",
  "忽然",
  "不料",
  "结果",
  "后来",
  "最后",
  "问",
  "答",
  "说",
  "曰",
  "大惊",
  "垂泪",
  "哭",
  "杀",
  "死",
  "逃",
  "入狱",
  "下狱",
  "处死",
  "打",
  "骂",
  "骗",
  "冤",
  "梦",
  "被",
  "顶罪",
  "自白",
  "刑求",
  "招",
  "皇帝",
  "太守",
  "县",
  "敌人",
  "泰山",
  "万岁",
  "奴才",
  "狱",
  "退敌"
];

const excludedByStandard = [
  "只收李敖文中讲成可独立复述、带人物行动、对话、反转或明确后果，并用来说明命、死生、鬼神、忠奸、司法、权力、敌友伦理或文化习惯的小故事。",
  "李敖自己的经历、家人经历、诉讼材料、新闻辩驳和现代政治事件链不以李敖为主角收录；如李鼎彝讲演、李世杰牢中对话、吕德刑求案、李翰祥电影事件等。",
  "纯思想论述、古书材料清单、词义考证、书目考据、制度说明和人物小传不收；只有其中被讲成故事的段落才截取。",
  "总表已有同一概念故事不重复收录，如孔融一家争死、董仲舒被学生误评入罪、马克吐温双胞胎淹死、徐甲离老子成枯骨、子濯孺子遇庾公之斯、武则天惜骆宾王骂文等。",
  "《中国命研究》中大量崇祯、慈禧、方苞、清代司法材料经二次筛选，只保留有完整场景和故事转折者，删去单纯史论或制度证据。"
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
    .find((name) => name.startsWith("006.") && name.includes(BOOK));
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

function splitParagraphsWithLines(source) {
  const blocks = [];
  const lines = source.split("\n");
  let current = [];
  let startLine = 1;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim()) {
      if (!current.length) startLine = index + 1;
      current.push(line);
    } else if (current.length) {
      blocks.push({
        paragraph: blocks.length + 1,
        startLine,
        endLine: index,
        text: current.join("\n").trim()
      });
      current = [];
    }
  }
  if (current.length) {
    blocks.push({
      paragraph: blocks.length + 1,
      startLine,
      endLine: lines.length,
      text: current.join("\n").trim()
    });
  }
  return blocks;
}

function splitParagraphs(source) {
  return splitParagraphsWithLines(source).map((block) => block.text);
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!fileName) throw new Error(`Cannot find source file for prefix ${prefix}`);
  return fileName;
}

function selectText(source, selection) {
  const blocks = splitParagraphsWithLines(source);
  const selected = selection.paragraphs.map((paragraphNumber) => {
    const block = blocks.find((item) => item.paragraph === paragraphNumber);
    if (!block) throw new Error(`Paragraph ${paragraphNumber} not found: ${selection.title}`);
    return block;
  });
  return {
    text: selected.map((block) => block.text).join("\n\n"),
    lineRange: `${selected[0].startLine}-${selected[selected.length - 1].endLine}`
  };
}

function storyId(index) {
  return `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`;
}

function sourceId(selection) {
  return `${ID_PREFIX}_${selection.prefix}_${selection.paragraphs.join("_")}`;
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
  if (/故事|笑话|传说|有一次|有一天|退敌/u.test(paragraph)) score += 6;
  if (/问|答|说|曰|谓|云/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/被|杀|死|逃|入狱|下狱|处死|顶罪|自白|刑求|招|骂/u.test(paragraph)) {
    score += 2;
  }
  if (/泰山|万岁|奴才|狱|白鸭|菩萨|敌人|阏氏/u.test(paragraph)) score += 2;
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphs(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.includes(marker));
      const quoteHeavy = (paragraph.match(/[“”]/gu) || []).length >= 6;
      const actionHeavy = /被|杀|死|逃|入狱|下狱|处死|顶罪|自白|刑求|招|骂/u.test(paragraph);
      if (!found.length && !quoteHeavy && !actionHeavy) return;
      const score = candidateScore(paragraph, found);
      if (score < 7 && !quoteHeavy) return;
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
    "# 中国命研究故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮初选：${manifest.selectionCount} 条`,
    `- 校对轮删除：${manifest.proofreadDropCount} 条`,
    `- 校对轮入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《中国命研究》横跨命、天、死生、皇权称谓、司法、自白、敌友伦理和退敌迷信，材料很容易滑成历史事件合集。本轮按“确实讲成故事”的口径筛选：必须有可复述的人物、场景、动作、对话、反转或后果，并且在文中承担说明道理的功能；纯考证、制度材料、人物履历、李敖自身事件和总表已有同概念故事不收。",
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
    "## 提取说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，得到 ${manifest.candidateCount} 条候选。`,
    `- 提取轮初选 ${manifest.selectionCount} 条；校对轮删除 ${manifest.proofreadDropCount} 条，保留 ${validation.count} 条。`,
    "- 校对轮重点删掉偏观念阐释、制度说明、告白文本、御批史料链和人物小传边界的条目。",
    "- 这本保留了《狱中杂记》《宰白鸭》《退敌学》中的多个故事，因为它们不是单纯史料，而是李敖用来说明司法荒诞、权力习惯、迷信退敌等道理的可复述段落。",
    "- 主动排除了马克吐温双胞胎、董仲舒被学生误评、徐甲成枯骨、庾公之斯、武则天惜骆宾王等总表已有同概念故事。",
    "",
    "## 校对轮删除",
    "",
    ...proofreadDropLines,
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
    proofreadDropCount: proofreadDrops.size,
    proofreadDrops: Array.from(proofreadDrops, ([title, reason]) => ({ title, reason })),
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "校对轮只收李敖讲成可独立复述、带人物行动、对话、反转或明确后果，并用来说明命、死生、鬼神、忠奸、司法、权力、敌友伦理或文化习惯的小故事；排除纯思想论述、词义考证、书目材料、制度说明、人物小传、李敖自身事件和前书已有同概念故事。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `提取轮初选 ${selections.length} 条；校对轮删除 ${proofreadDrops.size} 条，保留 ${rows.length} 条。`,
      "故事正文未改写，均按源文原段落截取。",
      "校对轮删去偏观念阐释、制度说明、告白文本、御批史料链和人物小传边界的条目。",
      "已主动排除总表已有的孔融一家争死、董仲舒被学生误评、马克吐温双胞胎、徐甲成枯骨、庾公之斯、武则天惜骆宾王等同概念故事。",
      "李敖自身经历、家人经历、诉讼材料、新闻辩驳和现代政治事件链不收。"
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
