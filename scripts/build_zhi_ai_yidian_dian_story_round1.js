const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "只爱一点点";
const SLUG = "zhi_ai_yidian_dian";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "ZAYDD";
const ORIGINAL_EXTRACTION_COUNT = 5;
const PROOFREAD_DROP_COUNT = 0;
const PROOFREAD_ADD_COUNT = 5;
const PROOFREAD_TIGHTENED_COUNT = 2;
const PROOFREAD_TITLE_ADJUSTED_COUNT = 0;
const CORPUS_ROOT = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
const CATEGORY_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT))
  .find((name) => name.startsWith("016."));
const BOOK_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR))
  .find((name) => name.startsWith("007."));
const SOURCE_ROOT = path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR, BOOK_DIR);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "004",
    paragraph: 6,
    title: "狄士累利婚后赢得妻子的爱情"
  },
  {
    prefix: "007",
    paragraph: 5,
    title: "杨孜骗妓女先喝毒酒",
    start: "据《类苑》所记",
    end: "可是已来不及了。"
  },
  {
    prefix: "011",
    paragraph: 9,
    title: "碧姬芭杜阉掉邻居的公驴",
    start: "报载法国女星碧姬芭杜",
    end: "竟快刀阉之。"
  },
  {
    prefix: "030",
    paragraph: 6,
    title: "官升一级夫妻也跟着变大"
  },
  {
    prefix: "035",
    paragraph: 3,
    title: "龚德柏自称中日两边的救星",
    end: "则中国早就给日本侵略成功了。"
  },
  {
    prefix: "022",
    paragraph: 2,
    title: "哲学家用美腿丑腿判断朋友",
    start: "富兰克林说他有一位研究哲学的老朋友",
    end: "这种朋友才可交。"
  },
  {
    prefix: "029",
    paragraph: 12,
    title: "舞厅老干部只准放慢华尔兹",
    start: "笔者曾走访中国一些大城市",
    end: "但他们专门替叶帅扯皮条。”"
  },
  {
    prefix: "029",
    paragraph: 14,
    title: "皮条客借叶帅名声抬高妓女身价"
  },
  {
    prefix: "029",
    paragraph: 16,
    title: "叶剑英临终仍拉着年轻姑娘",
    start: "据一位曾参加治疗叶剑英的医生说",
    end: "与世长辞。"
  },
  {
    prefix: "029",
    paragraph: 23,
    title: "权贵子弟付钱后反诬服务员偷钱",
    start: "来自上海公安局的干部说：今年一月在上海",
    end: "赔了三百元给该公子。"
  }
];

const excludedByStandard = [
  "本书主体包括爱情与性评论、李敖自身经历、政治讽刺、新闻与司法材料；校对后只收可独立复述，有场景、行动、转折或结果，并被李敖用来说明道理的故事。",
  "李敖自己的恋爱、婚姻、坐牢、写信、办刊、论战和官司不收；人物履历、新闻与案件链、资料摘录、历史概述、纯语录和薄例子也不按故事收入。",
  "004章只收狄士累利夫妻从金钱婚姻到真感情的完整轶事；他不读别人书、格兰斯顿不吊丧和女王墓前落泪等均过薄，不拆收。",
  "007章刘玉川骗妓女喝毒酒已由TZLA042等收录；另收叙事独立的杨孜假殉情故事。陈素卿案和其他殉情记录属于案件与事件链，不收。",
  "008章简雍以淫具反讽刘备已由GTWRNK009收录；009章狄奥根尼请亚历山大让开阳光已由XNDNQT003收录。",
  "011章八国联军比大小与旅馆驴啼笑分别已由SSSA012、SSSA013收录；碧姬芭杜受托照看公驴却将其阉掉，具备托付、行动和反讽结果，收入。",
  "022章新增富兰克林转述的美腿丑腿择友故事；富兰克林生平与《美腿与丑腿》的观点概述不拆作故事。",
  "024章亚当夏娃吃禁果后被逐的叙事核心已由ZLJBB028收录，不因本书引文更长而重复。",
  "029章只收四则具备具体场景、人物行动、对白或反讽结果的转述故事；叶剑英情史、王兴夜生活、高干子弟犯罪数字等履历与事件链不拆收。",
  "030章《笑林广记》升官后夫妻都变大的笑话有完整问答与反转，收入；032章老大老二对话是李敖坐牢经历，不收。",
  "034章状元不如鸡巴已由NSJFM005收录；035章老和尚捅破鼓皮已由SSSA005收录，另收龚德柏以一句反话自居中日两边救星的轶事。",
  "038章贯高不诬张敖已由SXGJT004收录；其余政治、妓业、司法和新闻材料不拆作故事。",
  "044章为寻乐哲学论述，苏东坡、佛印、鲁智深、杨朱等仅作人物或观点举例，没有独立展开成故事，不收。",
  "同一故事或同一核心正文如已在总库收过，本轮不因版本或措辞不同而重复。"
];

const candidateMarkers = [
  "故事",
  "小故事",
  "典故",
  "掌故",
  "逸事",
  "传说",
  "笑话",
  "讲故事",
  "举一个",
  "举例",
  "例子",
  "有一个",
  "有一次",
  "有一天",
  "当年",
  "后来",
  "最后",
  "原来",
  "忽然",
  "结果",
  "问",
  "答",
  "说",
  "他说",
  "她说",
  "写道",
  "自述",
  "回忆",
  "追忆",
  "哭",
  "笑",
  "骂",
  "骗",
  "逃",
  "跑",
  "杀",
  "死",
  "枪毙",
  "活捉",
  "强奸",
  "奸杀",
  "跪",
  "求",
  "请",
  "打电话",
  "请我吃饭",
  "龙应台",
  "龙爸爸",
  "蒋介石",
  "蒋经国",
  "宋美龄",
  "马英九",
  "彭明敏",
  "彭克立",
  "张灵甫",
  "杜聿明",
  "黄维",
  "刘峙",
  "雷震",
  "潘毓刚",
  "钱复",
  "余光中",
  "齐邦媛",
  "王尚义",
  "张乐平",
  "萧乾",
  "三毛",
  "国民党",
  "共产党",
  "外省人",
  "台湾人",
  "一九四九",
  "二二八",
  "长春",
  "太原",
  "人头",
  "密码",
  "人质",
  "说客",
  "监牢",
  "血祭",
  "逃难",
  "投降",
  "叛变"
];

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((name) => /^\d{3}(?:\.|(?=\D)).*\.txt$/u.test(name))
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
    paragraphs.push({ text: buffer.join("").trim(), startLine, endLine });
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
    const storyText = excerpt(
      paragraphObjects.map((paragraph) => paragraph.text).join("\n"),
      selection
    );

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

function candidateScore(paragraph, found) {
  let score = found.length;
  if (/故事|典故|掌故|我讲|讲一个|举一个|举例|例子|有一个|有一次|有一天/u.test(paragraph)) {
    score += 6;
  }
  if (/他说|她说|问|答|拒绝|逃|跑|杀|死|坐牢|抓|骗|哭|笑|骂|枪毙|活捉|强奸|奸杀/u.test(paragraph)) {
    score += 3;
  }
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/目录|注释|档案|资料|表格|名单|新闻|访问|采访|调查|日记|电文|公文|原文如下/u.test(paragraph)) {
    score -= 2;
  }
  if (/这个故事|以上.*故事|这件事|这段话/u.test(paragraph)) score += 2;
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
        text: paragraph.text.replace(/\s+/gu, " ").slice(0, 1200)
      });
    });
  }
  rows.sort(
    (a, b) =>
      b.score - a.score ||
      a.file.localeCompare(b.file, "zh-Hans-CN") ||
      a.paragraph - b.paragraph
  );
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

function writeBroadCandidateScan() {
  execFileSync(
    process.execPath,
    [path.join(ROOT, "scripts", "scan_book_story_candidates.js"), SOURCE_ROOT, path.join(ROOT, CANDIDATE_SCAN)],
    { stdio: "inherit" }
  );
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    `# 《${BOOK}》校对轮`,
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮原有：${manifest.originalExtractionCount} 条`,
    `- 校对后保留：${validation.count} 条`,
    `- 校对新增：${manifest.proofreadAddCount} 条`,
    `- 校对删除：${manifest.proofreadDropCount} 条`,
    `- 校对收紧：${manifest.proofreadTightenedCount} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书主体包括爱情与性评论、李敖自身经历、政治讽刺、新闻与司法材料。校对轮继续只保留能脱离论述独立复述，有人物行动、转折或结果，并被李敖拿来说明道理的故事；李敖本人作为行动主体的经历一律排除。第三方转述只有在形成完整场景、行动与结果时才收入。",
    "",
    "## 入选条目",
    "",
    ...(rows.length
      ? rows.map((row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`)
      : ["- 无"]),
    "",
    "## 排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 逐篇复核 ${manifest.sourceFileCount} 个正文文件和全部机器候选，并反向检索故事、笑话、传说、有一次、有一天等叙事标记。`,
    `- 提取轮原有${manifest.originalExtractionCount}则全部保留；校对新增${manifest.proofreadAddCount}则，校对后共${rows.length}则。`,
    "- 新增ZAYDD006至ZAYDD010接在原编号之后，保持ZAYDD001至ZAYDD005稳定。",
    "- ZAYDD003删去阉驴故事后的反问评论，ZAYDD005删去龚德柏故事后的现实类比，只保留叙事本身。",
    "- 新增条目均从低分候选和第三方转述中回看得到，具备人物、场景、行动、对白或结果，不把整段人物履历和新闻事件链收入。",
    "- 002、007、008、009、011、024、034、035、038章的同核故事均已定位总库既有条目，本书不重复。",
    "- 李敖自己的恋爱、婚姻、坐牢、写信、办刊、论战和官司，以及人物履历、新闻／案件链、资料摘录和薄例子，均不拆作故事。",
    "- 单书正文均为原文连续段落，未跨段拼接或改写。",
    `- 总库语义去重记录：${manifest.duplicateChecks.length} 组。`,
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
  if (!CORPUS_ROOT || !CATEGORY_DIR || !BOOK_DIR) throw new Error("Missing source directory");
  writeBroadCandidateScan();
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
    selectionCount: selections.length,
    originalExtractionCount: ORIGINAL_EXTRACTION_COUNT,
    proofreadAddCount: PROOFREAD_ADD_COUNT,
    proofreadDropCount: PROOFREAD_DROP_COUNT,
    proofreadTightenedCount: PROOFREAD_TIGHTENED_COUNT,
    proofreadTitleAdjustedCount: PROOFREAD_TITLE_ADJUSTED_COUNT,
    proofreadRetainedCount: rows.length,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "校对轮逐条复核叙事闭合度、故事主体、原文连续性与总库重复，并回看低分候选与第三方转述；李敖只是叙述者不构成排除，只有李敖本人作为行动主体的经历才排除；保留可脱离评论、传记和案件链独立复述，有明确人物行动、转折或结果，并用于说明道理的故事；排除薄事实、纯语录、资料清单、新闻事件链和总库已有同核故事。",
    excludedByStandard,
    duplicateChecks: [
      "校对后10则已用人物、关键动作与结果的不同组合反查总库，未发现同文或同核条目。",
      "新增美腿丑腿择友、舞厅慢华尔兹、维族妓女身价、叶剑英临终与三百元诬盗故事，均以人物、动作、对白和结果组合检索，未发现同核条目。",
      "《甜蜜的十一月》定位TZLA063、LAMS033、LATS019等；刘玉川假殉情定位TZLA042、LAXAJH005等。",
      "简雍以淫具反讽刘备定位GTWRNK009；狄奥根尼请亚历山大让开阳光定位XNDNQT003。",
      "八国联军比大小定位SSSA012，旅馆驴啼笑定位SSSA013，状元不如鸡巴定位NSJFM005，老和尚捅破鼓皮定位SSSA005。",
      "贯高不诬张敖定位SXGJT004；亚当夏娃吃禁果被逐定位ZLJBB028，均按同核故事排除。",
      "同书重复讲述的主题优先按总库既有故事去重，不因本书文字版本略有不同而重复收入。"
    ],
    proofreadAdds: [
      {
        id: "ZAYDD006",
        title: "哲学家用美腿丑腿判断朋友",
        sourceIds: "022#P2",
        reason: "哲学家以访客注意美腿还是丑腿决定是否交往，具备人物设定、判断动作与明确结果。"
      },
      {
        id: "ZAYDD007",
        title: "舞厅老干部只准放慢华尔兹",
        sourceIds: "029#P12",
        reason: "舞厅中老干部喝止年轻军官播放迪斯科，并被点明是替叶帅扯皮条的顾问，场景和反讽完整。"
      },
      {
        id: "ZAYDD008",
        title: "皮条客借叶帅名声抬高妓女身价",
        sourceIds: "029#P14",
        reason: "扫黄、盘问、皮条客解释高价缘由形成完整问答与讽刺结果。"
      },
      {
        id: "ZAYDD009",
        title: "叶剑英临终仍拉着年轻姑娘",
        sourceIds: "029#P16",
        reason: "医生转述叶剑英临终拉着年轻姑娘并告诫儿子，形成闭合的临终轶事。"
      },
      {
        id: "ZAYDD010",
        title: "权贵子弟付钱后反诬服务员偷钱",
        sourceIds: "029#P23",
        reason: "权贵子弟强买性服务后反称钱被偷，警方查明仍由局长赔钱，具备行动、反转和结果。"
      }
    ],
    proofreadDrops: [],
    proofreadTightened: [
      {
        id: "ZAYDD003",
        reason: "删去故事结束后的反问评论，只保留受托看驴却将公驴阉掉的叙事。"
      },
      {
        id: "ZAYDD005",
        reason: "删去龚德柏说完反话后的现实类比，只保留轶事场景与原话。"
      }
    ],
    proofreadTitleAdjusted: [],
    proofreadContextCompleted: [],
    proofreadNotes: [
      "提取轮原有5则全部保留，校对新增5则，校对后共10则。",
      "ZAYDD003与ZAYDD005收紧正文边界，标题与编号不变。",
      "新增5则均来自提取轮已扫描但当时按低分或材料段落暂缓的候选，校对后确认其叙事闭合。",
      "张敞画眉已由LAQJ001收录；李逵被张顺灌水、尾生溺死等仍属薄引或典故提示，不拆收。",
      "红色与美色只收四则可独立复述的转述故事，王兴夜生活、叶剑英情史与高干犯罪统计仍按事件链排除。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮保留 ${ORIGINAL_EXTRACTION_COUNT} 条，正文均能回到连续原文。`,
      "全部机器候选均已浏览，高分候选逐段回看上下文；另人工复核候选扫描未命中的006、021、023号正文。",
      "入选集中在古今人物轶事、反讽笑话与第三方微型故事。",
      "李敖自己的经历、人物履历、政治与司法案件链、新闻材料、纯语录和薄例子不按故事收入。",
      "同核故事已按人物、关键动作与规范化正文对总库检索并排除。"
    ],
    aggregateDuplicateTextIds: aggregate.duplicateTextIds,
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
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
