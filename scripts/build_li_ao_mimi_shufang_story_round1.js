const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖秘密书房";
const SLUG = "li_ao_mimi_shufang";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "LAMS";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const SLUG_BY_BOOK = {
  "李敖自传与回忆": "li_ao_zizhuan_yu_huiyi"
};
const PREFERRED_ORDER_PREFIX = ["li_ao_zizhuan_yu_huiyi", "li_ao_zizhuan_yu_huiyi_xuji"];

const selections = [
  {
    prefix: "004",
    paragraph: 3,
    title: "马克·吐温说书架上的书都是借来的",
    start: "大家记不记得美国有名的文学家",
    end: "都是向别人借来的。"
  },
  {
    prefix: "005",
    paragraph: 4,
    title: "敦伦蒙难记排错成文字狱",
    start: "讲到伦敦蒙难，给大家讲个笑话",
    end: "这个人就被抓起来了。"
  },
  {
    prefix: "005",
    paragraph: 4,
    title: "孙中山被扣后哭闹求饶",
    start: "《伦敦蒙难记》就是讲他到了英国",
    end: "原来我们眼中的民族英雄孙中山就这个德行。"
  },
  {
    prefix: "006",
    paragraph: 6,
    title: "彼得·伊贝特森梦中相会",
    start: "他这本书的最主要一个故事",
    end: "大概的故事就这么一个结局。"
  },
  {
    prefix: "012",
    paragraph: 6,
    title: "林损说太监下面没有了",
    start: "当时北京大学一个教授叫做林损",
    end: "原因就是说他已经忙别的事情去了。"
  },
  {
    prefix: "015",
    paragraph: 5,
    title: "顾维钧政治系必修矿物学",
    start: "我曾经讲过一个故事",
    end: "这就是教育的考验目的之一，也是教育的方法之一。"
  },
  {
    prefix: "021",
    paragraph: 5,
    title: "林则徐说关岳束手",
    start: "我不讲过一个故事吗，在鸦片战争以后",
    end: "结果白费了力气。"
  },
  {
    prefix: "023",
    paragraph: 3,
    title: "魏建功不要盲从惹鲁迅",
    start: "我爸爸跟我讲过一个故事",
    end: "后来讲给我听。"
  },
  {
    prefix: "026",
    paragraph: 5,
    title: "邵尧夫算树只有几小时寿命",
    start: "最有趣的一个例子就是邵尧夫跟一个朋友登山",
    end: "一棵树有一颗命。"
  },
  {
    prefix: "026",
    paragraph: 6,
    title: "茶壶也有命",
    start: "我父亲告诉我一个故事",
    end: "一个茶壶也有它的命。"
  },
  {
    prefix: "027",
    paragraph: 3,
    title: "跑不过熊只要跑过朋友",
    start: "我记得小马哥讲个笑话很有趣",
    end: "所谓肝胆相照不过如此。"
  },
  {
    prefix: "028",
    paragraph: 5,
    title: "一封未寄的求婚信",
    start: "其中有一篇文章叫做《一封未寄的信》",
    end: "当他年老的时候，他有这个幻想，有这个感想。"
  },
  {
    prefix: "030",
    paragraph: 9,
    title: "哥伦比亚最宽的街",
    start: "胡适讲了一个笑话",
    end: "反正这条街最宽的。"
  },
  {
    prefix: "041",
    paragraph: 3,
    title: "混蛋也抗议被比作律师",
    start: "我的笑话是说，在一个酒吧间里面",
    end: "因为律师还不如混蛋。"
  },
  {
    prefix: "043",
    paragraph: 10,
    title: "陈兆基北京话被当北京人",
    start: "我的好朋友陈兆基",
    end: "他们还听不出来，这么一个有趣的故事。"
  },
  {
    prefix: "046",
    paragraph: 15,
    title: "戴高乐军校毕业低一级",
    start: "他在军校毕业的时候",
    end: "这就是当时一个有名的笑话。"
  },
  {
    prefix: "047",
    paragraph: 23,
    title: "两百种起司与多党",
    start: "不过戴高乐解释很有趣",
    end: "当然党很多。"
  },
  {
    prefix: "049",
    paragraph: 22,
    title: "戴高乐嫌刺客枪法差",
    start: "还有我讲过戴高乐一辈子被十几次的暗杀",
    end: "这么多人拿机关枪打我都打不到，我这大块头，打不到他。"
  },
  {
    prefix: "054",
    paragraph: 8,
    title: "陈水扁笑成了习惯",
    start: "后来一个笑话是说",
    end: "就是笑成瘾来了，笑成习惯了。"
  },
  {
    prefix: "058",
    paragraph: 61,
    title: "谢冰莹最后一次探监",
    start: "她最后去给她政治犯的丈夫探监",
    end: "事实上是最后一面了。"
  },
  {
    prefix: "062",
    paragraph: 107,
    title: "卖牙签的木材生意",
    start: "我记得过去有一个有趣的笑话",
    end: "In a small way。小规模的，卖牙签的。"
  },
  {
    prefix: "063",
    paragraph: 154,
    title: "寡妇怀念打鼾声",
    start: "我讲一个故事给你听，一个太太",
    end: "可是大家在自然法则底下它会和谐。"
  },
  {
    prefix: "064",
    paragraph: 48,
    title: "上海人台湾人香港人谁最坏",
    start: "这个有一个笑话讲出来",
    end: "香港人还是人吗？"
  },
  {
    prefix: "065",
    paragraph: 72,
    title: "徐志摩把渴了译成三十岁",
    start: "并且还闹出笑话来",
    end: "会闹出这种笑话。"
  },
  {
    prefix: "072",
    paragraph: 265,
    title: "马连良被校对改成马速良",
    start: "我讲一个笑话给你听",
    end: "马要跑得快才是好马嘛！"
  },
  {
    prefix: "073",
    paragraph: 111,
    title: "医生问晚上有没有困难",
    start: "我前几天看到一个笑话",
    end: "他说我太太帮我一起找。"
  },
  {
    prefix: "073",
    paragraph: 145,
    title: "英国绅士在印度找女人",
    start: "我想到一个笑话",
    end: "English gentleman like this very much。"
  },
  {
    prefix: "077",
    paragraph: 67,
    title: "部长不来我也可以不来",
    start: "李敖：我讲个笑话给你听",
    end: "国防部根本没把立法委员看在眼里。"
  },
  {
    prefix: "086",
    paragraph: 36,
    title: "刘家昌儿子下跪要玩具枪",
    start: "所以刘家昌就给我讲一个故事",
    end: "台湾整个发生问题了。"
  },
  {
    prefix: "086",
    paragraph: 34,
    title: "小女孩说七个兄弟姐妹",
    start: "我记得我也看过一首诗",
    end: "可是在童心上面可以看出来。"
  },
  {
    prefix: "087",
    paragraph: 47,
    title: "孙子在钓鱼处怀念爷爷",
    start: "我在《读者文摘》看了一篇文章很动人的",
    end: "我觉得这种纪念比他参加追悼会还好。"
  },
  {
    prefix: "088",
    paragraph: 11,
    title: "看到丈母娘就想离婚",
    start: "有一个笑话讲",
    end: "所以就有这个现象。"
  },
  {
    prefix: "088",
    paragraph: 28,
    title: "甜蜜的十一月",
    start: "引得我不得不讲这个故事",
    end: "这才真的懂得爱情，原因就是爱情一定要限时分开。"
  },
  {
    prefix: "092",
    paragraph: 128,
    title: "推销员顺手卖口哨",
    start: "我记得有一个笑话，讲推销员的",
    end: "这个你买不买？"
  },
  {
    prefix: "094",
    paragraph: 57,
    title: "猎人杀虎后众人分肉",
    start: "像过去一个猎人杀了一只老虎",
    end: "他的这个善跟恶就是一念之间。"
  },
  {
    prefix: "108",
    paragraph: 26,
    title: "按摩床停电后半夜启动",
    start: "一个笑话说，一个人到了旅馆里面去",
    end: "不该按摩的时候它按摩起来了。"
  },
  {
    prefix: "110",
    paragraph: 4,
    title: "霍姆斯大法官保留反对票",
    start: "我向李庆华主席举了一个故事",
    end: "有一个反对票是好的。"
  },
  {
    prefix: "111",
    paragraph: 6,
    title: "狐假虎威",
    start: "狐假虎威，狐假虎威是中国古书里面的一个故事",
    end: "事实上怕的是自己。"
  },
  {
    prefix: "111",
    paragraph: 14,
    title: "约翰逊说值得看不值得跑去看",
    start: "我觉得最好的故事，英国的约翰逊",
    end: "可是不值得跑去看。"
  },
  {
    prefix: "115",
    paragraph: 8,
    title: "鲁宾斯坦让孩子放弃钢琴梦",
    start: "这就是我过去喜欢讲的一个笑话",
    end: "不要再妄想做为一个钢琴家了”。"
  },
  {
    prefix: "116",
    paragraph: 9,
    title: "千斤闸下的留者",
    start: "大家看到《隋唐演义》的一个故事",
    end: "留在现场的人跟要逃掉的人有这两类。"
  },
  {
    prefix: "119",
    paragraph: 27,
    title: "猪省下吃饭时间以后干什么",
    start: "李敖：我想一个笑话就是说",
    end: "剩下的时间都干什么？"
  },
  {
    prefix: "119",
    paragraph: 39,
    title: "丘吉尔信后亲笔写一行",
    start: "我讲一个故事，就是第二次世界大战的时候",
    end: "表示我跟你特别亲切的关系。"
  },
  {
    prefix: "121",
    paragraph: 6,
    title: "罗斯福信任霍普金斯",
    start: "我记得有一个故事",
    end: "并且对我是最客观的一个协助者。"
  }
];

const ORIGINAL_EXTRACTION_COUNT = 45;
const proofreadDrops = [
  ["百灵鸟学猫叫就不值钱", "只是养鸟知识点，没有完整人物行动或反转。"],
  ["出了国以后大家都是小导演", "一句机锋，缺少故事情节。"],
  ["苹果给最美丽的女神", "只点到希腊神话片段，故事没有展开。"],
  ["陆游卧室全是书", "一句藏书状态说明，更像书房例子而非故事。"]
];
const proofreadAdds = [
  "小女孩说七个兄弟姐妹",
  "猎人杀虎后众人分肉",
  "约翰逊说值得看不值得跑去看"
];

const excludedByStandard = [
  "书房、藏书、版本、题跋、购书和书籍流转本身的材料，只在其中真正重讲故事时入选。",
  "李敖自己的查封、坐牢、选举、官司、家庭和交游经历，除非段内转述的是独立故事，否则排除。",
  "嘉宾长段自述、来电问答和主持人只顺势回应的故事，原则上不纳入本轮。",
  "纯历史事件、政治复盘、制度材料和文件展示，没有问答反转或完整故事动作的，排除。",
  "本书内重复出现的同一故事只取较完整、较干净的一处，如顾维钧矿物学故事。"
];

const candidateMarkers = [
  "故事",
  "笑话",
  "寓言",
  "典故",
  "轶事",
  "趣闻",
  "有一次",
  "有一天",
  "我讲",
  "讲个",
  "讲一个",
  "我告诉",
  "我记得",
  "我举个例子"
];

function findSourceRoot() {
  const chaptersRoot = path.join(ROOT, "《大李敖全集6.0》分章节");
  const category = fs.readdirSync(chaptersRoot).find((name) => name.startsWith("010."));
  if (!category) throw new Error("Missing 010 source category");
  const categoryRoot = path.join(chaptersRoot, category);
  const bookDir = fs.readdirSync(categoryRoot).find((name) => name.startsWith("003."));
  if (!bookDir) throw new Error("Missing 003 book source");
  return path.join(categoryRoot, bookDir);
}

const SOURCE_ROOT = findSourceRoot();
const decoder = new TextDecoder("gb18030");

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((name) => /^\d{3}\..*\.txt$/u.test(name))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));
}

function readSource(fileName) {
  return decoder.decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName))).replace(/^\uFEFF/u, "");
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
    if (paragraph) {
      paragraphs.push({ text: paragraph, startLine, endLine });
    }
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
  if (typeof selection.paragraph === "string" && selection.paragraph.includes("-")) {
    const [start, end] = selection.paragraph.split("-").map((value) => Number(value));
    const picked = paragraphs.slice(start - 1, end);
    if (picked.length !== end - start + 1) {
      throw new Error(`Missing paragraph range ${selection.paragraph} in ${fileName}`);
    }
    return {
      fileName,
      sourceId: `${selection.prefix}#P${selection.paragraph}`,
      sourceLines: `${picked[0].startLine}-${picked[picked.length - 1].endLine}`,
      text: picked.map((paragraph) => paragraph.text).join("\n\n")
    };
  }

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
  return text.replace(/\s+/gu, "");
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
  if (/[",\r\n]/u.test(stringValue)) {
    return `"${stringValue.replace(/"/gu, '""')}"`;
  }
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
    book_slug: row.book_slug || bookSlug || SLUG_BY_BOOK[row.book] || "",
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
    if (seen.has(normalized)) {
      duplicates.push([seen.get(normalized), row.id]);
    } else {
      seen.set(normalized, row.id);
    }
  });
  return duplicates;
}

function existingBookOrder() {
  const aggregatePath = path.join(ROOT, "data", "all_stories.csv");
  if (!fs.existsSync(aggregatePath)) return [];
  const rows = readRowsFromCsv(aggregatePath);
  const order = rows
    .map((row) => row.book_slug || SLUG_BY_BOOK[row.book])
    .filter(Boolean);
  const unique = [...new Set(order)];
  return [
    ...PREFERRED_ORDER_PREFIX.filter((slug) => unique.includes(slug)),
    ...unique.filter((slug) => !PREFERRED_ORDER_PREFIX.includes(slug))
  ];
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
  const rows = [];
  orderedSlugs.forEach((slug) => {
    rows.push(
      ...readRowsFromCsv(path.join(booksRoot, slug, `${ROUND}.csv`)).map((row) =>
        normalizeAggregateRow(row, slug)
      )
    );
  });
  return rows;
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
  if (/故事|笑话|轶事|趣闻|典故|寓言/u.test(paragraph)) score += 6;
  if (/问|答|说|讲/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/哭|笑|杀|逃|打|骗|偷|抓|跪|求|死|梦|醒|嫁|娶|抢|跑|问|答/u.test(paragraph)) {
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
    "# 李敖秘密书房故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮初选：${ORIGINAL_EXTRACTION_COUNT} 条`,
    `- 校对轮删除：${proofreadDrops.length} 条`,
    `- 校对轮补入：${proofreadAdds.length} 条`,
    `- 校对轮保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖秘密书房》是节目逐字稿，夹杂书房展示、藏书来历、专题讲解、访谈和选战复盘。本轮只收李敖在文中讲成可独立复述、带情节动作或问答反转、并用于说明道理的小故事、笑话、寓言、掌故和文学故事；不把李敖自身经历、纯事件资料、嘉宾长段自述和书籍 provenance 当故事。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 校对轮删除",
    "",
    ...proofreadDrops.map(([title, reason]) => `- ${title}：${reason}`),
    "",
    "## 校对轮补入",
    "",
    ...proofreadAdds.map((title) => `- ${title}`),
    "",
    "## 提取说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 提取轮初选 ${ORIGINAL_EXTRACTION_COUNT} 条；校对轮删除 ${proofreadDrops.length} 条，补入 ${proofreadAdds.length} 条，保留 ${validation.count} 条。`,
    "- 故事正文均来自源文原段或段内原文截取，没有改写。",
    "- 对长段只截故事本体和必要的原文收束语，尽量去掉后续时政评论、现场问答和藏书说明。",
    "- 本书内重复出现的故事只保留较完整、较干净的一处。",
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
    originalExtractionCount: ORIGINAL_EXTRACTION_COUNT,
    proofreadDropCount: proofreadDrops.length,
    proofreadDrops: proofreadDrops.map(([title, reason]) => ({ title, reason })),
    proofreadAddCount: proofreadAdds.length,
    proofreadAdds,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖讲成可独立复述、带人物行动或问答反转、并用于说明道理的小故事、笑话、寓言、掌故和文学故事；排除李敖自身事件、纯时政连续叙述、文件材料、藏书 provenance、嘉宾长段自述和无情节概念。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮初选 ${ORIGINAL_EXTRACTION_COUNT} 条；校对轮删除 ${proofreadDrops.length} 条，补入 ${proofreadAdds.length} 条，保留 ${rows.length} 条。`,
      "正文均按源文原段或段内原文截取。",
      "本轮继续压掉知识点、书房例子和一句机锋，避免做成藏书/事件合集。"
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
