const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖笑傲江湖";
const SLUG = "li_ao_xiaoao_jianghu";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "LAXAJH";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "010.节目演讲类",
  "001.李敖笑傲江湖"
);

const selections = [
  {
    prefix: "001",
    paragraph: 15,
    title: "希特勒宁拔牙不谈佛朗哥"
  },
  {
    prefix: "003",
    paragraph: 19,
    title: "甘肃农家全家只有一条裤子"
  },
  {
    prefix: "004",
    paragraph: 4,
    title: "克利夫兰私生子竞选口号"
  },
  {
    prefix: "004",
    paragraph: 10,
    segment: "fu_fu_jiangjun",
    title: "党太尉腹负将军",
    start: "换句话说，在宋朝有一个故事",
    end: "这个草包。"
  },
  {
    prefix: "012",
    paragraph: 13,
    segment: "wentianxiang_yituanxue",
    title: "文天祥笑一团血",
    start: "所以当时呢，文天祥讲过一个笑话",
    end: "别人都没有死。"
  },
  {
    prefix: "020",
    paragraph: 4,
    title: "侯宝林鞋底也擦油"
  },
  {
    prefix: "020",
    paragraph: 5,
    title: "苏东坡晒肚子晒书"
  },
  {
    prefix: "020",
    paragraph: 9,
    title: "牛顿挖猫洞和爱因斯坦被骂"
  },
  {
    prefix: "025",
    paragraph: 4,
    title: "半截是后半截"
  },
  {
    prefix: "025",
    paragraphs: [5, 6],
    title: "屈突通半截忠臣"
  },
  {
    prefix: "025",
    paragraph: 21,
    title: "胡适答被抢姐姐之问"
  },
  {
    prefix: "027",
    paragraphs: [5, 6],
    title: "小狗拖鞋认所有权"
  },
  {
    prefix: "029",
    paragraph: 12,
    title: "董宣不向公主低头"
  },
  {
    prefix: "044",
    paragraph: 14,
    title: "亨利八世留下理发杆"
  },
  {
    prefix: "045",
    paragraph: 18,
    title: "郭子仪儿子薄天子而不为"
  },
  {
    prefix: "049",
    paragraph: 12,
    title: "卞和两次献玉被砍脚"
  },
  {
    prefix: "071",
    paragraph: 10,
    title: "胡适替记者承认没讲的话"
  },
  {
    prefix: "071",
    paragraph: 12,
    title: "萧同兹被敌人利用厚道"
  },
  {
    prefix: "071",
    paragraph: 15,
    title: "皮尔逊用情书逼麦帅撤诉"
  },
  {
    prefix: "071",
    paragraph: 16,
    title: "胡适说知识分子也有权有势"
  },
  {
    prefix: "073",
    paragraphs: [16, 17],
    title: "谭鑫培空城计临场接招"
  },
  {
    prefix: "073",
    paragraph: 18,
    title: "考中进士不如卵鸟"
  },
  {
    prefix: "085",
    paragraph: 5,
    segment: "windsor_quarrel",
    title: "温莎公爵吵架说皇帝都不干",
    start: "这个图片就是告诉我们",
    end: "这有趣的一件事情。"
  },
  {
    prefix: "085",
    paragraph: 16,
    segment: "stockholm",
    title: "老囚犯和斯德哥尔摩人质",
    start: "我们看英国文学家狄更斯",
    end: "他会变得认同这个关他的这个恶势力"
  },
  {
    prefix: "090",
    paragraph: 5,
    title: "郭坚探病送钱给杨虎城"
  },
  {
    prefix: "090",
    paragraphs: [9, 10],
    title: "萧同兹坐半个月计程车等司机"
  },
  {
    prefix: "092",
    paragraph: 16,
    title: "安德生专为旅馆女工唱一首歌"
  },
  {
    prefix: "092",
    paragraph: 17,
    segment: "hu_shi_xiaoxin",
    title: "胡适换咸蛋又替女学生关窗",
    start: "这个胡先生啊",
    end: "过来给这个女学生关窗户。"
  },
  {
    prefix: "093",
    paragraph: 9,
    title: "都德写朱屋大佐幻想胜利"
  },
  {
    prefix: "099",
    paragraph: 13,
    segment: "yiguan_yiren",
    title: "贼穿警服反去抓贼",
    start: "外国一个小说里面讲说",
    end: "因为他以为他自己是警察。"
  },
  {
    prefix: "099",
    paragraph: 15,
    title: "贝当多活十一年晚节不保"
  },
  {
    prefix: "100",
    paragraphs: [3, 4],
    title: "七金人贼博士不要小钱"
  },
  {
    prefix: "100",
    paragraph: 11,
    title: "巴格达波斯王子请假宴"
  },
  {
    prefix: "100",
    paragraph: 12,
    title: "吝啬鬼嫌儿子送空饼太大",
    start: "可是在这个，有一个笑话讲到这个饼的事情。"
  },
  {
    prefix: "100",
    paragraph: 14,
    title: "张三竖竹竿进城结亲家"
  },
  {
    prefix: "108",
    paragraph: 6,
    title: "林肯大儿子送母亲进精神病院"
  },
  {
    prefix: "111",
    paragraph: 4,
    title: "唐太宗杀侯君集后不上凌烟阁"
  },
  {
    prefix: "111",
    paragraph: 13,
    segment: "liubang_rugguan",
    title: "刘邦溺儒冠",
    start: "我举几个小故事给大家看看，汉高祖",
    end: "来表示我看不起你这个知识分子。"
  },
  {
    prefix: "111",
    paragraph: 13,
    segment: "sunquan_zhangzhao",
    title: "孙权用土封张昭大门",
    start: "好比说三国时候的孙权",
    end: "这双方这样搞法的。"
  },
  {
    prefix: "113",
    paragraph: 4,
    title: "伏尔泰哲学家三窟"
  },
  {
    prefix: "113",
    paragraph: 13,
    segment: "shengnvzhende_jiao",
    title: "哲学家临死说圣女贞德脚还热",
    start: "如果没有那么好的死法呢",
    end: "所以他临死的时候，还开了一句玩笑才死掉。"
  },
  {
    prefix: "125",
    paragraph: 8,
    title: "里根中枪仍向医生开玩笑"
  },
  {
    prefix: "125",
    paragraph: 9,
    title: "巴茨说不运动者别定运动规则"
  },
  {
    prefix: "125",
    paragraph: 13,
    title: "梁鸿志临死说两样最脏"
  },
  {
    prefix: "125",
    paragraph: 15,
    segment: "debs_prison_vote",
    title: "戴布兹坐牢仍得百万选票",
    start: "哲学家斯宾塞这段话影响一个人叫戴布兹",
    end: "大家注意啊，我翻的是带押韵的，他原文没有韵。"
  },
  {
    prefix: "125",
    paragraph: 17,
    title: "地藏菩萨前身发愿先度众生"
  },
  {
    prefix: "126",
    paragraph: 5,
    segment: "gandhi_goat_milk",
    title: "甘地不喝牛奶改喝羊奶",
    start: "使我想起印度国父甘地的一个故事",
    end: "所以他觉得心里有一点不舒服。"
  },
  {
    prefix: "126",
    paragraphs: [11, 12],
    title: "西班牙革命党回母亲尸旁赴死"
  },
  {
    prefix: "143",
    paragraph: 15,
    title: "金圣叹雪夜给穷友钱"
  },
  {
    prefix: "143",
    paragraph: 17,
    title: "黄山谷栏外伸足受雨"
  },
  {
    prefix: "143",
    paragraph: 18,
    title: "王安石临行哭小女儿坟"
  },
  {
    prefix: "143",
    paragraph: 19,
    title: "赵翼雷声中呼亡儿来身边"
  },
  {
    prefix: "143",
    paragraph: 20,
    title: "叶菊兰出门请郑南榕看家"
  },
  {
    prefix: "144",
    paragraph: 5,
    title: "宗炳老病后卧游山水"
  },
  {
    prefix: "144",
    paragraph: 6,
    title: "鲍斯威尔躲着偷记约翰生"
  },
  {
    prefix: "144",
    paragraph: 13,
    title: "康德不出远门却教地理"
  },
  {
    prefix: "149",
    paragraph: 14,
    title: "贾飞德情书九十七年后曝光"
  },
  {
    prefix: "149",
    paragraph: 15,
    title: "哈定情妇等不到总统太太先死"
  },
  {
    prefix: "149",
    paragraph: 18,
    title: "杜鲁门毁掉艾森豪威尔情书"
  },
  {
    prefix: "150",
    paragraph: 4,
    title: "杰克逊决斗割掉坏舌头"
  },
  {
    prefix: "150",
    paragraph: 9,
    title: "晏子反省女子献身求事"
  }
];

const proofreadDrops = new Map([
  [
    "亨利八世留下理发杆",
    "更像制度与标志源流说明，情节反转和人物行动弱，校对轮按边缘材料删去。"
  ],
  [
    "康德不出远门却教地理",
    "主要是事实型例证，不是李敖讲成的完整小故事，校对轮删去。"
  ]
]);

const proofreadAdds = [
  "温莎公爵吵架说皇帝都不干：补入爱德华八世退位后形成的短笑话，故事完整且用来说明爱情/代价。",
  "林肯大儿子送母亲进精神病院：补入林肯家庭母子紧张的短掌故。",
  "戴布兹坐牢仍得百万选票：补入李敖用来说明菩萨心肠/同俦同流的劳工领袖故事。",
  "贾飞德情书九十七年后曝光：补入用来说明信息不发达与历史迟到曝光的总统掌故。",
  "哈定情妇等不到总统太太先死：补入用来说明偷腥收尾与时机的总统掌故。"
];

const candidateMarkers = [
  "故事",
  "笑话",
  "有一次",
  "有一天",
  "一天",
  "忽然",
  "突然",
  "不料",
  "结果",
  "后来",
  "最后",
  "原来",
  "问",
  "答",
  "说",
  "讲",
  "骂",
  "哭",
  "杀",
  "逃",
  "打",
  "骗",
  "偷",
  "抓",
  "跪",
  "求",
  "死",
  "梦",
  "醒",
  "嫁",
  "娶",
  "皇帝",
  "太后",
  "公主",
  "将军",
  "和尚",
  "妓女",
  "监狱",
  "坐牢",
  "轶事",
  "趣闻",
  "典故",
  "寓言",
  "小孩",
  "儿子",
  "太太",
  "夫人",
  "父亲",
  "母亲",
  "老师",
  "学生",
  "医生",
  "律师"
];

const excludedByStandard = [
  "整集西安事变、孙立人案、蒋纬国案、殷海光案等连续历史或法律叙述，多数作为事件材料处理；只收其中能够单独复述并明显承担比喻功能的小故事。",
  "李敖自己的坐牢、打官司、节目来信、出版宣传、饭局应对、男女往事和《快意恩仇录》书中自述，按当前口径视为李敖自身事件或书籍宣传，不收入故事集。",
  "同一故事在不同集重复出现时，只取叙述更完整、故事信号更明确的一处；晏子献身求事取第150集，郭子仪故事取第45集，不重复收录。",
  "只作为词源、制度、名词或史实说明的材料不收；需有具体人物、行动、问答、反转或结果，并被李敖拿来说明道理。",
  "节目中纯引文、名单、判决书、报刊材料、来信摘录、图像说明和人物履历不收，除非李敖把它讲成了完整掌故或笑话。"
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
  if (/故事|笑话|轶事|趣闻|典故|寓言|有一次|有一天/u.test(paragraph)) score += 6;
  if (/问|答|说|讲/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/哭|杀|逃|打|骗|偷|抓|跪|求|死|梦|醒|嫁|娶/u.test(paragraph)) score += 2;
  if (
    /皇帝|太后|公主|将军|和尚|妓女|监狱|坐牢|小孩|儿子|太太|夫人|父亲|母亲|老师|学生|医生|律师/u.test(
      paragraph
    )
  ) {
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
        /故事|笑话|有一次|有一天|忽然|突然|不料|结果|后来|最后|原来|问|答|说|讲|骂|哭|杀|逃|打|骗|偷|抓|跪|求|死|梦|醒|嫁|娶|皇帝|太后|公主|将军|和尚|妓女|监狱|坐牢|轶事|趣闻|典故|寓言|小孩|儿子|太太|夫人|父亲|母亲|老师|学生|医生|律师/u.test(
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
  const proofreadAddLines = proofreadAdds.map((item) => `- ${item}`);
  const lines = [
    "# 李敖笑傲江湖故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 校对轮删除：${manifest.proofreadDropCount} 条`,
    `- 校对轮补入：${manifest.proofreadAddCount} 条`,
    `- 校对轮保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖笑傲江湖》是节目逐字稿，谈话里材料密度高，但也混有大量时政连续叙述、书籍宣传、个人经历和法律材料。本轮只收李敖讲出来、可独立复述、并明显用来说明一个道理的小故事：寓言、笑话、掌故、人物短事或有反转的历史片段。李敖自己的事件、纯资料、判决书/来信/名单、整段政论和没有故事动作的例证不收。",
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
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，得到 ${manifest.candidateCount} 条机器候选。`,
    `- 校对轮保留 ${validation.count} 条；故事正文未改写，均按源文原段或段内原文截取。`,
    "- 补完整“屈突通半截忠臣”的后续归唐段落，使故事闭合；“空饼”笑话删去前置望梅止渴说明，只留笑话本体。",
    "- 对节目中的重复讲法作了去重，同一故事只留一个更适合作为故事条目的版本。",
    "- 对长段时政叙述中的故事，只截取故事本体与必要收束，不把前后评论全并入正文。",
    "- 显著依赖李敖自身经历的条目，即使好玩，也暂不收入。",
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
  if (proofreadAddLines.length) {
    lines.push("", "## 校对轮补入", "", ...proofreadAddLines);
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
    proofreadAddCount: proofreadAdds.length,
    proofreadAdds,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖在节目中讲成可独立复述、带人物行动或问答反转、并用来说明道理的小故事；排除李敖自身事件、纯时政连续叙述、法律材料、来信摘录、书籍宣传、名单和无故事动作的例证。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `校对轮保留 ${rows.length} 条；删除 ${proofreadDrops.size} 条边缘材料，补入 ${proofreadAdds.length} 条漏收掌故。`,
      "故事正文未改写，均按源文原段或段内原文截取。",
      "补完整屈突通故事后半段，收窄空饼笑话前置说明。",
      "重复讲过的同一故事只取一处。",
      "长段节目评论只截取故事本体，不把评论扩成事件条目。"
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
