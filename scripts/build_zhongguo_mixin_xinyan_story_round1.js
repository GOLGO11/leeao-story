const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "中国迷信新研";
const SLUG = "zhongguo_mixin_xinyan";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "ZGMXXY";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "009.历史文化类",
  "010.中国迷信新研"
);

const selections = [
  {
    prefix: "001",
    paragraph: 3,
    title: "西太后割肉烧掉密诏"
  },
  {
    prefix: "001",
    paragraphs: [648, 649],
    title: "十一岁准儿媳割臂进未来婆婆"
  },
  {
    prefix: "001",
    paragraphs: [651, 652, 653],
    title: "老祖父吃十一岁孙女肉"
  },
  {
    prefix: "001",
    paragraphs: [654, 655],
    title: "冯顺弟把臂肉夹锅巴给弟弟"
  },
  {
    prefix: "001",
    paragraph: 669,
    title: "医云人肉可愈逼文氏割股"
  },
  {
    prefix: "001",
    paragraph: 686,
    title: "江伯儿杀子还愿被太祖杖戍"
  },
  {
    prefix: "001",
    paragraph: 700,
    title: "相声里儿媳割人肉汤"
  },
  {
    prefix: "001",
    paragraph: 702,
    title: "刘氏割肉放进死姑棺中"
  },
  {
    prefix: "002",
    paragraph: 83,
    title: "吕斅孚七岁割股给母"
  },
  {
    prefix: "002",
    paragraph: 86,
    title: "张三爱剖腹割肝"
  },
  {
    prefix: "002",
    paragraph: 88,
    title: "彭有源割肝曝百日"
  },
  {
    prefix: "002",
    paragraph: 91,
    title: "蔡元培早年刲臂事母"
  },
  {
    prefix: "002",
    paragraph: 93,
    title: "蒋百里十四岁割臂救母"
  },
  {
    prefix: "003",
    paragraph: 6,
    title: "杨乌涂割肉补父疮"
  },
  {
    prefix: "003",
    paragraph: 12,
    title: "彭阿泉割肉奉父"
  },
  {
    prefix: "003",
    paragraph: 18,
    title: "陈道杰割臂煮汤给母"
  },
  {
    prefix: "004",
    paragraph: 29,
    title: "跳楼少女办成人鬼联姻"
  },
  {
    prefix: "005",
    paragraph: 3,
    title: "尔朱荣铸铜像选皇帝"
  },
  {
    prefix: "005",
    paragraph: 5,
    title: "尔朱荣自己金像铸不成"
  },
  {
    prefix: "005",
    paragraph: 8,
    title: "明元帝死后追封铸像不成的皇后"
  },
  {
    prefix: "006",
    paragraph: 4,
    title: "王莽背威斗厌胜叛兵"
  },
  {
    prefix: "007",
    paragraph: 3,
    title: "薛祥救下厌镇案千名工匠"
  },
  {
    prefix: "009",
    paragraph: 4,
    title: "汉武帝令巫诅董仲舒反死"
  },
  {
    prefix: "009",
    paragraph: 5,
    title: "刘胥一路女巫祝诅求帝位"
  },
  {
    prefix: "009",
    paragraph: 7,
    title: "陈叔坚机关偶人昼夜祝诅"
  },
  {
    prefix: "010",
    paragraph: 2,
    title: "元妃李氏纸木人魇魅"
  },
  {
    prefix: "011",
    paragraphs: [3, 4],
    title: "陈皇后请女巫楚服媚道"
  },
  {
    prefix: "011",
    paragraph: 5,
    segment: "banjieyu",
    title: "班倢伃答媚道诉之何益",
    start: "又记“鸿嘉三年",
    end: "赐黄金百斤”。"
  },
  {
    prefix: "011",
    paragraph: 6,
    segment: "yijun",
    title: "宜君断婴儿臂膝作媚道",
    start: "《史记·建元以来侯者年表》记史子回",
    end: "这是说，行媚道时，形式条件是用砍下初生婴儿的臂和膝。"
  },
  {
    prefix: "011",
    paragraph: 6,
    segment: "xiefu",
    title: "棣王琰鞋中符被囚鹰狗坊",
    start: "《旧唐书·玄宗诸子传》记唐玄宗的老四棣王琰",
    end: "这是说，行媚道时，形式条件是用符放在被作法者的鞋中……"
  },
  {
    prefix: "012",
    paragraph: 4,
    segment: "dugu",
    title: "独孤皇后为猫鬼巫蛊弟弟求命",
    start: "《隋书·后妃传》记文献独孤皇后",
    end: "陀于是减死一等”。"
  },
  {
    prefix: "013",
    paragraph: 5,
    title: "江充掘偶人逼反太子"
  },
  {
    prefix: "013",
    paragraph: 6,
    segment: "yangguang",
    title: "杨广埋偶人陷害杨秀",
    start: "而《隋书·文四子传》记隋文帝第二子杨广做皇太子时",
    end: "这种埋偶人的迷信故事，可算是最细腻的了。"
  },
  {
    prefix: "014",
    paragraph: 5,
    title: "巫师坛中问出生魂供词"
  },
  {
    prefix: "014",
    paragraph: 7,
    title: "马仙桥摄魂请人作画"
  },
  {
    prefix: "014",
    paragraph: 12,
    title: "县长照相以为魔术捉人"
  },
  {
    prefix: "015",
    paragraph: 3,
    title: "孔子遇桓魋还说其如予何"
  },
  {
    prefix: "015",
    paragraph: 4,
    title: "孔子困匡靠从者做臣脱身"
  },
  {
    prefix: "015",
    paragraph: 5,
    title: "王莽火中端坐说汉兵其如予何"
  },
  {
    prefix: "015",
    paragraph: 6,
    title: "王安石不洗脸说天生黑"
  },
  {
    prefix: "016",
    paragraph: 5,
    title: "陶侃牛眠地葬母发迹"
  },
  {
    prefix: "016",
    paragraph: 6,
    title: "太白先生掘牛山破黄巢风水"
  },
  {
    prefix: "016",
    paragraph: 8,
    title: "李恒拒挖文天祥祖坟"
  },
  {
    prefix: "017",
    paragraph: 3,
    title: "晋侯梦厉鬼病入膏肓"
  },
  {
    prefix: "017",
    paragraph: 5,
    title: "孙林父骂儿子连厉鬼不如"
  },
  {
    prefix: "017",
    paragraph: 7,
    title: "子产用黄熊梦劝晋祭鲧"
  },
  {
    prefix: "017",
    paragraph: 9,
    title: "伯有厉鬼吓得郑人乱跑"
  },
  {
    prefix: "018",
    paragraph: 3,
    segment: "luofu",
    title: "裸妇阵吓得官军大炮不燃",
    start: "另一个例子是在清朝光绪二十年",
    end: "可见阴部威力之大，有胜于大炮者。"
  },
  {
    prefix: "018",
    paragraph: 3,
    segment: "yinmenzhen",
    title: "义和团阴门阵御枪炮",
    start: "第三个例子是清朝光绪二十六年",
    end: "“阴门阵”应该是不负程朱理学的。"
  },
  {
    prefix: "019",
    paragraphs: [5, 6, 7, 8, 9],
    title: "吴延环两个月相面过关"
  }
];

const proofreadDrops = new Map([
  ["病人要肉儿媳割股代替", "原段是“病人要肉”类型说明加三条例证串，不是一个可独立复述的小故事。"]
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
  "梦",
  "鬼",
  "神",
  "魂",
  "魄",
  "咒",
  "诅",
  "厌胜",
  "厌镇",
  "偶人",
  "纸人",
  "割股",
  "刲股",
  "割肉",
  "割肝",
  "杀",
  "死",
  "哭",
  "病",
  "祷",
  "祈",
  "祖坟",
  "报应",
  "迷信",
  "妖",
  "蛊",
  "媚道",
  "下狱",
  "自杀",
  "皇帝",
  "太后",
  "相士",
  "照相"
];

const excludedByStandard = [
  "《中国女人割股考》的六百二十件大表、公式化病愈例、伤亡率例、多角割股例和赏罚制度材料，多为材料归类，不逐条拆成故事。",
  "割股条目只收李敖在表后专门拎出来讲、带具体人物动作、荒诞后果或讽刺功能的案例。",
  "《中国男人割股考》中的单行孝子资料、法规议论和纯评论不收；保留吕斅孚、张三爱、彭有源、蔡元培、蒋百里等完整小故事。",
  "《“韩信用兵”与“萧何转饷”》大部分是来信考证和李敖答信方法论，只收其中作为冥婚迷信例子的“人鬼联姻”。",
  "打小人、蛊毒刑制、媚道、祖坟、厉鬼等专题中的概念说明、制度说明、例证串和李敖自我评语不收，只收有场景、对话、行动和后果的故事段。",
  "校对轮删除“病人要肉儿媳割股代替”这类概念说明加例证串；段内并列多故事则拆成单独条目，避免标题和正文不对应。",
  "总表已有同概念故事不重复收录，例如前书已收的王伦兵被妓女退敌，本书仅收后面裸妇阵与阴门阵两例。"
];

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((fileName) => /^\d{3}\./u.test(fileName))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!fileName) throw new Error(`Missing source file for prefix ${prefix}`);
  return fileName;
}

function readSource(fileName) {
  return new TextDecoder("gb18030")
    .decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName)))
    .replace(/\r\n/g, "\n")
    .replace(/\s*李敖影音E书[\s\S]*$/u, "")
    .trim();
}

function splitParagraphObjects(text) {
  const lines = text.split("\n");
  const paragraphs = [];
  let current = [];
  let startLine = 0;
  const flush = (endLine) => {
    if (!current.length) return;
    paragraphs.push({
      text: current.join("\n").trim(),
      startLine,
      endLine
    });
    current = [];
    startLine = 0;
  };
  lines.forEach((line, index) => {
    if (!line.trim()) {
      flush(index);
      return;
    }
    if (!current.length) startLine = index + 1;
    current.push(line);
  });
  flush(lines.length);
  return paragraphs;
}

function paragraphNumbers(selection) {
  if (selection.paragraphs) return selection.paragraphs;
  if (selection.paragraph) return [selection.paragraph];
  throw new Error(`Selection ${selection.title} has no paragraph reference`);
}

function selectText(sourceText, selection) {
  const paragraphObjects = splitParagraphObjects(sourceText);
  const selected = paragraphNumbers(selection).map((number) => {
    const paragraph = paragraphObjects[number - 1];
    if (!paragraph) throw new Error(`Missing paragraph ${number} for ${selection.title}`);
    return paragraph;
  });
  let text = selected.map((paragraph) => paragraph.text).join("\n\n");
  if (selection.start || selection.end) {
    const startIndex = selection.start ? text.indexOf(selection.start) : 0;
    if (startIndex === -1) throw new Error(`Start marker not found for ${selection.title}`);
    const endIndex = selection.end ? text.indexOf(selection.end, startIndex) : text.length - 1;
    if (endIndex === -1) throw new Error(`End marker not found for ${selection.title}`);
    text = text.slice(startIndex, endIndex + (selection.end ? selection.end.length : 1)).trim();
  }
  return {
    text,
    lineRange: `${selected[0].startLine}-${selected[selected.length - 1].endLine}`
  };
}

function storyId(index) {
  return `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`;
}

function sourceId(selection) {
  const segment = selection.segment ? `_${selection.segment}` : "";
  return `${ID_PREFIX}_${selection.prefix}_${paragraphNumbers(selection).join("_")}${segment}`;
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
  if (/故事|笑话|传说|有一次|有一天|一天/u.test(paragraph)) score += 6;
  if (/梦|鬼|神|魂|魄|咒|诅|厌胜|厌镇|偶人|纸人|蛊|媚道|报应/u.test(paragraph)) {
    score += 3;
  }
  if (/问|答|说|曰|谓|云/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/割股|刲股|割肉|割肝|杀|死|哭|病|下狱|自杀|祷|祈/u.test(paragraph)) {
    score += 2;
  }
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphObjects(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.text.includes(marker));
      const quoteHeavy = (paragraph.text.match(/[“”]/gu) || []).length >= 6;
      const actionHeavy =
        /割股|刲股|割肉|割肝|杀|死|哭|病|下狱|自杀|祷|祈|梦|鬼|魂|魄|咒|诅|厌胜|厌镇|偶人|纸人|蛊|媚道/u.test(
          paragraph.text
        );
      if (!found.length && !quoteHeavy && !actionHeavy) return;
      const score = candidateScore(paragraph.text, found);
      if (score < 7 && !quoteHeavy) return;
      rows.push({
        file: fileName,
        paragraph: index + 1,
        score,
        markers: found.join("|"),
        text: paragraph.text.replace(/\s+/gu, " ").slice(0, 900)
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
    "# 中国迷信新研故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 校对轮删除：${manifest.proofreadDropCount} 条`,
    `- 校对轮保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《中国迷信新研》材料密度很高，尤其前三篇割股考很容易变成资料条目汇编。本轮只收李敖文中讲成可复述小故事的段落：要有具体人物、动作、对话、反转或荒诞后果，并用来说明迷信、愚孝、厌胜、媚道、勾魂、祖坟、厉鬼或士大夫下层信仰。表格材料、概念说明、制度材料、例证串和李敖自我评语不收。",
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
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，得到 ${manifest.candidateCount} 条候选。`,
    `- 校对轮保留 ${validation.count} 条；故事正文未改写，均按源文原段或段内原文截取。`,
    "- 割股部分只收被李敖拿来讲成故事的具体案例，不把大表、公式化病愈清单和伤亡率清单逐条拆开。",
    "- 迷信法术、厉鬼、祖坟、相面等部分只收有场景和后果的故事，纯概念解释不收。",
    "- 校对时删除一条例证串，收窄文氏割股、江伯儿杀子和吴延环相面三条，拆开媚道、偶人、阴部思想中的段内多故事，并补入祝诅与厉鬼思想中的漏收故事。",
    "",
    "## 校验",
    "",
    `- 单书重复正文：${JSON.stringify(validation.duplicateTextIds)}`,
    `- 单书正文回源失败：${JSON.stringify(validation.missingSourceTextIds)}`,
    `- 汇总重复正文：${JSON.stringify(aggregate.duplicateTextIds)}`
  ];
  if (proofreadDropLines.length) {
    lines.push("", "## 校对轮删除", "", ...proofreadDropLines);
  }
  fs.writeFileSync(NOTES_PATH, `${lines.join("\n")}\n`, "utf8");
}

function main() {
  if (!fs.existsSync(SOURCE_ROOT)) throw new Error(`Missing source root: ${SOURCE_ROOT}`);
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
      "只收李敖文中讲成可独立复述、带具体人物、动作、对话、反转或荒诞后果，并用来说明迷信、愚孝、厌胜、媚道、勾魂、祖坟、厉鬼或士大夫下层信仰的小故事；排除表格材料、概念说明、制度材料、例证串和李敖自我评语。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `校对轮保留 ${rows.length} 条，删除 ${proofreadDrops.size} 条不成故事的例证串。`,
      "故事正文未改写，均按源文原段或段内原文截取。",
      "校对轮收窄概念说明混入过多的条目，并把段内并列故事拆成独立条目。",
      "割股部分不把大表和公式化材料逐条拆开，只收被李敖讲成故事的案例。",
      "已避开前书已有的同概念故事，如王伦兵被妓女退敌。"
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
