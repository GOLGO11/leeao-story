const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖大哥大";
const SLUG = "li_ao_dageda";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "LADG";
const ORIGINAL_EXTRACTION_COUNT = 53;
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;

const editionRoot = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
if (!editionRoot) throw new Error("Missing 大李敖全集6.0 source directory");
const categoryDir = fs
  .readdirSync(path.join(ROOT, editionRoot))
  .find((name) => name.startsWith("010."));
if (!categoryDir) throw new Error("Missing 010.节目演讲类 source directory");
const bookDir = fs
  .readdirSync(path.join(ROOT, editionRoot, categoryDir))
  .find((name) => name.startsWith("006."));
if (!bookDir) throw new Error("Missing 006.李敖大哥大 source directory");
const SOURCE_ROOT = path.join(ROOT, editionRoot, categoryDir, bookDir);
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "002",
    paragraph: 17,
    title: "斯德哥尔摩症候群",
    start: "斯德哥尔摩是瑞典的首都",
    end: "跟他一起打家劫舍了。"
  },
  {
    prefix: "002",
    paragraph: 39,
    title: "按摩床停电又来电",
    start: "大家知道有个笑话吗？",
    end: "不该按摩时候按摩。"
  },
  {
    prefix: "003",
    paragraph: 15,
    title: "拳击场上打点滴",
    start: "大家看这漫画很有趣。",
    end: "事实上你要遵守。"
  },
  {
    prefix: "003",
    paragraph: 17,
    title: "换老婆也有规则",
    start: "请看过去playboy杂志的一幅漫画。",
    end: "叫行规。"
  },
  {
    prefix: "003",
    paragraph: 24,
    title: "闯红灯只看警察",
    start: "过去台北市警察局长颜世锡讲过一个故事",
    end: "交通就乱掉了。"
  },
  {
    prefix: "003",
    paragraph: 24,
    title: "胡适夜里等红灯",
    start: "记得过去胡适博士讲过一个故事",
    end: "他知道有红灯我就要停下来。"
  },
  {
    prefix: "003",
    paragraph: 31,
    title: "撒切尔先安慰女侍",
    start: "我讲个撒切尔夫人的故事给你们听。",
    end: "所以她安慰这个女孩子。"
  },
  {
    prefix: "007",
    paragraph: 14,
    title: "小女孩丢十块钱",
    start: "我走到马路上碰到一个小女孩",
    end: "这就是整个的故事。"
  },
  {
    prefix: "007",
    paragraph: 43,
    title: "胡适说应尊敬娶受害女子的男人",
    start: "我记得有一个故事",
    end: "这是我们男人应该做的事情。"
  },
  {
    prefix: "008",
    paragraph: 31,
    title: "德国军人分四种",
    start: "我先讲一个故事",
    end: "这个是德国参谋本部的一个笑话。"
  },
  {
    prefix: "009",
    paragraph: 15,
    title: "婚后太太叫小狗拿拖鞋",
    start: "先讲一个小故事",
    end: "跟出了门叫，是不一样的。"
  },
  {
    prefix: "010",
    paragraph: 9,
    title: "苏东坡恨生得太晚",
    start: "我跟魏峥讲",
    end: "因为我生得太晚，所以来不及了。"
  },
  {
    prefix: "010",
    paragraph: 32,
    title: "竹竿进城被劈两半",
    start: "大家就记不记得那个笑话",
    end: "证明你比他还笨。"
  },
  {
    prefix: "014",
    paragraph: 8,
    title: "国代想选蒋介石做皇帝",
    start: "马武先生跟我讲了一个笑话",
    end: "你就在台湾永远做皇帝好不好？"
  },
  {
    prefix: "014",
    paragraph: 25,
    title: "丹尼少年坟中呼唤",
    start: "DANNY BOY整个的故事就是",
    end: "到外面去当兵去作战了。"
  },
  {
    prefix: "014",
    paragraph: 32,
    title: "虞美人先死给项羽看",
    start: "大家知道项羽临死的时候",
    end: "你不要牵挂我，我先死给你看。"
  },
  {
    prefix: "014",
    paragraph: 33,
    title: "静子夫人先死给广田看",
    start: "同样的故事，我们再看日本人。",
    end: "就这样死了。"
  },
  {
    prefix: "024",
    paragraph: 7,
    title: "卡罗素唱歌证明身份",
    start: "可当年的歌王卡罗素",
    end: "这就是歌王卡罗素。"
  },
  {
    prefix: "024",
    paragraph: 8,
    title: "卡罗素被认成鲁滨逊",
    start: "不过卡罗素也碰到一件糗事",
    end: "那卡罗素弄得哭笑不得。"
  },
  {
    prefix: "025",
    paragraph: 39,
    title: "吕后用老丑回匈奴情书",
    start: "大庭广众收到情书",
    end: "双方又好了，不打架了。"
  },
  {
    prefix: "028",
    paragraph: 34,
    title: "婆婆要龙子害胎死腹中",
    start: "陈福民是台湾妇产科的方面的名医。",
    end: "其他的小孩子就这样子做了“愚者自信”的婆婆的牺牲品。"
  },
  {
    prefix: "034",
    paragraph: 52,
    title: "费宫人三四刀刺虎",
    start: "清朝的袁枚就袁子才",
    end: "再看到是死掉了。"
  },
  {
    prefix: "035",
    paragraph: 6,
    title: "鲍勃霍普拿电话簿找共产党",
    start: "美国有一个很有名的演喜剧的明星叫做鲍勃·霍普",
    end: "就可以确定有多少共产党。"
  },
  {
    prefix: "037",
    paragraph: 11,
    title: "喻伯凯墙角写司法黑暗",
    start: "我告诉大家一个故事",
    end: "法官也被打官腔。"
  },
  {
    prefix: "037",
    paragraph: 14,
    title: "四个情夫吊唁各看一面",
    start: "我给大家先讲个故事、讲个笑话",
    end: "因为他的职业和身份决定了他的角度。"
  },
  {
    prefix: "039",
    paragraph: 16,
    title: "高斯立刻算出连加",
    start: "我记得有个故事讲数学家高斯的故事",
    end: "可是搞历史的不行的。"
  },
  {
    prefix: "043",
    paragraph: 35,
    title: "太太学认车后撞凯迪拉克",
    start: "我讲个笑话给你听",
    end: "跟男人的思考方法是不一样。"
  },
  {
    prefix: "047",
    paragraph: 27,
    title: "太太下辈子直接嫁博士",
    start: "就好像一个笑话一样",
    end: "我直接嫁给博士好了，更干脆！"
  },
  {
    prefix: "048",
    paragraph: 24,
    title: "守寡老太太摸铜钱",
    start: "我曾经讲过，清朝一个有名的故事",
    end: "寡，有的人能守，有的人不能守。"
  },
  {
    prefix: "054",
    paragraph: 8,
    title: "马英九梦里只吻一下",
    start: "我曾经有一个笑话挖苦马英九",
    end: "你脱光我干嘛？"
  },
  {
    prefix: "055",
    paragraph: 7,
    title: "蔡元培问挨打学生该不该打",
    start: "有一次我父亲在图书馆里面看书",
    end: "两个人都离开了。"
  },
  {
    prefix: "055",
    paragraph: 21,
    title: "王僧虔说皇帝和大臣各第一",
    start: "我讲个故事就在这里",
    end: "这皇帝听了就笑起来了。"
  },
  {
    prefix: "057",
    paragraph: 10,
    title: "丘吉尔羡慕美国国会脱党容易",
    start: "我讲个故事给大家听。",
    end: "在英国比较难。"
  },
  {
    prefix: "063",
    paragraph: 24,
    title: "七金人教授不捡金砖",
    start: "我先告诉大家一个有趣的故事",
    end: "我是大的贼，我不要小钱，搞几块回去我不要。"
  },
  {
    prefix: "068",
    paragraph: 10,
    title: "参议员醒来先反对",
    start: "不是有一个笑话说美国参议院开会的时候",
    end: "第一个反应是我反对。"
  },
  {
    prefix: "069",
    paragraph: 22,
    title: "哈台说自己卖牙签",
    start: "有一对有名的电影明星演喜剧片",
    end: "所以小规模的木材商。"
  },
  {
    prefix: "074",
    paragraph: 26,
    title: "《亚玛》妓女说自己是精神处女",
    start: "《亚玛》是什么故事呢？",
    end: "我就是处女。"
  },
  {
    prefix: "075",
    paragraph: 6,
    title: "幼稚园学生问老师也小便吗",
    start: "幼稚园的老师有一次",
    end: "原来老师也会小便。"
  },
  {
    prefix: "080",
    paragraph: 24,
    title: "孙悟空只好连狗一起打",
    start: "孙悟空大闹天宫以后",
    end: "你躲不掉的。"
  },
  {
    prefix: "081",
    paragraph: 6,
    title: "女明星拿昨天的处女证明",
    start: "我先讲一个笑话",
    end: "它有它一个时限的。"
  },
  {
    prefix: "082",
    paragraph: 6,
    title: "刘国轩用裸舞破和尚气功",
    start: "有一本书叫做《今世说》",
    end: "《今世说》这本书里面所记载的一个故事。"
  },
  {
    prefix: "082",
    paragraph: 13,
    title: "塞翁失马祸福相依",
    start: "我先讲个故事给大家听",
    end: "怎么知道不是好事呢？"
  },
  {
    prefix: "088",
    paragraph: 13,
    title: "丁慰慈被打到说出五十万",
    start: "过去有一个新疆王叫做盛世才",
    end: "这是最恐怖的一个手段！"
  },
  {
    prefix: "089",
    paragraph: 11,
    title: "跪求朋友别在好纸上写字",
    start: "过去有一个笑话",
    end: "给你写糟蹋了。"
  },
  {
    prefix: "090",
    paragraph: 20,
    title: "梁实秋说不该加入",
    start: "过去梁实秋先生跟我讲过个故事",
    end: "她的责任就是你为什么跟他扯在一起？"
  },
  {
    prefix: "093",
    paragraph: 14,
    title: "《灰色马》通缉犯明知母死仍回去",
    start: "这个格里高利派克",
    end: "就变成问号，就结束了这整个的故事。"
  },
  {
    prefix: "093",
    paragraph: 18,
    title: "《美丽人生》父亲把集中营说成游戏",
    start: "我谈到得到奥斯卡金像奖的《美丽人生》",
    end: "这小孩子还活着，就这么一个故事。"
  },
  {
    prefix: "100",
    paragraph: 11,
    title: "拳击手把自己打出局",
    start: "这张照片是一个拳击选手躺在拳击台外",
    end: "就是把自己打出了局。"
  },
  {
    prefix: "106",
    paragraph: 18,
    title: "鹦鹉救火",
    start: "大家想到我们过去古代一个寓言",
    end: "我们有一种鹦鹉救火的精神来处理这个问题。"
  },
  {
    prefix: "117",
    paragraph: 23,
    title: "谢冰莹送最后一次牢饭",
    start: "大家看过一个以前女作家谢冰莹的一本《女兵十年》吗？",
    end: "就离开他了。"
  },
  {
    prefix: "124",
    paragraph: 26,
    title: "李斯被假特使骗到不敢翻供",
    start: "你有没有看过《史记》这部书？",
    end: "杀掉了，就这样。"
  }
];

const proofreadDrops = [
  {
    title: "给叫花子一百元的多重动机",
    source: "014.李登辉卸任竟需要22人服侍？.txt:21-21",
    reason: "偏假设式自我举例，重点在分析动机，不是独立讲出的故事。"
  },
  {
    title: "孔子赞成曾点的志愿",
    source: "068.宋楚瑜应该进入立法院.txt:15-15",
    reason: "主要服务于解释“与”字用法，故事性弱，按语文材料删除。"
  }
];

const proofreadTrims = [
  "斯德哥尔摩症候群",
  "按摩床停电又来电",
  "胡适夜里等红灯",
  "《亚玛》妓女说自己是精神处女"
];

const excludedByStandard = [
  "张学良、二二八、国安局、郑南榕、李登辉、陈水扁等连续政治事件材料，只有资料铺陈或案情复盘的，不列为故事。",
  "李敖自己的坐牢、官司、家庭、军旅、节目纠纷和交游经历，除非段内转述的是独立故事，否则排除。",
  "来宾、来电者或主持搭档主讲的故事，不作为李敖讲出的故事。",
  "单句格言、翻译辨析、政策比喻、照片说明和文件展示，缺少人物行动或问答反转的排除。",
  "同一书内重复出现的小女孩十块钱、卖牙签希特勒、连狗一起打等故事，只取较完整的一处。"
];

const candidateMarkers = [
  "故事",
  "笑话",
  "寓言",
  "典故",
  "成语",
  "漫画",
  "小说",
  "电影",
  "有一次",
  "有一天",
  "忽然",
  "结果",
  "最后",
  "问",
  "回答",
  "说"
];

const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖导航站",
  "油管/抖音"
];

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((name) => /^\d{3}\..*\.txt$/u.test(name))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));
}

function stripFooter(text) {
  const lines = text.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n").split("\n");
  const footerIndex = lines.findIndex((line) =>
    footerPatterns.some((pattern) => line.includes(pattern))
  );
  return (footerIndex >= 0 ? lines.slice(0, footerIndex) : lines).join("\n").trim();
}

function readSource(fileName) {
  return stripFooter(
    decoder.decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName))).replace(/^\uFEFF/u, "")
  );
}

function splitParagraphObjects(text) {
  const lines = text.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n").split("\n");
  const paragraphs = [];
  let buffer = [];
  let startLine = 0;

  const flush = (endLine) => {
    const paragraph = buffer
      .map((line) => line.trim())
      .join(" ")
      .replace(/\s+/gu, " ")
      .trim();
    if (paragraph) paragraphs.push({ text: paragraph, startLine, endLine });
    buffer = [];
    startLine = 0;
  };

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    if (!line.trim()) {
      if (buffer.length) flush(lineNo - 1);
      return;
    }
    if (!buffer.length) startLine = lineNo;
    buffer.push(line);
  });
  if (buffer.length) flush(lines.length);
  return paragraphs;
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!fileName) throw new Error(`Missing source file for prefix ${prefix}`);
  return fileName;
}

function paragraphForSelection(selection) {
  const fileName = fileForPrefix(selection.prefix);
  const paragraphs = splitParagraphObjects(readSource(fileName));
  const index = Number(selection.paragraph) - 1;
  const paragraph = paragraphs[index];
  if (!paragraph) throw new Error(`Missing paragraph ${selection.paragraph} in ${fileName}`);
  return {
    fileName,
    sourceId: `${selection.prefix}#P${selection.paragraph}`,
    sourceLines: `${paragraph.startLine}-${paragraph.endLine}`,
    text: paragraph.text
  };
}

function selectedText(selection, paragraphText) {
  let text = paragraphText;
  if (selection.start) {
    const startIndex = text.indexOf(selection.start);
    if (startIndex < 0) throw new Error(`Start marker not found for ${selection.title}`);
    text = text.slice(startIndex);
  }
  if (selection.end) {
    const endIndex = text.indexOf(selection.end);
    if (endIndex < 0) throw new Error(`End marker not found for ${selection.title}`);
    text = text.slice(0, endIndex + selection.end.length);
  }
  return text.trim();
}

function charCount(text) {
  return Array.from(text).length;
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/gu, "");
}

function buildRows() {
  return selections.map((selection, index) => {
    const paragraph = paragraphForSelection(selection);
    const storyText = selectedText(selection, paragraph.text);
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: paragraph.sourceId,
      source_file: paragraph.fileName,
      source_lines: paragraph.sourceLines,
      char_count: charCount(storyText),
      story_text: storyText
    };
  });
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (/[",\r\n]/u.test(stringValue)) return `"${stringValue.replace(/"/gu, '""')}"`;
  return stringValue;
}

function writeCsv(filePath, rows) {
  const columns = [
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
  const lines = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const body = rows
    .map((row) =>
      [
        `【${row.id}】${row.title}`,
        `书名：${row.book}`,
        `来源：${row.source_file}:${row.source_lines}`,
        `字数：${row.char_count}`,
        "",
        row.story_text,
        "---"
      ].join("\n")
    )
    .join("\n\n");
  fs.writeFileSync(filePath, `${body}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
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
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...records] = rows.filter((item) => item.length > 1 || item[0]);
  if (!header) return [];
  const columns = header.map((column) => column.replace(/^\uFEFF/u, ""));
  return records.map((record) =>
    Object.fromEntries(columns.map((column, index) => [column, record[index] ?? ""]))
  );
}

function readRowsFromCsv(filePath) {
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function normalizeAggregateRow(row, bookSlug) {
  const storyText = row.story_text || row.text || "";
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || bookSlug || "",
    title: row.title,
    source_ids: row.source_ids || row.source_id || "",
    source_file: row.source_file,
    source_lines:
      row.source_lines || [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count || charCount(storyText),
    story_text: storyText
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
  for (const row of readRowsFromCsv(aggregatePath)) {
    const slug = row.book_slug;
    if (slug && !order.includes(slug)) order.push(slug);
  }
  return order;
}

function buildAggregateRows() {
  const booksDir = path.join(ROOT, "data", "books");
  const bookSlugs = fs
    .readdirSync(booksDir)
    .filter((name) => fs.statSync(path.join(booksDir, name)).isDirectory());
  const order = existingBookOrder();
  const sortedSlugs = [
    ...order.filter((slug) => bookSlugs.includes(slug)),
    ...bookSlugs
      .filter((slug) => !order.includes(slug))
      .sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }))
  ];

  return sortedSlugs.flatMap((slug) => {
    const csvPath = path.join(booksDir, slug, `${ROUND}.csv`);
    if (!fs.existsSync(csvPath)) return [];
    return readRowsFromCsv(csvPath).map((row) => normalizeAggregateRow(row, slug));
  });
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

function validateStoryInSource(source, storyText) {
  const segments = storyText.split(/\n\s*\n/u).filter(Boolean);
  if (segments.length > 1) {
    return segments.every((segment) => source.includes(normalizeText(segment)));
  }
  return source.includes(normalizeText(storyText));
}

function validateSourceMatches(rows) {
  const cache = new Map();
  return rows
    .filter((row) => {
      if (!cache.has(row.source_file)) {
        cache.set(row.source_file, normalizeText(readSource(row.source_file)));
      }
      return !validateStoryInSource(cache.get(row.source_file), row.story_text);
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
  if (/故事|笑话|轶事|趣闻|典故|寓言|成语/u.test(paragraph)) score += 6;
  if (/问|答|说|讲/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/哭|笑|杀|逃|打|骗|偷|抓|跪|求|死|梦|醒|嫁|娶|抢|跑|问|答|撞/u.test(paragraph)) {
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
      if (!found.length && !quoteHeavy) return;
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
  const lines = [
    "# 李敖大哥大故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮初选：${manifest.originalExtractionCount} 条`,
    `- 校对删除：${manifest.proofreadDropCount} 条`,
    `- 校对修边：${manifest.proofreadTrimCount} 条`,
    `- 校对保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖大哥大》是电视节目逐字稿，时政材料密度很高。本轮只收李敖在节目中讲成可独立复述、带人物行动或问答反转、并用来说明一个道理的小故事、笑话、典故、寓言、文学/电影故事；不把连续政治事件、证据材料、来宾自述、李敖自身经历和纯概念说明当作故事。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 校对删除",
    "",
    ...manifest.proofreadDrops.map((item) => `- ${item.title}：${item.source}。${item.reason}`),
    "",
    "## 校对修边",
    "",
    ...manifest.proofreadTrims.map((title) => `- ${title}`),
    "",
    "## 排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 提取说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 提取轮初选 ${manifest.originalExtractionCount} 条；校对轮删除 ${manifest.proofreadDropCount} 条、修边 ${manifest.proofreadTrimCount} 条，保留 ${validation.count} 条。`,
    "- 故事正文均来自源文原段或段内原文截取，没有改写。",
    "- 对长段只截故事本体和必要的原文收束语，尽量去掉后续时政发挥。",
    "- 同书重复故事只保留较完整、较适合独立阅读的一处。",
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
    originalExtractionCount: ORIGINAL_EXTRACTION_COUNT,
    selectionCount: selections.length,
    proofreadDropCount: proofreadDrops.length,
    proofreadDrops,
    proofreadTrimCount: proofreadTrims.length,
    proofreadTrims,
    proofreadAddCount: 0,
    proofreadAdds: [],
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖讲成可独立复述、带人物行动或问答反转、并用于说明道理的小故事、笑话、典故、寓言、掌故和文学/电影故事；排除李敖自身事件、纯时政连续叙述、资料展示、节目流程、来宾自述和无情节概念。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮初选 ${ORIGINAL_EXTRACTION_COUNT} 条；校对轮删除 ${proofreadDrops.length} 条，修边 ${proofreadTrims.length} 条，保留 ${rows.length} 条。`,
      "正文均按源文原段或段内原文截取。",
      "本册时政和历史材料特别多，本轮继续压掉事件型和概念说明型材料。"
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

  if (!validation.ok) {
    throw new Error(`Validation failed for ${BOOK}: ${JSON.stringify(validation)}`);
  }
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
