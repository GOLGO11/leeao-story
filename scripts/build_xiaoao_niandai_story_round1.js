const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "笑敖年代";
const SLUG = "xiaoao_niandai";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "XAND";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "001",
    paragraph: 45,
    title: "唐绍仪总理去做县长",
    start: "使我想起一个故事",
    end: "他不觉得自己受委屈。"
  },
  {
    prefix: "002",
    paragraph: 103,
    title: "刘贡父用大姨小姨挖苦欧阳修",
    start: "在宋朝有一个有名的笑话",
    end: "整个这么一个有趣的典故。"
  },
  {
    prefix: "002",
    paragraph: 107,
    title: "孔子先问人后问马",
    start: "我们念《论语》有一个故事",
    end: "孔子还是关心了马。"
  },
  {
    prefix: "003",
    paragraph: 73,
    title: "哈台说自己卖牙签",
    start: "有一次哈台问一个商人",
    end: "我是做牙签生意，卖牙签的。"
  },
  {
    prefix: "003",
    paragraph: 75,
    title: "胡适说请愿而死可耻",
    start: "我告诉你一个故事",
    end: "为了请愿而死的，太可耻了！"
  },
  {
    prefix: "003",
    paragraph: 131,
    title: "法官拒绝陷害岳飞",
    start: "当时宋高宗皇帝",
    end: "历史上都有这种记录，法官拒绝陷害忠良。"
  },
  {
    prefix: "003",
    paragraph: 131,
    title: "贝凯特为主教权力跟皇帝翻脸",
    start: "你看看这当年英国的坎特布里总主教贝凯特",
    end: "替被你们杀掉的人一辈子为他服务。"
  },
  {
    prefix: "004",
    paragraph: 25,
    title: "国代想让蒋介石做皇帝",
    start: "本来我有个笑话",
    end: "这样子双方都觉得划得来，并且经济有效。"
  },
  {
    prefix: "004",
    paragraph: 73,
    title: "太太最后一次探监",
    start: "我看过一个故事",
    end: "就很凄惨的一个故事。"
  },
  {
    prefix: "005",
    paragraph: 49,
    title: "周恩来说国民党人才多但不会用",
    start: "所以当年很有趣的一个故事",
    end: "国民党毛病出在这里。"
  },
  {
    prefix: "007",
    paragraph: 139,
    title: "吉姆爵爷第二次可以逃却自杀",
    start: "他有本书叫LORD JIM",
    end: "所以我们要给他一种机会。"
  },
  {
    prefix: "009",
    paragraph: 17,
    title: "林肯讲两匹马分两次死",
    start: "我先告诉你一个故事",
    end: "怕一次告诉你，你太难过了！"
  },
  {
    prefix: "009",
    paragraph: 45,
    title: "刘家昌儿子跪求水枪",
    start: "我给你讲个故事",
    end: "要求买一把水枪而已。"
  },
  {
    prefix: "010",
    paragraphs: [74, 75, 76],
    title: "邵雍给人看后晋亡国史",
    start: "最好的一个故事",
    end: "下场是亡国。"
  },
  {
    prefix: "011",
    paragraph: 28,
    title: "诸葛亮空城计赌司马懿不敢抓",
    start: "这个空城观念",
    end: "这是真的，我来解读空城计的故事，就这样。"
  },
  {
    prefix: "011",
    paragraph: 72,
    title: "毛泽东改国号给国民党喘息",
    start: "毛泽东本来他们进了北京以后",
    end: "国民党早就被我们掐死了，你懂吧！"
  },
  {
    prefix: "012",
    paragraph: 39,
    title: "曾子临死也要换席子",
    start: "我特别讲个故事给你听",
    end: "他是用道德标准来要求我。"
  },
  {
    prefix: "012",
    paragraph: 41,
    title: "阿登纳市长对抗希特勒",
    start: "当年希特勒做了德国国务总理",
    end: "复兴了德国。"
  },
  {
    prefix: "012",
    paragraph: 63,
    title: "林肯被说上帝不相信他",
    start: "我特别带来一个英文的笑话",
    end: "可是林肯最后还是当选了"
  },
  {
    prefix: "013",
    paragraph: 45,
    title: "庖丁解牛知道骨缝窍门",
    start: "所以中国古代讲说庖丁解牛",
    end: "这就是高明的人，他知道这里面有一个窍门儿"
  },
  {
    prefix: "013",
    paragraph: 45,
    title: "桃花女掐中吕洞宾背筋",
    start: "碰到一个妖怪叫桃花女",
    end: "知道你仙人的哪一根筋被我掐到了你就投降。"
  },
  {
    prefix: "013",
    paragraph: 57,
    title: "林肯要送格兰特同牌子酒",
    start: "我告诉你个故事",
    end: "还能挑人家毛病吗？"
  },
  {
    prefix: "014",
    paragraph: 77,
    title: "将军托管小岛惹科学家泄密",
    start: "我特别找个插曲故事跟你讲",
    end: "得不偿失嘛！"
  },
  {
    prefix: "015",
    paragraph: 86,
    title: "凯撒休掉被怀疑的太太",
    start: "事实上，这个故事完全讲错了",
    end: "我老婆被人家怀疑都不可以。"
  },
  {
    prefix: "016",
    paragraph: 27,
    title: "金佛郎案宁让犯人逃掉",
    start: "当年北洋时代有一个有名的案子叫做金佛郎案",
    end: "你抓到犯人，丢掉了法律。"
  }
];

const ORIGINAL_EXTRACTION_COUNT = 25;

const proofreadDrops = [];

const proofreadAdds = [
  {
    prefix: "002",
    paragraphs: [47, 48, 49],
    title: "熊十力用蒋介石照片解气",
    start: "雷震后来讲了一个故事",
    end: "他不像殷海光这种人生闷气。",
    reason: "候选复核补入；雷震转述熊十力以粗犷动作消解怨气，人物动作和反转完整。"
  },
  {
    prefix: "004",
    paragraph: 29,
    title: "张作霖教师节脱军装作揖",
    start: "发现军阀有很多规则",
    end: "张大帅不敢写张大帅训词，不敢。",
    reason: "候选复核补入；张作霖向老师作揖的细节构成独立历史掌故。"
  },
  {
    prefix: "007",
    paragraph: 77,
    title: "蔡元培问洪门故事怎么写",
    start: "所以孙中山是洪门",
    end: "会害了别人。",
    reason: "候选复核补入；蔡元培问史、孙中山避写、杜月笙夜壶比喻连成完整小故事。"
  },
  {
    prefix: "013",
    paragraph: 15,
    title: "保罗琼斯说还没开始打",
    start: "我讲个故事给你听",
    end: "被称为美国的海军之父。",
    reason: "候选复核补入；保罗琼斯拒降反胜，是李敖直接用来说明不退的故事。"
  },
  {
    prefix: "015",
    paragraph: 24,
    title: "立委半坐半蹲表示又赞成又反对",
    start: "这是国民党时代的民主表决方法",
    end: "我作为黄埔军官学校的一员，我反对。",
    reason: "候选复核补入；蒋介石表决场景有问答和荒诞反转，符合笑话/掌故口径。"
  }
];

const proofreadTrims = [
  {
    title: "桃花女掐中吕洞宾背筋",
    reason: "原提取包含过多房中术解释和李敖自我比喻，校对轮收窄到桃花女与吕洞宾交手的故事本体。"
  }
];

const proofreadDropTitles = new Set(proofreadDrops.map((item) => item.title));

const excludedByStandard = [
  "李敖自己的参选、立法院、官司、坐牢、亲友和节目现场经历，除非段内转述的是独立外部故事，否则排除。",
  "主持人或来宾提出的故事不直接收；只有李敖接着复述、解释并讲成故事的才收。",
  "连续时政论辩、人物评价、政党材料、新闻案情、政策推演、书籍展示和单句比喻，缺少独立情节的不列为故事。",
  "同书内重复出现的同一故事只取更完整、更适合独立阅读的一处。",
  "低俗笑话或性笑话只在情节完整且明确服务论证时保留；单纯插科打诨排除。"
];

const candidateMarkers = [
  "故事",
  "笑话",
  "寓言",
  "典故",
  "成语",
  "漫画",
  "小说",
  "电影",
  "有一次",
  "有一天",
  "忽然",
  "结果",
  "最后",
  "问",
  "回答",
  "说"
];

const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖导航站",
  "油管/抖音"
];

function findSourceRoot() {
  const editionRoot = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!editionRoot) throw new Error("Missing 大李敖全集6.0 source directory");
  const categoryRoot = path.join(
    ROOT,
    editionRoot,
    fs.readdirSync(path.join(ROOT, editionRoot)).find((name) => name.startsWith("010."))
  );
  const bookDir = fs.readdirSync(categoryRoot).find((name) => name.startsWith("008."));
  if (!bookDir) throw new Error("Missing 008.笑敖年代 source directory");
  return path.join(categoryRoot, bookDir);
}

const SOURCE_ROOT = findSourceRoot();

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((name) => /^\d{3}\..*\.txt$/u.test(name))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));
}

function stripFooter(text) {
  const lines = text.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n").split("\n");
  const footerIndex = lines.findIndex((line) =>
    footerPatterns.some((pattern) => line.includes(pattern))
  );
  return (footerIndex >= 0 ? lines.slice(0, footerIndex) : lines).join("\n").trim();
}

function readSource(fileName) {
  return stripFooter(
    decoder.decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName))).replace(/^\uFEFF/u, "")
  );
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
    if (paragraph) paragraphs.push({ text: paragraph, startLine, endLine });
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
  const pick = (number) => {
    const paragraph = paragraphs[Number(number) - 1];
    if (!paragraph) throw new Error(`Missing paragraph ${number} in ${fileName}`);
    return { paragraphNumber: Number(number), ...paragraph };
  };

  if (Array.isArray(selection.paragraphs)) {
    const picked = selection.paragraphs.map(pick);
    return {
      fileName,
      sourceId: picked.map((paragraph) => `${selection.prefix}#P${paragraph.paragraphNumber}`).join(";"),
      sourceLines: picked.map((paragraph) => `${paragraph.startLine}-${paragraph.endLine}`).join(";"),
      text: picked.map((paragraph) => paragraph.text).join("\n\n")
    };
  }

  const paragraph = pick(selection.paragraph);
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
  return String(text || "").replace(/\s+/gu, "");
}

function buildRows() {
  return [...selections, ...proofreadAdds]
    .filter((selection) => !proofreadDropTitles.has(selection.title))
    .map((selection, index) => {
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
  if (/[",\r\n]/u.test(stringValue)) return `"${stringValue.replace(/"/gu, '""')}"`;
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
    if (char === '"') inQuotes = true;
    else if (char === ",") {
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
    book_slug: row.book_slug || bookSlug || "",
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
  if (/故事|笑话|轶事|趣闻|典故|寓言|成语|漫画|电影|小说/u.test(paragraph)) score += 6;
  if (/问|答|说|讲/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/哭|笑|杀|逃|打|骗|偷|抓|跪|求|死|梦|醒|嫁|娶|抢|跑|问|答|撞/u.test(paragraph)) {
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
  const text = fs.readFileSync(candidatePath, "utf8").trim();
  return text ? Math.max(0, text.split(/\r?\n/u).length - 1) : 0;
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 笑敖年代故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮初选：${manifest.originalExtractionCount} 条`,
    `- 校对删除：${manifest.proofreadDropCount} 条`,
    `- 校对补入：${manifest.proofreadAddCount} 条`,
    `- 校对修边：${manifest.proofreadTrimCount} 条`,
    `- 校对保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《笑敖年代》是电视谈话节目逐字稿，主持问答、时政辩论和李敖自身参选材料较多。本轮只收李敖亲自讲成可独立复述、带人物行动或问答反转、并用来说明道理的小故事、笑话、典故、古书掌故、小说/电影故事和历史轶事；不把主持人的故事引子、李敖自己的参选/立法院事件、连续政治评论和单句比喻当故事。",
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
    "## 校对删除",
    "",
    ...(manifest.proofreadDrops.length
      ? manifest.proofreadDrops.map((item) => `- ${item.title}：${item.reason}`)
      : ["- 无"]),
    "",
    "## 校对补入",
    "",
    ...(manifest.proofreadAdds.length
      ? manifest.proofreadAdds.map((item) => `- ${item.title}：${item.reason}`)
      : ["- 无"]),
    "",
    "## 校对修边",
    "",
    ...(manifest.proofreadTrims.length
      ? manifest.proofreadTrims.map((item) => `- ${item.title}：${item.reason}`)
      : ["- 无"]),
    "",
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 提取轮初选 ${manifest.originalExtractionCount} 条；校对轮删除 ${manifest.proofreadDropCount} 条、补入 ${manifest.proofreadAddCount} 条、修边 ${manifest.proofreadTrimCount} 条，保留 ${validation.count} 条。`,
    "- 故事正文均来自源文原段或段内原文截取，没有改写。",
    "- 对长段继续只截故事本体和必要的原文收束语，尽量去掉后续时政发挥、节目自述和资料铺陈。",
    "- 同书内重复故事只取较完整、较适合独立阅读的一处。",
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
    originalExtractionCount: ORIGINAL_EXTRACTION_COUNT,
    selectionCount: selections.length,
    proofreadDropCount: proofreadDrops.length,
    proofreadDrops,
    proofreadTrimCount: proofreadTrims.length,
    proofreadTrims,
    proofreadAddCount: proofreadAdds.length,
    proofreadAdds,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖亲自讲成可独立复述、带人物行动或问答反转、并用于说明道理的小故事、笑话、典故、古书掌故、小说/电影故事和历史轶事；排除主持人故事引子、李敖自身事件、纯时政连续叙述、资料展示、节目流程和无情节概念。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮初选 ${ORIGINAL_EXTRACTION_COUNT} 条；校对轮删除 ${proofreadDrops.length} 条，补入 ${proofreadAdds.length} 条，修边 ${proofreadTrims.length} 条，保留 ${rows.length} 条。`,
      "正文均按源文原段或段内原文截取。",
      "本册主持问答较多，校对轮继续只取李敖亲自复述并能独立成条的故事。"
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
