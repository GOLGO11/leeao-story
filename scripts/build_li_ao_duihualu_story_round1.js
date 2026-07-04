const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖对话录";
const SLUG = "li_ao_duihualu";
const ROUND = "story_round1";
const ID_PREFIX = "LADHL";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "li_ao_duihualu_story_round1.md");
const CANDIDATE_SCAN = "notes/li_ao_duihualu_candidate_scan.tsv";
const BROAD_SCAN = "notes/li_ao_duihualu_broad_scan.tsv";

const selections = [
  {
    prefix: "001",
    paragraph: "74",
    title: "甘地发动抢盐运动",
    start: "甘地发起抢盐运动时",
    end: "我们做的牺牲还不大”。"
  },
  {
    prefix: "001",
    paragraph: "91",
    title: "陈平说从来没有哥哥",
    start: "陈平就是一个例子",
    end: "这个谣言还是跟了陈平一辈子。"
  },
  {
    prefix: "002",
    paragraph: "81",
    title: "张之洞禁用经济",
    start: "有一次，“中学为体、西学为用”的大师张之洞",
    end: "“名词”两个字也是日本文。"
  },
  {
    prefix: "004",
    paragraph: "30",
    title: "刘三变汉高祖",
    start: "汉高祖没当皇帝以前",
    end: "“道是刘三，说什么汉高祖？”"
  },
  {
    prefix: "004",
    paragraph: "92",
    title: "项羽杀宋义出兵",
    start: "秦汉时代，在一次救援友邦",
    end: "项羽的天下就是这样打来的。"
  },
  {
    prefix: "004",
    paragraph: "93",
    title: "刘伯温劝先打陈友谅",
    start: "我再举另外一个例",
    end: "回过头又消灭了张士诚。"
  },
  {
    prefix: "004",
    paragraph: "139",
    title: "韩信说多多益善",
    start: "有一天，刘邦问韩信",
    end: "不是带兵的。”"
  },
  {
    prefix: "004",
    paragraph: "173",
    title: "乾隆为十全再打准噶尔",
    start: "再说到和平，中国过去的记录",
    end: "你说，爱好和平的人会这样吗？"
  },
  {
    prefix: "006",
    paragraph: "27",
    title: "木偶说因为有人教",
    start: "木偶戏中人和木偶对话",
    end: "因为有人教我。”"
  },
  {
    prefix: "013",
    paragraph: "9",
    title: "阿登纳拒纳粹被诬",
    start: "我举阿登纳做例子",
    end: "他已经老掉了。"
  },
  {
    prefix: "013",
    paragraph: "47",
    title: "崔述学生倾家刊书",
    start: "清朝有个学者叫崔述",
    end: "但老师的著作一定要流传。"
  },
  {
    prefix: "013",
    paragraph: "62",
    title: "王安石回信司马光",
    start: "王安石变法时",
    end: "回头跑去写他的《资治通鉴》去了。"
  },
  {
    prefix: "014",
    paragraph: "39",
    title: "来亨鸡十姐妹一起垮",
    start: "记得刚到台湾时",
    end: "直到最后大家一起搞垮为止。"
  },
  {
    prefix: "015",
    paragraph: "71",
    title: "屠格涅夫乞丐握手",
    start: "屠格涅夫有一篇小说",
    end: "我要的不完全是钱啊。”"
  },
  {
    prefix: "016",
    paragraph: "33",
    title: "佛经以欲止欲",
    start: "《大圣欢喜供养法》等佛经中说",
    end: "观音宁愿挨肏。"
  },
  {
    prefix: "016",
    paragraph: "116",
    title: "颜习斋守丧得病",
    start: "譬如三年之丧",
    end: "结果得了肺病！"
  },
  {
    prefix: "017",
    paragraph: "12",
    title: "安徽学生请愿被打死",
    start: "记得在大陆，有位安徽学生",
    end: "究竟是可耻的！”"
  },
  {
    prefix: "017",
    paragraph: "26",
    title: "罗素靠爵士身份获保护",
    start: "当年，罗素支持妇女运动",
    end: "警察便过来保护他。"
  },
  {
    prefix: "019",
    paragraph: "48",
    title: "余英时骑警用机车赴召",
    start: "余英时是国民党青年部长",
    end: "做读书人竟然没身份如此，行吗？"
  }
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("007."));
  if (!categoryDir) throw new Error("Cannot find interview/preface category directory");
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
    `${[headers.join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join(
      "\n"
    )}\n`,
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
          `来源：${row.source_file}：${row.source_lines}`,
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
      if (!cache.has(row.source_file)) cache.set(row.source_file, normalizeText(readSource(row.source_file)));
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
    "# 李敖对话录故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 补漏扫描：${BROAD_SCAN}`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖对话录》为访谈和答问体，材料中夹有大量李敖自己的婚恋、坐牢、办刊、诉讼和政治交往经历。校对轮只保留李敖在回答中讲成一个小故事、可独立复述并用来说明判断的历史掌故、文学故事、笑话、宗教故事和人物轶事；不收访谈问句本身、李敖自己的事件合集、政治材料链、人物履历、单句格言、纯观点论述和只有一句典故名片的材料。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 李敖救殷海光、婚姻、坐牢、办刊、查禁、诉讼和朋友往来，虽有情节，但属于李敖自己的事件，不收。",
    "- 《五十而不知天命》中胡茵梦回答和现场问句中的故事，不算李敖讲述，不收。",
    "- 奥本海默反问主考、晏子吊齐庄公等故事，已在总表有更完整版本，本轮不重复收入。",
    "- 康宁祥、尤清、党外选举等政治材料链，只在其中嵌有独立故事时截取故事本身，不收整段时评。",
    "- 王崇五、姚从吾、余英时等人物材料中，偏李敖自我评价或履历材料的部分不收，只取可独立成故事的片段。",
    "- 校对轮删去曾国藩洗脚戏门生、罗素竞选一败涂地、黄克强嫌袁世凯看低人、杜月笙夜壶、李宗仁台儿庄用杂牌军：这些更像一句话典故、比喻或事实材料，不足以独立成故事。",
    "",
    "## 提取说明",
    "",
    "- 候选扫描覆盖全书 20 个正文文件，通用候选 224 条；另以宽口径补漏扫描 51 条。",
    "- 提取轮保留 24 条；校对轮删去 5 条过薄材料，保留 19 条。",
    "- 保留项羽、刘伯温、王安石、屠格涅夫、罗素爵士身份等有动作、转折或结局的小故事。",
    "- 对长段问答只截取故事本身，删去前后政治评论或李敖自我延伸。",
    "- 故事正文未改写，均按源文原句截取。",
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
      "对话录校对轮只收李敖在答问中讲成一个小故事、可独立复述并用来说明判断的历史掌故、文学故事、笑话、宗教故事和人物轶事；排除访谈问句、李敖自己的事件合集、政治材料链、人物履历、单句格言、纯观点论述和只有一句典故名片的材料。",
    excludedByStandard: [
      "李敖自己的婚恋、坐牢、办刊、诉讼、查禁和政治交往经历原则上不收。",
      "访谈问句本身、胡茵梦等非李敖回答中的故事不收。",
      "人物履历、政治材料链、文章导读、单句格言、观点论述、一句话典故和事实材料不收。",
      "总表已有更完整版本的同质故事不重复收入。"
    ],
    extractionNotes: [
      "通用候选扫描 224 条，补漏扫描 51 条。",
      "提取轮保留 24 条；校对轮删去 5 条，保留 19 条。",
      "奥本海默反问主考、晏子吊齐庄公等总表已有更完整版本，本轮不重复收入。",
      "故事正文未改写，均按源文原句截取。"
    ],
    proofreadNotes: [
      "删去曾国藩洗脚戏门生、罗素竞选一败涂地：只有一句典故材料，故事性不足。",
      "删去黄克强嫌袁世凯看低人、杜月笙说自己是夜壶、李宗仁台儿庄用杂牌军：偏一句话评价、比喻或事实材料。",
      "保留 19 条有最小情节、动作、转折或结局的故事。"
    ],
    aggregateDuplicateTextIds: aggregate.duplicateTextIds,
    generatedAt: new Date().toISOString()
  };
  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
  writeNotes(rows, validation, aggregate);
  if (!validation.ok) throw new Error(`Validation failed: ${JSON.stringify(validation)}`);
  if (aggregateDuplicatesForThisBook.length) {
    throw new Error(`Duplicate story text for ${BOOK}: ${JSON.stringify(aggregateDuplicatesForThisBook)}`);
  }
  console.log(
    JSON.stringify(
      { book: BOOK, rows: rows.length, aggregateRows: aggregate.rows.length, sourceFileCount: manifest.sourceFiles.length, ok: validation.ok },
      null,
      2
    )
  );
}

main();
