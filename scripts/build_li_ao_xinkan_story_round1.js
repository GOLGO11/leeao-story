const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖新刊";
const SLUG = "li_ao_xinkan";
const ROUND = "story_round1";
const ID_PREFIX = "LAXK";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);

const BOOK_ORDER = [
  "li_ao_zizhuan_yu_huiyi",
  "li_ao_zizhuan_yu_huiyi_xuji",
  "wo_zui_nanwang_de_shi_he_ren",
  "li_ao_huiyilu",
  "li_ao_kuaiyi_enchoulu",
  "li_ao_yitan_aisi_lu",
  "li_ao_fengliu_zizhuan",
  "li_ao_xiangguan",
  "chuantong_xia_de_dubai",
  "chuantong_xia_de_zaibai",
  "dubai_xia_de_chuantong",
  "li_ao_wencun",
  "li_ao_wencun_erji",
  "bobo_song",
  "li_ao_quanji",
  "jiaoyu_yu_lianpu",
  "wenhua_lunzhan_danhuolu",
  "wei_zhongguo_sixiang_quxiang_qiu_daan",
  "shangxia_gujin_tan",
  "shilun_xinyu",
  "qiushi_xinyu",
  "woshi_tiananmen",
  "ni_shi_jingfumen",
  "wei_ziyou_zhaohun",
  "ni_bendan_ni_bendan",
  "wo_mengsui_suoyi_wo_mengxing",
  "li_ao_xinkan"
];

const selections = [
  {
    prefix: "011",
    title: "蔡孟坚说北欧实行三民主义",
    paragraphs: [2],
    start: "他说他在一九五九年赴欧美考察归来",
    end: "我在先总统带着笑容中告别。"
  },
  {
    prefix: "024",
    title: "曲突徙薪先知被忘",
    paragraphs: [2]
  },
  {
    prefix: "027",
    title: "张乐平看见三个难童冻死两个",
    paragraphs: [4],
    start: "三毛的作者张乐平，在1947年年初",
    end: "就改成了难童的面貌。"
  },
  {
    prefix: "031",
    title: "吴铁嘴相上将夫人极贱而极贵",
    paragraphs: [5],
    start: "杭州梅花碑",
    end: "果然铁嘴也！”"
  },
  {
    prefix: "034",
    title: "徐子明说跟狗说话不能不狗叫",
    paragraphs: [4],
    start: "历史系有一极顽固老教授"
  },
  {
    prefix: "034",
    title: "侯榕生发现方豪是神父",
    paragraphs: [7],
    start: "历史系方豪教授"
  },
  {
    prefix: "035",
    title: "卢前翻考卷给人情一百分",
    paragraphs: [2],
    start: "方豪告诉我一个词曲家卢前的故事"
  },
  {
    prefix: "035",
    title: "殷文丽念Aristotle喷湿书",
    paragraphs: [6],
    start: "殷海光爱书成癖"
  },
  {
    prefix: "035",
    title: "殷海光打电话满头大汗",
    paragraphs: [7],
    start: "书呆子殷海光"
  },
  {
    prefix: "035",
    title: "殷海光夏道平困在电梯找咖啡",
    paragraphs: [8],
    start: "有一天，书呆子殷海光和政大的另一书呆子夏道平教授"
  },
  {
    prefix: "035",
    title: "殷海光一句不借挡周弃子",
    paragraphs: [9],
    start: "云贵高原的狼",
    end: "干脆答道：“不借！”"
  },
  {
    prefix: "036",
    title: "傅良圃指着生殖器说Useless",
    paragraphs: [2],
    start: "外文系洋神父傅良圃"
  },
  {
    prefix: "036",
    title: "卢保十个咸蛋吃一学期还剩半个",
    paragraphs: [6],
    start: "台大同学卢保"
  },
  {
    prefix: "036",
    title: "魏廷朝看外国电影只有一男一女",
    paragraphs: [11],
    start: "魏廷朝为人拙朴"
  }
];

const decoder = new TextDecoder("gb18030");
const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖导航站",
  "油管/抖音"
];

function findDirectory(parent, predicate, label) {
  const entry = fs
    .readdirSync(parent, { withFileTypes: true })
    .find((item) => item.isDirectory() && predicate(item.name));
  if (!entry) throw new Error(`Directory not found: ${label}`);
  return path.join(parent, entry.name);
}

const SOURCE_ROOT = findDirectory(
  findDirectory(
    findDirectory(ROOT, (name) => name.includes("6.0"), "source corpus"),
    (name) => name.startsWith("003."),
    "category 003"
  ),
  (name) => name.startsWith("012."),
  "book 012"
);

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function resolveSourceFile(prefix) {
  const file = fs.readdirSync(SOURCE_ROOT).find((name) => name.startsWith(`${prefix}.`));
  if (!file) throw new Error(`Source file not found for prefix ${prefix}`);
  return file;
}

function readSource(fileName) {
  return decoder.decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName))).replace(/\r\n/g, "\n");
}

function stripFooter(text) {
  const lines = text.split("\n");
  const footerIndex = lines.findIndex((line) =>
    footerPatterns.some((pattern) => line.includes(pattern))
  );
  return (footerIndex >= 0 ? lines.slice(0, footerIndex) : lines).join("\n").trim();
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
      blocks.push({
        index: blocks.length + 1,
        lineStart: startLine,
        lineEnd: index,
        text: current.join("\n").trim()
      });
      current = [];
    }
  }

  if (current.length) {
    blocks.push({
      index: blocks.length + 1,
      lineStart: startLine,
      lineEnd: lines.length,
      text: current.join("\n").trim()
    });
  }

  return blocks;
}

function getParagraphs(fileName, cache) {
  if (!cache.has(fileName)) {
    cache.set(fileName, splitParagraphs(stripFooter(readSource(fileName))));
  }
  return cache.get(fileName);
}

function sourceId(prefix, paragraph) {
  return `${ID_PREFIX}_${prefix}_${paragraph.index}`;
}

function sliceText(text, selection) {
  let startIndex = 0;
  if (selection.start) {
    startIndex = text.indexOf(selection.start);
    if (startIndex < 0) {
      throw new Error(`Start marker not found for ${selection.title}: ${selection.start}`);
    }
  }

  let endIndex = text.length;
  if (selection.end) {
    const found = text.indexOf(selection.end, startIndex);
    if (found < 0) {
      throw new Error(`End marker not found for ${selection.title}: ${selection.end}`);
    }
    endIndex = found + selection.end.length;
  }

  return text.slice(startIndex, endIndex).trim();
}

function buildRows() {
  const cache = new Map();
  return selections.map((selection, index) => {
    const fileName = resolveSourceFile(selection.prefix);
    const paragraphs = getParagraphs(fileName, cache).filter((paragraph) =>
      selection.paragraphs.includes(paragraph.index)
    );
    if (paragraphs.length !== selection.paragraphs.length) {
      throw new Error(`Paragraph lookup failed for ${selection.title}`);
    }

    const storyText = sliceText(paragraphs.map((paragraph) => paragraph.text).join("\n\n"), selection);
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: paragraphs.map((paragraph) => sourceId(selection.prefix, paragraph)).join(";"),
      source_file: fileName,
      source_lines: `${paragraphs[0].lineStart}-${paragraphs[paragraphs.length - 1].lineEnd}`,
      char_count: [...storyText].length,
      story_text: storyText
    };
  });
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
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const blocks = rows.map((row) =>
    [
      `# ${row.id} ${row.title}`,
      `book: ${row.book}`,
      `source: ${row.source_file}:${row.source_lines}`,
      "",
      row.story_text
    ].join("\n")
  );
  fs.writeFileSync(filePath, `${blocks.join("\n\n---\n\n")}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const headers = (rows.shift() || []).map((header, index) =>
    index === 0 ? header.replace(/^\uFEFF/, "") : header
  );
  return rows
    .filter((item) => item.some((value) => value !== ""))
    .map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index] ?? ""])));
}

function normalizeAggregateRow(row, bookSlug) {
  const storyText = row.story_text || row.text || "";
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || bookSlug,
    title: row.title,
    source_ids: row.source_ids,
    source_file: row.source_file,
    source_lines: row.source_lines || [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count || [...storyText].length,
    story_text: storyText
  };
}

function bookSortParts(filePath) {
  const slug = path.basename(path.dirname(filePath));
  const index = BOOK_ORDER.indexOf(slug);
  return index >= 0 ? [0, index, slug] : [1, BOOK_ORDER.length, slug];
}

function compareBookFiles(leftFile, rightFile) {
  const left = bookSortParts(leftFile);
  const right = bookSortParts(rightFile);
  if (left[0] !== right[0]) return left[0] - right[0];
  if (left[1] !== right[1]) return left[1] - right[1];
  return String(left[2]).localeCompare(String(right[2]));
}

function duplicateTextPairs(rows) {
  const textHashes = new Map();
  const duplicateTextIds = [];
  for (const row of rows) {
    const normalized = String(row.story_text || "").replace(/\s+/g, "");
    if (textHashes.has(normalized)) duplicateTextIds.push([textHashes.get(normalized), row.id]);
    else textHashes.set(normalized, row.id);
  }
  return duplicateTextIds;
}

function writeAggregate() {
  const dataBooksDir = path.join(ROOT, "data", "books");
  const csvFiles = fs
    .readdirSync(dataBooksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dataBooksDir, entry.name, `${ROUND}.csv`))
    .filter((filePath) => fs.existsSync(filePath))
    .sort(compareBookFiles);

  const rows = csvFiles.flatMap((filePath) => {
    const bookSlug = path.basename(path.dirname(filePath));
    return parseCsv(fs.readFileSync(filePath, "utf8")).map((row) => normalizeAggregateRow(row, bookSlug));
  });

  const seenIds = new Set();
  const duplicateIds = rows.filter((row) => {
    if (seenIds.has(row.id)) return true;
    seenIds.add(row.id);
    return false;
  });
  if (duplicateIds.length) {
    throw new Error(`Duplicate story ids in aggregate: ${duplicateIds.map((row) => row.id).join(", ")}`);
  }

  writeCsv(path.join(ROOT, "data", "all_stories.csv"), rows);
  writeTxt(path.join(ROOT, "data", "all_stories.txt"), rows);

  const books = Array.from(
    rows.reduce((map, row) => {
      const current = map.get(row.book_slug) || { book: row.book, slug: row.book_slug, count: 0 };
      current.count += 1;
      map.set(row.book_slug, current);
      return map;
    }, new Map()).values()
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

  return {
    rows,
    books,
    duplicateTextIds: duplicateTextPairs(rows)
  };
}

function validate(rows) {
  const duplicateTextIds = duplicateTextPairs(rows);
  return {
    ok: duplicateTextIds.length === 0 && rows.every((row) => Number(row.char_count) > 0),
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + Number(row.char_count || 0), 0),
    minChars: rows.length ? Math.min(...rows.map((row) => Number(row.char_count || 0))) : 0,
    maxChars: rows.length ? Math.max(...rows.map((row) => Number(row.char_count || 0))) : 0,
    duplicateTextIds
  };
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function main() {
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
    status: "校对轮",
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    selectionCount: selections.length,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    excludedByStandard: [
      "《李敖新刊》多为政论短文，明星政治、妓女传统、房事、遗教、请愿、法官、投资、双十节、谢聪敏、邵玉铭、金庸、朱高正、龚德柏、谢然之等章节里大量人物和事件，主要是论证材料或现实案情，未按故事拆收。",
      "《浮生记趣》系列中李敖祖父、算命、父亲、五叔、李敖童年、台大送报、陈又亮退敌、吓马洪祥等片段，属于李敖自己或家庭/校园场景，本轮不收。",
      "蔡孟坚故事在《俄国实行三民主义？》中重复出现，本轮只保留《谁实行三民主义？》版本。",
      "张贵永提前一刻钟也要洗衬衫已在总表以 LAKY008 收录，本轮不重复收入。",
      "介之推段落只有简述和解释，没有完整故事正文，暂不收录。",
      "方豪非自愿做神父一则原文标为传说，且李敖随即说明不相信，校准后暂不收。",
      "军官算妻命、姚从吾化妆老农、刘家顺飞机折返、张世民争洗碗权利、马宏祥被吓等虽有故事性，但与李敖家庭/亲历/同学交游场景绑定较重，本轮不收。"
    ],
    extractionNotes: [
      "《李敖新刊》共 38 篇正文，另有总序与目录；候选扫描 195 段，提取轮收入 9 条。",
      "本轮只收能脱离政论链条独立成立的笑话、掌故和小故事；李敖自己的经历、家庭片段、现实政治事件切片、法律案例和资料摘录继续排除。",
      "故事正文按原文截取，尽量切掉导语、评语和李敖自我插入；标题为便于检索的压缩标题。",
      "傅良圃一条篇幅较短，蔡孟坚一条政治语境较重，校对轮需重点确认是否继续保留。"
    ],
    proofreadAddCount: 5,
    proofreadAdds: [
      "曲突徙薪先知被忘",
      "徐子明说跟狗说话不能不狗叫",
      "殷海光一句不借挡周弃子",
      "卢保十个咸蛋吃一学期还剩半个",
      "魏廷朝看外国电影只有一男一女"
    ],
    proofreadDropCount: 0,
    proofreadDrops: [],
    proofreadNotes: [
      "校对轮从候选扫描中补入 5 条能独立成立的寓言、笑话和人物掌故；未删除提取轮 9 条。",
      "《两类人，两类待遇》中曲突徙薪段落有完整故事正文，提取轮误判为只有典故解释，校对轮补入。",
      "周弃子条目只保留狼式借钱与殷海光答“不借”的故事主体，删除后半段李敖拿自己比较的自述。",
      "继续排除李敖亲历的家庭、求学、同学恶作剧与政治案情材料，避免回到事件合集。"
    ],
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");

  if (!validation.ok) {
    throw new Error(`Validation failed for ${BOOK}`);
  }
  if (aggregate.duplicateTextIds.length) {
    throw new Error(`Duplicate story text in aggregate: ${JSON.stringify(aggregate.duplicateTextIds)}`);
  }

  console.log(
    JSON.stringify(
      {
        book: BOOK,
        rows: rows.length,
        aggregateRows: aggregate.rows.length,
        sourceFileCount: manifest.sourceFiles.length,
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
