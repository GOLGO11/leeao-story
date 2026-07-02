const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "千秋万岁编外集";
const SLUG = "qianqiu_wansui_bianwaiji";
const ROUND = "story_round1";
const ID_PREFIX = "QQWSBWJ";
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
  "qianqiu_wansui_bianwaiji"
];

const selections = [
  {
    prefix: "003",
    title: "戴季陶分菜给抢兔肉的录事",
    paragraphs: [17],
    start: "一次，这些录事见厨师端出戴吃剩的兔肉",
    end: "录事们得到一些恩赐，对戴颇有好感。"
  },
  {
    prefix: "003",
    title: "司机说戴季陶官邸应设太监",
    paragraphs: [20],
    start: "一次，戴季陶的公文包遗留在汽车内"
  },
  {
    prefix: "003",
    title: "门岗说没空理胡子",
    paragraphs: [24],
    start: "一次，戴瞥见一门岗胡子太长"
  },
  {
    prefix: "004",
    title: "张挺兄弟偷看革命头子孙中山",
    paragraphs: [5],
    start: "我当时年仅十三岁",
    end: "不过，几次短暂的见面却给我和哥哥留下极为深刻的美好印象。"
  },
  {
    prefix: "004",
    title: "张彪不见孙中山却迎溥仪",
    paragraphs: [6],
    start: "由于我父亲始终不肯放弃",
    end: "私谥“忠恪”二字。"
  },
  {
    prefix: "018",
    title: "胡适说艾略特诗只有自己懂",
    paragraphs: [2],
    start: "那时徐志摩住在中街",
    end: "希望你把他诗里的经典加点注疏，让我们了解了解。”"
  },
  {
    prefix: "018",
    title: "胡适劝教授回台湾免作无国籍人",
    paragraphs: [6],
    start: "有一天他和我在纽约同席",
    end: "我至今还记得。"
  },
  {
    prefix: "018",
    title: "胡适病中起床替学生借书",
    paragraphs: [7],
    start: "记得他第一次在美国得了心脏病",
    end: "到哥伦比亚大学图书馆去替他借一本中文善本书（普通人大概借不出来吧）。"
  },
  {
    prefix: "018",
    title: "胡适说丁文江又在做考据了",
    paragraphs: [8],
    start: "丁在君先生死了",
    end: "不觉自己微笑起来。"
  },
  {
    prefix: "021",
    title: "胡适对喊汉奸学生说屋里没有汉奸",
    paragraphs: [2],
    start: "当时他继孟邻先生之后上台训话",
    end: "始终保持着热心诚恳，恺悌慈祥的声音态度。"
  },
  {
    prefix: "021",
    title: "胡适忧华北国仍提醒穿外套",
    paragraphs: [3],
    start: "二十四年十一月二十号前后的某一晚上",
    end: "可是那语调的轻快，却将我心中的寒冷减少了。"
  },
  {
    prefix: "021",
    title: "胡适说老子又不是我的老子",
    paragraphs: [9],
    start: "他对于老子的年代问题",
    end: "看哪个合乎真理。"
  },
  {
    prefix: "022",
    title: "胡适骂榜德在伦敦不在纽约",
    paragraphs: [6],
    start: "第一次，在纽约",
    end: "他的嘻嘻哈哈又陶醉了我。"
  },
  {
    prefix: "022",
    title: "胡适骂黎东方轻诺寡信",
    paragraphs: [6],
    start: "第二次，在台北",
    end: "我气，然而不敢答辩。"
  },
  {
    prefix: "022",
    title: "胡适预约细说清朝又转送中研院",
    paragraphs: [9],
    start: "我之所以去南港",
    end: "说时，他长叹了好几次。"
  },
  {
    prefix: "028",
    title: "章太炎题三折肱后同游拍照",
    paragraphs: [12],
    start: "一次余编纂《中国药学大辞典》"
  },
  {
    prefix: "030",
    title: "马寅初说除非宪兵来请才见蒋介石",
    paragraphs: [13, 14],
    start: "一九四〇年初秋",
    end: "不能再劝。"
  },
  {
    prefix: "045",
    title: "李仙洲说三得不是三德",
    paragraphs: [8, 9, 10],
    start: "两人相互一笑之后",
    end: "才是三全其美。"
  },
  {
    prefix: "055",
    title: "慈禧因太监说杀马而杀人",
    paragraphs: [22],
    start: "慈禧太后晚年",
    end: "叫人把那名太监拖下去活活打死。"
  },
  {
    prefix: "057",
    title: "厨房失火学者仍看书",
    paragraphs: [3],
    start: "法国文艺复兴初期",
    end: "接着还是看他的书。"
  },
  {
    prefix: "057",
    title: "洛阳一席饭是三个孩子的身价",
    paragraphs: [11],
    start: "前年我从北平出来",
    end: "吃后往往连晚上也睡不了。"
  },
  {
    prefix: "057",
    title: "县官等托梦阴风救下一人",
    paragraphs: [21],
    start: "二十多年前，在北洋军阀的时代",
    end: "阴风大概是不再吹的了。"
  },
  {
    prefix: "069",
    title: "非洲国家脚踏车不用锁",
    paragraphs: [3],
    start: "在非洲一个新兴国家",
    end: "这样的国家太奇妙了。"
  },
  {
    prefix: "070",
    title: "难友低头放封被班长一拳",
    paragraphs: [43],
    start: "“怎么不会？”刘天照说",
    end: "这个大门！”"
  },
  {
    prefix: "070",
    title: "难友放封讲笑话也挨耳光",
    paragraphs: [46],
    start: "“还有呢？”刘天照道",
    end: "管理监狱的那些家伙是‘人’吗？”"
  },
  {
    prefix: "072",
    title: "王幸男扛中风苏志诚去医务所",
    paragraphs: [109],
    start: "苏志诚每星期两次都登记请医官看病",
    end: "这是不应该给抹杀掉的。"
  },
  {
    prefix: "078",
    title: "狼说我是狼你是羊",
    paragraphs: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    start: "改编的伊索寓言就可有这么一个故事：",
    end: "我可以吃你，这个理由已经足够了！”"
  }
];

const decoder = new TextDecoder("gb18030");
const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖研究网地址",
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
    (name) => name.startsWith("003."),
    "category 003"
  ),
  (name) => name.startsWith("015."),
  "book 015"
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
    status: "校对轮",
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    selectionCount: selections.length,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    excludedByStandard: [
      "本书主要是《千秋评论》相关外部署名文章、回忆录、政论、档案材料和案例文章；本轮只取其中可独立复述的短故事、轶事、寓言和笑话式片段。",
      "《蒋介石三失和平解决国共争端良机》《白崇禧在武汉与蒋介石的人事纠纷》《闻喜选举“国大”代表的黑幕》《有关CC点滴见闻录》《军统大特务马汉三之死》《白崇禧传》各篇主体是政治史和派系事件链，不按故事收入。",
      "《国民党特务机关的一所秘密监狱》《我所经历的蒋特三个集中营的内幕》《胡县长》《一场玩笑·两条人命》《火烧岛十载风霜》系列中大量段落是冤狱、刑讯、监狱生活和个案材料；只切出少数明确用来说明权力、荒谬或人物性格的小故事。",
      "《翁老板的故事》虽题为故事，但正文是营造业特权与工程腐败个案说明，不收入。",
      "《寻找女人》《胡适的生活和娱乐》《胡适的藏书和书斋》《头发政治述奇》等篇多为观点、习惯、资料或人物概述，未收。",
      "《胡适是什么样的学者？》中的胡适恋爱长段为传记绯闻叙述，篇幅长且更像人物材料链，提取轮暂不收入。",
      "《适之先生二三事》中胡适预支稿费让黎东方译书，主体是翻译出版项目和失信经过，校对轮删除。",
      "《马寅初先生在重庆大学》中叶元龙劝金国宝别请马寅初做次长，只有一句请托失败的概括，校对轮删除。"
    ],
    extractionNotes: [
      "源目录含 82 篇正文与 1 个目录文件；候选扫描 819 段，提取轮收入 29 条，校对轮保留 27 条。",
      "本轮收入集中在戴季陶、孙中山、胡适、章太炎、马寅初等人物轶事，另收少量寓言、讲演小故事和监狱回忆中的独立故事片段。",
      "《千秋万岁编外集》多为外部署名文章，本轮按“本书文本中出现的故事”处理；校对轮可进一步决定是否保留非李敖本人撰写文本中的故事。",
      "故事正文按原文切出，尽量删除导语、评论、人物概述、政论背景和长篇事件材料。",
      "对《火烧岛十载风霜》系列采取收窄标准，只保留两条“讲话/不讲话都挨打”的例证和一条王幸男助人轶事，排除作者自身连续经历与监狱案件链。",
      "校对轮删除 2 条，并收窄 1 条李仙洲“三得”故事的开头，去掉不必要的分组背景。"
    ],
    proofreadAddCount: 0,
    proofreadAdds: [],
    proofreadDropCount: 2,
    proofreadDrops: [
      "胡适预支稿费让黎东方译书",
      "叶元龙劝金国宝别请马寅初做次长"
    ],
    proofreadNotes: [
      "胡适预支稿费让黎东方译书偏向出版项目、翻译计划和失信材料链，不像独立小故事，删除。",
      "叶元龙劝金国宝别请马寅初做次长只有请托失败的概括句，故事动作不足，删除。",
      "李仙洲说三得不是三德保留，但正文从“两人相互一笑之后”开始，减少不必要的分组背景。"
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
