const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "从万宝囊到臭屎堆";
const SLUG = "cong_wanbaonang_dao_choushidui";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "CWNDCSD";
const ORIGINAL_EXTRACTION_COUNT = 8;
const PROOFREAD_DROP_COUNT = 0;
const PROOFREAD_ADD_COUNT = 1;
const PROOFREAD_TIGHTENED_COUNT = 1;
const PROOFREAD_TITLE_ADJUSTED_COUNT = 1;
const CORPUS_ROOT = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
const CATEGORY_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT))
  .find((name) => name.startsWith("016."));
const BOOK_DIR = fs
  .readdirSync(path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR))
  .find((name) => name.startsWith("008."));
const SOURCE_ROOT = path.join(ROOT, CORPUS_ROOT, CATEGORY_DIR, BOOK_DIR);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "008",
    paragraph: 7,
    title: "溥仪拜天照大神时心拜祖宗"
  },
  {
    prefix: "013",
    paragraph: 6,
    title: "希特勒追查泄密却查到公开资料",
    start: "当年德国在希特勒",
    end: "这一本领，令人惊叹不置。"
  },
  {
    prefix: "025",
    paragraph: 5,
    title: "傅斯年用秘书长反问程沧波",
    start: "他回忆傅斯年，有这样一段：",
    end: "人世间几个人能做有聊的事！’”"
  },
  {
    prefix: "012",
    paragraph: 6,
    title: "日本领事摆宴送闽变大员逃亡",
    end: "他们坐上日本军舰，“浪迹东西”了。"
  },
  {
    prefix: "028",
    paragraph: 9,
    title: "王季高先逃反被傅作义追截",
    end: "请将王季高截回。"
  },
  {
    prefix: "029",
    paragraphs: [13, 14],
    title: "飞行员骗逃难者下机后载走财物",
    start: "再看当时国民党辽宁省政府田赋粮食管理处处长兼东北剿总军粮采购委员会少将副主任胡圣一《回顾沈阳解放》一文回忆："
  },
  {
    prefix: "030",
    paragraph: 71,
    title: "据称归俘因已进忠烈祠而被守军打死",
    start: "我做预备军官排长的时候",
    end: "都在城门之下被拒绝过。"
  },
  {
    prefix: "031",
    paragraph: 65,
    title: "张月凤重逢后捶打失踪多年的丈夫",
    start: "张非《欢迎林坤荣先生归来》有这样一段",
    end: "国防部来接他的老友吓了一跳。”"
  },
  {
    prefix: "018",
    paragraph: 6,
    title: "刘邦把韩信的假齐王改封真齐王",
    start: "两千一百年前",
    end: "说着就封了真齐王给他。"
  }
];

const excludedByStandard = [
  "本书主体是孙中山、胡秋原、国民党史料、逃难记录和警察开枪案件；提取轮只收可独立复述，有场景、人物行动、转折或结果，并被用来说明道理的故事。",
  "李敖自己的打牌、交游、办报、坐牢和调查经历不收；政治文件、证据链、人物履历、逃难统计、司法案件和纯评论也不按故事收入。",
  "001章张君劢与宪法属于制度与政策形成过程，不拆作故事；008章只收溥仪表面祭天照大神、内心祭祖的完整轶事。",
  "009章李士群谈汉奸洗白已由DJDHPN011收录；013章只收希特勒追查军机泄密却发现记者全凭公开资料的反转故事。",
  "012章闽变大员受日本领事款待并乘军舰逃走，有具体困境、救援和结果，收入；其余闽变与胡秋原材料属于政治史事件链。",
  "025章只收傅斯年以程沧波自己做监察院秘书长反问他的轶事；程沧波生平、挽联与文章评论不收。",
  "018章韩信趁危要求做假齐王、刘邦反封真齐王，是有问答与结果的完整古代轶事，校对新增；胡秋原冒充部长的现实评论不混入正文。",
  "028章一背一提逃难已由LAFZ011收录，李朴生错过共存亡宣誓已由DJDHPN004收录；另收王季高先逃后被追截。",
  "029章邓本殷部队让百姓先让军队逃命已由DJDHPN005收录；只收飞行员骗乘客下机并载走行李的完整故事，其余机场逃难记录不拆收。",
  "030章罗列、洪承畴、屈突通、尧君素及何应钦听投降计划均已有同核条目；只收保留‘听到一个故事’及‘无法找回人证’限定的归俘遭守军射杀故事。",
  "031章主体是林坤荣一家离散重聚的长篇事件材料，只截取张月凤重逢后捶丈夫的闭合小故事；033章警察开枪案件与李敖牢中经历不收。",
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
    `- 标题调整：${manifest.proofreadTitleAdjustedCount} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "本书主体是政治史料、人物论战、逃难记录和警察案件。校对轮继续只保留能脱离论述独立复述，有人物行动、转折或结果，并被李敖拿来说明道理的故事；李敖本人作为行动主体的经历一律排除，第三方转述只有形成闭合小故事才收入，并保留原文中的出处和真实性限定。",
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
    "- 新增CWNDCSD009接在原编号之后，保持CWNDCSD001至CWNDCSD008稳定。",
    "- CWNDCSD006补入胡圣一回忆的出处；CWNDCSD007补回李敖无法找到人证及以关公、文天祥旁证的限定，并在标题加‘据称’。",
    "- 9则均只截取故事本身、必要出处与真实性限定，不把前后政治评论、人物履历、案件材料或统计数字混入正文。",
    "- 009、028、029、030章的多则同核故事已定位总库既有条目，本书不重复。",
    "- 李敖自己的打牌、交游、办报、坐牢和调查经历，以及政治文件、证据链、逃难统计、司法案件和薄例子，均不拆作故事。",
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
      "校对轮逐条复核叙事闭合度、故事主体、原文连续性、出处限定与总库重复，并回看低分候选；李敖只是叙述者不构成排除，只有李敖本人作为行动主体的经历才排除；保留可脱离评论、政治文件、人物履历和案件链独立复述，有明确人物行动、转折或结果，并用于说明道理的故事；排除薄事实、纯语录、资料清单、新闻事件链和总库已有同核故事。",
    excludedByStandard,
    duplicateChecks: [
      "校对后9则已用人物、关键动作与结果的不同组合反查总库，未发现同文或同核条目。",
      "新增韩信索要假齐王、刘邦改封真齐王故事，以韩信、刘邦、假齐王、真齐王等组合检索，未发现同核条目。",
      "李士群谈洗白定位DJDHPN011；一背一提逃难定位LAFZ011；李朴生错过宣誓定位DJDHPN004；邓本殷让军队先逃定位DJDHPN005。",
      "罗列从忠烈祠活回来定位JJSYSIJ008；洪承畴被提前哭丧定位JJSYSIJ009。",
      "屈突通与尧君素定位BJFS007、LAXAJH010；何应钦听投降计划定位LAYT003，均按同核故事排除。",
      "同书重复讲述的主题优先按总库既有故事去重，不因本书文字版本略有不同而重复收入。"
    ],
    proofreadAdds: [
      {
        id: "CWNDCSD009",
        title: "刘邦把韩信的假齐王改封真齐王",
        sourceIds: "018#P6",
        reason: "韩信趁危索要假齐王，刘邦用一句反问改封真齐王，具备人物行动、问答和明确结果。"
      }
    ],
    proofreadDrops: [],
    proofreadTightened: [
      {
        id: "CWNDCSD007",
        reason: "去掉脚注序号⑥，故事正文与真实性限定不变。"
      }
    ],
    proofreadTitleAdjusted: [
      {
        id: "CWNDCSD007",
        from: "归俘因已进忠烈祠而被守军打死",
        to: "据称归俘因已进忠烈祠而被守军打死",
        reason: "原文明确说无法找回人证，标题必须保留未经证实的限定。"
      }
    ],
    proofreadContextCompleted: [
      {
        id: "CWNDCSD006",
        reason: "补入故事来自胡圣一《回顾沈阳解放》的回忆出处。"
      },
      {
        id: "CWNDCSD007",
        reason: "补入无法找到人证及以关公、文天祥经历作旁证的原文限定。"
      }
    ],
    proofreadNotes: [
      "提取轮原有8则全部保留，校对新增1则，校对后共9则。",
      "新增CWNDCSD009来自018章低分候选，只截取韩信索王与刘邦改封的古代故事，不带胡秋原现实类比。",
      "CWNDCSD006与CWNDCSD007补全出处或真实性语境，CWNDCSD007同步调整标题。",
      "CWNDCSD007去掉脚注序号⑥，不改动原文叙事。",
      "长沙大火、死人上通缉榜、吴大猷安排官员座椅和电影中背后开枪仍属历史事件、薄例或剧情提示，不拆收。",
      "其余同核故事与提取轮查重结论不变。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮保留 ${ORIGINAL_EXTRACTION_COUNT} 条，正文均能回到连续原文。`,
      "全部机器候选均已浏览，高分候选逐段回看上下文，并人工复核长篇逃难、团圆和警察案件材料。",
      "入选集中在历史人物轶事、逃难反转、第三方转述与家庭重逢小场景。",
      "李敖自己的经历、政治文件、人物履历、逃难统计、司法案件、纯语录和薄例子不按故事收入。",
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
