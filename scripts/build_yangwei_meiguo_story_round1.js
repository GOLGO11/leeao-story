const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "阳痿美国";
const SLUG = "yangwei_meiguo";
const ROUND = "story_round1";
const ID_PREFIX = "YWMG";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "yangwei_meiguo_story_round1.md");

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
  "yangwei_meiguo"
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("004."));
  if (!categoryDir) throw new Error("Cannot find fiction category directory");
  const bookDir = fs
    .readdirSync(path.join(ROOT, corpusDir, categoryDir))
    .find((name) => name.startsWith("005."));
  if (!bookDir) throw new Error("Cannot find source book directory");
  return path.join(ROOT, corpusDir, categoryDir, bookDir);
}

const SOURCE_ROOT = findSourceRoot();

const selections = [
  {
    prefix: "001",
    paragraph: 10,
    line: "19-19",
    title: "棺中老公第一次不硬",
    start: "1976年11月《风流客》（Swingle）杂志有一则漫画",
    end: "It's the first time I ever saw him without an erection.）"
  },
  {
    prefix: "003",
    paragraph: 103,
    line: "205-205",
    title: "华盛顿砍樱桃树故事被后造",
    start: "我不会像威姆斯（M. L. Weems）那样造出你砍樱桃树的故事。",
    end: "来自威姆斯的“Life of George Washington”的1806年第5版到1810年的第10版。"
  },
  {
    prefix: "004",
    paragraph: 41,
    line: "81-89",
    title: "小学生被问谁签了独立宣言",
    start: "有个笑话挖苦你们这个《独立宣言》。",
    end: "就快点承认吧，我们才好离开这里。）"
  },
  {
    prefix: "010",
    paragraph: 16,
    line: "31-31",
    title: "范布伦不肯证实太阳东升",
    start: "你任参议员时，一位同僚打赌能使你表示积极意见。",
    end: "我不能确实的说。”"
  },
  {
    prefix: "011",
    paragraph: 45,
    line: "89-89",
    title: "艾奇森依法做一天总统",
    start: "他是艾奇森（David Rice Atchison）",
    end: "虽只做了一天，也是总统啊。"
  },
  {
    prefix: "036",
    paragraph: 42,
    line: "83-83",
    title: "肯尼迪父亲只买够当选票",
    start: "一个笑话说：你爸爸曾打电报给你",
    end: "我就倒霉了！”"
  },
  {
    prefix: "036",
    paragraph: 70,
    line: "139-139",
    title: "约翰逊想不起把手放在谁肩上",
    start: "那笑话说，你和参议员赛明顿",
    end: "我曾经把手放在你们两个小子的肩膀上。"
  },
  {
    prefix: "040",
    paragraph: 45,
    line: "89-89",
    title: "小偷要被偷者赔睡眠不足",
    start: "张先生被偷了，小偷被抓到了。",
    end: "你要赔偿我睡眠不足的损失！"
  },
  {
    prefix: "044",
    paragraph: 142,
    line: "283-283",
    title: "戴维用弹弓击倒歌利亚",
    start: "你们的《圣经》记载戴维（David）大战歌利亚（Goliath）的故事。",
    end: "我笑而信之，因为这才是真的要害。"
  },
  {
    prefix: "044",
    paragraph: 210,
    line: "419-419",
    title: "哈丁填表访美唯一目的是推翻美国",
    start: "要听听一个有趣的故事吗？",
    end: "访美唯一目的。”（Sole purpose of visit.）"
  },
  {
    prefix: "044",
    paragraph: 236,
    line: "471-471",
    title: "士官长不知道别人恨的是他",
    start: "BEETLE BAILEY漫画中",
    end: "他完全无法想象被恨的是他。"
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
  const rows = buildRows();
  const lines = [
    "# 阳痿美国故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《阳痿美国》为政治讽刺剧本，本轮不把美国总统生平、政策罪状、外交史料、战争案例链拆成故事。只收剧中用来说明道理的独立笑话、寓言、掌故和小故事。",
    "",
    "## 保留条目",
    "",
    ...rows.map((row) => `- ${row.id} ${row.title}（${row.source_file}:${row.source_lines}，${row.char_count}字）`),
    "",
    "## 本轮排除重点",
    "",
    "- 华盛顿、杰斐逊、麦迪逊、林肯、肯尼迪、尼克松、卡特、小布什等总统审判中的政策、战争、外交、种族与人权材料链不拆条。",
    "- 杰斐逊奴隶子女、麦迪逊夫人撤离白宫、加菲尔德遇刺、肯尼迪 PT-109、杜鲁门/艾森豪威尔/越战等总统事件偏历史案例，本轮不收。",
    "- 清教徒躲海盗已在《波波颂》收录；‘还是第一声最像’已在《为自由招魂》收录，本轮不重复。",
    "- 《台湾关系法》、越战重建、伊拉克武器、爱国者法案等段落虽有讽刺，但主体为政治论证或案例材料，不收。",
    "- 胡佛就职宣誓改字、加菲尔德遇刺、杰斐逊私生子、艾森豪威尔恋情等虽带故事字样或叙事性，仍属总统本人史事材料，不收。",
    "- 《伊索寓言》青蛙、《聊斋》蝴蝶、狼吃羊、威尔·罗吉斯国会笑话等只是一句标签或短引，不拆条。",
    "- 阿瑟幕中的马靴踢华工漫画偏政治象征图像，不是带转折的小故事，本轮不收。",
    "",
    "## 校对处理",
    "",
    "- 补入“士官长不知道别人恨的是他”：原文为 BEETLE BAILEY 漫画小故事，用来说明美国“不知自己被恨”。",
    "- 复核“华盛顿砍樱桃树故事被后造”“艾奇森依法做一天总统”：前者为造假掌故，后者为一日总统掌故，均保留。",
    "- 保留条目均收窄到故事本体，继续删去接回美国政治论证的尾巴。",
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
      "本书为政治讽刺剧本，只收剧中明确讲出的独立笑话、寓言、掌故和小故事；不收总统生平事件、政策罪状、战争外交材料链、纯论证或已收同题故事。",
    excludedByStandard: [
      "总统审判中的政策、战争、外交、种族与人权材料链不拆条。",
      "总统本人或身边人物的历史事件偏案例材料者不收。",
      "清教徒躲海盗与‘还是第一声最像’已在汇总表出现，本轮不重复。",
      "美国政治制度、国际法、台湾关系法、越战、伊拉克战争等大段论证不收。"
    ],
    extractionNotes: [
      "候选扫描覆盖 46 个正文文件和目录文件，触发词集中在讽刺笑话和政治掌故。",
      "保留棺材漫画、华盛顿樱桃树造假、《独立宣言》签名笑话、范布伦太阳、艾奇森一日总统、肯尼迪买票电报、约翰逊上帝梦、卡特小偷、戴维与歌利亚、加拿大作家签证表、BEETLE BAILEY 士官长等独立小故事。",
      "对长段落只截取故事本体，删去接回美国政治论证的评语尾巴。"
    ],
    proofreadNotes: [
      "补入 BEETLE BAILEY 漫画小故事。",
      "胡佛宣誓改字、加菲尔德遇刺、杰斐逊私生子、艾森豪威尔恋情等仍按总统史事材料排除。",
      "伊索青蛙、聊斋蝴蝶、狼吃羊、威尔·罗吉斯国会笑话等短引未讲成完整故事，继续排除。"
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
