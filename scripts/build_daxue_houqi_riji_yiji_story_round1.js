const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "大学后期日记乙集";
const SLUG = "daxue_houqi_riji_yiji";
const ROUND = "story_round1";
const ID_PREFIX = "DXHQRYJ";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "daxue_houqi_riji_yiji_story_round1.md");

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
  "daxue_houqi_riji_yiji"
];

const selections = [
  {
    prefix: "002",
    paragraph: "29",
    title: "罗耀拉临终仍主张打完球",
    start: "“要坚持在我们正在做的工作上",
    end: "如罗耀拉在生命最后二十分钟内仍主张打完手上的球。"
  },
  {
    prefix: "003",
    paragraph: "134",
    title: "第欧根尼白日提灯找人",
    start: "“犬儒主义”（Cynicism）的大宗师第欧根尼",
    end: "这是何等气魄！何等愤世的气息！"
  },
  {
    prefix: "003",
    paragraph: "192",
    title: "酒席屁声还是第一声像",
    start: "笑话一则：一个人在一酒席上",
    end: "还是第一声像”。"
  },
  {
    prefix: "004",
    paragraph: "163",
    title: "李陵说丈夫不能再辱",
    start: "昭帝立，大将军霍光",
    end: "元平元年（前七十四）病死。"
  },
  {
    prefix: "005",
    paragraph: "193",
    title: "阿登纳陪杜勒斯走完最后一段路",
    start: "阿登纳亲赴美国",
    end: "加入正义和崇高理想的追求。"
  },
  {
    prefix: "006",
    paragraph: "246",
    title: "莎冈胜诉反而破财",
    start: "现年二十三岁的法国女小说家莎冈",
    end: "共计三千五百元（英民译自22日《新闻周刊》）。"
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
    .find((name) => name.startsWith("004."));
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
    "# 大学后期日记乙集故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    "- 候选扫描：notes/daxue_houqi_riji_yiji_candidate_scan.tsv",
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《大学后期日记乙集》主体是大学后期的日常札记、交游、恋爱心理、读书摘记、社会新闻摘录和公开信。校对轮只保留李敖在日记或夹录文章中转述出来、可独立复述并带有动作转折或讽刺收束的外部小故事、笑话、掌故；不收李敖自己的事件、朋友往来、恋爱片段、单句感想、新闻材料链和纯议论。",
    "",
    "## 保留条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 李敖自己的校园、见人、恋爱、玩笑、论文、交游、研究所取舍和公开信官司材料不收。",
    "- 爱情婚姻观点、查泰莱禁映、征婚信件雪片飞、台大伪证等新闻/论证材料不收，除非段落本身形成独立小故事。",
    "- Bonnie、谢师宴、给钱思亮公开信等与李敖自身经历直接相关的事件不收。",
    "- 屈万里以故事代酒、连说几十个笑话等只提到故事/笑话而无故事正文，不收。",
    "",
    "## 校对处理",
    "",
    "- 提取轮 6 条，校对轮仍保留 6 条。",
    "- 保留“罗耀拉临终仍主张打完球”：虽短，但原文用这一掌故说明“完成”的精神，有动作和用意。",
    "- 保留“第欧根尼白日提灯找人”和“酒席屁声还是第一声像”：两条均为完整笑话或掌故。",
    "- 保留“李陵说丈夫不能再辱”：原文叙事完整，有劝归、拒归和“不再辱”的收束。",
    "- 保留“阿登纳陪杜勒斯走完最后一段路”和“莎冈胜诉反而破财”：两条虽来自新闻性材料，但有独立人物、动作、转折或点睛。",
    "- 继续排除公开信官司材料、爱情婚姻观点、查泰莱禁映、征婚信件和李敖自身交游日记。",
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
      "李敖自己的日记事件、朋友往来、恋爱片段、公开信官司材料和自我修养决心不收。",
      "单句观点、新闻摘录、格言、读书感想和缺少故事正文的材料不收。",
      "长篇论证材料和历史例子链不拆成故事，除非原文具有完整小故事形态。",
      "只提到故事或笑话而没有故事正文的不收。"
    ],
    extractionNotes: [
      "候选扫描覆盖全书 9 个正文文件，自动候选 28 条。",
      "补充以故事、笑话、问答、据说、结果、最后、李陵、莎冈、阿登纳、杜勒斯、打官司等关键词复查。",
      "保留罗耀拉、第欧根尼、酒席屁声、李陵、阿登纳、莎冈等外部小故事或笑话。",
      "排除公开信中的台大伪证与胡秋原官司材料，因为这是李敖自己的事件。",
      "排除征婚信件、爱情婚姻观点、查泰莱禁映等新闻/观点材料，因其更像材料链而非李敖讲出来的小故事。"
    ],
    proofreadNotes: [
      "提取轮 6 条，校对轮仍保留 6 条。",
      "罗耀拉、第欧根尼、酒席屁声、李陵、阿登纳、莎冈六条均具备独立复述的故事或笑话形态。",
      "未拆分李陵段落，因为劝归、拒归和“不再辱”的收束属于同一完整历史故事。",
      "继续排除李敖自身事件、公开信官司材料、新闻材料链和只提故事名而无正文的条目。"
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
