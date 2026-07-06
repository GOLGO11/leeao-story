const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "中国现代史定论";
const SLUG = "zhongguo_xiandaishi_dinglun";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "ZGXDSDL";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "009.历史文化类",
  "009.中国现代史定论"
);

const selections = [
  {
    prefix: "001",
    paragraphs: [428, 429, 430, 431],
    title: "胡秋原指挥一旅抗日故事露馅"
  },
  {
    prefix: "002",
    paragraphs: [18, 19, 20, 21, 22],
    title: "达洙劝胡秋原入共产主义中学"
  },
  {
    prefix: "002",
    paragraphs: [261, 262],
    title: "广东买番摊所有宝全压"
  },
  {
    prefix: "003",
    paragraphs: [8, 9, 10],
    title: "新华日报用两版骗过检查"
  },
  {
    prefix: "004",
    paragraph: 20,
    title: "宋子文喂客非请客"
  },
  {
    prefix: "005",
    paragraph: 18,
    title: "陈少白说训政把人驯正"
  },
  {
    prefix: "006",
    paragraph: 6,
    segment: "cross",
    title: "卫立煌画十字赌沈阳主力",
    start: "廖耀湘回忆，当时顾祝同奉蒋介石之命，到沈阳逼他们的时候，卫立煌就说",
    end: "比蒋介石正确得多。"
  },
  {
    prefix: "007",
    paragraphs: [3, 4, 5],
    title: "刘峙想做文天祥而不得"
  },
  {
    prefix: "008",
    paragraph: 3,
    title: "大捷里黄百韬回家休息"
  },
  {
    prefix: "008",
    paragraph: 4,
    title: "熊笑三制造假枪炮吓杜聿明"
  },
  {
    prefix: "008",
    paragraphs: [5, 6],
    title: "蒋介石飞机接杜聿明密码不符"
  },
  {
    prefix: "009",
    paragraph: 4,
    segment: "ammo",
    title: "空投弹药不投饭挨骂",
    start: "“徐蚌会战”时黄维奉命开赴战场赴援",
    end: "打你妈个屁！”"
  },
  {
    prefix: "009",
    paragraph: 5,
    title: "黄维胡琏带安眠药突围"
  },
  {
    prefix: "010",
    paragraph: 14,
    title: "王仲廉护送五十新兵防卖猪仔"
  },
  {
    prefix: "010",
    paragraph: 15,
    title: "严重一菜一汤加炒蛋"
  },
  {
    prefix: "010",
    paragraph: 16,
    title: "徐谦演讲假牙掉台下"
  }
];

const proofreadDrops = new Map();

const candidateMarkers = [
  "故事",
  "笑话",
  "传说",
  "有一次",
  "一天",
  "忽然",
  "不料",
  "结果",
  "后来",
  "最后",
  "问",
  "答",
  "说",
  "曰",
  "骂",
  "逃",
  "杀",
  "死",
  "抓",
  "捉",
  "逼",
  "骗",
  "冤",
  "枪毙",
  "自杀",
  "回忆",
  "蒋介石",
  "周恩来",
  "胡秋原",
  "傅斯年",
  "吴铁城",
  "廖耀湘",
  "黄维",
  "王仲廉"
];

const excludedByStandard = [
  "《现代史辨伪方法论》大部分闽变、福州接收、日军登陆材料：主要是辨伪证据链，只收胡秋原编造抗日故事露馅这一处。",
  "《论所有的宝全压》大部分胡秋原前后言论对照：属于论证材料，只收操场入团回忆和买番摊比喻。",
  "《傅斯年论豪门资本》孔宋财政、工业、外汇材料：多为傅斯年长篇政论和经济批判，只补收宋子文喂客非请客这一处有生活场景的掌故。",
  "《谁删减了〈吴铁城回忆录〉？》回忆录版本、残卷、张群改稿证据：属于出版辨伪和档案线索，只收陈少白训政谐音掌故。",
  "廖耀湘、刘峙、杜聿明、黄维等完整战役经过：容易变成事件目录，本轮只保留有对话、反转、荒诞动作或讽刺效果的片段。",
  "王仲廉出身、黄埔生活、借棺葬父、日军暴行清单、鲁西战役和晚年诗文：偏履历、惨案清单或自叙材料，不作为小故事收录。",
  "总表已有同概念的洗冤、投机、战败逃亡类故事不重复收录；本书只收文本中有明显新场景的段落。"
];

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((fileName) => /^\d{3}\./u.test(fileName))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!fileName) throw new Error(`Missing source file for prefix ${prefix}`);
  return fileName;
}

function readSource(fileName) {
  return new TextDecoder("gb18030")
    .decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName)))
    .replace(/\r\n/g, "\n")
    .replace(/\s*李敖影音E书[\s\S]*$/u, "")
    .trim();
}

function splitParagraphObjects(text) {
  const lines = text.split("\n");
  const paragraphs = [];
  let current = [];
  let startLine = 0;
  const flush = (endLine) => {
    if (!current.length) return;
    paragraphs.push({
      text: current.join("\n").trim(),
      startLine,
      endLine
    });
    current = [];
    startLine = 0;
  };
  lines.forEach((line, index) => {
    if (!line.trim()) {
      flush(index);
      return;
    }
    if (!current.length) startLine = index + 1;
    current.push(line);
  });
  flush(lines.length);
  return paragraphs;
}

function paragraphNumbers(selection) {
  if (selection.paragraphs) return selection.paragraphs;
  if (selection.paragraph) return [selection.paragraph];
  throw new Error(`Selection ${selection.title} has no paragraph reference`);
}

function selectText(sourceText, selection) {
  const paragraphObjects = splitParagraphObjects(sourceText);
  const selected = paragraphNumbers(selection).map((number) => {
    const paragraph = paragraphObjects[number - 1];
    if (!paragraph) throw new Error(`Missing paragraph ${number} for ${selection.title}`);
    return paragraph;
  });
  let text = selected.map((paragraph) => paragraph.text).join("\n\n");
  if (selection.start || selection.end) {
    const startIndex = selection.start ? text.indexOf(selection.start) : 0;
    if (startIndex === -1) throw new Error(`Start marker not found for ${selection.title}`);
    const endIndex = selection.end ? text.indexOf(selection.end, startIndex) : text.length - 1;
    if (endIndex === -1) throw new Error(`End marker not found for ${selection.title}`);
    text = text.slice(startIndex, endIndex + (selection.end ? selection.end.length : 1)).trim();
  }
  return {
    text,
    lineRange: `${selected[0].startLine}-${selected[selected.length - 1].endLine}`
  };
}

function storyId(index) {
  return `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`;
}

function sourceId(selection) {
  const segment = selection.segment ? `_${selection.segment}` : "";
  return `${ID_PREFIX}_${selection.prefix}_${paragraphNumbers(selection).join("_")}${segment}`;
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
  if (/故事|笑话|传说|有一次|一天/u.test(paragraph)) score += 6;
  if (/问|答|说|曰|骂/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/被|杀|死|逃|入狱|受刑|炸|刺|冤|抓|捉|逼|骗|枪毙|自杀/u.test(paragraph)) score += 2;
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphObjects(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.text.includes(marker));
      const quoteHeavy = (paragraph.text.match(/[“”]/gu) || []).length >= 6;
      const actionHeavy = /被|杀|死|逃|入狱|受刑|炸|刺|冤|抓|捉|逼|骗|枪毙|自杀/u.test(paragraph.text);
      if (!found.length && !quoteHeavy && !actionHeavy) return;
      const score = candidateScore(paragraph.text, found);
      if (score < 8 && !quoteHeavy) return;
      rows.push({
        file: fileName,
        paragraph: index + 1,
        score,
        markers: found.join("|"),
        text: paragraph.text.replace(/\s+/gu, " ").slice(0, 900)
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
    "# 中国现代史定论故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 校对轮保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《中国现代史定论》多为现代史辨伪、政论材料和战役回忆，本轮只收李敖文中讲成可复述小故事的段落：要有场景、人物动作、对话、反转、笑点或明确讽刺功能，并用来说明伪史、投机、荒谬、专制、败亡或人格状态。纯证据链、战役经过、履历、惨案清单、经济政论和李敖自我评论不收。",
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
    "",
    "## 提取说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，得到 ${manifest.candidateCount} 条候选。`,
    `- 校对轮保留 ${validation.count} 条；故事正文未改写，均按源文原段或段内原文截取。`,
    "- 战役类文本只保留有小场景或荒诞反转的片段，未把战役过程拆成事件目录。",
    "",
    "## 校验",
    "",
    `- 单书重复正文：${JSON.stringify(validation.duplicateTextIds)}`,
    `- 单书正文回源失败：${JSON.stringify(validation.missingSourceTextIds)}`,
    `- 汇总重复正文：${JSON.stringify(aggregate.duplicateTextIds)}`
  ];
  if (proofreadDropLines.length) {
    lines.push("", "## 校对轮删除", "", ...proofreadDropLines);
  }
  fs.writeFileSync(NOTES_PATH, `${lines.join("\n")}\n`, "utf8");
}

function main() {
  if (!fs.existsSync(SOURCE_ROOT)) throw new Error(`Missing source root: ${SOURCE_ROOT}`);
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
      "只收李敖文中确实讲成可独立复述、带人物行动、对话、转折、笑点或明确后果，并用来说明伪史、投机、荒谬、专制、败亡或人格状态的小故事；排除纯证据链、战役经过、履历、惨案清单、经济政论和李敖自我评论。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `校对轮保留 ${rows.length} 条。`,
      "故事正文未改写，均按源文原段或段内原文截取。",
      "战役类文本只保留有小场景或荒诞反转的片段，未把战役过程拆成事件目录。"
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
