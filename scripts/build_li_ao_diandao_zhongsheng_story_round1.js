const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖颠倒众生";
const SLUG = "li_ao_diandao_zhongsheng";
const ROUND = "story_round1";
const STATUS = "提取轮";
const ID_PREFIX = "LADZ";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const SLUG_BY_BOOK = {
  "李敖自传与回忆": "li_ao_zizhuan_yu_huiyi"
};
const PREFERRED_ORDER_PREFIX = ["li_ao_zizhuan_yu_huiyi", "li_ao_zizhuan_yu_huiyi_xuji"];

const selections = [
  {
    prefix: "001",
    paragraph: 11,
    title: "古人倒看榜成第一",
    start: "中国古代有一个人他去考试",
    end: "我倒数第一，我也是第一名。"
  },
  {
    prefix: "004",
    paragraph: 4,
    title: "穆生见醴酒不设便离开",
    start: "古代有一个故事",
    end: "重要的大家相处的标准。"
  },
  {
    prefix: "007",
    paragraph: 4,
    title: "钱穆考证被银雀山竹简推翻",
    start: "过去有一位有名的历史家叫做钱穆",
    end: "然后把他的理论推翻。"
  },
  {
    prefix: "009",
    paragraph: 13,
    title: "乔路易不把拳头打小流氓",
    start: "美国以前有一个有名的拳王叫做乔路易",
    end: "所任他们打架，我不要打架。"
  },
  {
    prefix: "009",
    paragraph: 16,
    title: "日本文官怕分发到韩国",
    start: "日本人在考试高考考完了分发的时候",
    end: "就是韩国人有正义感。"
  },
  {
    prefix: "010",
    paragraph: "9-10",
    title: "范子文说连杨森都跑掉",
    start: "这个范子文当时有个有趣的事情",
    end: "叫我们哭笑不得的话。"
  },
  {
    prefix: "010",
    paragraph: 13,
    title: "雷啸岑笑说干脆选蒋介石做皇帝",
    start: "这个老人活了年纪很大，他跟我讲个笑话",
    end: "当然这个构想是开玩笑的。"
  },
  {
    prefix: "013",
    paragraph: 13,
    title: "《亚玛》妓女为革命筹钱",
    start: "这个是什么故事呢？我告诉大家是俄国的一个有名妓院",
    end: "跟摸我手一样，有什么不同？"
  },
  {
    prefix: "014",
    paragraph: 6,
    title: "武二爷轿中说花书",
    start: "刚才我讲过这说花书的",
    end: "结果射出来了一背一脊梁。"
  },
  {
    prefix: "015",
    paragraph: 15,
    title: "李师科抢银行给小女孩",
    start: "有一个老兵叫李师科",
    end: "后来被枪毙了。"
  },
  {
    prefix: "016",
    paragraph: 14,
    title: "斯德哥尔摩人质跟强盗同流亡",
    start: "瑞典斯德哥尔摩一个银行的女职员",
    end: "他会认同那个强迫他做事的人。"
  },
  {
    prefix: "017",
    paragraph: 5,
    title: "张学良听戏时放何东鸽子",
    start: "他爸爸到了北方",
    end: "也会谅解这个情况。"
  },
  {
    prefix: "024",
    paragraph: "7-9",
    title: "吕后回信化解匈奴调情",
    start: "匈奴的领袖就听说刘邦死掉了",
    end: "而不是制造麻烦。"
  },
  {
    prefix: "037",
    paragraph: 7,
    title: "李夫人临死不让汉武帝看见病容",
    start: "李夫人就是这样子",
    end: "就是我跟你生离死别做的漂亮。"
  },
  {
    prefix: "037",
    paragraph: 8,
    title: "唐太宗为侯君集不再上凌烟阁",
    start: "唐太宗打天下有24个功臣帮他打天下",
    end: "你想想看唐太宗做的漂不漂亮？"
  },
  {
    prefix: "045",
    paragraph: 10,
    title: "王旦只认得随从后脑勺",
    start: "宋朝的丞相叫做王旦",
    end: "所以可以不认识他。"
  },
  {
    prefix: "047",
    paragraph: 14,
    title: "菲律宾司机宁选吃饱的马科斯",
    start: "他说他到菲律宾去的时候上了计程车",
    end: "吃的我们吃不消！"
  },
  {
    prefix: "049",
    paragraph: 4,
    title: "厨子回家炒菜也偷菜",
    start: "一个笑话是说，过去的厨子很穷",
    end: "你已没有了这个偷菜者的立场和身份了。"
  },
  {
    prefix: "052",
    paragraph: 5,
    title: "威尔森说美国利益就是通用利益",
    start: "当年美国的艾森豪总统",
    end: "是一致的。"
  },
  {
    prefix: "057",
    paragraph: 6,
    title: "丘吉尔裸身说对美国毫无保留",
    start: "就好像二次世界大战的时候",
    end: "还讲了这么一句话。"
  },
  {
    prefix: "057",
    paragraph: 9,
    title: "胡金铨问小图怎么不算黄色",
    start: "过去我记得已经死掉的一个名导演叫胡金铨",
    end: "他们不敢。"
  }
];

const excludedByStandard = [
  "李敖自己的竞选、官司、访客、出行、书信和现场节目经历，除非段内转述的是独立故事，否则排除。",
  "阿扁、李登辉、吕秀莲、尹清枫案等连续时政评论和案情整理，只有一句典故或比喻时不入选。",
  "嘉宾长段自述和主持人追问案情，原则上不作为李敖讲出的故事。",
  "纯历史事件、制度说明、文件材料、概念定义和一句机锋，缺少人物动作或问答反转的排除。",
  "同一书内重复出现的同一故事只取较完整、较适合独立复述的一处。"
];

const candidateMarkers = [
  "故事",
  "笑话",
  "寓言",
  "典故",
  "轶事",
  "趣闻",
  "有一次",
  "有一天",
  "过去有",
  "古代有",
  "我讲",
  "讲个",
  "讲一个",
  "我告诉",
  "我记得",
  "我想起",
  "我想到",
  "我举个例子",
  "乔路易",
  "匈奴",
  "汉武帝",
  "唐太宗",
  "王旦",
  "丘吉尔",
  "胡金铨",
  "厨子",
  "计程车"
];

function findSourceRoot() {
  const chaptersRoot = path.join(ROOT, "《大李敖全集6.0》分章节");
  const category = fs.readdirSync(chaptersRoot).find((name) => name.startsWith("010."));
  if (!category) throw new Error("Missing 010 source category");
  const categoryRoot = path.join(chaptersRoot, category);
  const bookDir = fs.readdirSync(categoryRoot).find((name) => name.startsWith("004."));
  if (!bookDir) throw new Error("Missing 004 book source");
  return path.join(categoryRoot, bookDir);
}

const SOURCE_ROOT = findSourceRoot();
const decoder = new TextDecoder("gb18030");

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((name) => /^\d{3}\..*\.txt$/u.test(name))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));
}

function readSource(fileName) {
  return decoder.decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName))).replace(/^\uFEFF/u, "");
}

function splitParagraphObjects(text) {
  const lines = text.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n").split("\n");
  const paragraphs = [];
  let buffer = [];
  let startLine = 0;

  const flush = (endLine) => {
    const paragraph = buffer
      .map((line) => line.trim())
      .join(" ")
      .replace(/\s+/gu, " ")
      .trim();
    if (paragraph) {
      paragraphs.push({ text: paragraph, startLine, endLine });
    }
    buffer = [];
    startLine = 0;
  };

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    if (!line.trim()) {
      if (buffer.length) flush(lineNo - 1);
      return;
    }
    if (!buffer.length) startLine = lineNo;
    buffer.push(line);
  });
  if (buffer.length) flush(lines.length);

  return paragraphs;
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!fileName) throw new Error(`Missing source file for prefix ${prefix}`);
  return fileName;
}

function paragraphForSelection(selection) {
  const fileName = fileForPrefix(selection.prefix);
  const paragraphs = splitParagraphObjects(readSource(fileName));
  if (typeof selection.paragraph === "string" && selection.paragraph.includes("-")) {
    const [start, end] = selection.paragraph.split("-").map((value) => Number(value));
    const picked = paragraphs.slice(start - 1, end);
    if (picked.length !== end - start + 1) {
      throw new Error(`Missing paragraph range ${selection.paragraph} in ${fileName}`);
    }
    return {
      fileName,
      sourceId: `${selection.prefix}#P${selection.paragraph}`,
      sourceLines: `${picked[0].startLine}-${picked[picked.length - 1].endLine}`,
      text: picked.map((paragraph) => paragraph.text).join("\n\n")
    };
  }

  const index = Number(selection.paragraph) - 1;
  const paragraph = paragraphs[index];
  if (!paragraph) throw new Error(`Missing paragraph ${selection.paragraph} in ${fileName}`);
  return {
    fileName,
    sourceId: `${selection.prefix}#P${selection.paragraph}`,
    sourceLines: `${paragraph.startLine}-${paragraph.endLine}`,
    text: paragraph.text
  };
}

function selectedText(selection, paragraphText) {
  let text = paragraphText;
  if (selection.start) {
    const startIndex = text.indexOf(selection.start);
    if (startIndex < 0) throw new Error(`Start marker not found for ${selection.title}`);
    text = text.slice(startIndex);
  }
  if (selection.end) {
    const endIndex = text.indexOf(selection.end);
    if (endIndex < 0) throw new Error(`End marker not found for ${selection.title}`);
    text = text.slice(0, endIndex + selection.end.length);
  }
  return text.trim();
}

function charCount(text) {
  return Array.from(text).length;
}

function normalizeText(text) {
  return text.replace(/\s+/gu, "");
}

function buildRows() {
  return selections.map((selection, index) => {
    const paragraph = paragraphForSelection(selection);
    const storyText = selectedText(selection, paragraph.text);
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: paragraph.sourceId,
      source_file: paragraph.fileName,
      source_lines: paragraph.sourceLines,
      char_count: charCount(storyText),
      story_text: storyText
    };
  });
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (/[",\r\n]/u.test(stringValue)) {
    return `"${stringValue.replace(/"/gu, '""')}"`;
  }
  return stringValue;
}

function writeCsv(filePath, rows) {
  const columns = [
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
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const body = rows
    .map((row) =>
      [
        `【${row.id}】${row.title}`,
        `书名：${row.book}`,
        `来源：${row.source_file}:${row.source_lines}`,
        `字数：${row.char_count}`,
        "",
        row.story_text,
        "---"
      ].join("\n")
    )
    .join("\n\n");
  fs.writeFileSync(filePath, `${body}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
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
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...records] = rows.filter((item) => item.length > 1 || item[0]);
  if (!header) return [];
  const columns = header.map((column) => column.replace(/^\uFEFF/u, ""));
  return records.map((record) =>
    Object.fromEntries(columns.map((column, index) => [column, record[index] ?? ""]))
  );
}

function readRowsFromCsv(filePath) {
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function normalizeAggregateRow(row, bookSlug) {
  const storyText = row.story_text || row.text || "";
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || bookSlug || SLUG_BY_BOOK[row.book] || "",
    title: row.title,
    source_ids: row.source_ids || row.source_id || "",
    source_file: row.source_file,
    source_lines:
      row.source_lines || [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count || charCount(storyText),
    story_text: storyText
  };
}

function duplicateTextPairs(rows) {
  const seen = new Map();
  const duplicates = [];
  rows.forEach((row) => {
    const normalized = normalizeText(row.story_text);
    if (seen.has(normalized)) {
      duplicates.push([seen.get(normalized), row.id]);
    } else {
      seen.set(normalized, row.id);
    }
  });
  return duplicates;
}

function existingBookOrder() {
  const aggregatePath = path.join(ROOT, "data", "all_stories.csv");
  if (!fs.existsSync(aggregatePath)) return [];
  const rows = readRowsFromCsv(aggregatePath);
  const order = rows
    .map((row) => row.book_slug || SLUG_BY_BOOK[row.book])
    .filter(Boolean);
  const unique = [...new Set(order)];
  return [
    ...PREFERRED_ORDER_PREFIX.filter((slug) => unique.includes(slug)),
    ...unique.filter((slug) => !PREFERRED_ORDER_PREFIX.includes(slug))
  ];
}

function buildAggregateRows() {
  const booksRoot = path.join(ROOT, "data", "books");
  const slugs = fs
    .readdirSync(booksRoot)
    .filter((slug) => fs.existsSync(path.join(booksRoot, slug, `${ROUND}.csv`)));
  const order = existingBookOrder();
  const orderedSlugs = [
    ...order.filter((slug) => slugs.includes(slug)),
    ...slugs.filter((slug) => !order.includes(slug)).sort()
  ];
  const rows = [];
  orderedSlugs.forEach((slug) => {
    rows.push(
      ...readRowsFromCsv(path.join(booksRoot, slug, `${ROUND}.csv`)).map((row) =>
        normalizeAggregateRow(row, slug)
      )
    );
  });
  return rows;
}

function writeAggregate() {
  const rows = buildAggregateRows();
  const books = [];
  rows.forEach((row) => {
    let book = books.find((item) => item.slug === row.book_slug);
    if (!book) {
      book = { book: row.book, slug: row.book_slug, count: 0 };
      books.push(book);
    }
    book.count += 1;
  });

  writeCsv(path.join(ROOT, "data", "all_stories.csv"), rows);
  writeTxt(path.join(ROOT, "data", "all_stories.txt"), rows);

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
  if (/故事|笑话|轶事|趣闻|典故|寓言/u.test(paragraph)) score += 6;
  if (/问|答|说|讲/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/哭|笑|杀|逃|打|骗|偷|抓|跪|求|死|梦|醒|嫁|娶|抢|跑|问|答/u.test(paragraph)) {
    score += 2;
  }
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphObjects(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.text.includes(marker));
      const quoteHeavy = (paragraph.text.match(/[“”]/gu) || []).length >= 6;
      if (!found.length && !quoteHeavy) return;
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
  const lines = [
    "# 李敖颠倒众生故事提取轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖颠倒众生》是节目逐字稿，主体是时政解读、官司回应、资料展示和访谈。提取轮只收李敖在文中讲成可独立复述、带人物行动或问答反转、并用来说明道理的小故事、笑话、典故、掌故和文学故事；不把李敖自己的事件、纯案情复盘、嘉宾叙述和概念解释当故事。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 提取说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 本轮入选 ${validation.count} 条，单书总字数 ${validation.totalChars}。`,
    "- 故事正文均来自源文原段或段内原文截取，没有改写。",
    "- 对长段只截故事本体和必要的原文收束语，尽量切掉后续时政评论和现场追问。",
    "- 对真实政治案件、新闻材料和李敖自身经历保持收紧，只保留被李敖讲成独立故事或笑话的一小段。",
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
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖讲成可独立复述、带人物行动或问答反转、并用于说明道理的小故事、笑话、典故、掌故和文学故事；排除李敖自身事件、纯时政连续叙述、文件材料、嘉宾长段自述和无情节概念。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮入选 ${rows.length} 条。`,
      "正文均按源文原段或段内原文截取。",
      "本轮特别收紧节目中的政治案情和李敖自身经历，避免做成事件合集。"
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
        sourceFileCount: manifest.sourceFileCount,
        candidateCount: manifest.candidateCount,
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
