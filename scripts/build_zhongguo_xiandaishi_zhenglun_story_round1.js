const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "中国现代史正论";
const SLUG = "zhongguo_xiandaishi_zhenglun";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "ZGXDSZL";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "009.历史文化类",
  "008.中国现代史正论"
);

const selections = [
  {
    prefix: "005",
    paragraph: 4,
    title: "毛泽东称邵华张冲是CC大将"
  },
  {
    prefix: "005",
    paragraphs: [6, 7],
    title: "陈立夫证明雷某是情报CC",
    end: "雷某则面红耳赤，狼狈而去。"
  },
  {
    prefix: "006",
    paragraphs: [38, 39, 40],
    title: "杨润普受刑后门板抬出"
  },
  {
    prefix: "008",
    paragraph: 29,
    segment: "a",
    title: "孙铭九门外守张周密谈",
    start: "照片中写“称我为‘小孩子’的恩人”",
    end: "可见张学良对他信任的程度。"
  },
  {
    prefix: "008",
    paragraph: 29,
    segment: "b",
    title: "孙铭九捉到光脚蒋介石",
    start: "后来孙铭九调任警卫营营长",
    end: "张皇失措、贪生怕死的一面。"
  },
  {
    prefix: "009",
    paragraph: 5,
    title: "何柱国在杨宅逃过少壮派"
  },
  {
    prefix: "010",
    paragraphs: [5, 6, 7, 8],
    title: "日本首相劝王家桢做开国元勋"
  },
  {
    prefix: "013",
    paragraph: 2,
    title: "吉田茂亲口说自己不在",
    start: "日本政坛有一个笑话",
    end: "竟以天下人为傻瓜也。"
  },
  {
    prefix: "014",
    paragraph: 5,
    title: "北塔105号出狱还要锁门"
  },
  {
    prefix: "016",
    paragraph: 11,
    segment: "a",
    title: "沈钧儒爱国未遂罪",
    start: "第一，上海几位救国领袖被捕",
    end: "革命必须有革命的行动！"
  },
  {
    prefix: "016",
    paragraph: 11,
    segment: "b",
    title: "张学良质问机关枪打学生",
    start: "第二，“一二九西安学生运动”",
    end: "他和专制大皇帝有什么区别？"
  },
  {
    prefix: "017",
    paragraph: 6,
    title: "山道上张学良说证据不便公开",
    end: "这种隐晦，是很令人惊异的！"
  },
  {
    prefix: "017",
    paragraph: 7,
    title: "保定专车上张学良下水"
  },
  {
    prefix: "019",
    paragraph: 9,
    title: "蒋介石见周恩来面色变白"
  },
  {
    prefix: "022",
    paragraph: 7,
    title: "家猫云游又回到家"
  },
  {
    prefix: "022",
    paragraph: 10,
    title: "楚霸王乌江不肯回家"
  },
  {
    prefix: "023",
    paragraphs: [23, 24, 25, 26, 27, 28, 29, 30, 31],
    title: "胡蝶辟九一八共舞谣"
  },
  {
    prefix: "025",
    paragraph: 7,
    title: "胡适催稿米粮库绝粮"
  },
  {
    prefix: "025",
    paragraphs: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
    title: "宋哲元查封独立评论风波"
  }
];

const proofreadDrops = new Map([
  [
    "孙铭九门外守张周密谈",
    "主要是照片题跋中说明孙铭九与张学良关系亲近的背景材料，情节虽有场景，但更像史料补注，不像独立小故事。"
  ],
  [
    "孙铭九捉到光脚蒋介石",
    "只是西安事变行动中的一个事实片段，用来评断蒋介石狼狈，故事体量过小，校对轮按事件细节删除。"
  ],
  [
    "张学良质问机关枪打学生",
    "主体是张学良解释西安事变近因的政治因果链，虽有质问句和现场，但更像史事说明，不像可独立复述的小故事。"
  ]
]);

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
  "受刑",
  "门板",
  "自由",
  "张学良",
  "蒋介石",
  "周恩来",
  "孙铭九",
  "胡适",
  "宋哲元"
];

const excludedByStandard = [
  "青年党内讧、惩戒法、国民党密件：主要是政党材料和文件证据链，缺少独立故事场景。",
  "陈立夫、廖仲恺、西山会议等辨误：多为史料抽样和论证，不拆成故事。",
  "李敖与陈平景、孙铭九通信及转照片过程、李敖幼年接触王家桢：属于李敖自己的经历或出版资料流转，本轮不收。",
  "《张学良心事探微》附录《最长的软禁》大段译文：非李敖正文，只参考其史料意义，不作为本轮故事来源。",
  "张学良特赦、六次释放错觉、公开信、祝寿、题词、赴美等新闻事件：除其中明确讲成故事的段落外，不按事件条目收录。",
  "《国民党的三通前科》通邮、通商、通车史料：偏政策史和前科档案，不作为小故事拆分。",
  "德赖弗斯、吉田石松洗冤：总表已有同概念故事，本书不重复。",
  "杨虎城遗体发现、东北军整编、绥远抗日无飞机等事实：虽有情节，但主要承担史实说明或论证例证，提取轮暂不单列。"
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
  if (/被|杀|死|逃|入狱|受刑|炸|刺|冤|抓|捉|逼|骗/u.test(paragraph)) score += 2;
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphObjects(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.text.includes(marker));
      const quoteHeavy = (paragraph.text.match(/[“”]/gu) || []).length >= 6;
      const actionHeavy = /被|杀|死|逃|入狱|受刑|炸|刺|冤|抓|捉|逼|骗/u.test(paragraph.text);
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
    "# 中国现代史正论故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮初选：${manifest.selectionCount} 条`,
    `- 校对轮删除：${manifest.proofreadDropCount} 条`,
    `- 校对轮入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《中国现代史正论》多为政党文件、西安事变史料、新闻评论和历史辨误，本轮只收李敖文中确实讲成小故事的段落：要有可复述的人物、场景、动作、对话、反转或后果，并承担说明造谣、背信、专制、冤屈、荒谬、忠厚或历史讽刺的功能。纯史料链、政策条目、李敖自身经历、附录长文、人物履历和总表已有同概念故事不收。",
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
    `- 提取轮初选 ${manifest.selectionCount} 条；校对轮删除 ${manifest.proofreadDropCount} 条，保留 ${validation.count} 条。`,
    "- 故事正文未改写，均按源文原段或段内原文截取。",
    "- 同一段内含两个独立小故事时，用精确起止字符串分段保留，并在 source_ids 增加 a/b 标识。",
    "- 对张学良相关材料只取有场景和可复述转折的段落，未把软禁、特赦、三通、整编等史实拆成事件目录。",
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
      "只收李敖文中确实讲成可独立复述、带人物行动、对话、转折或明确后果，并用来说明造谣、背信、专制、冤屈、荒谬、忠厚或历史讽刺的小故事；排除纯史料链、政策条目、李敖自身经历、附录长文、人物履历和总表已有同概念故事。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `提取轮初选 ${selections.length} 条；校对轮删除 ${proofreadDrops.size} 条，保留 ${rows.length} 条。`,
      "故事正文未改写，均按源文原段或段内原文截取。",
      "同概念去重后跳过德赖弗斯、吉田石松等总表已有故事。"
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
