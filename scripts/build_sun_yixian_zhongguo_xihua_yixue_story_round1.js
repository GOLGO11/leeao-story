const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "孙逸仙和中国西化医学";
const SLUG = "sun_yixian_zhongguo_xihua_yixue";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "SYXY";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "012.人物研究类",
  "004.孙逸仙和中国西化医学"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "001",
    paragraph: 6,
    title: "黄帝蚩尤为盐池开战",
    start: "例如黄帝，这据说是中国历史上第一伟人",
    end: "有一个“盐池”！"
  },
  {
    prefix: "001",
    paragraph: 18,
    title: "司马笑认司马光欧游后裔",
    start: "我的一位外国朋友",
    end: "多做一项证据吧？"
  },
  {
    prefix: "001",
    paragraph: 281,
    title: "段祺瑞洗脚穿不上皮鞋"
  },
  {
    prefix: "003",
    paragraph: 24,
    title: "孙中山被逼拜神后毁神像"
  },
  {
    prefix: "003",
    paragraph: 38,
    title: "孙中山问良相良医"
  },
  {
    prefix: "004",
    paragraph: 29,
    title: "孙中山街遇嘉约翰学医"
  },
  {
    prefix: "004",
    paragraph: 84,
    title: "尢列因荔枝争执结识孙中山"
  },
  {
    prefix: "005",
    paragraph: 64,
    title: "孙中山陈少白宿舍互掷"
  },
  {
    prefix: "005",
    paragraph: 66,
    title: "同学笑孙中山是洪秀全"
  },
  {
    prefix: "006",
    paragraph: 19,
    title: "孙中山失踪写上李鸿章书"
  },
  {
    prefix: "007",
    paragraph: 14,
    title: "孙中山一药治澳门久病",
    start: "当先生在香港学医时",
    end: "挂牌行医。"
  },
  {
    prefix: "007",
    paragraph: 37,
    title: "孙中山开药房被校长劝阻"
  },
  {
    prefix: "007",
    paragraph: 58,
    title: "德彰说革命救多数人"
  },
  {
    prefix: "007",
    paragraph: 63,
    title: "程翁摘下孙某招牌"
  },
  {
    prefix: "007",
    paragraph: 67,
    title: "孙中山问徐翁畏杀头耶",
    end: "先生大笑。"
  },
  {
    prefix: "008",
    paragraph: 7,
    title: "孙中山不肯阴服中药"
  },
  {
    prefix: "008",
    paragraphs: [10, 11, 12, 13],
    title: "孙中山问中药方能否改西药"
  },
  {
    prefix: "008",
    paragraph: 33,
    title: "孙中山安抚大阪旅社疯子"
  },
  {
    prefix: "008",
    paragraph: 34,
    title: "孙中山从鼾声判断胃弱"
  },
  {
    prefix: "008",
    paragraph: 38,
    title: "孙中山用旧方治林百克幼子"
  },
  {
    prefix: "008",
    paragraph: 44,
    title: "孙中山疑信高野疗法后见效"
  }
];

const excludedByStandard = [
  "本书多为孙中山西化、基督教、西医教育和革命史的论证；只有观点、书目、年表、制度沿革、人物小传或史料索引的段落不按故事收。",
  "《新夷说（代序）》里长篇民族论证、西方影响表和大段引文，只取其中能独立复述且有具体行动转折的小故事；纯论点和材料表排除。",
  "同一故事已经在总库出现的继续排除；本轮排除了孙中山被门警误作工人、反对哥哥做都督、让后裔供祖宗、临终仍信西医、交代翻译议事法则等重复故事。",
  "《李敖全集》校对轮已删除的孙中山洋派作风小例子继续不回收，包括暂不剪小辫、不赞成暗杀、坚持改用阳历、劝从物理化学用功、拒绝题字写序、不收门生、不替人推荐等。",
  "只收李敖在文中转述、引用或点明其意义的、能独立复述且有人物行动、问答或转折的小故事；薄事实、纯语录、病例清单、政治论证链和伪传闻排除。"
];

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((name) => /^0\d{2}\..+\.txt$/u.test(name))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function readSource(fileName) {
  return decoder.decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName)));
}

function splitParagraphObjects(text) {
  const lines = text.replace(/\r/gu, "").split("\n");
  const paragraphs = [];
  let buffer = [];
  let startLine = 1;
  let endLine = 1;

  function flush() {
    if (!buffer.length) return;
    paragraphs.push({
      text: buffer.join("").trim(),
      startLine,
      endLine
    });
    buffer = [];
  }

  lines.forEach((line, index) => {
    if (line.trim()) {
      if (!buffer.length) startLine = index + 1;
      buffer.push(line.trim());
      endLine = index + 1;
    } else {
      flush();
    }
  });
  flush();
  return paragraphs.filter((item) => item.text);
}

function fileByPrefix(prefix) {
  const file = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!file) throw new Error(`Missing source file for prefix ${prefix}`);
  return file;
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/gu, "");
}

function charCount(text) {
  return Array.from(String(text || "")).length;
}

function excerpt(text, selection) {
  if (!selection.start && !selection.end) return text.trim();

  const startIndex = selection.start ? text.indexOf(selection.start) : 0;
  if (startIndex < 0) {
    throw new Error(`Start marker not found for ${selection.title}: ${selection.start}`);
  }
  const afterStart = selection.start ? startIndex + selection.start.length : 0;
  let endIndex = text.length;
  if (selection.end) {
    const foundEnd = text.indexOf(selection.end, afterStart);
    if (foundEnd < 0) throw new Error(`End marker not found for ${selection.title}: ${selection.end}`);
    endIndex = foundEnd + selection.end.length;
  }
  return text.slice(startIndex, endIndex).trim();
}

function buildRows() {
  return selections.map((selection, index) => {
    const sourceFile = fileByPrefix(selection.prefix);
    const paragraphs = splitParagraphObjects(readSource(sourceFile));
    const paragraphNumbers = selection.paragraphs || [selection.paragraph];
    const paragraphObjects = paragraphNumbers.map((paragraphNumber) => {
      const paragraph = paragraphs[paragraphNumber - 1];
      if (!paragraph) throw new Error(`Missing paragraph ${paragraphNumber} in ${sourceFile}`);
      return paragraph;
    });
    const joined = paragraphObjects.map((paragraph) => paragraph.text).join("\n");
    const storyText = excerpt(joined, selection);

    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: paragraphNumbers.map((paragraphNumber) => `${selection.prefix}#P${paragraphNumber}`).join(";"),
      source_file: sourceFile,
      source_lines: paragraphObjects.map((paragraph) => `${paragraph.startLine}-${paragraph.endLine}`).join(";"),
      char_count: charCount(storyText),
      story_text: storyText
    };
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/u.test(text) ? `"${text.replace(/"/gu, '""')}"` : text;
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
  const body = rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","));
  fs.writeFileSync(filePath, `${headers.join(",")}\n${body.join("\n")}${body.length ? "\n" : ""}`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const ch = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/u, ""));
  return rows
    .filter((cells) => cells.some((cell) => cell !== ""))
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])));
}

function readRowsFromCsv(filePath) {
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function writeTxt(filePath, rows) {
  const text = rows
    .map(
      (row) =>
        `【${row.id}】${row.title}\n` +
        `书名：${row.book}\n` +
        `来源：${row.source_file}:${row.source_lines}\n` +
        `字数：${row.char_count}\n\n` +
        `${row.story_text}\n---`
    )
    .join("\n\n");
  fs.writeFileSync(filePath, `${text}${text ? "\n" : ""}`, "utf8");
}

function normalizeAggregateRow(row, slug) {
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || slug,
    title: row.title,
    source_ids: row.source_ids || row.source_id || "",
    source_file: row.source_file,
    source_lines:
      row.source_lines || [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count || charCount(row.story_text),
    story_text: row.story_text
  };
}

function duplicateTextPairs(rows) {
  const seen = new Map();
  const duplicates = [];
  rows.forEach((row) => {
    const normalized = normalizeText(row.story_text);
    if (seen.has(normalized)) duplicates.push([seen.get(normalized), row.id]);
    else seen.set(normalized, row.id);
  });
  return duplicates;
}

function existingBookOrder() {
  const aggregatePath = path.join(ROOT, "data", "all_stories.csv");
  if (!fs.existsSync(aggregatePath)) return [];
  const order = [];
  readRowsFromCsv(aggregatePath).forEach((row) => {
    const slug = row.book_slug;
    if (slug && !order.includes(slug)) order.push(slug);
  });
  return order;
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
  return orderedSlugs.flatMap((slug) =>
    readRowsFromCsv(path.join(booksRoot, slug, `${ROUND}.csv`)).map((row) =>
      normalizeAggregateRow(row, slug)
    )
  );
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

const candidateMarkers = [
  "故事",
  "小故事",
  "笑话",
  "典故",
  "掌故",
  "逸事",
  "传说",
  "寓言",
  "讲故事",
  "举一个",
  "举例",
  "例子",
  "有一个",
  "有一次",
  "有一天",
  "从前",
  "过去",
  "当年",
  "后来",
  "最后",
  "问",
  "答",
  "说",
  "他说",
  "她说",
  "写道",
  "自述",
  "追忆",
  "逸事",
  "趣闻",
  "拒绝",
  "逃",
  "骂",
  "杀",
  "死",
  "哭",
  "笑",
  "跳",
  "赔",
  "请",
  "诊",
  "治",
  "病",
  "医",
  "学医",
  "行医",
  "医院",
  "药房",
  "题字",
  "孙中山",
  "孙逸仙",
  "孙文",
  "国父",
  "先生",
  "基督",
  "北帝庙",
  "番鬼仔",
  "嘉约翰",
  "嘉医生",
  "博济",
  "西医书院",
  "雅丽氏",
  "何启",
  "陈少白",
  "郑照",
  "郑士良",
  "尢列",
  "尢少纨",
  "杨鹤龄",
  "陆皓东",
  "孙眉",
  "德彰",
  "陈英士",
  "葛廉夫",
  "胡适",
  "徐翁",
  "中西药局",
  "东西药房",
  "高野太吉",
  "林百克",
  "Linebarger",
  "洪秀全",
  "孙行者",
  "黄帝",
  "蚩尤",
  "司马光",
  "司马笑",
  "段祺瑞",
  "吴稚晖",
  "李鸿章",
  "郑观应",
  "王韬",
  "革命",
  "改良",
  "救国",
  "起义",
  "檀岛",
  "澳门",
  "广州",
  "石岐",
  "大阪",
  "河内"
];

function candidateScore(paragraph, found) {
  let score = found.length;
  if (/故事|笑话|典故|掌故|寓言|漫画|我讲|讲一个|举一个|举例|例子|有一个|有一次/u.test(paragraph)) {
    score += 6;
  }
  if (/他说|她说|问|答|拒绝|逃|骂|杀|死|签名|冥婚|失弓/u.test(paragraph)) score += 3;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/记者|主旨|收件者|寄件者|报导|判决|全文如下|演讲会活动/u.test(paragraph)) score -= 2;
  if (/这个故事|以上.*故事/u.test(paragraph)) score += 3;
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
      if (score < 8 && !quoteHeavy) return;
      rows.push({
        file: fileName,
        paragraph: index + 1,
        lines: `${paragraph.startLine}-${paragraph.endLine}`,
        score,
        markers: found.join("|"),
        text: paragraph.text.replace(/\s+/gu, " ").slice(0, 1000)
      });
    });
  }
  rows.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file, "zh-Hans-CN"));
  fs.mkdirSync(path.dirname(path.join(ROOT, CANDIDATE_SCAN)), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, CANDIDATE_SCAN),
    `${[
      ["file", "paragraph", "lines", "score", "markers", "text"].join("\t"),
      ...rows.map((row) =>
        [row.file, row.paragraph, row.lines, row.score, row.markers, row.text]
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
  const text = fs.readFileSync(candidatePath, "utf8").trim();
  return text ? Math.max(0, text.split(/\r?\n/u).length - 1) : 0;
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    `# ${BOOK}故事校对轮`,
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 校对保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书多为孙中山西化、基督教、西医教育、行医经历和革命史的论证。校对轮只收李敖在文中转述、引用或点明其意义的、能独立复述、带人物行动或问答转折的小故事；纯资料引文、人物小传、制度沿革、书目考订、政治论证链、病例清单和既有总库重复故事不收。",
    "",
    "## 入选条目",
    "",
    ...(rows.length
      ? rows.map(
          (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
        )
      : ["- 无"]),
    "",
    "## 排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 校对调整",
    "",
    "- 删除：孙中山学会有而不有。理由：更像薄趣闻和题旨呼应，独立故事性不足。",
    "- 删除：何启以亡妻遗产建雅丽氏医院。理由：偏建院史材料，不是李敖用来说明道理的小故事。",
    "- 新增：孙中山问良相良医、孙中山一药治澳门久病、孙中山问中药方能否改西药。",
    "- 收短：孙中山被逼拜神后毁神像、孙中山失踪写上李鸿章书、孙中山问徐翁畏杀头耶，去掉背景铺陈或后续事件链。",
    "",
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 校对轮保留 ${validation.count} 条；提取轮 20 条中删 2 条、补 3 条，并收短 3 条。`,
    "- 正文均来自源文原段或段内原文截取，没有改写。",
    "- 已复核候选表、源码段落和总库关键短语；继续排除重复故事、薄事实、伪传闻、病例清单、人物小传、制度沿革、史料索引和政治论证链。",
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
  if (process.argv.includes("--scan-only")) {
    console.log(
      JSON.stringify(
        {
          book: BOOK,
          sourceRoot: path.relative(ROOT, SOURCE_ROOT),
          sourceFileCount: sourceFiles().length,
          candidateScan: CANDIDATE_SCAN,
          candidateCount: candidateCount()
        },
        null,
        2
      )
    );
    return;
  }

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
    status: STATUS,
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    sourceFileCount: sourceFiles().length,
    candidateScan: CANDIDATE_SCAN,
    candidateCount: candidateCount(),
    originalExtractionCount: 20,
    selectionCount: selections.length,
    proofreadDropCount: 2,
    proofreadAddCount: 3,
    proofreadTightenedCount: 3,
    proofreadDrops: ["孙中山学会有而不有", "何启以亡妻遗产建雅丽氏医院"],
    proofreadAdds: [
      "孙中山问良相良医",
      "孙中山一药治澳门久病",
      "孙中山问中药方能否改西药"
    ],
    proofreadTightened: [
      "孙中山被逼拜神后毁神像",
      "孙中山失踪写上李鸿章书",
      "孙中山问徐翁畏杀头耶"
    ],
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖在文中转述、引用或点明其意义的、可独立复述、带人物行动或问答转折的小故事；排除文献资料堆砌、人物小传、制度沿革、病例清单、政治论证链、纯语录、伪传闻和总库已有重复故事。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `校对轮保留 ${rows.length} 条；提取轮 20 条中删 2 条、补 3 条，并收短 3 条。`,
      "正文均按源文原段或段内原文截取。",
      "已用总库短语检索排除孙中山被门警误作工人、反对哥哥做都督、让后裔供祖宗、临终仍信西医、交代翻译议事法则等重复故事；同时排除《李敖全集》校对轮删除的洋派作风小例子、伪传闻、病例清单和政治论证链。"
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

  console.log(
    JSON.stringify(
      {
        book: BOOK,
        slug: SLUG,
        status: STATUS,
        count: rows.length,
        totalChars: validation.totalChars,
        aggregateCount: aggregate.rows.length,
        validationOk: validation.ok,
        candidateCount: candidateCount(),
        outDir: path.relative(ROOT, OUT_DIR),
        notes: path.relative(ROOT, NOTES_PATH)
      },
      null,
      2
    )
  );
}

main();
