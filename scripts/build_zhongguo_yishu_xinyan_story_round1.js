const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "中国艺术新研";
const SLUG = "zhongguo_yishu_xinyan";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "ZGYSXY";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "009.历史文化类",
  "011.中国艺术新研"
);

const selections = [
  {
    prefix: "001",
    paragraph: 31,
    title: "王著千文被卫兵偷走烧毁"
  },
  {
    prefix: "001",
    paragraph: 46,
    title: "周越跋与乾隆诗双双浮海"
  },
  {
    prefix: "001",
    paragraph: 120,
    segment: "wangzhu_shancao",
    title: "王著删章草被识者笑俗",
    start: "王著开了中国帖学的先河",
    end: "就是一例。"
  },
  {
    prefix: "001",
    paragraph: 151,
    segment: "wangzhu_cry",
    title: "王著醉哭后周世宗",
    start: "(28)《宋史》卷二六九的王著字成象",
    end: "这是一件含意深长的轶事。"
  },
  {
    prefix: "001",
    paragraph: 153,
    title: "王著不称善逼太宗练字"
  },
  {
    prefix: "005",
    paragraph: 3,
    segment: "maoxiang_ruan",
    title: "冒辟疆桃叶渡酒骂阮大铖",
    start: "冒襄，字辟疆",
    end: "襄赖救仅免。"
  },
  {
    prefix: "005",
    paragraphs: [11, 12],
    title: "冒董同夜梦见生离"
  },
  {
    prefix: "005",
    paragraphs: [22, 23, 24],
    title: "冒董金山被游人指为神仙"
  },
  {
    prefix: "006",
    paragraph: 6,
    segment: "liuyong",
    title: "刘墉反问哪一笔是自己",
    start: "他的学生戈仙舟是翁方纲女婿",
    end: "可见他突出自我，不泥古人的作风。"
  },
  {
    prefix: "006",
    paragraph: 14,
    segment: "yuanmei",
    title: "袁枚初见张问陶叹老而不死",
    start: "张问陶（1764-1814）字仲冶",
    end: "其钦挹之如此。"
  },
  {
    prefix: "006",
    paragraph: 18,
    segment: "yangxian",
    title: "杨岘藐视上官被劾自号藐翁",
    start: "他以藐翁自号",
    end: "故改号藐翁。"
  },
  {
    prefix: "006",
    paragraph: 32,
    segment: "lirq",
    title: "李瑞清城陷不屈改作清道人",
    start: "辛亥革命时",
    end: "可见此公人品。"
  },
  {
    prefix: "006",
    paragraph: 51,
    segment: "chuye",
    title: "宋人三年雕象牙楮叶",
    start: "《韩非子·喻老》篇说",
    end: "这就是毫芒艺术的渊源。"
  },
  {
    prefix: "006",
    paragraph: 53,
    title: "张飞破张郃铭被楷书制图"
  }
];

const proofreadDrops = new Map([
  ["真宗有子转身赏周起红包", "只是周越家世关系旁证，像人物关系小注，独立故事性太弱。"],
  ["张祖翼游泰西带回埃及残石拓本", "是藏拓履历资料点，缺少情节展开和故事功能。"]
]);

const proofreadAdds = [
  "王著删章草被识者笑俗：补入王著编帖被批评的具体小掌故。",
  "杨岘藐视上官被劾自号藐翁：补入号名来历的问答式掌故。",
  "宋人三年雕象牙楮叶：补入李敖用来说明毫芒艺术的寓言式故事。"
];

const candidateMarkers = [
  "故事",
  "轶事",
  "奇闻",
  "笑话",
  "有趣",
  "有一次",
  "有一天",
  "一天",
  "忽然",
  "不料",
  "结果",
  "后来",
  "最后",
  "原来",
  "问",
  "答",
  "说",
  "曰",
  "谓",
  "云",
  "梦",
  "死",
  "杀",
  "哭",
  "病",
  "赐",
  "献",
  "藏",
  "题",
  "跋",
  "画",
  "书",
  "墨迹",
  "真迹",
  "伪",
  "偷",
  "盗",
  "买",
  "卖",
  "骗",
  "皇帝",
  "太后",
  "和尚",
  "尼姑"
];

const excludedByStandard = [
  "周越墨迹研究中的年代、印鉴、题跋、版本、引用源流等考证段，虽有材料价值，但不是故事，不收。",
  "秦孝仪、台湾故宫相关质询和错误清单，多属论战证据或事件材料，不作为小故事收入。",
  "《李敖所藏中国美术精品图说》中纯人物小传、艺术评价、藏品说明和风格判断不收；只收有问答、反转、行动和后果的小掌故。",
  "李敖自己的论文发表、藏画、受赠画和胡茵梦相关往事，按当前口径视为李敖自身事件，不收入。",
  "同一周越材料在论文和序文中重复出现时，只取故事性更完整、来源更靠前的一处。",
  "校对轮删去人物关系旁证和藏拓履历资料点；补入王著删章草、杨岘自号藐翁、宋人雕楮叶三条更能独立复述的故事。"
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
  if (/故事|轶事|奇闻|笑话|有趣|有一次|有一天|一天/u.test(paragraph)) score += 6;
  if (/问|答|说|曰|谓|云/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/死|杀|哭|病|赐|献|偷|盗|买|卖|骗/u.test(paragraph)) score += 2;
  if (/画|书|墨迹|真迹|伪|题|跋|皇帝|太后|和尚|尼姑/u.test(paragraph)) score += 2;
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphObjects(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.text.includes(marker));
      const quoteHeavy = (paragraph.text.match(/[“”]/gu) || []).length >= 6;
      const actionHeavy =
        /故事|轶事|奇闻|笑话|有趣|有一次|有一天|忽然|不料|结果|后来|最后|问|答|曰|谓|云|梦|死|杀|哭|病|赐|献|偷|盗|买|卖|骗/u.test(
          paragraph.text
        );
      if (!found.length && !quoteHeavy && !actionHeavy) return;
      const score = candidateScore(paragraph.text, found);
      if (score < 7 && !quoteHeavy) return;
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
  const proofreadAddLines = proofreadAdds.map((item) => `- ${item}`);
  const lines = [
    "# 中国艺术新研故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 校对轮删除：${manifest.proofreadDropCount} 条`,
    `- 校对轮补入：${manifest.proofreadAddCount} 条`,
    `- 校对轮保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《中国艺术新研》以书画史考证、序文、质询和藏品图说为主，材料常像论文证据或艺术小传。本轮只收李敖文中讲成可复述掌故的段落：有具体人物、动作、问答、反转或结果，并用来说明书画真伪、文物沉浮、士人风骨、书法观念或才子佳人想象。纯考证、图录说明、政治质询、人物履历和李敖自己的藏画经历不收。",
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
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，得到 ${manifest.candidateCount} 条候选。`,
    `- 校对轮保留 ${validation.count} 条；故事正文未改写，均按源文原段或段内原文截取。`,
    "- 周越论文和序文重复处，只取故事性更完整的一处，避免同一掌故重复入表。",
    "- 藏品图说只收掌故，不把每一位书画家的履历、评语和艺术风格说明都当作故事。",
    "- 董小宛条目收窄为同夜怪梦本身，不把后续考辨整段并入故事正文。",
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
  if (proofreadAddLines.length) {
    lines.push("", "## 校对轮补入", "", ...proofreadAddLines);
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
    proofreadAddCount: proofreadAdds.length,
    proofreadAdds,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖文中讲成可独立复述、带具体人物、动作、问答、反转或结果，并用来说明书画真伪、文物沉浮、士人风骨、书法观念或才子佳人想象的小故事；排除纯考证、图录说明、政治质询、人物履历和李敖自身藏画经历。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `校对轮保留 ${rows.length} 条，删除 ${proofreadDrops.size} 条资料点，补入 ${proofreadAdds.length} 条故事。`,
      "故事正文未改写，均按源文原段或段内原文截取。",
      "董小宛条目已收窄为同夜怪梦本身。",
      "周越研究相关重复材料只取一处。",
      "藏品图说中的人物小传和艺术评价不逐条拆为故事。"
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
