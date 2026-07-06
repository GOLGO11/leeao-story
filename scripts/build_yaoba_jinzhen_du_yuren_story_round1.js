const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "要把金针度与人";
const SLUG = "yaoba_jinzhen_du_yuren";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "YBJZDYR";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;

const selections = [
  {
    prefix: "001",
    paragraph: 20,
    title: "徐陵沉掉魏收文集",
    start: "《隋唐嘉话》里有这样一段",
    end: "实在该适度予以水葬才好！"
  },
  {
    prefix: "003",
    paragraph: 41,
    title: "刘勰装卖书求沈约推荐",
    start: "《文心雕龙》写成以后",
    end: "才变成名著。"
  },
  {
    prefix: "003",
    paragraph: "44-45",
    title: "刘知几少时批史后来证实",
    start: "刘知几（661-721）",
    end: "难与之言……"
  },
  {
    prefix: "004",
    paragraph: 28,
    title: "吕不韦奇货可居",
    start: "吕不韦（？-前235）",
    end: "家僮万人。"
  },
  {
    prefix: "004",
    paragraph: 29,
    title: "吕不韦悬赏一字千金",
    start: "《吕氏春秋》是吕不韦的食客",
    end: "当然要杂啊！"
  },
  {
    prefix: "004",
    paragraph: 37,
    title: "扬雄跳楼避案摔伤",
    start: "扬雄四十岁后",
    end: "白白摔得鼻青眼肿一场。"
  },
  {
    prefix: "004",
    paragraph: 56,
    title: "仲长统看穿高干",
    start: "仲长统（179-220）",
    end: "大家都说仲长统有眼光。"
  },
  {
    prefix: "004",
    paragraph: 68,
    title: "周敦颐为冤狱辞官",
    start: "周敦颐（1017-1703）",
    end: "就辞职不干了。"
  },
  {
    prefix: "004",
    paragraph: 90,
    title: "陈亮醉言获赦",
    start: "陈亮前后下狱三次。",
    end: "所学益博”。"
  },
  {
    prefix: "004",
    paragraph: 115,
    title: "何心隐坐而不跪",
    start: "何心隐办了一所他理想中的学校",
    end: "年六十三岁。"
  },
  {
    prefix: "004",
    paragraph: 118,
    title: "李贽荣死诏狱成语谶",
    start: "李贽（1527-1602）",
    end: "“荣死诏狱，可以成就此生”的语谶。"
  },
  {
    prefix: "004",
    paragraph: 126,
    title: "李顒无师自学成名",
    start: "李顒（1629-1705）",
    end: "终于自修成为大学者。"
  },
  {
    prefix: "004",
    paragraph: 129,
    title: "李顒拒绝被抬床召见",
    start: "有一次，大官人特备车马",
    end: "放弃送他去“召见”。"
  },
  {
    prefix: "005",
    paragraph: 11,
    title: "董仲舒被学生误评入罪",
    start: "在这种师生关系中",
    end: "但他再也不敢谈灾异了。"
  },
  {
    prefix: "005",
    paragraph: 14,
    title: "韩愈谏迎佛骨被贬潮州",
    start: "唐宪宗听说凤翔法门寺的护国真身塔里有释迦文佛的指骨",
    end: "就放回来了。"
  },
  {
    prefix: "005",
    paragraph: 25,
    title: "范缜不买梁武帝围剿",
    start: "范缜（450-515？）",
    end: "自然有它历史的地位。"
  },
  {
    prefix: "005",
    paragraph: "36-37",
    title: "葛洪非欲为荣以有丹",
    start: "葛洪在石冰之乱时",
    end: "就出发了。"
  },
  {
    prefix: "006",
    paragraph: "7-8",
    title: "鲍叔牙知管仲",
    start: "管仲（约前719-前645）",
    end: "知我者鲍子也！"
  },
  {
    prefix: "006",
    paragraph: 24,
    title: "商鞅三说秦孝公",
    start: "公孙鞅（？-前338）",
    end: "听了几天，还要听。"
  },
  {
    prefix: "006",
    paragraph: 30,
    title: "秦始皇抢韩非",
    start: "韩非（约前280-前233）",
    end: "秦始皇统一了天下。"
  },
  {
    prefix: "006",
    paragraph: 68,
    title: "黄宗羲亲手报父仇",
    start: "黄宗羲的父亲黄尊素",
    end: "或刺伤、或刺死。"
  },
  {
    prefix: "006",
    paragraph: 114,
    title: "汪辉祖问案与罪人同哭",
    start: "他后来成为进士",
    end: "可见他感人之深。"
  },
  {
    prefix: "006",
    paragraph: 142,
    title: "洪亮吉四日由斩决到发配",
    start: "洪亮吉（1746-1809）",
    end: "九年后死去。"
  },
  {
    prefix: "006",
    paragraph: 151,
    title: "辜鸿铭一夕谈后归国",
    start: "辜汤生（1857-1928）",
    end: "回祖国了。"
  },
  {
    prefix: "010",
    paragraph: 10,
    title: "唐寅佯狂逃宁王",
    start: "唐寅年轻时候",
    end: "讽世以死。"
  },
  {
    prefix: "011",
    paragraph: 4,
    title: "司马相如子虚赋惊动汉武帝",
    start: "司马相如年轻时候",
    end: "就红起来了。"
  },
  {
    prefix: "011",
    paragraph: 5,
    title: "司马相如卓文君卖酒",
    start: "司马相如落魄时候",
    end: "死前一直是御用文人。"
  },
  {
    prefix: "011",
    paragraph: 11,
    title: "蔡邕叹董卓被杀入狱",
    start: "董卓掌权后",
    end: "年六十一岁。"
  },
  {
    prefix: "011",
    paragraph: 21,
    title: "陆机临刑叹华亭鹤唳",
    start: "陆机后来在晋朝做官",
    end: "正是指此。"
  },
  {
    prefix: "011",
    paragraph: 32,
    title: "江淹梦还五色笔",
    start: "江淹五十四岁时候",
    end: "这是一个有趣的故事。"
  },
  {
    prefix: "011",
    paragraph: 52,
    title: "苏轼乌台诗案死里逃生",
    start: "苏轼二十一岁时候",
    end: "不准离开。"
  },
  {
    prefix: "011",
    paragraph: 70,
    title: "归有光训话不判刑被管马",
    start: "中了进士，他去做长兴知县",
    end: "拉上马了。"
  },
  {
    prefix: "011",
    paragraph: 89,
    title: "郑板桥救难民丢官",
    start: "他中进士后，做了山东潍县的“七品官耳”",
    end: "清朝的生祠就不同了）。"
  },
  {
    prefix: "011",
    paragraph: 94,
    title: "全祖望十四岁砸奸将牌位",
    start: "全祖望（1705-1775）",
    end: "丢到池子里。"
  },
  {
    prefix: "011",
    paragraph: 107,
    title: "汪中当众批山长诗差",
    start: "汪中在扬州安定书院时",
    end: "何况诗又写得不好！"
  },
  {
    prefix: "011",
    paragraph: 181,
    title: "陈子昂送钱仍死狱中",
    start: "陈子昂三十四岁时候",
    end: "政治迫害，是黑暗政治上的一场冤狱。"
  },
  {
    prefix: "011",
    paragraph: 185,
    title: "王维凭凝碧池诗减刑",
    start: "王维“九岁知属辞”",
    end: "一直难以释怀。"
  },
  {
    prefix: "011",
    paragraph: 205,
    title: "李贺锦囊收诗",
    start: "每旦日出",
    end: "是儿要呕出心乃已耳！”"
  },
  {
    prefix: "011",
    paragraph: 219,
    title: "韦庄爱儿又穷怕",
    start: "韦庄（855-920）",
    end: "以小气出名。"
  },
  {
    prefix: "011",
    paragraph: 221,
    title: "韦庄爱人被夺后绝食",
    start: "韦庄四十四岁中进士",
    end: "乃绝食而死。"
  },
  {
    prefix: "011",
    paragraph: 293,
    title: "吴敬梓冬夜绕城暖足",
    start: "三十三岁后，他搬到南京",
    end: "这样死了。"
  },
  {
    prefix: "011",
    paragraph: "303-304",
    title: "刘鹗治河赈灾反得罪",
    start: "1888年，他三十二岁时候",
    end: "死在风中的迪化（今乌鲁木齐市——编者）。"
  },
  {
    prefix: "012",
    paragraph: 31,
    title: "班固私撰汉书两度下狱",
    start: "班固（32-92）",
    end: "死在牢里。"
  },
  {
    prefix: "012",
    paragraph: 37,
    title: "陈寿三国志令夏侯湛毁己书",
    start: "仕蜀为观阁令史",
    end: "于是诏下河南尹洛阳令，就家写其书。"
  },
  {
    prefix: "012",
    paragraph: 44,
    title: "司马光通鉴别人一页就困",
    start: "《资治通鉴》是宋神宗定的名字",
    end: "还是中国的名著。"
  },
  {
    prefix: "012",
    paragraph: 64,
    title: "崔述平反商船反被诬",
    start: "崔述（1740-1816）",
    end: "得以免议。"
  },
  {
    prefix: "012",
    paragraph: 68,
    title: "陈履和穷困刻老师书",
    start: "崔述在五十三岁时候",
    end: "没有比他再伟大的了。"
  },
  {
    prefix: "012",
    paragraph: "85-86",
    title: "郦道元瞋目叱贼而死",
    start: "郦道元（约472-527）",
    end: "色貌不改”！）"
  },
  {
    prefix: "012",
    paragraph: "96-99",
    title: "顾祖禹答父终身穷饿隐居",
    start: "顾祖禹（1624-1680）",
    end: "写了一部名著——《读史方舆纪要》。"
  },
  {
    prefix: "012",
    paragraph: 107,
    title: "范成大使金几被杀仍全节",
    start: "范成大（1126-1193）",
    end: "“竟得全节而归”。"
  }
];

const proofreadDrops = new Map([
  [
    "周敦颐为冤狱辞官",
    "只是人物小传中的节操短例，只有一句行动和一句引语，故事展开不足。"
  ],
  [
    "李顒无师自学成名",
    "母亲劝学加成名概述，更像励志小传，不单列。"
  ],
  [
    "范缜不买梁武帝围剿",
    "主体是思想论争概述，缺少具体场景和转折。"
  ],
  [
    "汪辉祖问案与罪人同哭",
    "好官小传，情节薄，偏人物评价。"
  ],
  [
    "韦庄爱人被夺后绝食",
    "一句悲剧结果，缺少故事展开。"
  ],
  [
    "班固私撰汉书两度下狱",
    "班固修史生平链条，偏人物履历。"
  ],
  [
    "崔述平反商船反被诬",
    "县令办案履历中的一例，未讲成可独立故事。"
  ],
  [
    "郦道元瞋目叱贼而死",
    "主要是被害经过和附带材料，偏遇害事件，不单列。"
  ]
]);

const candidateMarkers = [
  "故事",
  "有趣",
  "传说",
  "笑话",
  "掌故",
  "有一次",
  "忽然",
  "不料",
  "后来",
  "最后",
  "问",
  "答",
  "曰",
  "说",
  "告诉",
  "被捕",
  "下狱",
  "入狱",
  "自杀",
  "处死",
  "被杀",
  "辞官",
  "逃",
  "梦",
  "赦",
  "发配",
  "召见",
  "吕不韦",
  "扬雄",
  "董仲舒",
  "管仲",
  "鲍叔",
  "商鞅",
  "韩非",
  "唐寅",
  "蔡邕",
  "陆机",
  "苏轼",
  "李贺",
  "韦庄",
  "吴敬梓",
  "刘鹗",
  "班固",
  "陈寿",
  "郦道元",
  "顾祖禹"
];

const excludedByStandard = [
  "李敖自己的读书、出版、官司、交游事件不收。",
  "书目介绍、分类理论、版本说明、思想概述、著作评价和材料清单不收。",
  "只有一句名言、典故名或人物小传而缺少场景、行动、转折或后果者不收。",
  "与前书已有同一概念故事者尽量不重复收入，如陈梦雷、武则天惜骆宾王、文天祥答十七史、顾恺之、嵇康、郑思肖、司马迁、孔融、陶潜、叶德辉等。"
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("009."));
  if (!categoryDir) throw new Error("Cannot find history category directory");
  const bookDir = fs
    .readdirSync(path.join(ROOT, corpusDir, categoryDir))
    .find((name) => name.startsWith("004.") && name.includes(BOOK));
  if (!bookDir) throw new Error(`Cannot find source book directory for ${BOOK}`);
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

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^\d{3}\./u.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function splitParagraphs(source) {
  return source
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
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
  if (/故事|有趣|传说|笑话|掌故/u.test(paragraph)) score += 6;
  if (/问|答|曰|谓|说|告诉/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/吕不韦|扬雄|董仲舒|管仲|鲍叔|商鞅|韩非|唐寅|蔡邕|陆机|李贺|韦庄|刘鹗|郦道元/u.test(paragraph)) {
    score += 3;
  }
  if (/被捕|下狱|入狱|自杀|处死|被杀|辞官|逃|梦|赦|发配|召见/u.test(paragraph)) {
    score += 2;
  }
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphs(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.includes(marker));
      const quoteHeavy = (paragraph.match(/[“”]/gu) || []).length >= 6;
      const actionHeavy = /被捕|下狱|入狱|自杀|处死|被杀|辞官|逃|梦|赦|发配|召见/u.test(
        paragraph
      );
      if (!found.length && !quoteHeavy && !actionHeavy) return;
      rows.push({
        file: fileName,
        paragraph: index + 1,
        score: candidateScore(paragraph, found),
        markers: found.join("|"),
        text: paragraph.replace(/\s+/gu, " ").slice(0, 900)
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
  const lines = [
    "# 要把金针度与人故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮入选：${manifest.selectionCount} 条`,
    `- 校对轮删除：${manifest.proofreadDropCount} 条`,
    `- 校对轮入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《要把金针度与人》是《中国名著精华全集》的导读、书目提要与序文合集。校对轮继续压缩，只收李敖讲成可独立复述、带人物行动、对话、反转或明确后果，并用来说明读书方法、人物气节、制度荒谬、思想压迫、知识分子处境或书籍命运的小故事、书林掌故、传记轶事；删去偏人物履历、单句节操例证、思想论争概述、被害事件链和情节过薄的条目。",
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
    "- 《总类》《哲学类》《宗教类》《社会科学类》《文学类》《史地类》中大量作者小传、思想评价和书目介绍不收；只截取讲成故事的段落。",
    "- 《艺术类》里顾恺之两条、嵇康打铁不理钟会已在前书/总表出现，本轮只新增唐寅佯狂逃宁王。",
    "- 《应用技术类》里叶德辉春宫画防火已在总表出现；叶德辉殉道段偏传记事件，本轮未收。",
    "- 《中国名著精华全集》序以出版理念、分类法和版本观念为主，文天祥答十七史、尉缭子出土等相近内容前书已收，本轮未再重复。",
    "",
    "## 校对轮删除",
    "",
    ...proofreadDropLines,
    "",
    "## 提取与校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，得到 ${manifest.candidateCount} 条候选。`,
    `- 提取轮入选 ${manifest.selectionCount} 条，校对轮删除 ${manifest.proofreadDropCount} 条，保留 ${validation.count} 条。`,
    "- 故事正文未改写，均按源文原句截取；跨段条目保留原文换行。",
    "- 韩愈、葛洪、郑板桥、顾祖禹等条目截短到故事本体，删去传记铺垫、理论说明或书评尾巴。",
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
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "校对轮只收李敖讲成可独立复述、带人物行动、对话、反转或明确后果，并用来说明读书方法、人物气节、制度荒谬、思想压迫、知识分子处境或书籍命运的小故事、书林掌故、传记轶事；排除纯书目、版本、分类、思想概述、著作评价、材料清单、李敖自身事件、偏人物履历的事件链，以及前书已有同一概念故事。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `提取轮入选 ${selections.length} 条，校对轮删除 ${proofreadDrops.size} 条，保留 ${rows.length} 条。`,
      "故事正文未改写，均按源文原句截取。",
      "已主动排除前书已有的顾恺之、嵇康、郑思肖、司马迁、孔融、陶潜、叶德辉、武则天惜骆宾王、文天祥答十七史等同一概念故事。",
      "校对轮删除人物小传边界、思想论争概述、情节过薄或偏遇害事件的条目。",
      "韩愈、葛洪、郑板桥、顾祖禹等条目已截短到故事本体，去掉传记铺垫、理论说明或书评尾巴。"
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
