const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "上山·上山·爱";
const SLUG = "shangshan_shangshan_ai";
const ROUND = "story_round1";
const ID_PREFIX = "SSSA";
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
  "bobo_song",
  "li_ao_quanji",
  "jiaoyu_yu_lianpu",
  "wenhua_lunzhan_danhuolu",
  "wei_zhongguo_sixiang_quxiang_qiu_daan",
  "shangxia_gujin_tan",
  "shilun_xinyu",
  "qiushi_xinyu",
  "woshi_tiananmen",
  "ni_shi_jingfumen",
  "wei_ziyou_zhaohun",
  "ni_bendan_ni_bendan",
  "wo_mengsui_suoyi_wo_mengxing",
  "li_ao_xinkan",
  "qianqiu_wansui_wuya_qiushi_heji",
  "li_ao_zawenji",
  "qianqiu_wansui_bianwaiji",
  "beijing_fayuansi",
  "shangshan_shangshan_ai"
];

const selections = [
  {
    prefix: "002",
    title: "孔子见麒麟说吾道穷",
    paragraphs: [183],
    start: "孔夫子七十一岁时候",
    end: "不久就死了。"
  },
  {
    prefix: "002",
    title: "闯红灯只怕警察",
    paragraphs: [374],
    start: "说一个人开车",
    end: "答案竟是：‘我没看到警察。’"
  },
  {
    prefix: "002",
    title: "张籍还君明珠",
    paragraphs: [533],
    start: "诗里写一个有夫之妇",
    end: "恨不相逢未嫁时。’"
  },
  {
    prefix: "002",
    title: "法非愚斯救泰绮思",
    paragraphs: [877],
    start: "法国文学家法朗士",
    end: "只有在地上有生命的一切的爱情才是真实的。’"
  },
  {
    prefix: "002",
    title: "和尚捅破鼓皮",
    paragraphs: [877],
    start: "有一个笑话说，有一座庙",
    end: "原来鼓皮都给捅破了。"
  },
  {
    prefix: "002",
    title: "陶望三拒绝狐女试探",
    paragraphs: [877],
    start: "《聊斋志异》中有《小谢》一篇",
    end: "不理她们。"
  },
  {
    prefix: "002",
    title: "阎王爷安排富贵托生",
    paragraphs: [897],
    start: "笑话不是说，一个人死了",
    end: "我也不做阎王爷了。"
  },
  {
    prefix: "002",
    title: "程颢心中却无妓",
    paragraphs: [1046],
    start: "宋朝程颢就是程明道",
    end: "承认自己境界不如哥哥高。"
  },
  {
    prefix: "002",
    title: "妇产科医生叫人先脱衣",
    paragraphs: [1412]
  },
  {
    prefix: "002",
    title: "美男子市长与女记者",
    paragraphs: [1567],
    start: "一个美男子，做了市长",
    end: "脱光我干嘛？"
  },
  {
    prefix: "002",
    title: "马克吐温双胞胎淹死",
    paragraphs: [1574],
    start: "美国幽默大师马克·吐温",
    end: "而我本人，却是当时被淹死的那位。’"
  },
  {
    prefix: "002",
    title: "八国联军士兵逛中药铺",
    paragraphs: [1606],
    start: "清朝末年",
    end: "我的最大。’"
  },
  {
    prefix: "002",
    title: "旅馆主人看驴一哭一笑",
    paragraphs: [1608],
    start: "有一个与驴有关的笑话。",
    end: "真的比它的大！"
  },
  {
    prefix: "002",
    title: "五官争位眉毛压阵",
    paragraphs: [1869],
    start: "有一个笑话说，一天，人脸上的五官忽然不和",
    end: "你能像个人样，就幸亏有我！’"
  },
  {
    prefix: "002",
    title: "双重否定没有铅笔",
    paragraphs: [1923],
    start: "有个小男孩",
    end: "那铅笔都到哪里去了呢？’"
  },
  {
    prefix: "002",
    title: "陶渊明斜眼派汉学家",
    paragraphs: [1957],
    start: "例如一个汉学家断言陶渊明",
    end: "当然，斜眼也表示是偏见。"
  },
  {
    prefix: "002",
    title: "法国人与美国人找不到老爸爸",
    paragraphs: [1957],
    start: "美国人向法国人开玩笑",
    end: "也找不到老爸爸了。"
  },
  {
    prefix: "002",
    title: "桑塔耶那阳春有约",
    paragraphs: [2032],
    start: "记得西班牙籍的美国哲学家桑塔耶那",
    end: "八十九岁死在罗马。"
  },
  {
    prefix: "002",
    title: "张翰想鲈鱼辞官",
    paragraphs: [2036],
    start: "张翰在外面做大官",
    end: "立刻就不干了。"
  },
  {
    prefix: "002",
    title: "纪晓岚写吴先生与女狐仙",
    paragraphs: [2307],
    start: "清朝纪晓岚",
    end: "也不再找妓女了。"
  },
  {
    prefix: "002",
    title: "老祖母转念忘情",
    paragraphs: [2324],
    start: "一个老祖母死了小孙女",
    end: "那一转，就是‘太上忘情’。"
  },
  {
    prefix: "002",
    title: "王阳明山中花树",
    paragraphs: [2410],
    start: "明朝的王阳明《传习录》中有一个故事",
    end: "不在尔的心外。’"
  },
  {
    prefix: "002",
    title: "县太爷抓狗屁家属",
    paragraphs: [2537],
    start: "有一个又糊涂又凶得要命的县太爷",
    end: "现在拿得家属在此！"
  },
  {
    prefix: "002",
    title: "木材商只卖牙签",
    paragraphs: [2537],
    start: "有个卖木材的商人",
    end: "我是卖牙签的。"
  },
  {
    prefix: "002",
    title: "梁鼎芬夜里呻吟",
    paragraphs: [2559],
    start: "清朝的梁鼎芬",
    end: "喝之乃悟’"
  },
  {
    prefix: "002",
    title: "国父不死还有精神",
    paragraphs: [2565],
    start: "老粗总司令在司令台上",
    end: "‘还有精神！’"
  },
  {
    prefix: "002",
    title: "冒辟疆与董小宛",
    paragraphs: [2580],
    start: "最有名的例子是清朝冒辟疆与董小宛的故事。",
    end: "多动人？"
  },
  {
    prefix: "002",
    title: "苏武妻十九年改嫁",
    paragraphs: [2592],
    start: "记得汉朝苏武吗？",
    end: "他的情人太太改嫁了。"
  },
  {
    prefix: "004",
    title: "密罗老运动员死在橡树里",
    paragraphs: [186],
    start: "纪元前六世纪",
    end: "狂劈橡木而死。"
  },
  {
    prefix: "004",
    title: "王景文饮毒酒不劝人",
    paragraphs: [430],
    start: "南北朝时宋明帝要死了",
    end: "就从容死了。"
  },
  {
    prefix: "004",
    title: "哥白尼临死校新书",
    paragraphs: [444],
    start: "十六世纪波兰天文学家哥白尼",
    end: "突然死了。"
  },
  {
    prefix: "004",
    title: "王安石墓前扁舟",
    paragraphs: [501],
    start: "宋朝王安石有一首向他死去女儿道别的诗",
    end: "爸爸老了，不会再来了。"
  },
  {
    prefix: "004",
    title: "富兰克林避雷针被教堂反对",
    paragraphs: [584],
    start: "当富兰克林（Fanklin）发明避雷针以后",
    end: "因为它阻止了上帝对坏人天打雷劈。"
  }
];

const decoder = new TextDecoder("gb18030");
const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖导航站",
  "油管/抖音"
];

function findDirectory(parent, predicate, label) {
  const entry = fs
    .readdirSync(parent, { withFileTypes: true })
    .find((item) => item.isDirectory() && predicate(item.name));
  if (!entry) throw new Error(`Directory not found: ${label}`);
  return path.join(parent, entry.name);
}

const SOURCE_ROOT = findDirectory(
  findDirectory(
    findDirectory(ROOT, (name) => name.includes("6.0"), "source corpus"),
    (name) => name.startsWith("004."),
    "category 004"
  ),
  (name) => name.startsWith("002."),
  "book 002"
);

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function resolveSourceFile(prefix) {
  const file = fs.readdirSync(SOURCE_ROOT).find((name) => name.startsWith(`${prefix}.`));
  if (!file) throw new Error(`Source file not found for prefix ${prefix}`);
  return file;
}

function readSource(fileName) {
  return decoder.decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName))).replace(/\r\n/g, "\n");
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

function sourceId(prefix, paragraph) {
  return `${ID_PREFIX}_${prefix}_${paragraph.index}`;
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
  return selections.map((selection, index) => {
    const fileName = resolveSourceFile(selection.prefix);
    const paragraphs = getParagraphs(fileName, cache).filter((paragraph) =>
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
      source_ids: paragraphs.map((paragraph) => sourceId(selection.prefix, paragraph)).join(";"),
      source_file: fileName,
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
      `# ${row.id} ${row.title}`,
      `book: ${row.book}`,
      `source: ${row.source_file}:${row.source_lines}`,
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

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
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

function bookSortParts(filePath) {
  const slug = path.basename(path.dirname(filePath));
  const index = BOOK_ORDER.indexOf(slug);
  return index >= 0 ? [0, index, slug] : [1, BOOK_ORDER.length, slug];
}

function compareBookFiles(leftFile, rightFile) {
  const left = bookSortParts(leftFile);
  const right = bookSortParts(rightFile);
  if (left[0] !== right[0]) return left[0] - right[0];
  if (left[1] !== right[1]) return left[1] - right[1];
  return String(left[2]).localeCompare(String(right[2]));
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
    .map((entry) => path.join(dataBooksDir, entry.name, `${ROUND}.csv`))
    .filter((filePath) => fs.existsSync(filePath))
    .sort(compareBookFiles);

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

  return {
    rows,
    books,
    duplicateTextIds: duplicateTextPairs(rows)
  };
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, "");
}

function validateSourceMatches(rows) {
  const sourceCache = new Map();
  return rows
    .filter((row) => {
      if (!sourceCache.has(row.source_file)) {
        sourceCache.set(row.source_file, normalizeText(stripFooter(readSource(row.source_file))));
      }
      return !sourceCache.get(row.source_file).includes(normalizeText(row.story_text));
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
    status: "校对轮",
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    selectionCount: selections.length,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "本书为小说，本轮不拆主线人物事件，只收小说中由叙述者或人物明确讲出的嵌入故事、笑话、寓言、文学掌故与历史轶事；已在总表收入的同题故事不重复收。",
    excludedByStandard: [
      "叶葇、作家大学生、小葇与叙述者的主线相识、交往、争执、病痛、坐牢、重逢等情节不作为故事条目。",
      "李敖自己的山居、牢狱、朋友、政治处境、案情和白色恐怖案例链属于人物事件或材料说明，本轮不收。",
      "玻璃鲶、鲶鱼上竹、太原五百完人、韩凭何氏、介之推、鲁仲连、庖丁解牛等只是类比或典故标签，正文未讲成独立小故事者不收。",
      "强奸犯与屁股互推责任等过薄、过脏且只作插科打诨的段子，本轮暂不收。",
      "白石先生不愿升天、猫和爱神、李夫人拒见汉武帝、延州妓女菩萨化身、锁骨菩萨墓、穷秀才打和尚、英国大学蛮人用叉子吃人肉、周世宗毁佛铸钱、虞愿说湘宫寺无功德、唐太宗哭别侯君集等已在总表收入，本轮不重复收。"
    ],
    extractionNotes: [
      "候选扫描覆盖楔子、三十年前、二十年前、三十年后与写作说明；写作说明只有创作解释和主线说明，未新增可独立复述的小故事。",
      "第一部保留孔子见麒麟、闯红灯笑话、张籍《节妇吟》、泰绮思、鼓皮笑话、聊斋《小谢》、阎王托生、两程、妇产科、马克吐温、八国联军、驴哭驴笑、五官争位等嵌入故事。",
      "第一部后段保留语法笑话、陶渊明斜眼派、法美老爸爸笑话、桑塔耶那、张翰、纪晓岚女狐、太上忘情、王阳明花树、县太爷狗屁、牙签木材、梁鼎芬、国父不死、冒辟疆董小宛、苏武妻等独立段子或掌故。",
      "第三部保留密罗老运动员、王景文饮毒酒、哥白尼临死校书、王安石墓前扁舟、富兰克林避雷针等非主线嵌入故事。"
    ],
    proofreadDropCount: 0,
    proofreadDrops: [],
    proofreadTrimCount: 21,
    proofreadTrims: [
      "裁去孔子、闯红灯、两程、马克吐温、桑塔耶那、张翰、哥白尼等条目的对话引子或作者回钩。",
      "裁去美男子市长、八国联军、驴哭驴笑、王景文、富兰克林等条目中接回小说主线的评语尾巴。",
      "补齐张籍、泰绮思、五官争位、马克吐温等条目的原文引号终点。",
      "收窄冒辟疆与董小宛、梁鼎芬夜里呻吟、密罗老运动员等条目到故事本体。"
    ],
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");

  if (!validation.ok) {
    throw new Error(`Validation failed for ${BOOK}: ${JSON.stringify(validation)}`);
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
