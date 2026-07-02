const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖杂文集";
const SLUG = "li_ao_zawenji";
const ROUND = "story_round1";
const ID_PREFIX = "LAZWJ";
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
  "li_ao_xinkan",
  "qianqiu_wansui_wuya_qiushi_heji",
  "li_ao_zawenji"
];

const selections = [
  {
    prefix: "008",
    title: "秦舞阳见秦王发抖露馅",
    paragraphs: [4],
    start: "话说荆轲刺秦王",
    end: "便吓得发抖而遭发现。"
  },
  {
    prefix: "010",
    title: "韩福瑞临时代替詹森主持募捐会",
    paragraphs: [4],
    start: "在三四年前",
    end: "一定不会在这么仓卒的时间内接手的。"
  },
  {
    prefix: "010",
    title: "韩福瑞十年后认出陈纳德夫人",
    paragraphs: [7],
    start: "以我个人为例",
    end: "我在参议院那边见过你！”"
  },
  {
    prefix: "010",
    title: "韩福瑞下班后只同漂亮小姐说话",
    paragraphs: [7],
    start: "又有一次，我同华府的一位高级官员",
    end: "说着就走了过来。"
  },
  {
    prefix: "010",
    title: "韩福瑞给记者看穿洞鞋底",
    paragraphs: [8],
    start: "据说有一次，在他竞选旅行时",
    end: "你们看，我走得皮鞋都穿洞了！”"
  },
  {
    prefix: "010",
    title: "韩福瑞让空小姐先读地理",
    paragraphs: [18],
    start: "记得有一次，他快竞选副总统的时候",
    end: "‘空’小姐，要先读读‘地理’啦！”"
  },
  {
    prefix: "010",
    title: "韩福瑞说成功秘诀是好太太",
    paragraphs: [19],
    start: "不久以前，在美国一家电视节目中",
    end: "我有一位好太太！”"
  },
  {
    prefix: "010",
    title: "韩福瑞夫人等那个也在等我的人",
    paragraphs: [20],
    start: "有一次在机场上",
    end: "我等那位也在等着我的人！”"
  },
  {
    prefix: "010",
    title: "韩福瑞夫妇互送同一条狗",
    paragraphs: [20],
    start: "今年圣诞节",
    end: "又可以逗先生玩玩。"
  },
  {
    prefix: "015",
    title: "章太炎写信挖苦胡适丢宝玉大弓",
    paragraphs: [6, 7, 8, 9, 10]
  },
  {
    prefix: "015",
    title: "狗熊进玉米园读书只剩一根",
    paragraphs: [16],
    start: "他看书，就好像一只狗熊",
    end: "出园来时腋下还是只剩那一根。"
  }
];

const decoder = new TextDecoder("gb18030");
const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖研究网地址",
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
  (name) => name.startsWith("014."),
  "book 014"
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
      "《我的希望》《狱中书信两封》《李敖札记》《台大校长不要脸》《退孙中山的票》《义助慰安妇》《为什么要声讨法轮功？》《阿扁的四条出路》等篇中，大量段落是政论、书信、自述、现实政治案例、战争暴行记录或观点材料，不按故事收入。",
      "《义助慰安妇》中的南京暴行记录具叙事性，但主体是战争罪行材料与史料引文，不属于李敖用来说明道理的小故事，本轮排除。",
      "《阿扁的四条出路》中陈水扁醉酒、李登辉坐椅子、动物农庄类比等，或为现实政治事件，或为文学/政治案例链，暂不收；杰克逊骑马队进白宫只有一句类比，校对轮删除。",
      "《我所知道的韩福瑞》虽署陈香梅，源文注说明该文经李敖连改带写；本轮只收其中可独立成立的人物轶事，排除人物品格概述和履历说明。",
      "《我所知道的韩福瑞》“邀批评记者辩论再写”是概括性场景，不是单次具体故事，校对轮删除。",
      "《关于韩福瑞和他的思想》主体是序文、思想介绍和文星事件材料，未拆收。",
      "《李敖中文大句典》构想书、《给吕佳真的工作日志》《中国奥运歌》没有符合标准的故事条目。"
    ],
    extractionNotes: [
      "源目录含 15 篇正文与 1 个目录文件；候选扫描 34 段，提取轮收入 13 条，校对轮保留 11 条。",
      "本轮收入集中在韩福瑞人物轶事、章太炎挖苦胡适的信，以及秦舞阳历史类比。",
      "故事正文按原文切出，尽量删除导语、概述、评论和李敖自我宣传段落。",
      "《我所知道的韩福瑞》为陈香梅署名但李敖改写增写，校对轮按《李敖杂文集》内的李敖改写文本保留其中人物轶事。",
      "校对轮删除 2 条：杰克逊骑马队进白宫过薄，韩福瑞邀批评记者辩论再写偏概括场景。",
      "校对轮收窄 2 条：秦舞阳条目删除尾部评论句，章太炎条目删除结尾评价句。",
      "狗熊进玉米园虽短，但属于完整比喻型小故事，校对轮保留。"
    ],
    proofreadAddCount: 0,
    proofreadAdds: [],
    proofreadDropCount: 2,
    proofreadDrops: [
      "杰克逊骑马队进白宫",
      "韩福瑞邀批评记者辩论再写"
    ],
    proofreadNotes: [
      "杰克逊骑马队进白宫仅一句类比，没有展开为可独立复述的小故事，删除。",
      "韩福瑞邀批评记者辩论再写用“比如遇到”概括习惯性场景，不是单次具体故事，删除。",
      "韩福瑞系列虽署陈香梅，但源文注明确李敖连改带写，本轮仍按李敖杂文集中的改写文本保留具体轶事。",
      "秦舞阳和章太炎两条只作切口收窄，故事主体保留。"
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
