const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "千秋万岁乌鸦求是合集";
const SLUG = "qianqiu_wansui_wuya_qiushi_heji";
const ROUND = "story_round1";
const ID_PREFIX = "QQWSWYQS";
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
  "qianqiu_wansui_wuya_qiushi_heji"
];

const selections = [
  {
    prefix: "020",
    title: "孙中山交代翻译议事法则",
    paragraphs: [3]
  },
  {
    prefix: "028",
    title: "表弟二十岁混蛋四十岁",
    paragraphs: [3],
    start: "有一个笑话",
    end: "当然是四十岁！"
  },
  {
    prefix: "032",
    title: "宙斯不收毒蛇口中玫瑰",
    paragraphs: [20]
  },
  {
    prefix: "038",
    title: "郑思肖心史藏井三百五十六年",
    paragraphs: [3, 4, 5]
  },
  {
    prefix: "056",
    title: "阮籍送嫂子说礼岂为我设",
    paragraphs: [4],
    start: "晋朝阮籍的嫂子回娘家",
    end: "礼岂为我设邪？”（礼是给你们凡夫俗子订的，难道是为我订的吗？”）"
  },
  {
    prefix: "060",
    title: "僖负羁给流亡晋文公烧冷灶",
    paragraphs: [4],
    start: "晋文公在“未遇”时期",
    end: "这种够朋友，绝不是讲究现实的人干出来的。"
  },
  {
    prefix: "062",
    title: "刘章唱耕田歌锄吕家",
    paragraphs: [2, 3, 4, 5, 6, 7, 8],
    end: "第二年，吕后死了，刘章终于联合元老重臣，把吕家的人都给“锄而去之”了。"
  },
  {
    prefix: "087",
    title: "成大共党向假共产党致敬又取消",
    paragraphs: [11],
    start: "来了一批以成功大学学生为主",
    end: "弄得傻头傻脑的李荆荪糊里糊涂，搞不清忽来致敬忽又取消是怎么回事。"
  },
  {
    prefix: "087",
    title: "调查局干员说没来以前先剥你的皮",
    paragraphs: [12],
    start: "“成大共产党”在调查局被刑求"
  },
  {
    prefix: "087",
    title: "吴荣元没死就丢佛经看李敖书",
    paragraphs: [14],
    start: "“成大共产党”另一领袖吴荣元"
  },
  {
    prefix: "087",
    title: "台湾人捶棉被骂调查局",
    paragraphs: [15],
    start: "有一次，一个土头土脑的台湾人",
    end: "真可成立“棉被学说”了。"
  },
  {
    prefix: "099",
    title: "囚犯不要五分钟议员要",
    paragraphs: [4],
    start: "美国艾森豪威尔总统曾说过一个笑话",
    end: "因为我正在竞选议员。"
  },
  {
    prefix: "101",
    title: "阿兵哥睁闭眼都不会瞄准",
    paragraphs: [22],
    start: "阿兵哥多来自农村"
  },
  {
    prefix: "101",
    title: "老兵数钱买老婆一条腿一只胳臂",
    paragraphs: [34],
    start: "有的老兵拼命想成家"
  },
  {
    prefix: "101",
    title: "两批部队接力骗美军顾问",
    paragraphs: [37],
    start: "军中演习时有美军顾问来参观"
  },
  {
    prefix: "120",
    title: "尹俊喊成我们是总统的家长",
    paragraphs: [4],
    start: "尹俊将军做十七师师长"
  },
  {
    prefix: "120",
    title: "罗素抗议诺贝尔给错奖",
    paragraphs: [5],
    start: "英国哲学家罗素",
    end: "你们给错了。"
  },
  {
    prefix: "124",
    title: "颜延之说狂妄谁也学不到",
    paragraphs: [4],
    start: "他有一个大毛病"
  },
  {
    prefix: "124",
    title: "颜延之骂何尚之朽木难雕",
    paragraphs: [5]
  },
  {
    prefix: "124",
    title: "颜延之问何以呼我为公",
    paragraphs: [6]
  },
  {
    prefix: "125",
    title: "宋太祖让王著哭周世宗",
    paragraphs: [4]
  },
  {
    prefix: "129",
    title: "李鸿章不退职怕祸不测",
    paragraphs: [5],
    start: "亲贵多讽合肥",
    end: "非恋栈也，朝廷意欲予退久矣。）"
  },
  {
    prefix: "133",
    title: "俞大维不来立法院副部长也可不来",
    paragraphs: [11],
    start: "前国防部长俞大维"
  },
  {
    prefix: "160",
    title: "松下幸之助与德国一流商品同价",
    paragraphs: [3],
    end: "于是这笔生意便成交了。"
  },
  {
    prefix: "167",
    title: "尹仲容车中等母亲打牌",
    paragraphs: [3],
    start: "“我自己也"
  },
  {
    prefix: "167",
    title: "尹仲容拒讲同乡关系",
    paragraphs: [4],
    start: "“民国四十年秋天"
  },
  {
    prefix: "167",
    title: "尹仲容说大房子养蚊子",
    paragraphs: [6],
    start: "“尹仲容在台湾并没有财产"
  },
  {
    prefix: "167",
    title: "尹仲容退还兼职车马费",
    paragraphs: [7],
    start: "“尹兼三职"
  },
  {
    prefix: "167",
    title: "尹仲容说正想下台",
    paragraphs: [8],
    start: "“尹仲容绝少着新衣"
  },
  {
    prefix: "167",
    title: "尹仲容替部属担法院责任",
    paragraphs: [9],
    start: "“只要部属是真正的为公"
  },
  {
    prefix: "167",
    title: "尹仲容说知过不改才有损政府威信",
    paragraphs: [10],
    start: "“外贸会公布某些中药",
    end: "知过不改，才真正的有损政府威信。"
  },
  {
    prefix: "167",
    title: "尹仲容宁可不会耍政治",
    paragraphs: [10],
    start: "例如八七水灾之后",
    end: "我宁可不会耍。’"
  },
  {
    prefix: "167",
    title: "尹仲容旧车被撞仍不换新车",
    paragraphs: [11],
    start: "又说，‘他兼任台银董事长后",
    end: "不应该乱用一文钱。”"
  },
  {
    prefix: "177",
    title: "苏东坡写小蚁抱草叶相见",
    paragraphs: [8]
  },
  {
    prefix: "180",
    title: "克来闰斯戴老爸不跟黑匣子说话",
    paragraphs: [5],
    start: "克来闰斯戴（Clarice Day）笔下的他的老爸"
  },
  {
    prefix: "191",
    title: "酒保两杯马丁尼辨国籍",
    paragraphs: [2],
    start: "美国艾森豪做总统时候",
    end: "站起来讲演的就是美国人。”"
  },
  {
    prefix: "191",
    title: "谷正纲在迪斯尼乐园也想演讲",
    paragraphs: [6],
    start: "有一次他去美国公干",
    end: "谷正纲才算怏怏取消了一代名演说。"
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
    (name) => name.startsWith("003."),
    "category 003"
  ),
  (name) => name.startsWith("013."),
  "book 013"
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
      "本册政论、答辩、声明、书信、议会攻防、两岸时事与法律材料很多；凡只是现实案情、政治事件、制度批评、人物履历、材料摘录或李敖自述场景的段落，本轮不按故事收入。",
      "《思想不变，配革命吗？》中孙中山革命年限故事已在前册收入，本轮不重复。",
      "《“良心”并发症》六兄弟问心笑话已在前册收入，本轮不重复。",
      "《黑牢忆趣》中罗永黎神仙老虎狗、范子文打蚊子、高中生信宪法、叶迫理发、许性德刮马桶、黄中国上天堂投机等故事已在前册或总表收入，本轮不重复。",
      "《浮生一粲六续》侯榕生发觉方豪是神父、《浮生一粲七续》太轻了不算、《预官记趣》曹梓华请瞄高一点、尹俊嘉奖哨兵、老兵问蒋经国袜子、妓女拿连长帽子等故事已在前册或总表收入，本轮不重复。",
      "《叉子新论》英国大学蛮人用西餐叉吃人肉已在《为中国思想趋向求答案》收入，本轮校对删除。",
      "《林云无耻·华视无知》湖北人牵骆驼卖草药已在《上下古今谈》收入，本轮校对删除。",
      "《和胡茵梦有关的笑话》主要围绕李敖离婚、社交和诉讼的自我场景，本轮按李敖自身事件排除。",
      "《刘光头口中的逃难》《宁肯让法律和犯人一起逃掉》等篇幅虽有叙事，但主体是战争/政治事件链或案例材料，本轮排除。",
      "《尹仲容的一些轶事》“无钱应讯步行去法院”段落以听说与求证串成材料簇，不是单个完整故事，本轮校对删除。"
    ],
    extractionNotes: [
      "源目录含 192 篇正文与 1 个目录文件；候选扫描 860 段，提取轮收入 37 条，校对轮仍保留 37 条。",
      "收入标准继续按故事集口径执行：保留笑话、寓言、掌故、轶事、典故中有明确人物行动与转折、并被李敖用来说明意思的片段。",
      "故事正文从原文切出，尽量删除导语、评语、政论延伸和李敖自我插入；标题为检索用压缩标题。",
      "校对轮删除 3 条：2 条既有总表重复，1 条尹仲容材料簇不符合单个故事标准。",
      "校对轮补入 3 条尹仲容轶事：大房子养蚊子、知过不改才有损政府威信、宁可不会耍政治。",
      "校对轮收窄多条正文切口，删除编号、导语、评语、经营评论、政论延伸和故事后的说明。",
      "郑思肖《心史》、僖负羁烧冷灶、苏东坡小蚁、电话黑匣子等边界项经复核仍具备完整故事形态，保留。",
      "《黑牢忆趣》《预官记趣》里仅保留独立人物轶事或笑话；李敖只是叙述或旁观时保留，李敖自身事件链仍排除。",
      "《何须马丁尼！》篇末注称沈沉是李敖笔名，故两条演讲癖故事保留。"
    ],
    proofreadAddCount: 3,
    proofreadAdds: [
      "尹仲容说大房子养蚊子",
      "尹仲容说知过不改才有损政府威信",
      "尹仲容宁可不会耍政治"
    ],
    proofreadDropCount: 3,
    proofreadDrops: [
      "英国大学蛮人用西餐叉吃人肉",
      "湖北人牵骆驼卖草药",
      "尹仲容无钱应讯步行去法院"
    ],
    proofreadNotes: [
      "近似重复扫描发现英国大学蛮人用西餐叉吃人肉与 WZGSXQ001 重复，湖北人牵骆驼卖草药与 SXGJT002 重复，校对轮删除。",
      "尹仲容无钱应讯步行去法院一条包含三个听说求证事项，缺少单个故事结构，校对轮删除。",
      "尹仲容大房子养蚊子、知错即改、宁可不会耍政治三条有具体场景和回话，校对轮补入。",
      "多个条目仅作切口收窄，不改变是否保留：成大致敬取消、李鸿章不退职、松下幸之助定价、谷正纲迪斯尼乐园等。"
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
