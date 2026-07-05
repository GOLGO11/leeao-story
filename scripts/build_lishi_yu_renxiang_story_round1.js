const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "历史与人像";
const SLUG = "lishi_yu_renxiang";
const ROUND = "story_round1";
const ID_PREFIX = "LSYRX";
const STATUS = "校对轮";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;

const selections = [
  {
    prefix: "002",
    paragraph: 6,
    title: "余玠殴死茶翁后逃走",
    start: "有“太保”性格。",
    end: "《宋史·余玠传》：“脱身走襄淮。”"
  },
  {
    prefix: "002",
    paragraph: "26-29",
    title: "冉氏兄弟默画钓鱼山城",
    start: "播州冉氏兄弟琎、璞有文武才",
    end: "屯兵聚粮，为必守计。”"
  },
  {
    prefix: "002",
    paragraph: 37,
    title: "贾似道发余玠冢取玉带",
    start: "《宋史》（四七四）贾似道传",
    end: "专制帝王的兔死狗烹，真是手脚利落呢！"
  },
  {
    prefix: "004",
    paragraph: "4-5",
    title: "吴稚晖说十碰九不开",
    start: "陈伯庄有一次跟吴稚晖谈到一件不如意的挫折",
    end: "马尔萨斯的人口论才真可怕呢①！"
  },
  {
    prefix: "004",
    paragraph: "31-32",
    title: "司机太太之死促桑格献身节育",
    start: "1912年的夏天里，桑格夫人为一个二十八岁的妈妈助产",
    end: "为了解救一切苦难人儿的命运。"
  },
  {
    prefix: "004",
    paragraph: "24-29",
    title: "邮政局让少女专栏开天窗",
    start: "《每个少女该知道些什么》一问世就有了麻烦",
    end: "可是她还是设法印成了小册子。"
  },
  {
    prefix: "004",
    paragraph: "36-42",
    title: "桑格秘密印书后流亡",
    start: "回到纽约，她租了一间小房",
    end: "不是奇迹吗？"
  },
  {
    prefix: "004",
    paragraph: "56-62",
    title: "女警卧底抓捕节育指导所",
    start: "桑格夫人手持传单",
    end: "却正是荷兰认为生育指导所是“公众福利”的时候。"
  },
  {
    prefix: "004",
    paragraph: "63-69",
    title: "桑格拒绝服从不尊重的法律",
    start: "群众生气了！",
    end: "医生们指导避孕，再也不必担心坐牢了！"
  },
  {
    prefix: "004",
    paragraph: 71,
    title: "桑格同志接力演讲让警察抓不胜抓",
    start: "桑格夫人又到了欧洲",
    end: "真不是外人所能想像的。"
  },
  {
    prefix: "004",
    paragraph: 79,
    title: "日本先禁桑格上岸后请她演说",
    start: "1922年，国际性的生育节制大会在伦敦召开",
    end: "甚至在1948年公开在法律上允许堕胎！"
  },
  {
    prefix: "004",
    paragraph: "80-82",
    title: "胡适主持桑格北大演讲后学生次日印书",
    start: "离开了日本，桑格夫人来到中国",
    end: "这是节育运动在中国燃烧起来的第一个火花！"
  },
  {
    prefix: "005",
    paragraph: 89,
    title: "九江木板上的奸杀私刑",
    start: "九江日前江水急流中",
    end: "众谓“此必奸杀案”。"
  },
  {
    prefix: "005",
    paragraph: 90,
    title: "武公业鞭死非烟",
    start: "另一种私刑是军人的虐杀。",
    end: "“鞭楚流血死”！"
  },
  {
    prefix: "007",
    paragraph: 13,
    title: "胡七王五劝谭嗣同出走",
    start: "1930年10月，中华书局出版了一本陶菊隐著的《新语林》",
    end: "胡七却是始终不露面的。”"
  },
  {
    prefix: "009",
    paragraph: "21-23",
    title: "辛殿撰三百青蚨买时文换爵",
    start: "元人王恽在《玉堂嘉话》里引《辛殿撰小传》",
    end: "甚至贵为皇帝都用它来开玩笑了。"
  },
  {
    prefix: "010",
    paragraph: 56,
    title: "张美强娶民女宋太祖折钱了事",
    start: "司马光《涑水记闻》卷一：“张美为沧州节度使",
    end: "善遇此女。……’”(34)"
  },
  {
    prefix: "010",
    paragraph: 64,
    title: "妻妾互拔郎官胡须",
    start: "彭乘《墨客挥犀》：“有一郎官",
    end: "不逾月颐颔遂空。”(40)"
  },
  {
    prefix: "010",
    paragraph: 72,
    title: "文氏女临嫁化为男子",
    start: "洪迈《夷坚丙志》卷第一《文氏女》",
    end: "案验得实，乃已。”"
  },
  {
    prefix: "010",
    paragraph: 87,
    title: "王安石奏逐学生遗孀",
    start: "魏泰《东轩笔录》：“有工部员外侯叔献者",
    end: "侯工部死后休妻。’”(78)"
  },
  {
    prefix: "010",
    paragraph: "89-91",
    title: "陆游沈园遇唐氏题钗头凤",
    start: "周密《齐东野语》卷一《放翁钟情前室》：“陆务观初娶唐氏，闳之女也",
    end: "锦书难托——莫！莫！莫"
  },
  {
    prefix: "010",
    paragraph: 139,
    title: "马大夫妻沉婢子又灌热粥",
    start: "郭彖《睽车志》卷三：“盐商马大夫中行",
    end: "竟以血癖而殂。”"
  },
  {
    prefix: "010",
    paragraph: 139,
    title: "常氏趁丈夫出门箠杀马妾",
    start: "洪迈《夷坚乙志》卷第十五《马妾冤》：“蜀妇人常氏者，先嫁潭州益阳楚椿卿，与嬖妾马氏以妒宠相嫉",
    end: "乘楚生出，箠杀之。”"
  },
  {
    prefix: "010",
    paragraph: 148,
    title: "杨道人随异人弃妻子",
    start: "郭彖《睽车志》卷四：“成都杨道人",
    end: "一子数岁以予人。”"
  },
  {
    prefix: "010",
    paragraph: 148,
    title: "秦少游修真遣朝华",
    start: "张邦基《墨庄漫录》卷三：“秦少游侍儿朝华",
    end: "遣朝华随去。”(97)"
  },
  {
    prefix: "010",
    paragraph: 160,
    title: "周渭被虏二十七年妻守不嫁",
    start: "司马光《涑水记闻》卷一：“周渭",
    end: "妻固不嫁，育二子皆长。……”"
  },
  {
    prefix: "010",
    paragraph: 164,
    title: "王开府用孩子识破老妇诬媳",
    start: "刘敞《公是集》卷五十一《行状·王开府行状》",
    end: "媪伏诬状。”(114)"
  },
  {
    prefix: "010",
    paragraph: 186,
    title: "宋太祖强嫁王审琦之子",
    start: "邵伯温《河南邵氏闻见前录》卷第一",
    end: "帝谓承衍曰：‘汝父可以安矣！’"
  },
  {
    prefix: "010",
    paragraph: 186,
    title: "刘后被逐藏张耆家后复召",
    start: "又司马光《涑水记闻》卷五",
    end: "未几，太宗宴驾，太子即帝位，复召入宫。”"
  },
  {
    prefix: "010",
    paragraph: 188,
    title: "王荆公生前嫁妇",
    start: "王辟之《渑水燕谈录》卷十《谈谑》：“王荆公之子滂",
    end: "王太祝生前嫁妇……。’”"
  },
  {
    prefix: "010",
    paragraph: 228,
    title: "王八郎妻告官分产护女",
    start: "唐州比阳富人王八郎",
    end: "自是不复相闻。"
  }
];

const proofreadDrops = new Map([
  [
    "桑格秘密印书后流亡",
    "这一条是节育运动传记进程与书信材料的长段串联，故事性弱于相邻的开天窗、卧底抓捕、法庭拒服从等独立场景。"
  ],
  [
    "桑格同志接力演讲让警察抓不胜抓",
    "只有运动策略概述，缺少具体人物场景和情节转折，校对轮删除。"
  ],
  [
    "日本先禁桑格上岸后请她演说",
    "主要是日本对桑格前后态度变化的历史对比，偏传播史材料，不作为小故事保留。"
  ],
  [
    "胡适主持桑格北大演讲后学生次日印书",
    "虽有场面和结果，但整体是访问史和节育运动传播记录，校对轮按事件材料删除。"
  ],
  [
    "武公业鞭死非烟",
    "只是私刑段落中的一句压缩例证，缺少可独立复述的故事展开。"
  ],
  [
    "王安石奏逐学生遗孀",
    "只是悍妻/休妻材料中的简短风闻和谚语，缺少完整故事动作与收束。"
  ],
  [
    "马大夫妻沉婢子又灌热粥",
    "仅为一句残酷事实例证，人物和转折都太薄，校对轮删除。"
  ],
  [
    "常氏趁丈夫出门箠杀马妾",
    "仅为一句妒杀材料，偏案例名目，不作为小故事保留。"
  ]
]);

const candidateMarkers = [
  "故事",
  "笑话",
  "寓言",
  "掌故",
  "传说",
  "有一次",
  "有一回",
  "有一天",
  "有一个",
  "曾经",
  "问曰",
  "问道",
  "答曰",
  "曰",
  "说",
  "告诉",
  "回答",
  "开玩笑",
  "结果",
  "后来",
  "余玠",
  "冉氏",
  "钓鱼",
  "桑格",
  "康斯托克",
  "女警察",
  "胡适",
  "吴稚晖",
  "谭嗣同",
  "王五",
  "胡七",
  "陆游",
  "唐氏",
  "王荆公",
  "王安石",
  "王八郎",
  "宋太祖",
  "刘后",
  "张美",
  "奸杀",
  "私刑"
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
    .find((name) => name.startsWith("001.") && name.includes(BOOK));
  if (!bookDir) throw new Error("Cannot find source book directory");
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
  if (/故事|笑话|寓言|掌故|传说/u.test(paragraph)) score += 6;
  if (/问|说|答|曰|谓|告诉|云/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/桑格|余玠|冉氏|谭嗣同|王五|胡七|王荆公|陆游|王八郎|宋太祖/u.test(paragraph)) {
    score += 3;
  }
  if (/被捕|逃走|抓|杀|逐|嫁|改嫁|诉|梦|死|开玩笑/u.test(paragraph)) score += 2;
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphs(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.includes(marker));
      const quoteHeavy = (paragraph.match(/[“”]/gu) || []).length >= 6;
      const actionHeavy = /被捕|逃走|抓|杀|逐|嫁|改嫁|诉|梦|死|开玩笑/u.test(paragraph);
      if (!found.length && !quoteHeavy && !actionHeavy) return;
      rows.push({
        file: fileName,
        paragraph: index + 1,
        score: candidateScore(paragraph, found),
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
    "# 历史与人像故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮入选：${selections.length} 条`,
    `- 校对轮删除：${proofreadDrops.size} 条`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书多为历史人物、文化考证、法律制度和书评文章。校对轮只收李敖在论证中讲成可独立复述、带有行动、对话、反转或后果，并能说明人物性格、制度荒谬或观念判断的小故事、掌故、传记轶事和法律案例；删除传记进程、运动传播史、私刑材料清单、一句式例证、纯制度说明、李敖自己的写作/论战事件和非李敖叙述的附录材料。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 校对轮删除",
    "",
    ...proofreadDropLines,
    "",
    "## 本轮排除重点",
    "",
    "- 《袁世凯的祀孔》主要是年表、公文和政治评论，未收。",
    "- 《杜威的教育思想及其他》《行李考》《李易安再嫁了吗？》多为生平概述、词源考证或辩诬推理，未收为故事。",
    "- 《宋帝始生异象考》是帝王出生异象的资料排比和表格归纳，未拆成故事条目。",
    "- 《对〈徐树铮先生文集年谱合刊〉的批评》以书评和史料方法批评为主；刘凤翰附录虽有陆建章案细节，但不是李敖讲出的故事，本轮不收。",
    "- 《夫妻同体主义下的宋代婚姻的无效撤销解消及其效力与手续》只收成形案例；法条、纯注释、制度说明和一句式材料不收。",
    "",
    "## 提取与校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，按故事、笑话、传说、曰/问/答、被捕/逃走/杀/逐/嫁等动作词和人物名横扫，得到 ${manifest.candidateCount} 条候选。`,
    `- 提取轮入选 ${selections.length} 条；校对轮删除 ${proofreadDrops.size} 条，保留 ${validation.count} 条。`,
    "- 校对轮压掉桑格夫人部分中过于传记进程/运动传播史的条目，只保留开天窗、助产触发、女警卧底、法庭拒服从等能独立成场景的故事。",
    "- 宋代婚姻长文保留有问答、误会、判案、反转或后果的案例；删除只有一句材料性质的杀妾、逐妇例证。",
    "- 故事正文未改写，均按源文原句截取；跨段条目保留原文换行。",
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
      "校对轮只收李敖在历史文化论证中讲成可独立复述、带行动、对话、反转或后果，且用于说明人物性格、制度荒谬或观念判断的小故事、掌故、传记轶事和法律案例；排除年表、公文、法条、资料排比、异象表、纯考证、传记进程、运动传播史、一句式材料、书评方法批评、李敖自身事件和非李敖叙述的附录。",
    excludedByStandard: [
      "袁世凯祀孔公文链、杜威生平概述、行李词源考证、李清照辩诬推理不收。",
      "宋帝出生异象表属于资料排比，不拆收。",
      "徐树铮书评和刘凤翰附录不作为李敖讲出的故事收入。",
      "宋代婚姻长文中只收案例故事，不收法条、制度解释和一句式例证。",
      "桑格夫人部分只保留可独立成场景的故事，删除传记进程和运动传播史材料。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `提取轮保留 ${selections.length} 条；校对轮删除 ${proofreadDrops.size} 条，保留 ${rows.length} 条。`,
      "校对轮删除桑格传记进程、运动传播史、一句式私刑/婚姻例证和过薄风闻。",
      "故事正文未改写，均按源文原句截取。",
      "保留项已尽量截取故事本体，减少制度论证和材料链。"
    ],
    proofreadNotes: [
      "余玠、冉氏兄弟、吴稚晖、桑格助产/开天窗/卧底抓捕/法庭拒服从、九江私刑、胡七王五、科场笑话和宋代婚姻中有完整情境的案例继续保留。",
      "桑格秘密印书流亡、接力演讲、日本前倨后恭、胡适北大演讲后学生印书，校对轮按运动进程/传播史材料删除。",
      "武公业鞭死非烟、王安石奏逐学生遗孀、马大夫妻虐婢、常氏杀马妾，因只有一句式例证或风闻，校对轮删除。"
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
