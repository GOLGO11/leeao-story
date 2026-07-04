const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖书序集";
const SLUG = "li_ao_shuxuji";
const ROUND = "story_round1";
const ID_PREFIX = "LASHXJ";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "li_ao_shuxuji_story_round1.md");
const CANDIDATE_SCAN = "notes/li_ao_shuxuji_candidate_scan.tsv";

const selections = [
  {
    prefix: "001",
    paragraph: "7",
    title: "蒋介石两道指示挡居正",
    start: "1949年蒋介石下野",
    end: "在立法院未获通过。"
  },
  {
    prefix: "001",
    paragraph: "16",
    title: "张惊声讲革命讲成姐夫",
    start: "张惊声早在结婚前",
    end: "原来那个革命狂张先生竟成了他的姐夫！"
  },
  {
    prefix: "001",
    paragraph: "32",
    title: "淡江英专一日假基金",
    start: "例如所谓“淡江英专是我们张家的财产”之说",
    end: "欲罢不能，只好硬着头皮办下去。"
  },
  {
    prefix: "001",
    paragraph: "71-78",
    title: "居浩然比老子比贵戚比身体",
    start: "我手上有一封1972年8月28日居浩然写给白崇禧公子的信",
    end: "国民党少爷们的不可救药，就于此可见了！"
  },
  {
    prefix: "004",
    paragraph: "22-24",
    title: "梁鼎芬冒弹进宫教课",
    start: "例如书中写溥仪老师梁鼎芬",
    end: "岂不正是绝好的时代记录吗？"
  },
  {
    prefix: "004",
    paragraph: "25-28",
    title: "朱煜勋借冠服遮贫",
    start: "又如书中写溥仪召见明朝的后裔",
    end: "岂不正是绝好的时代记录吗？"
  },
  {
    prefix: "006",
    paragraph: "19-21",
    title: "溥杰妻为骚笑过度道歉",
    start: "又如溥仪的大弟——溥杰",
    end: "和他们的思想。"
  },
  {
    prefix: "010",
    paragraph: "2",
    title: "沈醉回头岸在北京",
    start: "但是，1980年沈醉曾有香港之行",
    end: "沈醉真的变了。"
  },
  {
    prefix: "011",
    paragraph: "2",
    title: "夏曾佑陈寅恪无书可看",
    start: "俞大维讲过一段故事",
    end: "东抄西抄。’”"
  },
  {
    prefix: "011",
    paragraph: "5-6",
    title: "李宗吾托张默生作传",
    start: "出人意外的，一位出身北京高师的作家张默生",
    end: "世之对中国书“无书可看”者，请啼笑之间，快看此书。"
  },
  {
    prefix: "014",
    paragraph: "6",
    title: "万大鋐重游瞻园捐书画",
    start: "他回归大陆，重游当年他们特务大本营",
    end: "真令我们感佩不置。"
  },
  {
    prefix: "016",
    paragraph: "2",
    title: "曹操问许子将",
    start: "曹操问许子将",
    end: "尚有足观者在。"
  },
  {
    prefix: "018",
    paragraph: "4",
    title: "熊十力骂梁漱溟笨蛋",
    start: "梁漱溟一直被看做哲学家",
    end: "我同意熊十力这一棒喝。"
  },
  {
    prefix: "019",
    paragraph: "9",
    title: "章太炎为陈炯明说公道",
    start: "在举国诬蔑陈炯明的当口",
    end: "伟大的知识分子，不当如是乎？"
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
    .find((name) => name.startsWith("002."));
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

function lineNumberAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

function selectText(source, selection) {
  const startIndex = source.indexOf(selection.start);
  if (startIndex < 0) throw new Error(`Start marker not found: ${selection.title}`);
  const endIndex = source.indexOf(selection.end, startIndex);
  if (endIndex < 0) throw new Error(`End marker not found: ${selection.title}`);
  return {
    text: source.slice(startIndex, endIndex + selection.end.length).trim(),
    lineRange: `${lineNumberAt(source, startIndex)}-${lineNumberAt(
      source,
      endIndex + selection.end.length
    )}`
  };
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
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function writeNotes(rows, validation, aggregate) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 李敖书序集故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖书序集》多为书序、题记、出版说明和人物/史料介绍。校对轮只收李敖在序文中真正讲成小故事、可独立复述并用来说明判断的掌故、人物轶事和短案例；不收单纯书目评价、作者履历、版本说明、李敖自己的出版交往、案件材料链和未展开的历史判断。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    "- 汪政权、李宗仁、章太炎、梁漱溟等人物的概括性履历和史论判断不收。",
    "- 《恶法录及其他》《李宗仁回忆录》《鹰犬将军》等涉及李敖自己的出版、约稿、配图、校对经过，除非内含独立外部故事，一律不收。",
    "- 007《调查局研究》虽有很强叙事性，但主体是李敖自己的狱中亲历和难友交往，本轮按既定口径排除。",
    "- 001 中“居瀛玖偷通信寻亲”“张建邦夺淡江赶舅舅”“居瀛玖受辱自尽”偏连续人物/家族事件，校对轮删去。",
    "- 020《历年办理匪案汇编》中的周芝雨、李友邦、段沄、黄氏姐妹、杨慕荣诸条，偏案件材料链和冤案档案，校对轮整体删去。",
    "- 单句名言、书名解释、题词、诗句、作者评语不收。",
    "",
    "## 提取与校对说明",
    "",
    "- 候选扫描覆盖全书 20 个正文文件，自动候选 272 条。",
    "- 提取轮原保留 23 条，校对轮删去 9 条，保留 14 条。",
    "- 保留项集中在两道指示、一日假基金、居浩然夸门第、庄士敦书中掌故、沈醉回北京、夏曾佑陈寅恪、李宗吾托传、万大鋐捐书画、曹操许子将、熊十力梁漱溟、章太炎陈炯明等短小故事。",
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
    selectionCount: selections.length,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "书序类校对轮只收可独立复述并用来说明判断的小故事、掌故、人物轶事和短案例；排除书目评价、作者履历、版本说明、李敖自己的出版交往、案件材料链和未展开材料。",
    excludedByStandard: [
      "李敖自己的出版、约稿、配图、校对、探访、狱中亲历和交往经过不收。",
      "概括性人物履历、史论判断、文章导读、版本说明和材料清单不收。",
      "案件类材料链即使有叙事性，也不作为故事条目。",
      "总表已有同质故事不重复收入。"
    ],
    extractionNotes: [
      "候选扫描覆盖全书 20 个正文文件，自动候选 272 条。",
      "提取轮保留居正、居瀛玖、淡江英专、庄士敦书中掌故、沈醉、李宗吾、万大鋐、曹操许子将、熊十力梁漱溟、章太炎陈炯明，以及《历年办理匪案汇编》外部冤案例证等 23 条。",
      "007《调查局研究》叙事虽强，但主体为李敖自己的狱中亲历，本轮不收。",
      "故事正文未改写，均按源文原句截取。"
    ],
    proofreadNotes: [
      "校对轮删去“居瀛玖偷通信寻亲”：偏人物身世铺陈，故事性弱于掌故轶事。",
      "校对轮删去“张建邦夺淡江赶舅舅”“居瀛玖受辱自尽”：偏连续家族/学校事件，不作为小故事收入。",
      "校对轮删去《历年办理匪案汇编》6 条：偏案件材料链和冤案档案，容易把故事集拉回事件合集。",
      "校对轮保留 14 条短小、可独立复述且有判断指向的故事。"
    ],
    aggregateDuplicateTextIds: aggregate.duplicateTextIds,
    generatedAt: new Date().toISOString()
  };
  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
  writeNotes(rows, validation, aggregate);
  if (!validation.ok) throw new Error(`Validation failed: ${JSON.stringify(validation)}`);
  if (aggregateDuplicatesForThisBook.length) {
    throw new Error(`Duplicate story text for ${BOOK}: ${JSON.stringify(aggregateDuplicatesForThisBook)}`);
  }
  console.log(
    JSON.stringify(
      { book: BOOK, rows: rows.length, aggregateRows: aggregate.rows.length, sourceFileCount: manifest.sourceFiles.length, ok: validation.ok },
      null,
      2
    )
  );
}

main();
