const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "中国近代史新论";
const SLUG = "zhongguo_jindaishi_xinlun";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "ZGJDSXL";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "009.历史文化类",
  "007.中国近代史新论"
);

const selections = [
  {
    prefix: "001",
    paragraphs: [77, 78, 79, 80],
    title: "李之藻病中受洗后出妾"
  },
  {
    prefix: "001",
    paragraph: 83,
    title: "利玛窦赐葬敲碎佛像"
  },
  {
    prefix: "002",
    paragraphs: [60, 61, 62],
    title: "崇祯发现旧钢琴"
  },
  {
    prefix: "002",
    paragraphs: [66, 67],
    title: "顺治扶汤若望起身"
  },
  {
    prefix: "002",
    paragraphs: [75, 76],
    title: "杨光先搬进汤若望教堂"
  },
  {
    prefix: "002",
    paragraphs: [78, 79, 80],
    title: "杨光先不知推算讲尧舜"
  },
  {
    prefix: "003",
    paragraphs: [31, 32, 33, 34],
    title: "杨光先把耶稣当谋反贼"
  },
  {
    prefix: "003",
    paragraphs: [60, 61, 62, 63, 64, 65],
    title: "乾隆命蒋友仁造喷水机"
  },
  {
    prefix: "005",
    paragraphs: [9, 10, 11],
    title: "尼布楚谈判带八千人"
  },
  {
    prefix: "005",
    paragraph: 12,
    title: "康熙借上帝约束俄国"
  },
  {
    prefix: "006",
    paragraphs: [53, 54, 55, 56],
    title: "界碑错刻以南属俄国"
  },
  {
    prefix: "007",
    paragraphs: [5, 6, 7],
    title: "福大人说火器没稀罕"
  },
  {
    prefix: "007",
    paragraphs: [8, 9],
    title: "老太监说伦敦钟中国造"
  },
  {
    prefix: "007",
    paragraphs: [21, 22, 23, 24, 25],
    title: "清军宽衣大袖被看穿"
  },
  {
    prefix: "008",
    paragraph: 3,
    title: "胡林翼见洋船吐血"
  },
  {
    prefix: "009",
    paragraph: 3,
    title: "溥仪祖母抱住小皇帝"
  },
  {
    prefix: "010",
    paragraphs: [6, 7],
    title: "史坚如炸德寿功败垂成"
  },
  {
    prefix: "010",
    paragraph: 8,
    title: "史坚如受刑不供同党"
  },
  {
    prefix: "010",
    paragraph: 11,
    title: "高剑父泼墨遮供词"
  },
  {
    prefix: "011",
    paragraphs: [4, 5, 6],
    title: "彭家珍炸良弼"
  },
  {
    prefix: "012",
    paragraphs: [12, 13],
    title: "武昌革命真史被禁切角"
  },
  {
    prefix: "013",
    paragraph: 7,
    title: "陈范答不在后逃走"
  },
  {
    prefix: "013",
    paragraphs: [12, 13, 14],
    title: "陈撷芬捐最后二百版"
  },
  {
    prefix: "015",
    paragraphs: [21, 22],
    title: "章太炎拍桌骂吴稚晖"
  },
  {
    prefix: "015",
    paragraph: 49,
    title: "邹容骂社员皆买办"
  },
  {
    prefix: "015",
    paragraph: 69,
    title: "章太炎自指我是也",
    start: "独章炳麟不肯去。",
    end: "越日，自行投到。"
  },
  {
    prefix: "015",
    paragraph: 70,
    title: "英译小丑成小贼"
  },
  {
    prefix: "015",
    paragraphs: [85, 86, 87],
    title: "俞明震吃面暗示吴稚晖"
  },
  {
    prefix: "015",
    paragraphs: [88, 89, 90, 91, 92],
    title: "吴稚晖铁栅探监"
  },
  {
    prefix: "015",
    paragraphs: [113, 114],
    title: "邹容被丢砖激将投案"
  },
  {
    prefix: "015",
    paragraphs: [119, 120],
    title: "章太炎抚邹容尸"
  },
  {
    prefix: "015",
    paragraph: 128,
    title: "章太炎撒钱拒写墓志铭"
  },
  {
    prefix: "015",
    paragraphs: [131, 132],
    title: "章太炎铜像预言反讽应验"
  },
  {
    prefix: "015",
    paragraphs: [148, 149, 150, 151, 152],
    title: "邹容剪姚文甫辫子"
  },
  {
    prefix: "016",
    paragraphs: [10, 11],
    title: "吉田石松五十一年洗冤"
  },
  {
    prefix: "016",
    paragraphs: [35, 36, 37],
    title: "许世英自称开释汪精卫"
  }
];

const proofreadDrops = new Map([
  [
    "乾隆命蒋友仁造喷水机",
    "主要是圆明园西洋楼工程史料和技术输入材料，虽然有命令与施工经过，但更像西化史事件，不像李敖借来说明道理的小故事。"
  ],
  [
    "界碑错刻以南属俄国",
    "主体是条约后立碑失误和疆界考证，情节人物不足，校对轮按条约史材料删除。"
  ],
  [
    "武昌革命真史被禁切角",
    "偏书籍出版史和史料评价，虽有禁书细节，但不是文中讲出来的独立小故事。"
  ],
  [
    "邹容骂社员皆买办",
    "主要用于铺陈邹容性格和《革命军》背景，情节过薄，校对轮不单列。"
  ],
  [
    "章太炎铜像预言反讽应验",
    "更像文章结尾的讽刺论断和历史对照，不是有完整人物动作的小故事。"
  ]
]);

const candidateMarkers = [
  "故事",
  "笑话",
  "传说",
  "有一次",
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
  "骂",
  "逃",
  "杀",
  "死",
  "炸",
  "刺",
  "投案",
  "入狱",
  "受刑",
  "吐血",
  "不供",
  "谈判",
  "上帝",
  "铜像",
  "告密",
  "供词",
  "冤",
  "革命"
];

const excludedByStandard = [
  "利玛窦送钟、利玛窦画像非回回：总表已有同概念故事，避免重复收录。",
  "利玛窦、徐光启、李之藻的西学贡献清单：属于西学史材料，不拆成故事。",
  "王丰肃等传教士受迫害名单：多为简表材料，缺少可独立复述的情节。",
  "《尼布楚条约》《恰克图条约》条款和失地计算：属于条约史论，不作为故事。",
  "史坚如、陈范、曹汝霖等人物的完整履历：只收其中有场景和转折的轶事。",
  "章太炎谢本师：总表已有同概念故事，本书不重复。",
  "胡适中西楼偶遇黄兴、黄兴家书：偏史料串连和纪念文字，本轮不收。",
  "《全盘西化的理由》长篇理论与火车单轮车比喻：主要是论述，不算人物故事。"
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
  return `${ID_PREFIX}_${selection.prefix}_${paragraphNumbers(selection).join("_")}`;
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
  if (/故事|笑话|传说|有一次|一天/u.test(paragraph)) score += 6;
  if (/问|答|说|曰|骂/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/被|杀|死|逃|入狱|投案|受刑|炸|刺|冤|吐血|不供/u.test(paragraph)) score += 2;
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphObjects(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.text.includes(marker));
      const quoteHeavy = (paragraph.text.match(/[“”]/gu) || []).length >= 6;
      const actionHeavy = /被|杀|死|逃|入狱|投案|受刑|炸|刺|冤|吐血|不供/u.test(paragraph.text);
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
    "# 中国近代史新论故事校对轮",
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
    "《中国近代史新论》多为近代史论、条约史、革命人物辨误和西学输入材料，本轮只收李敖在文中确实讲成小故事的段落：要有可复述的人物、场景、动作、对话、反转或后果，并承担说明自大、顽固、误读、背叛、牺牲、冤屈或历史讽刺的功能。纯履历、条款、资料清单、长篇论述、李敖评论和总表已有同概念故事不收。",
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
    `- 提取轮保留 ${validation.count} 条；故事正文未改写，均按源文原段或段内原文截取。`,
    "- 利玛窦钟表与画像两条因总表已有同概念故事，本书只保留出妾、赐葬等未重复段落。",
    "- 对《苏报》案只保留若干最有现场感的小故事，未把整篇案情拆成事件链。",
    "- 校对轮进一步删除偏工程史、条约考证、书籍出版史、性格碎片和结尾论断的条目。",
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
      "只收李敖讲成可独立复述、带人物行动、对话、转折或明确后果，并用来说明自大、顽固、误读、背叛、牺牲、冤屈或历史讽刺的小故事；排除纯史论、条约条款、制度材料、人物履历、李敖评论、资料清单和总表已有同概念故事。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `提取轮初选 ${selections.length} 条；校对轮删除 ${proofreadDrops.size} 条，保留 ${rows.length} 条。`,
      "故事正文未改写，均按源文原段或段内原文截取。",
      "同概念去重后跳过利玛窦送钟、利玛窦画像非回回、章太炎谢本师等故事。"
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
