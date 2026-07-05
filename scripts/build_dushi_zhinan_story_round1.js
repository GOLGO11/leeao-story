const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "读史指南";
const SLUG = "dushi_zhinan";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "DSZN";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;

const selections = [
  {
    prefix: "002",
    paragraph: 78,
    title: "陈梦雷发配归来编成图书集成",
    start: "陈梦雷可说是苦命的人",
    end: "在他的《松鹤山房集》文集卷二《进汇编启略》里说得很明白："
  },
  {
    prefix: "002",
    paragraph: 128,
    title: "清帝加序攫书又毁铜活字",
    start: "1726年（雍正四年）陈梦雷用新制的铜活字",
    end: "乾隆初年，又把这一批活字销毁了铸钱。"
  },
  {
    prefix: "002",
    paragraph: "147-148",
    title: "义理寿从残书里配成全套",
    start: "美国普林斯顿大学葛思德东方书库中",
    end: "他的耐心是可佩服的。"
  },
  {
    prefix: "002",
    paragraph: 182,
    title: "张之洞重印图书集成险成大狱",
    start: "武进陶兰泉（湘）先生谙于书林掌故",
    end: "竟致破产自杀，乃得了结。"
  },
  {
    prefix: "002",
    paragraph: 211,
    title: "张廷玉获赐两部图书集成",
    start: "物以稀为贵。",
    end: "亦古今未有之幸事也！”"
  },
  {
    prefix: "002",
    paragraph: "225-231",
    title: "王胡子三千银子卖图书集成",
    start: "因为得之不易，所以偶有转手的机会",
    end: "正常价格也就不难想像了！"
  },
  {
    prefix: "002",
    paragraph: "236-237",
    title: "胡适母亲借贷买图书集成",
    start: "胡适在《胡适留学日记》巻四第二则“母之爱”里",
    end: "犹处处为儿子设想如此。"
  },
  {
    prefix: "004",
    paragraph: 3,
    title: "曹操说无孤几人称王",
    start: "曹操有一次向他左右自负的说",
    end: "没有权臣早就“几人称帝，几人称王”了。"
  },
  {
    prefix: "004",
    paragraph: 23,
    title: "文天祥答十七史从何说起",
    start: "正因为中国人没有闲工夫记这些名和号",
    end: "为什么？历史书太多了！"
  },
  {
    prefix: "004",
    paragraph: 27,
    title: "小孩听说书刘败哭曹败跳",
    start: "说书最早发生在唐朝",
    end: "听到曹操打败了，就高兴得跳起来。"
  },
  {
    prefix: "004",
    paragraph: 95,
    title: "武则天惜骆宾王骂文",
    start: "唐朝的另一大手笔是它“对人才的态度”",
    end: "这是何等大度！何等人才至上！"
  },
  {
    prefix: "004",
    paragraph: 96,
    title: "唐太宗接见进士说入彀",
    start: "唐朝“对人才的态度”，导致了科举取士。",
    end: "可见唐朝的人才政策，当时是成功的。"
  },
  {
    prefix: "004",
    paragraph: 107,
    title: "宋太祖撤走宰相座位",
    start: "不但在名义和实权方面神气",
    end: "这真是中国的大不幸！"
  },
  {
    prefix: "004",
    paragraph: 109,
    title: "宋仁宗愿以独女和亲",
    start: "夷狄来的时候，宋朝开始窝囊了",
    end: "一国皇帝窝囊至此，还有什么好说！"
  },
  {
    prefix: "004",
    paragraph: 115,
    title: "王洙写宋史质排掉元朝",
    start: "其次是政治上的曲解。",
    end: "变成了中国史中的黑暗时代。"
  }
];

const proofreadDrops = new Map([
  [
    "清帝加序攫书又毁铜活字",
    "这一条是书史结论和版本命运概述，虽有动作词，但缺少具体场景和可复述的故事转折。"
  ],
  [
    "张廷玉获赐两部图书集成",
    "主体是《古今图书集成》稀贵性的说明和一句感叹，不够成一个小故事。"
  ],
  [
    "曹操说无孤几人称王",
    "只是开篇引用的一句历史判断，偏名言/论断，不作为故事条目保留。"
  ],
  [
    "唐太宗接见进士说入彀",
    "只是科举取士段落中的一句机锋，缺少情节推进，校对轮删除。"
  ]
]);

const candidateMarkers = [
  "故事",
  "笑话",
  "有一次",
  "说书",
  "问",
  "答",
  "回答",
  "曰",
  "说",
  "告诉",
  "自杀",
  "发遣",
  "发配",
  "攫",
  "盗卖",
  "销毁",
  "哭",
  "跳",
  "撤走",
  "张之洞",
  "陈梦雷",
  "图书集成",
  "文天祥",
  "曹操",
  "武则天",
  "骆宾王",
  "唐太宗",
  "宋太祖",
  "宋仁宗",
  "王洙",
  "胡适"
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
    .find((name) => name.startsWith("002.") && name.includes(BOOK));
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
  if (/故事|笑话|说书/u.test(paragraph)) score += 6;
  if (/问|答|回答|曰|谓|说|告诉/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/陈梦雷|图书集成|文天祥|曹操|唐太宗|武则天|宋太祖|宋仁宗/u.test(paragraph)) {
    score += 3;
  }
  if (/发遣|发配|攫|盗卖|销毁|自杀|哭|跳|撤走/u.test(paragraph)) score += 2;
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphs(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.includes(marker));
      const quoteHeavy = (paragraph.match(/[“”]/gu) || []).length >= 6;
      const actionHeavy = /发遣|发配|攫|盗卖|销毁|自杀|哭|跳|撤走/u.test(paragraph);
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
    "# 读史指南故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮入选：${selections.length} 条`,
    `- 校对轮删除：${proofreadDrops.size} 条`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《读史指南》多为书目对照、百科全书研究、版本源流和历史演义导读。校对轮只收李敖文中讲成可独立复述、带人物行动、问答、反讽或明确后果，并用于说明读史方法、书籍命运、历史教育或政治判断的小故事、书林掌故和压缩历史轶事；删除纯书目、版本列表、索引用法、朝代概述、典故名清单、制度说明、书史结论和只有一句机锋/名言的材料。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 校对轮删除",
    "",
    ...proofreadDropLines,
    "",
    "## 本轮排除重点",
    "",
    "- 《四部备要暨四部丛刊书目对照表例》主体是书目对照表，未收故事。",
    "- 《古今图书集成》研究中，纯版本说明、索引价值、卷册数字、书价评语和李敖自己的文星索引工作不收。",
    "- 《介绍世界最大的百科全书》主要说明《古今图书集成》的分类、索引和研究用途，未见可独立复述的小故事。",
    "- 《中国历史演义总说》中的朝代概述、典故名串、演义书目、历史判断和一句机锋不拆收；只收带具体人物问答、动作或反讽收束的短故事。",
    "",
    "## 提取与校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，得到 ${manifest.candidateCount} 条候选。`,
    `- 提取轮入选 ${selections.length} 条；校对轮删除 ${proofreadDrops.size} 条，保留 ${validation.count} 条。`,
    "- 校对轮删去书史结论和单句轶事，保留陈梦雷、义理寿、张之洞、胡适母亲、文天祥问答、说书儿童反应、宋太祖撤座位等更能独立复述的故事。",
    "- 对书史长段只截取故事本体，尽量删去前后书目、版本、索引、朝代概述和评论铺陈。",
    "- 故事正文未改写，均按源文原句截取；跨段条目保留原文换行。",
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
      "校对轮只收李敖文中讲成可独立复述、带人物行动、问答、反讽或明确后果，并用于说明读史方法、书籍命运、历史教育或政治判断的小故事、书林掌故和压缩历史轶事；排除纯书目、版本列表、索引用法、朝代概述、典故名清单、制度说明、书史结论和只有一句机锋/名言的材料。",
    excludedByStandard: [
      "四部备要/四部丛刊对照表为书目材料，不收。",
      "古今图书集成研究中纯版本源流、卷册数字、索引用法、书价评语、书史结论和文星工作说明不收。",
      "介绍世界最大的百科全书主要是分类和检索用途说明，未收。",
      "中国历史演义总说中朝代综述、典故名串、书目推荐和一句机锋不拆成故事。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `提取轮保留 ${selections.length} 条；校对轮删除 ${proofreadDrops.size} 条，保留 ${rows.length} 条。`,
      "故事正文未改写，均按源文原句截取。",
      "校对轮删去清帝攫书毁活字、张廷玉受赐、曹操无孤和唐太宗入彀四条。"
    ],
    proofreadNotes: [
      "保留陈梦雷发配后编书、义理寿配全残书、张之洞重印险成大狱、王胡子卖书、胡适母亲借贷买书等书林掌故。",
      "保留文天祥答十七史、小孩听说书、武则天惜骆宾王、宋太祖撤座位、宋仁宗愿以独女和亲、王洙排掉元朝等可独立说明判断的短故事。",
      "删除书史结论和单句机锋，避免把本册拉回材料摘录。"
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
