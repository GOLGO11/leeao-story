const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖Talk秀";
const SLUG = "li_ao_talkxiu";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "LATS";
const ORIGINAL_EXTRACTION_COUNT = 41;
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const SLUG_BY_BOOK = {
  "李敖自传与回忆": "li_ao_zizhuan_yu_huiyi"
};
const PREFERRED_ORDER_PREFIX = ["li_ao_zizhuan_yu_huiyi", "li_ao_zizhuan_yu_huiyi_xuji"];

const selections = [
  {
    prefix: "001",
    paragraphs: [49, 62, 66],
    title: "《亚玛》妓女说自己仍是处女",
    start: "《亚玛》是什么书呢？",
    end: "你真正变化是内心的，你懂我意思吧？"
  },
  {
    prefix: "001",
    paragraph: 130,
    title: "柯立芝问是不是同一只母鸡",
    start: "我打断你的话，讲一个故事",
    end: "是搞不同的母鸡。"
  },
  {
    prefix: "001",
    paragraph: 233,
    title: "部长体检晚上靠太太找",
    start: "我想到一个笑话",
    end: "晚上我太太帮我找。"
  },
  {
    prefix: "002",
    paragraph: 23,
    title: "守寡老太太数铜钱",
    start: "清朝一个有名的故事",
    end: "就是我们面临了这个问题。"
  },
  {
    prefix: "002",
    paragraph: 25,
    title: "荒岛空投角先生",
    start: "现在我告诉你们，这种东西是有趣的一个现象",
    end: "还可以自得其乐。"
  },
  {
    prefix: "002",
    paragraph: 125,
    title: "海明威小说里男孩割掉自己",
    start: "海明威他有一本短篇小说",
    end: "这么一个故事。"
  },
  {
    prefix: "003",
    paragraph: 19,
    title: "农民请阿里斯太狄斯写自己名字",
    start: "这个是希腊有名的真正的政治家",
    end: "所以我把他赶走。"
  },
  {
    prefix: "004",
    paragraph: 11,
    title: "维多利亚女王说我是你的太太",
    start: "我讲个故事给大家听",
    end: "这时候门才开。"
  },
  {
    prefix: "004",
    paragraph: 29,
    title: "祖母把哭孙女的一小时换成回忆",
    start: "可是我可以告诉你一个故事",
    end: "我觉得你可以考虑。"
  },
  {
    prefix: "004",
    paragraph: 33,
    title: "主持会议忍到下班才办丧事",
    start: "他爸爸有一天在上班",
    end: "能够暂时忍住私人的悲痛。"
  },
  {
    prefix: "004",
    paragraph: 75,
    title: "胡佛签名不如贝比鲁斯",
    start: "坐下来，我花一分钟讲个故事给你们听",
    end: "今天免费要让我签名两次。"
  },
  {
    prefix: "004",
    paragraph: 93,
    title: "金岳霖为林徽因一生不婚",
    start: "最近你们看到有一个有名的电视剧叫做《人间四月天》",
    end: "一直到死。"
  },
  {
    prefix: "004",
    paragraph: 123,
    title: "重温旧梦就是破坏旧梦",
    start: "我告诉你一个认真的故事",
    end: "爱情是我们人生的一部分，绝非全体。"
  },
  {
    prefix: "005",
    paragraph: 12,
    title: "谭鑫培空城计台词救场",
    start: "京戏里面有一出戏叫做《空城计》",
    end: "还赞美这句话。"
  },
  {
    prefix: "007",
    paragraph: 118,
    title: "卫灵公分桃与毕秋帆打兔子",
    start: "什么是分桃？",
    end: "男生的零号。"
  },
  {
    prefix: "008",
    paragraph: 46,
    title: "老兵问穿袜子洗脚吗",
    start: "我讲一个笑话给你听",
    end: "他不舒服，所以就变成这样子。"
  },
  {
    prefix: "008",
    paragraph: 184,
    title: "国家代表建议选蒋介石做皇帝",
    start: "过去蒋介石做总统的时候不断的连任",
    end: "我们两厢情愿。"
  },
  {
    prefix: "009",
    paragraph: 217,
    title: "珍哈露新婚才知丈夫天阉",
    start: "美国有个大明星叫做珍哈露",
    end: "把她的初夜给了他。"
  },
  {
    prefix: "009",
    paragraphs: [250, 252],
    title: "《甜蜜的十一月》每天都是十一月三十日",
    start: "我常常在讲一个故事",
    end: "12月份男朋友报到了。"
  },
  {
    prefix: "009",
    paragraph: 284,
    title: "蒋介石给田单演员鞠躬",
    start: "过去蒋介石看那个田单火牛阵",
    end: "他以为他真的田单出现了。"
  },
  {
    prefix: "010",
    paragraph: 4,
    title: "任夫人喝醋拦小老婆",
    start: "唐朝有一个有名的大臣叫做任瑰",
    end: "还有三段论。"
  },
  {
    prefix: "010",
    paragraph: 5,
    title: "苏菲亚罗兰一个月牢就崩溃",
    start: "可是她发生一件事情穿帮了",
    end: "一个月的牢就把这位女士压垮了。"
  },
  {
    prefix: "010",
    paragraph: 7,
    title: "艾森豪戒烟说自己有意志力",
    start: "像美国有名的总统叫艾森豪",
    end: "别人没有，就这个感觉。"
  },
  {
    prefix: "010",
    paragraph: 176,
    title: "张煦华认出匿名小天使",
    start: "我的好朋友，我所佩服的密苏里新闻学院",
    end: "很有名的立法院立法委员。"
  },
  {
    prefix: "010",
    paragraph: 243,
    title: "格兰特授勋不会讲话",
    start: "我记得以前美国打赢南北战争的将军格兰特",
    end: "他的WARM UP比你还慢！"
  },
  {
    prefix: "011",
    paragraph: 4,
    title: "台湾人抗议最坏中国人",
    start: "我想到一个笑话",
    end: "香港人还是人吗？"
  },
  {
    prefix: "013",
    paragraph: 10,
    title: "德国军人分四种",
    start: "我给你讲个笑话",
    end: "会做很多错事出来。"
  },
  {
    prefix: "014",
    paragraph: 35,
    title: "列子说只看到钱没看到人",
    start: "就好像那个列子的故事",
    end: "也不管别的。"
  },
  {
    prefix: "014",
    paragraph: 160,
    title: "换夫漫画里没人肯换",
    start: "我看到一个PLAYBOY漫画",
    end: "表示甲男太太不跟他换。"
  },
  {
    prefix: "016",
    paragraph: 86,
    title: "丈夫死后太太想念鼾声",
    start: "有一个故事是说",
    end: "鼾声对女人好重要。"
  },
  {
    prefix: "016",
    paragraph: 94,
    title: "离婚案里的山羊和鸽子",
    start: "一个有名有趣的故事",
    end: "打开了以后，我养的鸽子飞掉了。"
  },
  {
    prefix: "017",
    paragraph: 84,
    title: "西太后笑许世英不外放",
    start: "我记得以前民国时候的司法总长许世英",
    end: "油水少。"
  },
  {
    prefix: "017",
    paragraph: 102,
    title: "孙子到河边钓鱼悼念祖父",
    start: "我过去看过一篇文章",
    end: "他不用这种世俗的方法去表达。"
  },
  {
    prefix: "018",
    paragraph: 2,
    title: "邵尧夫给大官看亡国史",
    start: "先讲一个故事",
    end: "原来我们的国家最后是亡国。"
  },
  {
    prefix: "018",
    paragraph: 6,
    title: "梁实秋说不该加入",
    start: "我记得过去梁实秋先生给我讲了一个故事",
    end: "你不加入，它就开除不了你，对不对？"
  }
];

const proofreadDrops = [
  {
    title: "贾桂琳与欧纳西斯订爱情条约",
    source: "001.20000517李敖Talk秀.txt:469-469",
    reason: "只是婚恋契约事实说明，缺少展开的情节动作和故事反转。"
  },
  {
    title: "钱穆考证被银雀山竹简推翻",
    source: "002.20000524李敖Talk秀.txt:259-259",
    reason: "偏学术材料和证据案例，本轮按非小故事删除。"
  },
  {
    title: "《失乐园》验尸报告荒谬",
    source: "006.20000621李敖Talk秀.txt:461-461",
    reason: "主要是文学批评和剧情材料，故事性不足。"
  },
  {
    title: "赵四小姐陪张学良坐四十五年牢",
    source: "007.20000628李敖Talk秀.txt:15-15",
    reason: "更像历史事件概括，不是带完整讲述结构的小故事。"
  },
  {
    title: "女政治犯装不懂英文嫁给美军",
    source: "012.20000802李敖Talk秀.txt:227-227",
    reason: "更像真人经历材料和火爆新闻，容易滑向事件合集。"
  },
  {
    title: "林肯与杰斐逊家的痛苦",
    source: "017.20000906李敖Talk秀.txt:205-205",
    reason: "由多个人物材料串联而成，不是单一可独立复述的小故事。"
  }
];

const proofreadTrims = [
  "部长体检晚上靠太太找",
  "荒岛空投角先生",
  "海明威小说里男孩割掉自己",
  "农民请阿里斯太狄斯写自己名字",
  "金岳霖为林徽因一生不婚",
  "谭鑫培空城计台词救场",
  "老兵问穿袜子洗脚吗",
  "国家代表建议选蒋介石做皇帝",
  "《甜蜜的十一月》每天都是十一月三十日",
  "离婚案里的山羊和鸽子"
];

const proofreadAdds = [];

const excludedByStandard = [
  "李敖自己的坐牢、官司、离婚、家庭、母亲葬礼、节目被查和个人交游经历，除非段内转述的是独立故事，否则排除。",
  "来宾自述、来电者经验、现场辩论和节目流程笑料，原则上不作为李敖讲出的故事。",
  "连续时政评论、案情整理、制度说明、资料展示和一句格言，缺少故事动作或问答反转的排除。",
  "过长段落只截取故事本体和必要的原文收束语，切掉后续时政发挥。",
  "同一书内重复出现的同一故事只取较完整、较适合独立阅读的一处。"
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
  "过去有",
  "古代有",
  "我讲",
  "讲个",
  "讲一个",
  "我告诉",
  "我记得",
  "我想到",
  "我想起",
  "我举个例子",
  "有名",
  "柯立芝",
  "维多利亚",
  "胡佛",
  "任瑰",
  "梁实秋",
  "邵尧夫"
];

function findSourceRoot() {
  const chaptersRoot = path.join(ROOT, "《大李敖全集6.0》分章节");
  const category = fs.readdirSync(chaptersRoot).find((name) => name.startsWith("010."));
  if (!category) throw new Error("Missing 010 source category");
  const categoryRoot = path.join(chaptersRoot, category);
  const bookDir = fs.readdirSync(categoryRoot).find((name) => name.startsWith("005."));
  if (!bookDir) throw new Error("Missing 005 book source");
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

  if (Array.isArray(selection.paragraphs)) {
    const picked = selection.paragraphs.map((paragraphNumber) => {
      const paragraph = paragraphs[paragraphNumber - 1];
      if (!paragraph) throw new Error(`Missing paragraph ${paragraphNumber} in ${fileName}`);
      return { paragraphNumber, ...paragraph };
    });
    return {
      fileName,
      sourceId: picked.map((paragraph) => `${selection.prefix}#P${paragraph.paragraphNumber}`).join(";"),
      sourceLines: picked.map((paragraph) => `${paragraph.startLine}-${paragraph.endLine}`).join(";"),
      text: picked.map((paragraph) => paragraph.text).join("\n\n")
    };
  }

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
    "# 李敖Talk秀故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮初选：${manifest.originalExtractionCount} 条`,
    `- 校对删除：${manifest.proofreadDropCount} 条`,
    `- 校对修边：${manifest.proofreadTrimCount} 条`,
    `- 校对补入：${manifest.proofreadAddCount} 条`,
    `- 校对保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖Talk秀》是节目逐字稿，内容以性、婚恋、学校、时政和来宾访谈为主。校对轮只收李敖在节目中讲成可独立复述、带人物行动或问答反转、并用来说明道理的小故事、笑话、典故、掌故和文学故事；不把李敖自己的坐牢、官司、离婚、家事、节目纠纷、来宾自述、单纯事实材料和连续时政事件当故事。",
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
    `- 提取轮初选 ${manifest.originalExtractionCount} 条；校对轮删除 ${manifest.proofreadDropCount} 条、修边 ${manifest.proofreadTrimCount} 条、补入 ${manifest.proofreadAddCount} 条，保留 ${validation.count} 条。`,
    "- 故事正文均来自源文原段或段内原文截取，没有改写。",
    "- 对节目中被问答打断的故事，只合并李敖讲述故事本体的原文段落，并在来源栏保留多个段号。",
    "- 对长段只截故事本体和必要的原文收束语，尽量去掉后续时政发挥和现场讨论。",
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
    proofreadAddCount: proofreadAdds.length,
    proofreadAdds,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖讲成可独立复述、带人物行动或问答反转、并用于说明道理的小故事、笑话、典故、掌故和文学故事；排除李敖自身事件、纯时政连续叙述、资料展示、节目流程、来宾长段自述和无情节概念。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮初选 ${ORIGINAL_EXTRACTION_COUNT} 条；校对轮删除 ${proofreadDrops.length} 条，修边 ${proofreadTrims.length} 条，补入 ${proofreadAdds.length} 条，保留 ${rows.length} 条。`,
      "正文均按源文原段或段内原文截取。",
      "本轮对李敖自身经历、来宾自述、单纯事实材料和时政事件保持收紧，避免做成节目事件合集。"
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
