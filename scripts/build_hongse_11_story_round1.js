const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "红色11";
const SLUG = "hongse_11";
const ROUND = "story_round1";
const ID_PREFIX = "HS11";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "hongse_11_story_round1.md");
const SOURCE_ROOT = path.join(ROOT, "《大李敖全集6.0》分章节", "004.小说剧本类", "003.红色11");

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
  "hongse_11"
];

const selections = [
  {
    prefix: "002",
    paragraph: 135,
    line: "269-269",
    title: "鸠摩罗什讲经中途要女人",
    start: "中国晋朝时候，印度来了名和尚鸠摩罗什",
    end: "后来生了两个小孩。"
  },
  {
    prefix: "002",
    paragraph: 155,
    line: "309-309",
    title: "狄阿杰尼斯白天打灯笼找人",
    start: "希腊犬儒学派的哲学家狄阿杰尼斯",
    end: "也人不像人。"
  },
  {
    prefix: "002",
    paragraph: 158,
    line: "315-315",
    title: "塞翁失马焉知非福",
    start: "“塞翁失马”便是其中之一",
    end: "这就是有名的“塞翁失马，焉知非福”的寓言。"
  },
  {
    prefix: "002",
    paragraph: 218,
    line: "435-435",
    title: "罗宾汉射出最后一箭",
    start: "罗宾汉最后被女人陷害",
    end: "就死了。"
  },
  {
    prefix: "002",
    paragraph: 315,
    line: "629-629",
    title: "狼给羊安罪名",
    start: "《伊索寓言》里写狼要吃羊",
    end: "狼不愁没有罪名。"
  },
  {
    prefix: "002",
    paragraph: 315,
    line: "629-629",
    title: "李元吉说还怕没理由吗",
    start: "唐太宗李世民跟兄弟抢皇位的时候",
    end: "李元吉不愁没罪名。"
  },
  {
    prefix: "002",
    paragraph: 397,
    line: "793-793",
    title: "精神病人怕鸡不知道",
    start: "有一个笑话，说一个人有精神病",
    end: "可是鸡不知道。"
  },
  {
    prefix: "002",
    paragraph: 399,
    line: "797-797",
    title: "米袋里的奸夫声明是米",
    start: "还有一个笑话，说一个女人养汉",
    end: "米袋里的奸夫就声明：“是米。”"
  },
  {
    prefix: "004",
    paragraph: 7,
    line: "13-13",
    title: "纪渻子养斗鸡",
    start: "有个人叫纪渻子",
    end: "吓跑了。"
  },
  {
    prefix: "004",
    paragraph: 43,
    line: "85-85",
    title: "张汤审老鼠",
    start: "司马迁《史记》里有一篇《酷吏列传》",
    end: "最后果然变成大酷吏。"
  },
  {
    prefix: "004",
    paragraph: 55,
    line: "109-109",
    title: "妻死后只煮一个鸡蛋",
    start: "有一个笑话说：有个人一早醒来",
    end: "早餐的鸡蛋，煮一个就够了。”"
  },
  {
    prefix: "004",
    paragraph: 117,
    line: "233-233",
    title: "山西房东骗杀黑狗又分食狗肉",
    start: "宗荣禄《天民回忆录》记他在山西夏县四交村",
    end: "都讨来要。”"
  },
  {
    prefix: "004",
    paragraph: 136,
    line: "271-271",
    title: "海涅临死把宽恕交给上帝",
    start: "当诗人海涅临死前",
    end: "他是干那行的啊。’"
  },
  {
    prefix: "004",
    paragraph: 214,
    line: "427-427",
    title: "狮子怕公鸡象怕蚊子",
    start: "《伊索寓言》里有一篇《狮子、周彼得和象》",
    end: "公鸡总比蚊子大啊！"
  },
  {
    prefix: "004",
    paragraph: 221,
    line: "441-441",
    title: "阎王罚人投胎做母狗",
    start: "一个笑话说：有一个人",
    end: "所以想做母狗。”"
  },
  {
    prefix: "004",
    paragraph: 374,
    line: "747-747",
    title: "子濯孺子遇庾公之斯",
    start: "中国古代的名射手子濯孺子",
    end: "射了四下就走了。"
  },
  {
    prefix: "004",
    paragraph: 376,
    line: "751-751",
    title: "羊叔子送药给敌将",
    start: "羊叔子的故事总单纯了吧？",
    end: "羊叔子哪里是拿毒药毒人的人！”"
  },
  {
    prefix: "004",
    paragraph: 503,
    line: "1005-1005",
    title: "毕加索被说不是真共产党",
    start: "毕加索曾发表一个声明说",
    end: "也不属于任何组织。"
  }
];

function decodeText(filePath) {
  return new TextDecoder("gb18030").decode(fs.readFileSync(filePath));
}

function stripFooter(text) {
  return text.replace(/\s*上一页\s+回目录\s+下一页\s*$/u, "").trim();
}

function fileForPrefix(prefix) {
  const fileName = fs
    .readdirSync(SOURCE_ROOT)
    .find((name) => name.startsWith(`${prefix}.`) && name.endsWith(".txt"));
  if (!fileName) throw new Error(`Cannot find source file for prefix ${prefix}`);
  return fileName;
}

function readSource(fileName) {
  return stripFooter(decodeText(path.join(SOURCE_ROOT, fileName)));
}

function selectText(source, selection) {
  const startIndex = source.indexOf(selection.start);
  if (startIndex < 0) throw new Error(`Start marker not found for ${selection.title}`);
  const endIndex = source.indexOf(selection.end, startIndex);
  if (endIndex < 0) throw new Error(`End marker not found for ${selection.title}`);
  return source.slice(startIndex, endIndex + selection.end.length).trim();
}

function storyId(index) {
  return `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`;
}

function buildRows() {
  const sourceCache = new Map();
  return selections.map((selection, index) => {
    const sourceFile = fileForPrefix(selection.prefix);
    if (!sourceCache.has(sourceFile)) sourceCache.set(sourceFile, readSource(sourceFile));
    const storyText = selectText(sourceCache.get(sourceFile), selection);
    const id = storyId(index);
    return {
      id,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: `${ID_PREFIX}_${selection.prefix}_${selection.paragraph}`,
      source_file: sourceFile,
      source_lines: selection.line,
      char_count: Array.from(storyText).length,
      story_text: storyText
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
        `来源：${row.source_file}（${row.source_lines}）`,
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
    throw new Error(`Duplicate story ids in aggregate: ${duplicateIds.map((row) => row.id).join(", ")}`);
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

function writeNotes(validation, aggregate) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 红色11故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：校对轮`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《红色11》为剧本，本轮不拆主线牢房情节，不把白色恐怖案件、人物受难履历、狱中辩论材料当作故事条目。只收剧中人物明确讲出来、可脱离剧情复述的小故事、笑话、寓言、文学掌故与历史轶事。",
    "",
    "## 保留条目",
    "",
    ...buildRows().map((row) => `- ${row.id} ${row.title}（${row.source_file}:${row.source_lines}，${row.char_count}字）`),
    "",
    "## 本轮排除重点",
    "",
    "- 史处长、华老师、余三共、欧卡曾等人的入狱、审讯、受刑、争执与牢房动作，是剧本主线或人物事件，不收。",
    "- 邱宏臣、武汉大旅社命案、吴相煇、刘金财、毛泽东词案、黄进川、王经典、阮有成、赖溪河等白色恐怖案例链，偏事件材料与论证，不收。",
    "- 青龙、白虎、变色龙、梭罗、甘地、圣经谱系、文天祥等解释性或引用性段落，未讲成独立故事者不收。",
    "- 丹尼·蓬、清教徒躲海盗等同题故事已在汇总表出现，本轮不重复收录。",
    "- 周处除三害、岳飞不辩、耶稣不辩等只作简短标签或例证链者，暂不拆条。",
    "",
    "## 校对处理",
    "",
    "- 删除“老革命在昏黑日午里被整肃”：原文只是小说主题摘要，缺少可复述的小故事动作。",
    "- 收窄“罗宾汉射出最后一箭”：删去前置背景与议论，只保留临死射箭的故事本体。",
    "- 补齐“妻死后只煮一个鸡蛋”“阎王罚人投胎做母狗”“羊叔子送药给敌将”的原文结尾引号。",
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
      "本书为剧本，只收剧中人物明确讲出的独立小故事、笑话、寓言、文学掌故与历史轶事；不收主线牢房情节、人物事件、案件材料链、纯议论或过短标签。",
    excludedByStandard: [
      "史处长、华老师、余三共、欧卡曾等人的审讯、坐牢、受刑、牢房动作与争执属于剧本主线或人物事件，不作为故事条目。",
      "邱宏臣、武汉大旅社命案、吴相煇、刘金财、毛泽东词案、黄进川、老吕、王印、王经典、马来西亚侨生、阮有成、赖溪河、吕安仁、林颂和等段落偏政治案例或法律事件材料，不收。",
      "青龙、白虎、变色龙、蟑螂、梭罗、甘地、圣经谱系、文天祥、班扬、电影片名等解释性文字或引用标签，未讲成独立故事者不收。",
      "丹尼·蓬与清教徒躲海盗等同题故事已见于汇总数据，本轮不重复收录。",
      "周处除三害、岳飞不辩、耶稣不辩等只在论证链中一笔带过，暂不拆成故事条目。"
    ],
    extractionNotes: [
      "候选扫描覆盖剧中人、四幕与后记；后记未发现可独立复述的小故事。",
      "保留鸠摩罗什、狄阿杰尼斯、塞翁失马、罗宾汉、伊索狼羊、李元吉、鸡不知道、米不知道等第一幕嵌入故事。",
      "保留纪渻子养斗鸡、张汤审老鼠、死妻鸡蛋、房东黑狗、海涅、伊索狮象、母狗投胎、子濯孺子、羊叔子、毕加索等第三幕嵌入故事。",
      "对长段落只截取故事本体，去掉接回人物辩论或剧本主线的评语尾巴。"
    ],
    proofreadDropCount: 1,
    proofreadDrops: ["老革命在昏黑日午里被整肃"],
    proofreadTrimCount: 1,
    proofreadTrims: ["罗宾汉射出最后一箭"],
    proofreadBoundaryFixCount: 3,
    proofreadBoundaryFixes: [
      "妻死后只煮一个鸡蛋",
      "阎王罚人投胎做母狗",
      "羊叔子送药给敌将"
    ],
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
  writeNotes(validation, aggregate);

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
