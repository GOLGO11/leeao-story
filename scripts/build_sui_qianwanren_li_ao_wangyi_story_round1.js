const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "虽千万人，李敖往矣";
const SLUG = "sui_qianwanren_li_ao_wangyi";
const ROUND = "story_round1";
const ID_PREFIX = "SQWLW";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "sui_qianwanren_li_ao_wangyi_story_round1.md");

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
  "shangshan_shangshan_ai",
  "hongse_11",
  "xuni_de_shiqisui",
  "yangwei_meiguo",
  "di_73_lieshi",
  "aiqing_de_mimi",
  "li_ao_de_qingshi",
  "li_yulu",
  "li_ao_yulu",
  "sui_qianwanren_li_ao_wangyi"
];

const selections = [
  {
    prefix: "001",
    paragraph: "106",
    title: "皇上玩过的屁股",
    start: "旧笑话书载：一人犯法",
    end: "这笑话彰显了屁股的地位。"
  },
  {
    prefix: "002",
    paragraph: "13",
    title: "俞大维问投降过来怕不怕",
    start: "伪国防部长俞大维到金门前线",
    end: "投降的敌人，有时比作战的更可怕。"
  },
  {
    prefix: "003",
    paragraph: "9",
    title: "张三李四竞选",
    start: "一个选举笑话是",
    end: "所以李四当选了。"
  },
  {
    prefix: "005",
    paragraph: "120",
    title: "萧振瀛窗口说卖国争时间",
    start: "七七事变前",
    end: "他们才有机会在这里爱国！”"
  },
  {
    prefix: "005",
    paragraph: "155",
    title: "劳顿让小孩弹琴回敬鲁宾斯坦",
    start: "大钢琴家鲁宾斯坦（Arthur Rubinstein）请大明星查理士劳顿",
    end: "下次请到我家，我叫小孩弹琴给你听。"
  },
  {
    prefix: "006",
    paragraph: "18",
    title: "母狮子用午餐同小狮子别离",
    start: "失群的母狮子",
    end: "动物比我们更会别离。"
  },
  {
    prefix: "006",
    paragraph: "60",
    title: "前排让座给听不到的人",
    start: "看过一个笑话。",
    end: "我听得到，我这位子让给你。”"
  },
  {
    prefix: "009",
    paragraph: "55",
    title: "艾森豪威尔不抽烟",
    start: "有人问艾森豪威尔（IKE）",
    end: "感想是我有毅力，他们没有。”"
  },
  {
    prefix: "012",
    paragraph: "46",
    title: "牛牢不跟帝王做朋友",
    start: "汉光武刘秀做学生时",
    end: "大丈夫不跟帝王做朋友。”"
  },
  {
    prefix: "012",
    paragraph: "70",
    title: "周恩来留下武则天坟给别人挖",
    start: "考古家们要挖武则天的坟",
    end: "留下点给别人做吧。"
  },
  {
    prefix: "012",
    paragraph: "85",
    title: "王徽之乘兴访戴",
    start: "公元4世纪。",
    end: "何必见戴？”"
  },
  {
    prefix: "013",
    paragraph: "4",
    title: "小牛藏屠刀救母牛",
    start: "梁章钜《楹联丛话》里",
    end: "弱者以弱为强，强就是遮盖。"
  },
  {
    prefix: "013",
    paragraph: "25",
    title: "宋徽宗忍不住笑西字脸",
    start: "按中国相法",
    end: "宋徽宗就忍不住哈哈大笑。"
  },
  {
    prefix: "014",
    paragraph: "64",
    title: "徐志摩把口渴译成三十岁",
    start: "徐志摩翻译小说",
    end: "被他翻成“我三十岁了给我个苹果”。"
  },
  {
    prefix: "015",
    paragraph: "67",
    title: "齐白石误以为毛主席来共他产",
    start: "1949开国后",
    end: "请共产党开恩！”"
  },
  {
    prefix: "019",
    paragraph: "40",
    title: "心理医生治好张三的难为情",
    start: "张三尿失禁",
    end: "我有了新职业，我在中央台。"
  },
  {
    prefix: "026",
    paragraph: "79",
    title: "牙医女儿判钱早晚是我的",
    start: "一位牙医白手起家",
    end: "钱早晚是我的！”"
  },
  {
    prefix: "032",
    paragraph: "73",
    title: "俞国华革命艰难变狗命",
    start: "蒋介石御用大臣俞国华",
    end: "俞国华的原音是“我们的革命是艰难的”。"
  },
  {
    prefix: "034",
    paragraph: "30",
    title: "齐白石后人不拆穿假画",
    start: "难友刘辰旦喜欢中国书画",
    end: "一拆穿，我们真的也卖不掉了。”"
  },
  {
    prefix: "036",
    paragraph: "63",
    title: "狼吃羊怪祖先弄脏河水",
    start: "伊索寓言说狼要吃羊",
    end: "狼说可是你的祖先在上游过。"
  },
  {
    prefix: "043",
    paragraph: "3",
    title: "小狗追火车",
    start: "小火车站站长养了小狗",
    end: "万一它真的追上了，可把火车怎么办。）"
  },
  {
    prefix: "043",
    paragraph: "37",
    title: "邓小平送一千万移民给卡特",
    start: "国民党伪外交部长出版《钱复回忆录》",
    end: "“吓得卡特立即乱以他语。”"
  },
  {
    prefix: "046",
    paragraph: "57",
    title: "方士代吃饭",
    start: "清朝王渔洋《池北偶谈》讲到一个故事",
    end: "太邪门了。"
  },
  {
    prefix: "048",
    paragraph: "19",
    title: "喝尿娶妻成屄大王",
    start: "一男苦恋一女",
    end: "中间坐个屄大王。”"
  }
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("005."));
  if (!categoryDir) throw new Error("Cannot find poetry category directory");
  const bookDir = fs
    .readdirSync(path.join(ROOT, corpusDir, categoryDir))
    .find((name) => name.startsWith("005."));
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
  if (startIndex < 0) throw new Error(`Start marker not found for ${selection.title}`);
  const endIndex = source.indexOf(selection.end, startIndex);
  if (endIndex < 0) throw new Error(`End marker not found for ${selection.title}`);
  const text = source.slice(startIndex, endIndex + selection.end.length).trim();
  return {
    text,
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
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
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
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const text = rows
    .map((row) =>
      [
        `【${row.id}】${row.title}`,
        `书名：${row.book}`,
        `来源：${row.source_file}：${row.source_lines}`,
        "",
        row.story_text
      ].join("\n")
    )
    .join("\n\n---\n\n");
  fs.writeFileSync(filePath, `${text}\n`, "utf8");
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

function compareBookFiles(a, b) {
  const slugA = path.basename(path.dirname(a));
  const slugB = path.basename(path.dirname(b));
  const orderA = BOOK_ORDER.indexOf(slugA);
  const orderB = BOOK_ORDER.indexOf(slugB);
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

function validateSourceMatches(rows) {
  const sourceCache = new Map();
  return rows
    .filter((row) => {
      if (!sourceCache.has(row.source_file)) {
        sourceCache.set(row.source_file, normalizeText(readSource(row.source_file)));
      }
      return !sourceCache.get(row.source_file).includes(normalizeText(row.story_text));
    })
    .map((row) => row.id);
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
    throw new Error(
      `Duplicate story ids in aggregate: ${duplicateIds.map((row) => row.id).join(", ")}`
    );
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

  return {
    rows,
    books,
    duplicateTextIds: duplicateTextPairs(rows)
  };
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

function writeNotes(rows, validation, aggregate) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 虽千万人，李敖往矣故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    "- 候选扫描：notes/sui_qianwanren_li_ao_wangyi_candidate_scan.tsv",
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《虽千万人，李敖往矣》是微博/脸书短文合集，很多段落是李敖自己的近事、政治时评、短句机锋或材料摘录。校对轮继续收紧：只保留能独立讲出来、带动作转折和收束的外部小故事、笑话、寓言、文学/历史掌故；正文使用源文原句，必要时裁去同段中的自我发挥、政治尾评或重复议论。",
    "",
    "## 保留条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 已在总表出现的同题故事不重复：清教徒让仆人打海盗、闯红灯只怕警察、老祖母转念回忆孙女、桑塔耶那阳春有约、国父不死还有精神、苏轼佛印与苏小妹、大嫂上花轿等。",
    "- 李敖自身经历、家事、现场目击和朋友圈应酬不收：李放看狗交配、小女儿假装报警、母亲不出门、前妻拍戏说哭就哭、陈文茜电视回嘴、乞丐握手、李敖拒做美国人等。",
    "- 纯政治时事、案情材料、政党骂战和人物评语不收：柯震东道歉、太阳花判决、公民不服从辨析、党派选举事件、核武评论、灌肠传闻等。",
    "- 只有典故名、格言、单句比喻、概念解释，或只是举例而没有动作转折的段落不收。",
    "",
    "## 校对处理",
    "",
    "- 自动候选扫描覆盖 56 个源文件；候选多来自 2011 年和 2013-2017 年短文。",
    "- 从提取轮 29 条缩为 24 条。",
    "- 删除“小孩绊倒要妈妈打板凳”：原段是临时政治比喻，故事动作过薄。",
    "- 删除“薛起文躲浴室听蝴蝶夫人”：属李敖朋友圈听闻和现场反应，校对轮按社交逸事排除。",
    "- 删除“小惦儿跟公共汽车跑”：笑话核心依赖李敖自我应答，校对轮按自我插入项排除。",
    "- 删除“欧替斯被惊雷击中”“罗斯过马路成最后一面”：更像人物事件或场景感想，不作为故事新增。",
    "- 收窄“艾森豪威尔不抽烟”：删除“这个小故事，影响了我一生”这句自我说明，只留问答核心。",
    "- 同一故事在书内重复时只留较完整的一条，例如小狗追火车留 043.2016年6月 版本，清教徒海盗因前书已收不再入库。",
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
    status: "校对轮",
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    selectionCount: selections.length,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "微博短文只保留未在总表出现、能独立复述的外部小故事、笑话、寓言和文学/历史掌故；排除李敖自身经历、家事、现场应酬、政治案情、材料链、短句格言、纯论证例子和同题重复故事。",
    excludedByStandard: [
      "李敖自己的牢狱、家事、近事、现场目击和应酬不收。",
      "政治时事案情、政党骂战、人物评语和材料链不收。",
      "前书已经收录的同题故事不重复。",
      "只有典故名或单句比喻而没有情节转折的段落不收。"
    ],
    extractionNotes: [
      "候选扫描覆盖全书 56 个源文件，自动候选 926 条。",
      "提取轮从候选中保留 29 条外部故事、笑话、寓言或掌故。",
      "校对轮删除 5 条边界项，保留 24 条。",
      "多个条目裁去同段政治尾评或自我说明，只保留原文故事核心。",
      "清教徒海盗、闯红灯、老祖母、桑塔耶那、国父不死、苏轼佛印、大嫂花轿等同题故事已在前书入库，本轮不重复。"
    ],
    proofreadNotes: [
      "删除小孩打板凳、薛起文听蝴蝶夫人、小惦儿跟公共汽车跑、欧替斯被惊雷击中、罗斯过马路成最后一面。",
      "收窄艾森豪威尔不抽烟，去掉李敖自我影响说明。",
      "保留项均为外部故事、笑话、寓言或文学历史掌故。"
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
  writeNotes(rows, validation, aggregate);

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
        sourceFileCount: manifest.sourceFiles.length,
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
