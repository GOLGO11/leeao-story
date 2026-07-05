const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "坐牢家爸爸给女儿的八十封信";
const SLUG = "zuolaojia_baba_gei_nuer_de_bashi_fengxin";
const ROUND = "story_round1";
const ID_PREFIX = "ZLJBB";
const STATUS = "校对轮";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;

const selections = [
  {
    prefix: "004",
    paragraph: 3,
    title: "巴米赛德酒席只用嘴上菜",
    start: "有一个故事说请人吃饭，主人光用嘴说一道一道的菜",
    end: "也正是“画饼充饥”的意思。"
  },
  {
    prefix: "008",
    paragraph: 3,
    title: "送砖头后躲进厕所",
    start: "但如果你真的送的是砖头",
    end: "再送给哥哥吧！哈哈！"
  },
  {
    prefix: "014",
    paragraph: 4,
    title: "贪人杀鹅取金蛋",
    start: "伊索寓言里有一个故事说",
    end: "这个故事写人又笨又贪心。"
  },
  {
    prefix: "016",
    paragraph: 3,
    title: "追阔小姐后改卖天鹅饼",
    start: "爸爸有一个朋友，在台北衡阳街口卖芝麻饼",
    end: "他后来把卖的饼改名“天鹅饼”。"
  },
  {
    prefix: "018",
    paragraph: 13,
    title: "南瓜灯杰克天地无门",
    start: "万圣节点灯笼，是因为爱尔兰传说",
    end: "等待最后审判。"
  },
  {
    prefix: "021",
    paragraph: 6,
    title: "王尔德报关只报天才",
    start: "19世纪英国有一个文学家叫王尔德",
    end: "I have nothing to declare except my genius．）"
  },
  {
    prefix: "022",
    paragraph: 3,
    title: "重影人只认别人看两块",
    start: "爸爸认识一个人，他的眼睛有毛病",
    end: "他说：“就有这么一点好处！”"
  },
  {
    prefix: "023",
    paragraph: "14-17",
    title: "老师批作文放狗屁",
    start: "一个笑话说老师给三个作文做不好的学生批作文",
    end: "是老是放屁的狗）"
  },
  {
    prefix: "025",
    paragraph: 13,
    title: "狮子被青蛙叫声骗",
    start: "《伊索寓言》说一个狮子听到青蛙叫",
    end: "才知道原来这么小"
  },
  {
    prefix: "027",
    paragraph: 18,
    title: "犹大亲吻出卖耶稣",
    start: "跟这个字很近的一个字叫Judas",
    end: "谁都怕这种kiss。"
  },
  {
    prefix: "030",
    paragraph: 3,
    title: "狗替主人报仇后年年哀呼",
    start: "他曾写过一部小说，叫《野性的呼声》",
    end: "狗在许多方面，都比人够意思。"
  },
  {
    prefix: "030",
    paragraph: "6-8",
    title: "牧羊小孩喊狼来了",
    start: "《伊索寓言》里有三十七个关于狼的故事",
    end: "人家也不信他。）"
  },
  {
    prefix: "030",
    paragraph: 9,
    title: "学生把狼当成色狼",
    start: "有一个笑话，老师问学生",
    end: "所以把整个意思给弄拧了。"
  },
  {
    prefix: "031",
    paragraph: "15-16",
    title: "少女一篮蛋发财梦碎",
    start: "有一个故事说，一个少女头上顶了一篮蛋",
    end: "别冒险把你所有的蛋放在一个篮子里。）"
  },
  {
    prefix: "032",
    paragraph: 4,
    title: "狙公朝三暮四哄猴子",
    start: "中国寓言里说一个养猴子的人叫“狙公”",
    end: "后来变成“朝三暮四”的成语。"
  },
  {
    prefix: "032",
    paragraph: 8,
    title: "孙悟空藏仙丹在腮里",
    start: "中国的名小说《西游记》",
    end: "并且骂太上老君小家子相。"
  },
  {
    prefix: "036",
    paragraph: 17,
    title: "国王花钱买千里马骨",
    start: "但在中国古代，有国王叫人去买千里马",
    end: "有时也不冤枉。"
  },
  {
    prefix: "042",
    paragraph: 34,
    title: "Nessus临死害死Hercules",
    start: "有一个有名的Centaur叫Nessus",
    end: "害死了Hercules。"
  },
  {
    prefix: "043",
    paragraph: 15,
    title: "林肯疼得笑不得哭不得",
    start: "林肯竞选参议员失败了",
    end: "小文你要把它背下来。"
  },
  {
    prefix: "043",
    paragraph: "22-26",
    title: "猴子骗猫火中取栗",
    start: "一个故事说猴子",
    end: "to do something unpleasant or dangerous."
  },
  {
    prefix: "045",
    paragraph: 6,
    title: "马可波罗牢中口述游记",
    start: "13到14世纪的时候，有一个人叫马可波罗",
    end: "竟演变出这么多的发现和故事。"
  },
  {
    prefix: "045",
    paragraph: 10,
    title: "赫斯替希特勒写书后坐长牢",
    start: "一、德国以前的元首希特勒",
    end: "每天四份报纸。"
  },
  {
    prefix: "045",
    paragraph: 11,
    title: "戴布兹坐牢参选得百万票",
    start: "二、另一个好玩的坐牢故事",
    end: "只好把他特赦出来。"
  },
  {
    prefix: "046",
    paragraph: 3,
    title: "狗贪水影丢了肉",
    start: "寓言里头狗偷了一块肉",
    end: "这是一个写又笨又贪心的故事。"
  },
  {
    prefix: "046",
    paragraph: 4,
    title: "李白醉后捞月淹死",
    start: "中国古代的大诗人李白",
    end: "叫“镜花水月总成空”。"
  },
  {
    prefix: "046",
    paragraph: 8,
    title: "汉武帝被骗看李夫人影子",
    start: "有一种“皮人影子戏”",
    end: "从此就出来一句“姗姗来迟”的成语。"
  },
  {
    prefix: "047",
    paragraph: "8-10",
    title: "富兰克林说不团结就上绞架",
    start: "当时签字后John Hancock警告大家",
    end: "都会被英国人吊死。"
  },
  {
    prefix: "049",
    paragraph: 3,
    title: "夏娃被蛇骗出伊甸园",
    start: "英国大诗人，17世纪的弥尔顿",
    end: "所以被赶出来。"
  },
  {
    prefix: "049",
    paragraph: 6,
    title: "渔夫误入桃花源后再找不到",
    start: "中国古代的大诗人陶渊明",
    end: "因此出来一句成语——“世外桃源”。"
  },
  {
    prefix: "052",
    paragraph: "19-20",
    title: "唱机规则别让爹爹修",
    start: "我们十一岁女儿的生日快到前",
    end: "别让爹爹去修。”"
  },
  {
    prefix: "053",
    paragraph: 8,
    title: "庄子斗鸡呆若木鸡",
    start: "“木鸡”本来是称赞",
    end: "世界是变的呀！）"
  },
  {
    prefix: "055",
    paragraph: 27,
    title: "吉田茂骂马鹿野郎丢首相",
    start: "请姥姥给你讲中文成语“指鹿为马”的故事。",
    end: "结果丢了首相宝座。"
  },
  {
    prefix: "056",
    paragraph: 3,
    title: "达芬奇画天使使老师改行",
    start: "五百年前，Italy",
    end: "青出于蓝而胜于蓝”（Green comes from blue but excels blue）。"
  },
  {
    prefix: "057",
    paragraph: 9,
    title: "盲人摸象各说各样",
    start: "现在谈“触觉”。触觉瞎子最灵",
    end: "如果时间够，瞎子一定可以摸出象的模样来。"
  },
  {
    prefix: "058",
    paragraph: 5,
    title: "圣彼得铁链自开越狱",
    start: "坐在画里Judas旁的白胡子老头叫彼得",
    end: "开个铁链上的锁自然不在话下。"
  },
  {
    prefix: "058",
    paragraph: 18,
    title: "尼克松留下小狗Checkers",
    start: "有人用middel name",
    end: "所以Nixon当选了。"
  },
  {
    prefix: "059",
    paragraph: 3,
    title: "斯巴达人说鹅也会单脚站",
    start: "古时候，有人有一种特技",
    end: "True, but every goose can.）"
  },
  {
    prefix: "059",
    paragraph: 10,
    title: "印度选民都投牛的票",
    start: "你记得去年2月16日爸爸给你谈牛的信上",
    end: "结果大家都投牛的票！（牛以外，monkeys and snakes也神圣。）"
  },
  {
    prefix: "059",
    paragraph: 21,
    title: "沙迦罕为妻建泰姬陵",
    start: "不过做印度人老婆，有一个人至少占了便宜",
    end: "它是全世界最漂亮的坟。"
  },
  {
    prefix: "064",
    paragraph: 14,
    title: "伽利略比萨斜塔试球",
    start: "第二个科学家——伽利略",
    end: "他被大学赶走了。"
  },
  {
    prefix: "066",
    paragraph: 3,
    title: "法国饭店拒绝嚼口香糖客",
    start: "一个笑话说美国人嚼口香糖去饭店",
    end: "安能品味！"
  },
  {
    prefix: "066",
    paragraph: 8,
    title: "克里蒙梭死也要站着死",
    start: "还有一个能活的，是法国在第一次世界大战时的总理克里蒙梭",
    end: "这个人有多历害，可想而知。"
  },
  {
    prefix: "066",
    paragraph: 11,
    title: "吃饼与何不食肉糜",
    start: "法国大革命的时候，皇帝和皇后",
    end: "断头台是一个医生发明的。"
  },
  {
    prefix: "066",
    paragraph: 14,
    title: "伏尔泰狡哲三窟",
    start: "伏尔泰写文章惹祸太多",
    end: "他真是狡哲三窟啊！"
  },
  {
    prefix: "070",
    paragraph: "13-14",
    title: "Oedipus猜破Sphinx谜",
    start: "金字塔前面的狮身人面像",
    end: "was made its king.）"
  },
  {
    prefix: "071",
    paragraph: 15,
    title: "Laocoon警告木马无人信",
    start: "在《木马屠城记》中",
    end: "Greeks都从肚子里跳出来了。"
  },
  {
    prefix: "071",
    paragraph: 30,
    title: "亚历山大快刀斩乱结",
    start: "Alexander the Great打到Turkey中部的时候",
    end: "快刀斩乱麻”（to find and use a quick, easy way out of a difficulty）。"
  },
  {
    prefix: "072",
    paragraph: 21,
    title: "汉尼拔带象越山攻罗马",
    start: "罗马对面有古国迦太基",
    end: "才在最后打败Hannibal。"
  }
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("008."));
  if (!categoryDir) throw new Error("Cannot find letters category directory");
  const bookDir = fs
    .readdirSync(path.join(ROOT, corpusDir, categoryDir))
    .find((name) => name.startsWith("010.") && name.includes(BOOK));
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

function fileForPrefix(prefix) {
  const fileName = fs
    .readdirSync(SOURCE_ROOT)
    .find((name) => name.startsWith(`${prefix}.`) && name.endsWith(".txt"));
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
  return selections.map((selection, index) => {
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

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^\d{3}\./u.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function candidateCount() {
  const candidatePath = path.join(ROOT, CANDIDATE_SCAN);
  if (!fs.existsSync(candidatePath)) return 0;
  return Math.max(0, fs.readFileSync(candidatePath, "utf8").trim().split(/\r?\n/u).length - 1);
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 坐牢家爸爸给女儿的八十封信故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书是李敖写给女儿的英文、成语、常识和世界文化书信，故事密度高。校对轮只收信中被李敖讲出来、能独立复述、且用于解释词语、成语、道理或知识点的寓言、笑话、掌故、神话和压缩轶事；不收李敖自己的坐牢、亲友、家务、赠礼、通信、教育安排等现实事件，不收纯词义、纯百科资料、故事名提示、英文出处说明、单句格言和没有情节的例句。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 亲爱的小文、生日礼物、姥姥体检、回台湾、父亲坐牢说明、爷爷丧礼、女儿学习与家庭通信等属于李敖自身/家庭现实事件，不作故事收录。",
    "- 猫狗谚、鳄鱼眼泪、猫头鹰、回文、十二生肖、月份节日、动物习性、植物介绍、地理历史说明等，若只是词义或百科解释而无可复述情节，不收。",
    "- Cat-and-mouse Act、袋鼠法庭、英国囚犯移送澳洲、苏伊士/巴拿马运河、坐牢名人名单等偏制度、材料或事件链，本轮只保留其中李敖明称或讲成小故事的片段。",
    "- 删除阿里巴巴喊芝麻开门、猎人坐象背笼打老虎、Erehwon牧人坐气球逃出、狗占马槽不吃也拦马、Jacob梦见登天梯：这些条目偏故事名提示、常识/例句、小说设定梗概、英文释义或英文出处说明，不是展开讲出的独立小故事。",
    "- 总表未发现本书入选条目的同文重复；校对轮已按故事性收紧。",
    "",
    "## 提取说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，通用候选 ${manifest.candidateCount} 条；另按篇名和“故事、笑话、寓言、传说、后来、结果、问他、他说”等关键词横扫低分段落。`,
    "- 提取轮原入选 53 条；校对轮删除 5 条，保留 48 条。",
    "- 桃花源、泰姬陵两条收短边界，只保留故事本体，去掉后续例证或百科说明。",
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
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "校对轮信件中被李敖讲出来、能独立复述、且用于解释词语、成语、道理或知识点的寓言、笑话、掌故、神话和压缩轶事；排除李敖自身/家庭现实事件、纯词义、纯百科资料、故事名提示、英文词义/出处说明、单句格言和没有情节的例句。",
    excludedByStandard: [
      "李敖自己的坐牢、亲友、家务、赠礼、通信、教育安排等现实事件不收。",
      "纯词义、纯百科资料、动物习性、地理历史背景、单句格言和没有情节的例句不收。",
      "制度材料和事件链只在被李敖压缩成可复述的小故事时入选。",
      "故事名提示、小说设定梗概、英文释义或英文出处说明不收。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      "提取轮保留 53 条，覆盖寓言、笑话、神话、圣经典故、文学故事梗概和词源轶事。",
      "亲友通信、家庭事件、纯词义/百科说明、无情节例句和制度材料链已按口径排除。",
      "校对轮继续按小故事标准收紧。",
      "故事正文未改写，均按源文原句截取。"
    ],
    proofreadNotes: [
      "校对轮删除 5 条：阿里巴巴喊芝麻开门、猎人坐象背笼打老虎、Erehwon牧人坐气球逃出、狗占马槽不吃也拦马、Jacob梦见登天梯。",
      "删除理由：故事名提示、常识/例句、小说设定梗概、英文释义或英文出处说明，不符合独立小故事口径。",
      "桃花源和泰姬陵两条收短边界，只保留故事本体。",
      "保留 48 条；其中坐牢故事、文学/神话/寓言、笑话和词源轶事均可独立复述。"
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
        sourceFileCount: manifest.sourceFileCount,
        candidateCount: manifest.candidateCount,
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
