const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖快意恩仇录";
const SLUG = "li_ao_kuaiyi_enchoulu";
const ROUND = "story_round1";
const ID_PREFIX = "LAKY";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "001.自传回忆类",
  "005.李敖快意恩仇录"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const BOOK_ORDER = [
  "li_ao_zizhuan_yu_huiyi",
  "li_ao_zizhuan_yu_huiyi_xuji",
  "wo_zui_nanwang_de_shi_he_ren",
  "li_ao_huiyilu",
  "li_ao_kuaiyi_enchoulu"
];

const selections = [
  {
    file: "004.小寒纪.txt",
    title: "老居士素面吃肉",
    paragraphs: [6],
    start: "李善培对我讲了一个秘密",
    end: "鲁智深那一套）。"
  },
  {
    file: "004.小寒纪.txt",
    title: "老居士佛堂停骂",
    paragraphs: [6],
    start: "还有一次，老居士在大雄宝殿骂李天培",
    end: "老居士猛悟，立刻停骂了。"
  },
  {
    file: "005.大寒纪.txt",
    title: "张丕隆转包送报",
    paragraphs: [28],
    start: "台大校本部送报生"
  },
  {
    file: "005.大寒纪.txt",
    title: "陈又亮假借卵子退敌",
    paragraphs: [30],
    start: "陈又亮年纪最小"
  },
  {
    file: "005.大寒纪.txt",
    title: "王建人自批公文",
    paragraphs: [33],
    start: "第四室同房法律系司法组第一届的王建人",
    end: "以过干瘾。"
  },
  {
    file: "005.大寒纪.txt",
    title: "姚从吾涂去士鳌",
    paragraphs: [38],
    start: "姚从吾老师学名姚士鳌"
  },
  {
    file: "005.大寒纪.txt",
    title: "傅良圃说没用了",
    paragraphs: [42],
    start: "外文系洋神父傅良圃"
  },
  {
    file: "005.大寒纪.txt",
    title: "张贵永让女佣再洗衬衫",
    paragraphs: [49],
    start: "历史系有西洋史教授"
  },
  {
    file: "005.大寒纪.txt",
    title: "徐子明说白话文狗叫",
    paragraphs: [51],
    start: "历史系有一极顽固老教授",
    end: "我跟狗说话，不能不狗叫！”"
  },
  {
    file: "008.星火纪.txt",
    title: "黄三拒绝自打手心",
    paragraphs: [13],
    start: "还有一位黄三",
    end: "黄三为了向不良教育抗争，又给开除了。"
  },
  {
    file: "009.白露纪.txt",
    title: "名媛回问谁是涂咪咪",
    paragraphs: [72],
    start: "“H”因为演过电影《窗外》",
    end: "名媛功夫也！"
  },
  {
    file: "010.根株纪.txt",
    title: "梁实秋说不该加入",
    paragraphs: [14],
    start: "当年郭良蕙出版了一部名叫《心锁》的书",
    end: "第二个错误是你不该加入。”"
  },
  {
    file: "010.根株纪.txt",
    title: "梁实秋说小便认门",
    paragraphs: [20],
    start: "余光中介绍一个人",
    end: "下次就找不到我家啦！”"
  },
  {
    file: "010.根株纪.txt",
    title: "徐复观鞠躬求女人",
    paragraphs: [43],
    start: "更有趣的是《联合报》驻日特派员司马桑敦告诉我的故事",
    end: "司马桑敦一边说还一边学徐复观，好玩极了。"
  },
  {
    file: "011.殷鉴纪.txt",
    title: "劳思光带高信疆玩电玩",
    paragraphs: [54],
    start: "多年以后，劳思光自香港移台",
    end: "听了信疆之言，我们相互大笑。"
  },
  {
    file: "014.寒武纪.txt",
    title: "张翠英替李丽华瞒岁数",
    paragraphs: [18],
    start: "在李翰祥家作客时",
    end: "年龄互保，人同此心，大家有所保留，亦大好事也。"
  },
  {
    file: "015.三叠纪.txt",
    title: "黄中国判死刑分鸡腿",
    paragraphs: [13],
    start: "黄中国一进房就大喊",
    end: "现在你知道他为什么那么胖了吧？”"
  },
  {
    file: "015.三叠纪.txt",
    title: "俞中兴替天行道",
    paragraphs: [43],
    start: "俞中兴身体极好",
    end: "以后谁还敢‘替天行道’啊！”"
  },
  {
    file: "015.三叠纪.txt",
    title: "傅积宽喊自己万岁",
    paragraphs: [44],
    start: "傅胖子傅积宽是",
    end: "抓到牢里，判了五年。"
  },
  {
    file: "016.梦遗纪.txt",
    title: "田中抱怨更审四次",
    paragraphs: [44],
    start: "日本浪人田中因涉嫌杀死情妇",
    end: "田中无辞以对。"
  },
  {
    file: "017.猪猡纪.txt",
    title: "雷啸岑说一次买断选皇帝",
    paragraphs: [27],
    start: "“马五先生”雷啸岑者",
    end: "我们选他做皇帝算啦！”"
  },
  {
    file: "020.志留纪.txt",
    title: "张善惠父亲说跳淡水河",
    paragraphs: [3],
    start: "“院长”的老爸当年",
    end: "觉得每顿饭都吃得痛苦不堪。"
  },
  {
    file: "020.志留纪.txt",
    title: "宋英说国民党也不错",
    paragraphs: [55],
    start: "雷震《自由中国》被封后",
    end: "国民党也不错啊！”"
  },
  {
    file: "020.志留纪.txt",
    title: "乔路易斯台上索寞",
    paragraphs: [65],
    start: "美国绰号“褐色轰炸机”",
    end: "没有真正可堪一击的“敌人”。"
  },
  {
    file: "020.志留纪.txt",
    title: "乔路易斯一拳太值钱",
    paragraphs: [65],
    start: "乔·路易斯在美国",
    end: "怎么可以用来打这些小子们。”"
  }
];

function readGb18030(filePath) {
  return new TextDecoder("gb18030").decode(fs.readFileSync(filePath));
}

function stripNoise(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n\s*好读书柜《典藏版》，网址：.*$/gmu, "")
    .replace(/\n\s*扫描校对制作：.*$/gmu, "")
    .replace(/\n\s*本书由.*$/gmu, "")
    .replace(/\n\s*李敖影音E书.*$/gmu, "")
    .replace(/\n\s*李敖数字博物馆.*$/gmu, "")
    .replace(/\n\s*李敖资源下载站.*$/gmu, "")
    .replace(/\n\s*油管\/抖音.*$/gmu, "")
    .trim();
}

function splitParagraphs(text) {
  const lines = stripNoise(text).split("\n");
  const paragraphs = [];
  let buffer = [];
  let start = 1;

  function flush(endLine) {
    const raw = buffer.join("\n").trim();
    if (raw) {
      paragraphs.push({
        index: paragraphs.length + 1,
        text: raw.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n"),
        lineStart: start,
        lineEnd: endLine
      });
    }
    buffer = [];
  }

  lines.forEach((line, index) => {
    if (/^\s*$/.test(line)) {
      flush(index);
      start = index + 2;
      return;
    }
    if (buffer.length === 0) start = index + 1;
    buffer.push(line);
  });
  flush(lines.length);
  return paragraphs;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function getParagraphMap(fileName, cache) {
  if (!cache.has(fileName)) {
    const fullPath = path.join(SOURCE_ROOT, fileName);
    if (!fs.existsSync(fullPath)) throw new Error(`Source file not found: ${fileName}`);
    cache.set(
      fileName,
      new Map(splitParagraphs(readGb18030(fullPath)).map((paragraph) => [paragraph.index, paragraph]))
    );
  }
  return cache.get(fileName);
}

function sliceText(text, selection) {
  let output = text;
  if (selection.start) {
    const startIndex = output.indexOf(selection.start);
    if (startIndex < 0) {
      throw new Error(`${selection.file} ${selection.title} missing slice start: ${selection.start}`);
    }
    output = output.slice(startIndex);
  }
  if (selection.end) {
    const endIndex = output.indexOf(selection.end);
    if (endIndex < 0) {
      throw new Error(`${selection.file} ${selection.title} missing slice end: ${selection.end}`);
    }
    output = output.slice(0, endIndex + selection.end.length);
  }
  return output.trim();
}

function buildRows() {
  const cache = new Map();
  return selections.map((selection, index) => {
    const paragraphMap = getParagraphMap(selection.file, cache);
    const parts = selection.paragraphs.map((paragraphIndex) => {
      const paragraph = paragraphMap.get(paragraphIndex);
      if (!paragraph) throw new Error(`${selection.file} has no paragraph ${paragraphIndex}`);
      return paragraph;
    });
    const text = sliceText(parts.map((part) => part.text).join("\n\n"), selection);
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: selection.paragraphs.map((paragraphIndex) => `${selection.file}#P${paragraphIndex}`).join(";"),
      source_file: selection.file,
      source_lines: `${Math.min(...parts.map((part) => part.lineStart))}-${Math.max(
        ...parts.map((part) => part.lineEnd)
      )}`,
      char_count: [...text].length,
      story_text: text
    };
  });
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
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const blocks = rows.map((row) =>
    [
      `【${row.id}】${row.title}`,
      `书名：${row.book}`,
      `出处：${row.source_file}，${row.source_lines}行`,
      `字数：${row.char_count}`,
      "",
      row.story_text
    ].join("\n")
  );
  fs.writeFileSync(filePath, `${blocks.join("\n\n---\n\n")}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const headers = (rows.shift() || []).map((header, index) =>
    index === 0 ? header.replace(/^\uFEFF/, "") : header
  );
  return rows
    .filter((item) => item.some((value) => value !== ""))
    .map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index] ?? ""])));
}

function normalizeAggregateRow(row, bookSlug) {
  const storyText = row.story_text || row.text || "";
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || bookSlug,
    title: row.title,
    source_ids: row.source_ids,
    source_file: row.source_file,
    source_lines: row.source_lines || [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count || [...storyText].length,
    story_text: storyText
  };
}

function bookSortKey(filePath) {
  const slug = path.basename(path.dirname(filePath));
  const index = BOOK_ORDER.indexOf(slug);
  return index >= 0 ? index : BOOK_ORDER.length + slug;
}

function duplicateTextPairs(rows) {
  const textHashes = new Map();
  const duplicateTextIds = [];
  for (const row of rows) {
    const normalized = String(row.story_text || "").replace(/\s+/g, "");
    if (textHashes.has(normalized)) duplicateTextIds.push([textHashes.get(normalized), row.id]);
    else textHashes.set(normalized, row.id);
  }
  return duplicateTextIds;
}

function writeAggregate() {
  const dataBooksDir = path.join(ROOT, "data", "books");
  const csvFiles = fs
    .readdirSync(dataBooksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dataBooksDir, entry.name, "story_round1.csv"))
    .filter((filePath) => fs.existsSync(filePath))
    .sort((a, b) => {
      const left = bookSortKey(a);
      const right = bookSortKey(b);
      return typeof left === "number" && typeof right === "number"
        ? left - right
        : String(left).localeCompare(String(right));
    });

  const rows = csvFiles.flatMap((filePath) => {
    const bookSlug = path.basename(path.dirname(filePath));
    return parseCsv(fs.readFileSync(filePath, "utf8")).map((row) => normalizeAggregateRow(row, bookSlug));
  });

  const seenIds = new Set();
  const duplicateIds = rows.filter((row) => {
    if (seenIds.has(row.id)) return true;
    seenIds.add(row.id);
    return false;
  });
  if (duplicateIds.length) {
    throw new Error(`Duplicate story ids in aggregate: ${duplicateIds.map((row) => row.id).join(", ")}`);
  }

  writeCsv(path.join(ROOT, "data", "all_stories.csv"), rows);
  writeTxt(path.join(ROOT, "data", "all_stories.txt"), rows);

  const books = Array.from(
    rows.reduce((map, row) => {
      const current = map.get(row.book_slug) || { book: row.book, slug: row.book_slug, count: 0 };
      current.count += 1;
      map.set(row.book_slug, current);
      return map;
    }, new Map()).values()
  );

  const webPayload = {
    book: "李敖故事",
    slug: "all",
    round: ROUND,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + Number(row.char_count || 0), 0),
    books,
    sources: Array.from(new Set(rows.map((row) => `${row.book}｜${row.source_file}`))),
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

  return {
    rows,
    books,
    duplicateTextIds: duplicateTextPairs(rows)
  };
}

function validate(rows) {
  const duplicateTextIds = duplicateTextPairs(rows);
  return {
    ok: duplicateTextIds.length === 0 && rows.every((row) => row.char_count > 0),
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + row.char_count, 0),
    minChars: Math.min(...rows.map((row) => row.char_count)),
    maxChars: Math.max(...rows.map((row) => row.char_count)),
    duplicateTextIds
  };
}

function writeMetadata(rows, validation) {
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
  fs.writeFileSync(
    path.join(OUT_DIR, "story_manifest.json"),
    `${JSON.stringify(
      {
        book: BOOK,
        slug: SLUG,
        round: ROUND,
        sourceRoot: path.relative(ROOT, SOURCE_ROOT),
        outputs: ["story_round1.csv", "story_round1.txt", "story_manifest.json", "story_validation.json"],
        criteria:
          "只保留李敖文中讲出来的小故事；故事焦点不是李敖本人的恩仇事件，且有具体人物、动作、转折或收束；李敖自身经历、恋爱、官司、出版、出境、政治论战、人物简历和非李敖叙述口吻的家族回忆从严剔除；正文保留原文。"
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(ROOT, "notes", "li_ao_kuaiyi_enchoulu_story_round1.md"),
    [
      "# 李敖快意恩仇录 story_round1",
      "",
      `- 输出条目：${rows.length}`,
      `- 总字数：${validation.totalChars}`,
      `- 最短/最长：${validation.minChars}/${validation.maxChars}`,
      "- 口径：只收李敖文中讲出来、故事焦点不是李敖本人恩仇事件、且有具体人物动作和转折收束的小故事；正文为原文。",
      "- 从严剔除：李敖自己的恋爱、官司、出版、出境、斗争、会面、求助、卖书、写作经历；单纯论辩、人物评传、背景说明、档案材料。",
      "- 额外剔除：陆根纪中非李敖本人叙述口吻的家庭回忆，即使有故事性也不纳入本轮。",
      "- 跳过明显重述：前几册已收的刘家昌、张永亭、黄中国上天堂投机、范子文打蚊子、王拓查扣、雷震补新闻等近同故事。"
    ].join("\n") + "\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(ROOT, "notes", "li_ao_kuaiyi_enchoulu_proofread_round1.md"),
    [
      "# 李敖快意恩仇录 proofread_round1",
      "",
      "- 校对日期：2026-06-30",
      "- 输入条目：34",
      `- 输出条目：${rows.length}`,
      `- 总字数：${validation.totalChars}`,
      "- 口径：继续按故事集处理，只留李敖文中讲出来、焦点不是李敖本人恩仇事件、且有具体人物动作和转折收束的小故事；删去事件材料、政论解释、人物印象和自我经历。",
      "- 同步输出：本书 story_round1.csv/txt、五本 all_stories.csv/txt、web/stories.js。",
      "",
      "## 本轮删去",
      "",
      "- 吴申叔交信无下文：偏朋友遭遇和政治关系材料，故事转折不足。",
      "- 李焕说西北穷苦：偏见闻概述和社会说明，不是完整小故事。",
      "- 检举匪谍反成匪谍：偏李敖对制度的解释和警告，不是具体故事。",
      "- 检举标语反被罗织：泛称情形，缺少具体人物和完整情节。",
      "- 匪谍自首罪加一等：泛称情形，偏政论说明。",
      "- 范子文说真共产党抓不到：只有一句判断，故事性不足。",
      "- 息先生沉默无声：偏人物素描和监狱见闻，缺少故事转折。",
      "- 张烈说不要骂孔子：主轴是李敖出版遭审查的事件材料。",
      "- 张烈密电放行全集：主轴是李敖出书经过，偏自传事件。",
      "- 刘心皇秘密写现形记：偏出版托付和人物资料，不是完整小故事。",
      "- 黄宝实少写类稿多写惩贪：偏李敖书信劝告，不是独立故事。",
      "",
      "## 本轮新增",
      "",
      "- 徐子明说白话文狗叫：从漏收段落中补入，焦点在徐子明对白话文的反讽答语。",
      "- 梁实秋说不该加入：从长段中切出郭良蕙到梁家的小故事，保留两重错误的收束。",
      "",
      "## 本轮调整",
      "",
      "- 王建人自批公文：删去蒋介石报告狂的政治展开，只留王家公文习惯。",
      "- 黄中国判死刑分鸡腿：删去入房前铺陈，从黄中国喊判死刑处进入。",
      "- 俞中兴替天行道：删去李敖与其聊天的场景铺垫，只留俞中兴逻辑。",
      "- 傅积宽喊自己万岁：删去看守所总述，从傅积宽本人故事进入。",
      "- 雷啸岑说一次买断选皇帝：删去曹锟比较，只留国大代表笑谈。",
      "- 乔路易斯一拳太值钱：删去结尾评论，只留一拳值钱的故事。"
    ].join("\n") + "\n",
    "utf8"
  );
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(ROOT, "notes"), { recursive: true });

  const rows = buildRows();
  writeCsv(path.join(OUT_DIR, "story_round1.csv"), rows);
  writeTxt(path.join(OUT_DIR, "story_round1.txt"), rows);

  const validation = validate(rows);
  writeMetadata(rows, validation);
  const aggregate = writeAggregate();

  console.log(
    JSON.stringify(
      {
        book: BOOK,
        rows: rows.length,
        validationOk: validation.ok,
        aggregateRows: aggregate.rows.length,
        aggregateDuplicateTexts: aggregate.duplicateTextIds,
        aggregateBooks: aggregate.books
      },
      null,
      2
    )
  );
}

main();
