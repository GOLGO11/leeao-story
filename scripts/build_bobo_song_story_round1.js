const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "波波颂";
const SLUG = "bobo_song";
const ROUND = "story_round1";
const ID_PREFIX = "BBS";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "002.精品散文类",
  "006.波波颂"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const BOOK_ORDER = [
  "li_ao_zizhuan_yu_huiyi",
  "li_ao_zizhuan_yu_huiyi_xuji",
  "wo_zui_nanwang_de_shi_he_ren",
  "li_ao_huiyilu",
  "li_ao_kuaiyi_enchoulu",
  "li_ao_yitan_aisi_lu",
  "li_ao_fengliu_zizhuan",
  "li_ao_xiangguan",
  "chuantong_xia_de_dubai",
  "chuantong_xia_de_zaibai",
  "dubai_xia_de_chuantong",
  "li_ao_wencun",
  "li_ao_wencun_erji",
  "bobo_song"
];

const selections = [
  {
    file: "《波波颂》自序.txt",
    title: "艾森豪母亲问哪一个",
    paragraphs: [6]
  },
  {
    file: "004.用冰冷表现洁白.txt",
    title: "小男孩不参加爷爷追悼会",
    paragraphs: [4]
  },
  {
    file: "004.用冰冷表现洁白.txt",
    title: "李夫人死前拒见汉武帝",
    paragraphs: [5]
  },
  {
    file: "004.用冰冷表现洁白.txt",
    title: "林肯不见临死父亲",
    paragraphs: [6]
  },
  {
    file: "009.“显性伪君子”和“隐性伪君子”.txt",
    title: "清教徒躲进船舱让仆人抗海盗",
    paragraphs: [4]
  },
  {
    file: "009.“显性伪君子”和“隐性伪君子”.txt",
    title: "巴顿掌掴战争疲劳小兵",
    paragraphs: [5]
  },
  {
    file: "009.“显性伪君子”和“隐性伪君子”.txt",
    title: "餐桌君子拉上窗帘",
    paragraphs: [10],
    end: "继续大吃特吃了。"
  },
  {
    file: "009.“显性伪君子”和“隐性伪君子”.txt",
    title: "公孙弘布衣里穿貂皮",
    paragraphs: [11],
    start: "一个最有名的例子就是汉朝的大臣公孙弘。",
    end: "完全是个伪善的家伙。"
  },
  {
    file: "009.“显性伪君子”和“隐性伪君子”.txt",
    title: "小茵让卖冰淇淋的去捐",
    paragraphs: [12],
    start: "一个笑话说",
    end: "不更好吗？”"
  },
  {
    file: "011.呜呼新女性.txt",
    title: "艺妓一句话救回婚姻",
    paragraphs: [5],
    start: "以前看过一场"
  },
  {
    file: "011.呜呼新女性.txt",
    title: "维多利亚女王敲门",
    paragraphs: [6],
    end: "门才开了。"
  },
  {
    file: "013.人到底该怎么选择？.txt",
    title: "屈原不肯从俗富贵",
    paragraphs: [11, 12, 13, 14]
  },
  {
    file: "013.人到底该怎么选择？.txt",
    title: "祢衡正言碰上黄祖",
    paragraphs: [15, 16]
  },
  {
    file: "016.别弄拧了堂吉诃德.txt",
    title: "塞万提斯千劫写堂吉诃德",
    paragraphs: [7]
  },
  {
    file: "018.论“向将军道歉”.txt",
    title: "玛咪问向哪一位将军道歉",
    paragraphs: [2]
  },
  {
    file: "018.论“向将军道歉”.txt",
    title: "皮尔逊用黑资料逼退麦克阿瑟",
    paragraphs: [4]
  },
  {
    file: "020.别孵那贼蛋！.txt",
    title: "椋鸟下贼蛋让别鸟代孵",
    paragraphs: [7, 8]
  },
  {
    file: "020.别孵那贼蛋！.txt",
    title: "黄莺筑新巢拒孵贼蛋",
    paragraphs: [11, 12],
    start: "当这种黄莺发现蛋中有贼蛋"
  },
  {
    file: "023.波波颂.txt",
    title: "曹操捉刀见匈奴使",
    paragraphs: [23],
    end: "追杀此使。”"
  },
  {
    file: "024.能下床就是好猫.txt",
    title: "爱神把恋爱猫变回猫",
    paragraphs: [2]
  },
  {
    file: "026.古董与今董.txt",
    title: "秦士买假古董倾家荡产",
    paragraphs: [3],
    start: "《增新事林广记》中写有秦士是古董迷",
    end: "还讨古钱呢！"
  },
  {
    file: "026.古董与今董.txt",
    title: "宋小濂被古董商骗宋版书",
    paragraphs: [5]
  },
  {
    file: "027.天堂不是我们的.txt",
    title: "白石先生不愿升天",
    paragraphs: [7],
    end: "更苦于人间！”"
  },
  {
    file: "027.天堂不是我们的.txt",
    title: "猫不随鸡犬升天",
    paragraphs: [8, 9, 10],
    end: "不要上天堂。"
  },
  {
    file: "028.用替身可也！.txt",
    title: "顾恺之画邻女钉心",
    paragraphs: [6]
  },
  {
    file: "028.用替身可也！.txt",
    title: "顾恺之月下长咏替身",
    paragraphs: [8]
  },
  {
    file: "030.神像百年一感.txt",
    title: "拉斐特吾人在此",
    paragraphs: [3],
    start: "当年美国独立",
    end: "在拉斐特作古七十三年之后，美国人犹有豪情如此！"
  },
  {
    file: "031.纵裸女战斗.txt",
    title: "延州妓女原是舍身菩萨",
    paragraphs: [6],
    start: "《西湖二集》",
    end: "济贫人之欲（慾）！”"
  },
  {
    file: "031.纵裸女战斗.txt",
    title: "胡僧礼锁骨菩萨墓",
    paragraphs: [7, 8]
  },
  {
    file: "031.纵裸女战斗.txt",
    title: "马郎妇锁骨升云而去",
    paragraphs: [9, 10]
  },
  {
    file: "032.陶潜者，今之我也.txt",
    title: "陶潜不为五斗米折腰",
    paragraphs: [6]
  },
  {
    file: "039.童子功加老子功.txt",
    title: "杜浚先自笑天下奇作",
    paragraphs: [7],
    start: "明末清初的不合作主义者杜子皇",
    end: "是以先自笑也！’”"
  },
  {
    file: "043.顺风与逆风.txt",
    title: "王尔德嫌橱窗里的花累",
    paragraphs: [4],
    start: "英国唯美派的王尔德",
    end: "理由是那几朵花看起来太累了。"
  },
  {
    file: "047.拳王的索寞.txt",
    title: "乔路易斯舍不得用金拳打小子",
    paragraphs: [4],
    end: "怎么可以用来打这些小子们。”"
  },
  {
    file: "047.拳王的索寞.txt",
    title: "乔路易斯一句话被错译",
    paragraphs: [5]
  },
  {
    file: "048.想起施洗者约翰.txt",
    title: "施洗约翰做前驱而身首异处",
    paragraphs: [3, 5, 6]
  },
  {
    file: "049.以得礼始，以失礼终.txt",
    title: "范冉道旁送别拂衣而去",
    paragraphs: [7]
  },
  {
    file: "050.文人之雄.txt",
    title: "巴尔扎克给拿破仑像留字",
    paragraphs: [6],
    end: "我可以用笔征服。”"
  },
  {
    file: "052.“平生之志，不在温饱”.txt",
    title: "王曾平生之志不在温饱",
    paragraphs: [2]
  },
  {
    file: "052.“平生之志，不在温饱”.txt",
    title: "耶稣拒把石头变面包",
    paragraphs: [4],
    end: "乃是靠神口里所出的一切话。”"
  },
  {
    file: "055.魂牵梦萦贝克特.txt",
    title: "贝克特为教会与国王翻脸",
    paragraphs: [3, 4, 5]
  }
];

const proofreadDrops = new Set([
  "屈原不肯从俗富贵",
  "祢衡正言碰上黄祖",
  "塞万提斯千劫写堂吉诃德",
  "拉斐特吾人在此",
  "乔路易斯一句话被错译",
  "施洗约翰做前驱而身首异处",
  "贝克特为教会与国王翻脸"
]);

const decoder = new TextDecoder("gb18030");
const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖导航站",
  "油管/抖音"
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function readSource(fileName) {
  const filePath = path.join(SOURCE_ROOT, fileName);
  return decoder.decode(fs.readFileSync(filePath)).replace(/\r\n/g, "\n");
}

function stripFooter(text) {
  const lines = text.split("\n");
  const footerIndex = lines.findIndex((line) =>
    footerPatterns.some((pattern) => line.includes(pattern))
  );
  return (footerIndex >= 0 ? lines.slice(0, footerIndex) : lines).join("\n").trim();
}

function splitParagraphs(text) {
  const blocks = [];
  let current = [];
  let startLine = 1;
  const lines = text.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim()) {
      if (!current.length) startLine = index + 1;
      current.push(line);
    } else if (current.length) {
      blocks.push({
        index: blocks.length + 1,
        lineStart: startLine,
        lineEnd: index,
        text: current.join("\n").trim()
      });
      current = [];
    }
  }

  if (current.length) {
    blocks.push({
      index: blocks.length + 1,
      lineStart: startLine,
      lineEnd: lines.length,
      text: current.join("\n").trim()
    });
  }

  return blocks;
}

function getParagraphs(fileName, cache) {
  if (!cache.has(fileName)) {
    cache.set(fileName, splitParagraphs(stripFooter(readSource(fileName))));
  }
  return cache.get(fileName);
}

function sourceId(selection, paragraph) {
  const fileIndex = (selection.file.match(/^(\d{3})\./) || [null, "000"])[1];
  return `${ID_PREFIX}_${fileIndex}_${paragraph.index}`;
}

function sliceText(text, selection) {
  let startIndex = 0;
  if (selection.start) {
    startIndex = text.indexOf(selection.start);
    if (startIndex < 0) {
      throw new Error(`Start marker not found for ${selection.title}: ${selection.start}`);
    }
  }

  let endIndex = text.length;
  if (selection.end) {
    const found = text.indexOf(selection.end, startIndex);
    if (found < 0) {
      throw new Error(`End marker not found for ${selection.title}: ${selection.end}`);
    }
    endIndex = found + selection.end.length;
  }

  return text.slice(startIndex, endIndex).trim();
}

function buildRows() {
  const cache = new Map();
  return selections.filter((selection) => !proofreadDrops.has(selection.title)).map((selection, index) => {
    const paragraphs = getParagraphs(selection.file, cache).filter((paragraph) =>
      selection.paragraphs.includes(paragraph.index)
    );
    if (paragraphs.length !== selection.paragraphs.length) {
      throw new Error(`Paragraph lookup failed for ${selection.title}`);
    }

    const storyText = sliceText(paragraphs.map((paragraph) => paragraph.text).join("\n\n"), selection);
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: paragraphs.map((paragraph) => sourceId(selection, paragraph)).join(";"),
      source_file: selection.file,
      source_lines: `${paragraphs[0].lineStart}-${paragraphs[paragraphs.length - 1].lineEnd}`,
      char_count: [...storyText].length,
      story_text: storyText
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
  fs.writeFileSync(filePath, rows.length ? `${blocks.join("\n\n---\n\n")}\n` : "", "utf8");
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
    ok: duplicateTextIds.length === 0 && rows.every((row) => Number(row.char_count) > 0),
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + Number(row.char_count || 0), 0),
    minChars: rows.length ? Math.min(...rows.map((row) => Number(row.char_count || 0))) : 0,
    maxChars: rows.length ? Math.max(...rows.map((row) => Number(row.char_count || 0))) : 0,
    duplicateTextIds
  };
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function main() {
  const rows = buildRows();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  writeCsv(path.join(OUT_DIR, `${ROUND}.csv`), rows);
  writeTxt(path.join(OUT_DIR, `${ROUND}.txt`), rows);

  const validation = validate(rows);
  const aggregate = writeAggregate();
  const manifest = {
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    selectionCount: selections.length,
    proofreadDropCount: proofreadDrops.size,
    proofreadDrops: Array.from(proofreadDrops),
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    excludedByStandard: [
      "李敖自己的生活事件、交游场景和写作姿态",
      "纯论述、史料目录、文献校勘和观念归纳",
      "案件、书信、广告和办刊过程中的李敖本人事件",
      "附录中明确署名为他人的整篇文章，除非李敖正文直接转述",
      "只有资料性陈述、术语分类或名单串列而无故事转折的段落"
    ],
    proofreadTrimmed: [
      "餐桌君子拉上窗帘",
      "公孙弘布衣里穿貂皮",
      "小茵让卖冰淇淋的去捐",
      "艺妓一句话救回婚姻",
      "维多利亚女王敲门",
      "曹操捉刀见匈奴使",
      "黄莺筑新巢拒孵贼蛋",
      "秦士买假古董倾家荡产",
      "白石先生不愿升天",
      "猫不随鸡犬升天",
      "延州妓女原是舍身菩萨",
      "杜浚先自笑天下奇作",
      "王尔德嫌橱窗里的花累",
      "乔路易斯舍不得用金拳打小子",
      "范冉道旁送别拂衣而去",
      "巴尔扎克给拿破仑像留字",
      "耶稣拒把石头变面包"
    ],
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");

  if (!validation.ok) {
    throw new Error(`Validation failed for ${BOOK}`);
  }
  if (aggregate.duplicateTextIds.length) {
    throw new Error(`Duplicate story text in aggregate: ${JSON.stringify(aggregate.duplicateTextIds)}`);
  }

  console.log(
    JSON.stringify(
      {
        book: BOOK,
        rows: rows.length,
        aggregateRows: aggregate.rows.length,
        sourceFileCount: manifest.sourceFiles.length,
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
