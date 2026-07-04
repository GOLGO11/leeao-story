const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖访谈录1990-2018";
const SLUG = "li_ao_fangtanlu_1990_2018";
const ROUND = "story_round1";
const ID_PREFIX = "LAFTL";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "li_ao_fangtanlu_1990_2018_story_round1.md");
const CANDIDATE_SCAN = "notes/li_ao_fangtanlu_1990_2018_candidate_scan.tsv";

const selections = [
  {
    prefix: "001",
    paragraph: 90,
    title: "陈毅说友谊像鸡蛋",
    start: "共产党的陈毅从苏联回到北京",
    end: "可是很脆弱。"
  },
  {
    prefix: "006",
    paragraph: 16,
    title: "欧阳修重刻醉翁亭记",
    start: "欧阳修都会，你看《醉翁亭记》",
    end: "所以把石碑敲掉重刻。"
  },
  {
    prefix: "006",
    paragraph: 18,
    title: "刘贡父反问王雱神童",
    start: "你看中国古人，王安石他有个儿子叫王雱",
    end: "我儿子也看一遍。"
  },
  {
    prefix: "006",
    paragraph: 23,
    title: "颜驷三朝不合拍",
    start: "汉武帝在巡视的时候",
    end: "跟你们三代搭配不上，所以一直倒霉。"
  },
  {
    prefix: "006",
    paragraph: 27,
    title: "老祖母回想孙女快乐",
    start: "我看过一个故事，一个老祖母",
    end: "一起在树后面捉迷藏，也很好吗。"
  },
  {
    prefix: "006",
    paragraph: 35,
    title: "约翰生说值得看不值得跑去看",
    start: "他的学生鲍斯威尔就跟他讲",
    end: "值得看，可是不值得跑去看（笑）。"
  },
  {
    prefix: "009",
    paragraph: 9,
    title: "哈台卖牙签也算木材业",
    start: "就像著名电影明星劳莱与哈台",
    end: "“in a small way.”"
  },
  {
    prefix: "009",
    paragraph: 33,
    title: "凯撒的三月十五还没过去",
    start: "过去凯撒大帝打胜仗回来",
    end: "结果凯撒一进去就被杀掉了。"
  },
  {
    prefix: "011",
    paragraph: 20,
    title: "丙吉不问杀人问牛喘",
    start: "汉朝有个宰相叫丙吉",
    end: "所以大臣是管大事的。"
  },
  {
    prefix: "012",
    paragraph: 55,
    title: "李远哲停车也被歧视",
    start: "我讲个故事给你听：我的一个同学叫李远哲",
    end: "他都被歧视。"
  },
  {
    prefix: "014",
    paragraph: 8,
    title: "谢冰莹最后一次送饭",
    start: "谢冰莹在书中曾提到",
    end: "丈夫也被枪毙。"
  },
  {
    prefix: "022",
    paragraph: 71,
    title: "徐世勣割股喂单雄信",
    start: "唐太宗打天下的时候有个大将叫做徐世勣",
    end: "可是我的一部分跟你去死。"
  },
  {
    prefix: "024",
    paragraph: 12,
    title: "任显群不敢上诉",
    start: "任显群是跟蒋经国抢顾正秋",
    end: "你上诉表示你抗拒。"
  },
  {
    prefix: "047",
    paragraph: 188,
    title: "猪肉罐头机器空转",
    start: "一个做猪肉罐头的机器",
    end: "结果只有空转了。"
  },
  {
    prefix: "061",
    paragraph: 130,
    title: "蝎子蛰癞蛤蟆",
    start: "蝎子背着癞蛤蟆过河",
    end: "但是我本性如此。"
  },
  {
    prefix: "071",
    paragraph: 34,
    title: "欧阳修六字写尽马毙犬",
    start: "一个故事，欧阳修跟徒弟们讲",
    end: "他六个字写整个故事。"
  },
  {
    prefix: "074",
    paragraph: 26,
    title: "范仲淹友人临死无恐怖",
    start: "范仲淹，宋朝时他有一个好朋友",
    end: "说完他就死掉了。"
  },
  {
    prefix: "074",
    paragraph: 26,
    title: "霍姆斯叔叔脚热笑话",
    start: "美国那个大法官小奥利弗·温德尔·霍姆斯",
    end: "被烧死的嘛！"
  },
  {
    prefix: "074",
    paragraph: 29,
    title: "张大千舍房买画",
    start: "抗战时期，张大千在北京看上一套房子",
    end: "这就是刀口上的艺术家气质使然。"
  },
  {
    prefix: "075",
    paragraph: 36,
    title: "爱因斯坦忘病和德文遗嘱",
    start: "爱因斯坦理论我不懂",
    end: "这让我觉得他对生死怎么看得这么淡。"
  },
  {
    prefix: "075",
    paragraph: 66,
    title: "甘地靠羊奶救命",
    start: "甘地发誓不吃荤的",
    end: "人有时会被骗。"
  },
  {
    prefix: "075",
    paragraph: 83,
    title: "广田弘毅妻子先死",
    start: "日本的外相广田弘毅",
    end: "大家跟着喊万岁。"
  }
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("007."));
  if (!categoryDir) throw new Error("Cannot find interview/preface category directory");
  const bookDir = fs
    .readdirSync(path.join(ROOT, corpusDir, categoryDir))
    .find((name) => name.startsWith("005.") && name.includes("李敖访谈录1990-2018"));
  if (!bookDir) throw new Error("Cannot find source book directory");
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

function fileForPrefix(prefix) {
  const fileName = fs
    .readdirSync(SOURCE_ROOT)
    .find((name) => name.startsWith(`${prefix}.`) && name.endsWith(".txt"));
  if (!fileName) throw new Error(`Cannot find source file for prefix ${prefix}`);
  return fileName;
}

function splitParagraphs(text) {
  const blocks = [];
  let current = [];
  let startLine = 1;
  const lines = text.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim()) {
      if (!current.length) startLine = index + 1;
      current.push(line);
    } else if (current.length) {
      blocks.push({ startLine, endLine: index, text: current.join("\n").trim() });
      current = [];
    }
  }
  if (current.length) blocks.push({ startLine, endLine: lines.length, text: current.join("\n").trim() });
  return blocks;
}

function lineOffset(text, index) {
  return text.slice(0, index).split("\n").length - 1;
}

function selectText(source, selection) {
  const block = splitParagraphs(source)[selection.paragraph - 1];
  if (!block) throw new Error(`Paragraph not found: ${selection.title}`);
  const startIndex = block.text.indexOf(selection.start);
  if (startIndex < 0) throw new Error(`Start marker not found: ${selection.title}`);
  const endIndex = block.text.indexOf(selection.end, startIndex);
  if (endIndex < 0) throw new Error(`End marker not found: ${selection.title}`);
  const text = block.text.slice(startIndex, endIndex + selection.end.length).trim();
  const startLine = block.startLine + lineOffset(block.text, startIndex);
  const endLine = block.startLine + lineOffset(block.text, endIndex + selection.end.length);
  return { text, lineRange: `${startLine}-${endLine}` };
}

function storyId(index) {
  return `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`;
}

function sourceId(selection) {
  return `${ID_PREFIX}_${selection.prefix}_${String(selection.paragraph).replace(/-/g, "_")}`;
}

function buildRows() {
  const cache = new Map();
  return selections.map((selection, index) => {
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
    `${[headers.join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join(
      "\n"
    )}\n`,
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
          `来源：${row.source_file}：${row.source_lines}`,
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
      if (!cache.has(row.source_file)) cache.set(row.source_file, normalizeText(readSource(row.source_file)));
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
    status: "校对轮",
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + Number(row.char_count || 0), 0),
    minChars: rows.length ? Math.min(...rows.map((row) => Number(row.char_count || 0))) : 0,
    maxChars: rows.length ? Math.max(...rows.map((row) => Number(row.char_count || 0))) : 0,
    duplicateTextIds,
    missingSourceTextIds
  };
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^\d{3}\./u.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function candidateCount() {
  const candidatePath = path.join(ROOT, CANDIDATE_SCAN);
  if (!fs.existsSync(candidatePath)) return 0;
  return Math.max(0, fs.readFileSync(candidatePath, "utf8").trim().split(/\r?\n/u).length - 1);
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 李敖访谈录1990-2018故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖访谈录1990-2018》篇幅长、问答多，材料中夹有大量李敖自己的坐牢、选举、出版、疾病、收藏、人际往来和时政判断。校对轮只保留李敖在访谈回答中讲成一个可独立复述、并明显用来说明道理或判断的小故事；不收李敖自己的事件、访谈现场问答、政治材料链、人物履历、单句观点、书籍剧情介绍和只有一个典故名片的材料。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 湖北人牵骆驼、卓别林扮卓别林、小女孩丢十块钱、施华德买阿拉斯加等故事，总表已有同质或更完整版本，本轮不重复收入。",
    "- 胡适是否做官、打字机键盘排列、李敖藏画买书、坐牢交友、儿女疾病等，偏事实说明或李敖自身事件，不收。",
    "- 《第73烈士》相关白色恐怖材料虽有情节，但在此处是李敖说明小说结构和取材，不作为独立故事收入。",
    "- 乃木西典夫妇殉死只在记忆方法段中作一笔带过，故事性过薄，本轮先不收；同段广田弘毅妻子先死有完整动作和结果，暂收。",
    "- 丙吉问牛喘虽曾在杨颙劝诸葛亮故事中以古文典故一语出现，本轮访谈段落是独立复述，校对轮仍保留。",
    "- 校对轮删去孙中山让位袁世凯、董其昌看王献之字、列宁割地以后拿回：三条更像政治事实、题跋态度或历史材料，不够像可独立复述的小故事。",
    "",
    "## 提取说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，通用候选 ${manifest.candidateCount} 条。`,
    "- 提取轮入选 25 条；校对轮删去 3 条，保留 22 条。",
    "- 对长段问答只截取故事本身，删去前后访谈判断或自我延伸。",
    "- 同一故事在本书内重复出现时选更干净的一处；徐世勣割股喂单雄信用《新华网》段，不用《广角镜》长段。",
    "- 故事正文未改写，均按源文原句截取。",
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
    status: "校对轮",
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
      "访谈录校对轮只收李敖在回答中讲成一个可独立复述、并明显用来说明道理或判断的小故事；排除李敖自己的事件、访谈现场问答、政治材料链、人物履历、单句观点、书籍剧情介绍和只有一个典故名片的材料。",
    excludedByStandard: [
      "李敖自己的坐牢、选举、出版、疾病、收藏、人际往来和时政判断原则上不收。",
      "访谈问句、主持人叙述、记者报导和李敖逝后他人回忆不收。",
      "事实说明、观点论述、人物履历、文章导读、单句典故和故事性过薄的材料不收。",
      "总表已有同质或更完整版本的故事不重复收入。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      "提取轮入选 25 条；校对轮删去 3 条，保留 22 条。",
      "湖北人牵骆驼、卓别林扮卓别林、小女孩丢十块钱、施华德买阿拉斯加等总表已有版本，本轮不重复收入。",
      "丙吉问牛喘已有古文典故嵌入杨颙条，本轮因访谈段为独立复述，校对轮仍保留。",
      "徐世勣割股喂单雄信用《新华网》较干净段落，不用《广角镜》长段。",
      "故事正文未改写，均按源文原句截取。"
    ],
    proofreadNotes: [
      "删去孙中山让位袁世凯：偏政治事实和时局判断，故事性不足。",
      "删去董其昌看王献之字：更像题跋态度或一句掌故，缺少动作闭合。",
      "删去列宁割地以后拿回：偏历史政策材料，用作政治类比，不作为故事收入。"
    ],
    aggregateDuplicateTextIds: aggregate.duplicateTextIds,
    generatedAt: new Date().toISOString()
  };
  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
  writeNotes(rows, validation, aggregate, manifest);
  if (!validation.ok) throw new Error(`Validation failed: ${JSON.stringify(validation)}`);
  if (aggregateDuplicatesForThisBook.length) {
    throw new Error(`Duplicate story text for ${BOOK}: ${JSON.stringify(aggregateDuplicatesForThisBook)}`);
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
