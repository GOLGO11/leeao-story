const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "启发你的小故事";
const SLUG = "qifa_nide_xiaogushi";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "QFNXGS";
const ORIGINAL_EXTRACTION_COUNT = 7;
const PROOFREAD_DROP_COUNT = 0;
const PROOFREAD_ADD_COUNT = 6;
const PROOFREAD_TIGHTENED_COUNT = 0;
const PROOFREAD_TITLE_ADJUSTED_COUNT = 0;
const CORPUS_ROOT = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
const CATEGORY_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT))
  .find((name) => name.startsWith("016."));
const BOOK_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR))
  .find((name) => name.startsWith("005."));
const SOURCE_ROOT = path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR, BOOK_DIR);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "004",
    paragraphs: [2, 3],
    title: "追贼反跑到贼前面"
  },
  {
    prefix: "014",
    paragraph: 2,
    title: "士兵割耳朵交差"
  },
  {
    prefix: "014",
    paragraph: 3,
    title: "盐兵逼民为盗"
  },
  {
    prefix: "047",
    paragraph: 3,
    title: "严复把鸡汤当芥菜汤"
  },
  {
    prefix: "047",
    paragraph: 5,
    title: "宋孝宗察觉素膳混了鸡汁"
  },
  {
    prefix: "047",
    paragraph: 7,
    title: "熊十力怎样端鸡汤都不对",
    start: "我的同学徐武军",
    end: "怎么做都不成。"
  },
  {
    prefix: "047",
    paragraph: 8,
    title: "詹森看空桌满桌都能挑错",
    start: "美国詹森总统",
    end: "这证明你的工作效率太低了！”"
  },
  {
    prefix: "005",
    paragraph: 6,
    title: "老士官只请对方吃客饭"
  },
  {
    prefix: "005",
    paragraph: 7,
    title: "席德进只肯请小杯橘子汁"
  },
  {
    prefix: "013",
    paragraph: 2,
    title: "邱延亮说吃老百姓的饭",
    end: "我吃老百姓的饭！”"
  },
  {
    prefix: "016",
    paragraph: 6,
    title: "孙中山失败后仍在读书",
    start: "孙中山在辛亥革命前",
    end: "这种强毅内敛，是很难能的。"
  },
  {
    prefix: "020",
    paragraph: 11,
    title: "赫尔只判断羊的这一面",
    start: "美国前国务卿赫尔",
    end: "羊的这一面是白的。”"
  },
  {
    prefix: "050",
    paragraph: 8,
    title: "丘吉尔宣战也不失客气",
    start: "丘吉尔在二次大战时",
    end: "不妨客气一点。"
  }
];

const excludedByStandard = [
  "本书虽以小故事为名，主体仍有大量李敖自身经历、政治评论、官司材料和人物事件；校对后只收可独立复述，有场景、行动、转折或结果，并被用来说明道理的故事。",
  "李敖自己的求学、服役、坐牢、交游、办刊、论战和官司一律不收；政治案件、新闻材料、人物履历、语录和只有结论的薄例子也不按故事收入。",
  "002章董其昌见《伯远帖》只是一则题跋掌故，叙事过薄，不收；004章《贼在后面》笑话有完整追逐与反转，保留。",
  "005章老士官请客与席德进只准点小杯饮料，故事主体均不是李敖，且有人物行动和反转，校对新增；李敖本人赴林佛儿饭局不收。",
  "007章胡适、李定一不识梦露已由LZXJ003收录；010章艾森豪戒烟已由SQWLW008收录。",
  "012章孙悟空被二郎神的狗咬住，已由LADG039收录；其余西游记情节不再拆收。",
  "013章邱延亮以‘吃老百姓的饭’回敬蒋纬国，故事主体不是李敖，且有完整场景与点题反转，校对截取故事本身新增；后续刑期和政治分析不混入正文。",
  "014章缴耳朵与缴私盐均有考核办法、人物应对和荒诞后果，继续保留；李敖亲历的缴小偷、缴罚单、缴匪谍不收。",
  "016章孙中山在革命失败时仍读书，具备逆境、人物行动和鲜明对照，校对截取故事本身新增；刘秀赞吴汉败后备战已由LAYT002收录。",
  "020章赫尔只判断眼前羊毛颜色，是用问答说明谨慎判断的完整微型故事，校对新增；清教徒躲海盗已由BBS005等收录，巴顿掌掴小兵已由BBS006收录。",
  "024章罗宾汉临终射箭已由HS11004收录；036章大卫弹弓击中歌利亚已由YWMG009收录；039章梁启超宁让犯人逃掉已由LAQJ003收录。",
  "047章四则鸡汤故事各自叙事闭合且未发现总库同核条目，分别收入；只截取故事及必要出处，不混入李敖后续评论。",
  "050章丘吉尔对日宣战时字斟句酌、受人取笑后作答，具备情境、行动与回应，校对截取故事本身新增；其余书信、声明、评论和案件链不收。",
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
    .filter((name) => /^\d{3}\..+\.txt$/u.test(name))
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
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书虽以小故事为名，仍混有大量李敖自身经历、政治评论、官司与人物材料。校对轮逐条复核故事主体：李敖只是叙述者不等于李敖自己的事件；只要故事主体是他人，且有明确人物行动、转折或结果并用于说明道理，即可收入。李敖本人作为行动主体的经历仍一律排除。",
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
    "- 提取轮原有7则全部保留；校对新增6则，校对后共13则。",
    "- 新增QFNXGS008至QFNXGS013均追加在原编号之后，保持提取轮7个ID稳定。",
    "- QFNXGS010至QFNXGS013只截取故事本身，未混入刑期分析、人物晚年评论、现实评论或李敖自身写作语境。",
    "- 艾森豪、清教徒、巴顿、厕所道歉、罗宾汉、吴汉、大卫、孙悟空与梁启超等故事均已定位总库既有条目，本书不重复。",
    "- 董其昌题《伯远帖》仍因叙事过薄排除；梁实秋遭搜索仍属政治事件考证，不拆作故事。",
    "- 李敖自己的求学、服役、坐牢、办刊、交游、论战和官司，以及政治案件与新闻材料，均不拆作故事。",
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
      "校对轮逐条复核叙事闭合度、故事主体、原文连续性与总库重复；李敖只是叙述者不构成排除，只有李敖本人作为行动主体的经历才排除；保留可脱离政治评论和案件链独立复述，有明确人物行动、转折或结果，并用于说明道理的紧凑故事；排除薄题跋、纯语录、新闻资料和总库已有同核故事。",
    excludedByStandard,
    duplicateChecks: [
      "校对后13则均用人物、关键动作和结果的不同组合反查总库；原有7则继续未发现同核条目。",
      "新增6则以老士官与客饭、席德进与小杯橘汁、邱延亮与老百姓的饭、孙中山与革命失败后读书、赫尔与羊毛颜色、丘吉尔与客气宣战等组合检索，未发现同核条目。",
      "艾森豪戒烟定位SQWLW008，胡适与李定一不识梦露定位LZXJ003，清教徒抗海盗定位BBS005，巴顿掌掴小兵定位BBS006。",
      "厕所道歉定位LASHF001，罗宾汉临终定位HS11004，吴汉差强人意定位LAYT002，大卫弹弓定位YWMG009，孙悟空被狗咬定位LADG039，梁启超法律逃掉定位LAQJ003。",
      "同书重复讲述的主题优先按总库既有故事去重，不因本书文字版本略有不同而重复收入。"
    ],
    proofreadAdds: [
      {
        id: "QFNXGS008",
        title: "老士官只请对方吃客饭",
        sourceIds: "005#P6",
        reason: "故事主体是两名老士官，李敖只是交代背景；请客者自己不吃、只请对方吃一份客饭，具备完整场景与反转。"
      },
      {
        id: "QFNXGS009",
        title: "席德进只肯请小杯橘子汁",
        sourceIds: "005#P7",
        reason: "客人点饮料时席德进立刻叮嘱只要小杯，以一个动作完成吝啬性格的反转。"
      },
      {
        id: "QFNXGS010",
        title: "邱延亮说吃老百姓的饭",
        sourceIds: "013#P2",
        reason: "蒋纬国责问、邱延亮回敬，场景与点题对白完整；只截取故事本身，不收入后续政治分析。"
      },
      {
        id: "QFNXGS011",
        title: "孙中山失败后仍在读书",
        sourceIds: "016#P6",
        reason: "革命失败后众人消沉，来访者却发现孙中山仍读书，人物行动与对照明确。"
      },
      {
        id: "QFNXGS012",
        title: "赫尔只判断羊的这一面",
        sourceIds: "020#P11",
        reason: "问羊的颜色而只确认眼前一面为白，是用问答说明谨慎判断的完整微型故事。"
      },
      {
        id: "QFNXGS013",
        title: "丘吉尔宣战也不失客气",
        sourceIds: "050#P8",
        reason: "丘吉尔对日宣战时字斟句酌，受人取笑后作答，具备情境、行动与回应。"
      }
    ],
    proofreadDrops: [],
    proofreadTightened: [],
    proofreadTitleAdjusted: [],
    proofreadContextCompleted: [],
    proofreadNotes: [
      "提取轮原有7则全部保留，校对新增6则，校对后共13则。",
      "新增条目追加为QFNXGS008至QFNXGS013，原有QFNXGS001至QFNXGS007编号不变。",
      "校对修正了‘出现李敖背景就一律排除’的过严判断：李敖只是叙述者时，仍按故事主体是否为李敖本人判断。",
      "邱延亮、孙中山、赫尔和丘吉尔四则均截取连续原文中的故事部分，未混入后续评论。",
      "董其昌题跋、梁实秋搜索事件、李敖赴林佛儿饭局及其他李敖自身经历继续排除。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮保留 ${ORIGINAL_EXTRACTION_COUNT} 条，正文均能回到连续原文。`,
      "全部194个机器候选均已浏览，其中56个五分以上、22个六分以上候选重点回看上下文。",
      "入选集中在带反转的笑话、制度诱发荒诞行为的历史故事，以及四则叙事闭合的名人鸡汤故事。",
      "李敖自己的经历、政治案件与新闻事件链、人物事迹摘要、纯语录和薄例子不按故事收入。",
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
