const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "一个预备军官的日记";
const SLUG = "yige_yubei_junguan_de_riji";
const ROUND = "story_round1";
const ID_PREFIX = "YYJGDRJ";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "yige_yubei_junguan_de_riji_story_round1.md");

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
  "sui_qianwanren_li_ao_wangyi",
  "tiaozhan_li_ao_ao_yulu",
  "daxue_zhaji",
  "zaonian_riji",
  "daxue_houqi_riji_jiaji",
  "daxue_houqi_riji_yiji",
  "yige_yubei_junguan_de_riji"
];

const selections = [
  {
    prefix: "010",
    paragraph: "104-105",
    title: "帮老人劈柴后才有偷闲",
    start: "在陈先生处见到一书名The Idle Thoughts",
    end: "终日闲居无事，则无所谓“偷”了。"
  },
  {
    prefix: "011",
    paragraph: "257",
    title: "预训班言语不检挡住出国门",
    start: "三、广诚来言一故事",
    end: "不能出国门矣。"
  },
  {
    prefix: "015",
    paragraph: "343",
    title: "契诃夫车夫向小马诉苦",
    start: "曾读过一篇Chekhov的小说",
    end: "瘦弱的小马倾诉去了。"
  },
  {
    prefix: "021",
    paragraph: "300",
    title: "九十岁老人说为政在力行",
    start: "两千多年前，汉朝的一个皇帝问",
    end: "顾力行何如耳。”"
  },
  {
    prefix: "021",
    paragraph: "336",
    title: "关公走麦城害了蜀吴大局",
    start: "我们看三国的历史，在三国的时候",
    end: "这些都是关公的杰作和他引起来的坏影响。"
  },
  {
    prefix: "022",
    paragraph: "645",
    title: "安瓦里看见诗人显赫改作诗",
    start: "Anwari初习科学",
    end: "治科学者显荣矣！"
  },
  {
    prefix: "024",
    paragraph: "56",
    title: "李斯特演奏不放过漂亮女人",
    start: "六、珂言李斯特故事",
    end: "漂亮的女人！”"
  },
  {
    prefix: "025",
    paragraph: "62",
    title: "大卫王找亚比煞取暖",
    start: "（七）老人喜剧法",
    end: "王却没有与她亲近。”"
  },
  {
    prefix: "025",
    paragraph: "92",
    title: "马克吐温捡刨花挨打",
    start: "（一）最讨厌学校",
    end: "剥贺尔太太那种人的头皮。”"
  },
  {
    prefix: "025",
    paragraph: "96",
    title: "马克吐温两阵转运的风",
    start: "（五）平生两阵使他转运的风",
    end: "可是怕人来领。"
  },
  {
    prefix: "025",
    paragraph: "101",
    title: "马克吐温采矿失败才开始胜利",
    start: "（十）拓荒采矿失败",
    end: "胜利的开始。”"
  },
  {
    prefix: "025",
    paragraph: "105",
    title: "老采矿介绍马克吐温没坐过牢",
    start: "（十四）到处演说",
    end: "我不知道为什么。”"
  },
  {
    prefix: "025",
    paragraph: "106",
    title: "马克吐温自己介绍自己上台",
    start: "（十五）或自己先弹钢琴",
    end: "灯光大亮）。"
  },
  {
    prefix: "025",
    paragraph: "109",
    title: "未婚妻说自己相信马克吐温",
    start: "（十八）准公公说",
    end: "我比他们更认识你。”"
  },
  {
    prefix: "025",
    paragraph: "114",
    title: "马克吐温回信说上帝魔鬼都知道",
    start: "（二三）“上帝晓得在何处",
    end: "它晓得，他也晓得。”"
  },
  {
    prefix: "025",
    paragraph: "125",
    title: "马克吐温拒绝卖推荐和演说",
    start: "（三三）有人以一万元请推荐",
    end: "保持残余的自尊心过下去”。"
  },
  {
    prefix: "025",
    paragraph: "130",
    title: "马克吐温要同哈雷彗星走",
    start: "（三八）他是1835",
    end: "竟成语谶。"
  }
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("006."));
  if (!categoryDir) throw new Error("Cannot find diary category directory");
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
    "# 一个预备军官的日记故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    "- 候选扫描：notes/yige_yubei_junguan_de_riji_candidate_scan.tsv",
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《一个预备军官的日记》主体是预备军官训练、野战部队、退伍前后的日记与书信，并夹有若干读书札记。提取轮只收李敖文中转述的外部小故事、笑话、掌故，须具备可独立复述的动作、转折或收束；不收李敖自己的军旅遭遇、演讲场面、恋爱交游、朋友信件、单句议论和新闻/法律材料链。",
    "",
    "## 保留条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 序文和友人书信中关于李敖本人的趣事、评价、军中表现不收。",
    "- 李敖自己的排长生活、讲演比赛、打靶、借钱、恋爱、斗嘴、交游和退伍前后行程不收。",
    "- 剪报式法律问题、冯大勇与钱玛琍新闻、征婚/养女会材料等更像材料链，不作为故事收录。",
    "- 读书札记中只列书名、剧情梗概、单句格言或人物事实的条目不收；只保留已经形成短故事或笑话的掌故。",
    "- 马克吐温破产还债故事已在总表《上下古今谈》收过，本轮不重复收入该同质故事。",
    "",
    "## 提取说明",
    "",
    "- 候选扫描覆盖全书 27 个 txt 文件，自动候选 336 条。",
    "- 契诃夫车夫故事只截到“小马倾诉去了”，后面李敖自比处境的个人感怀不收。",
    "- 汉帝问老人条只截取“为政不在多言，顾力行何如耳”的故事句，后续演讲铺排不收。",
    "- 关公条保留走麦城破坏蜀吴联盟至刘备败亡的因果链，因其是外部历史故事并服务于“历史人物评介”的辨伪。",
    "- 马克吐温札记只保留有笑点、反转或原则收束的故事，跳过纯传记事实和已重复的破产还债故事。",
    "",
    "## 校对处理",
    "",
    "- 提取轮 17 条，校对轮仍保留 17 条。",
    "- 继续排除序文、友人书信和日记里的李敖本人军旅事件、演讲效果、恋爱交游、斗嘴与行程。",
    "- 保留“预训班言语不检挡住出国门”：原文明确称“来言一故事”，且有行为记录导致不能出国的完整收束。",
    "- 保留“关公走麦城害了蜀吴大局”：虽出自李敖演讲，但故事主体是外部历史叙事，用来说明俗传英雄与历史评价的落差。",
    "- 保留马克吐温掌故中有动作、反转或原则收束的短故事；破产还债等已在总表出现的同质故事继续不收。",
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
      "沉思日记类只保留未在总表出现、能独立复述的外部小故事、笑话、掌故；排除李敖自身日记事件、交游、恋爱片段、单句感想、新闻材料链和纯议论。",
    excludedByStandard: [
      "李敖自己的预官训练、野战部队、演讲、斗嘴、恋爱、交游和退伍行程不收。",
      "友人序文和书信中关于李敖的趣事与评价不收。",
      "新闻、法律、征婚和社会材料链不收，除非段落本身形成独立小故事。",
      "读书札记中的纯书目、剧情梗概、格言摘句、人物事实和重复故事不收。"
    ],
    extractionNotes: [
      "候选扫描覆盖全书 27 个 txt 文件，自动候选 336 条。",
      "保留偷闲、预训班言语不检、契诃夫车夫、汉帝问老人、关公走麦城、安瓦里改作诗、李斯特、大卫王与亚比煞、马克吐温掌故等外部小故事。",
      "契诃夫与汉帝问老人两条只截取故事主体，去掉后续李敖自我处境或演讲发挥。",
      "关公条虽在李敖自己的演讲中出现，但故事主体是外部历史叙事，且用于说明历史人物评介难以凭俗传定论。",
      "马克吐温破产还债故事已见总表 SXGJT005，本轮不重复收入。"
    ],
    proofreadNotes: [
      "提取轮 17 条，校对轮仍保留 17 条。",
      "未纳入李敖自己的军旅、演讲、恋爱、交游和斗嘴事件。",
      "预训班言语不检、关公走麦城、马克吐温掌故等条目均具有外部故事主体和明确收束。",
      "读书札记中纯书目、剧情概述、单句格言、人物事实和已重复的马克吐温破产还债故事继续排除。"
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
