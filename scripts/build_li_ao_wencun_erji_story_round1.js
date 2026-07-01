const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖文存二集";
const SLUG = "li_ao_wencun_erji";
const ROUND = "story_round1";
const ID_PREFIX = "LAWCEJ";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "002.精品散文类",
  "005.李敖文存二集"
);
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
  "li_ao_wencun_erji"
];

const selections = [
  {
    file: "001.“缇萦救父”表示了什么？.txt",
    title: "缇萦上书救父",
    paragraphs: [5, 6, 7, 8]
  },
  {
    file: "001.“缇萦救父”表示了什么？.txt",
    title: "孔融一家争死",
    paragraphs: [61],
    start: "为了收容通缉犯张俭",
    end: "开脱亲人。"
  },
  {
    file: "001.“缇萦救父”表示了什么？.txt",
    title: "吉翂挝鼓乞代父命",
    paragraphs: [61],
    start: "吉翂的父亲",
    end: "结果才查明白。"
  },
  {
    file: "001.“缇萦救父”表示了什么？.txt",
    title: "高郢张绍组请代父死",
    paragraphs: [62],
    start: "唐朝高郢的父亲"
  },
  {
    file: "001.“缇萦救父”表示了什么？.txt",
    title: "贾直言抢喝毒药",
    paragraphs: [64],
    start: "唐朝贾直言"
  },
  {
    file: "001.“缇萦救父”表示了什么？.txt",
    title: "劭广两子做奴换父命",
    paragraphs: [82],
    start: "3世纪，晋朝武帝的时候",
    end: "还是判了劭广五年。"
  },
  {
    file: "003.“逸豫适足亡身”吗？.txt",
    title: "刘后推出银盆皇子劳军",
    paragraphs: [13],
    start: "刘后是最有名的爱钱大王",
    end: "你去卖了劳军吧！”"
  },
  {
    file: "003.“逸豫适足亡身”吗？.txt",
    title: "敬新磨扇醒李天下",
    paragraphs: [15],
    start: "唐庄宗演戏演得高兴",
    end: "大笑起来。"
  },
  {
    file: "003.“逸豫适足亡身”吗？.txt",
    title: "敬新磨反讽救县令",
    paragraphs: [16]
  },
  {
    file: "004.中国小姐新论.txt",
    title: "汉高祖美人画像退匈奴",
    paragraphs: [5]
  },
  {
    file: "004.中国小姐新论.txt",
    title: "金苹果选美引战",
    paragraphs: [11],
    start: "照希腊人说法",
    end: "一打就是十年。"
  },
  {
    file: "005.罗斯福路该改名罗斯祸路.txt",
    title: "吴敬恒回敬小弟不姓王",
    paragraphs: [4],
    start: "当年王照讨论注音符号",
    end: "小弟不姓王。”"
  },
  {
    file: "005.罗斯福路该改名罗斯祸路.txt",
    title: "慕容霸摔牙改名慕容缺",
    paragraphs: [18],
    start: "前燕慕容霸很有武功",
    end: "慕容垂”"
  },
  {
    file: "006.重要不重要与不重要重要.txt",
    title: "宋太祖弹弓打掉牙",
    paragraphs: [2],
    end: "送大臣一笔钱。"
  },
  {
    file: "006.重要不重要与不重要重要.txt",
    title: "贝尔电话被当玩具",
    paragraphs: [12],
    start: "又如发明电话的贝尔",
    end: "别人不要买“玩具”。"
  },
  {
    file: "006.重要不重要与不重要重要.txt",
    title: "萧何搬走秦朝档案",
    paragraphs: [17],
    start: "刘邦进咸阳",
    end: "得以争胜得以建国。"
  },
  {
    file: "006.重要不重要与不重要重要.txt",
    title: "休德两分钱一亩买阿拉斯加",
    paragraphs: [17],
    start: "又如美国国务卿休德",
    end: "使美国受益在五十、一百年后。"
  },
  {
    file: "008.“舒而脱脱兮！”.txt",
    title: "巴黎菲菲脱衣舞吊胃口",
    paragraphs: [36, 37, 38, 39, 40]
  },
  {
    file: "008.“舒而脱脱兮！”.txt",
    title: "吉普赛女郎梦中变美",
    paragraphs: [50],
    start: "例如一个十九岁的吉普赛女郎",
    end: "最后梦醒时分，犹娇喘不已。"
  },
  {
    file: "011.论没有“流血的自由”.txt",
    title: "谭嗣同不肯逃",
    paragraphs: [7],
    start: "戊戌政变时候的谭嗣同",
    end: "就义之日，观者万人！”"
  },
  {
    file: "011.论没有“流血的自由”.txt",
    title: "禹之谟要流血却被绞",
    paragraphs: [8],
    start: "当时革命志士禹之谟",
    end: "辜负我满腔心事矣！”"
  },
  {
    file: "011.论没有“流血的自由”.txt",
    title: "斯大林大公审让被告自毁",
    paragraphs: [13, 14, 15, 16],
    end: "追随斯大林！”"
  },
  {
    file: "012.牛肉面老板的七封信.txt",
    title: "五台山长老逐鲁智深",
    paragraphs: [65, 66, 67],
    start: "你前番一次大醉",
    end: "我这里决然安你不得了！"
  }
];

const proofreadDrops = new Set([
  "宋太祖弹弓打掉牙",
  "巴黎菲菲脱衣舞吊胃口",
  "吉普赛女郎梦中变美"
]);

const decoder = new TextDecoder("gb18030");
const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖导航站",
  "油管/抖音"
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function readSource(fileName) {
  const filePath = path.join(SOURCE_ROOT, fileName);
  return decoder.decode(fs.readFileSync(filePath)).replace(/\r\n/g, "\n");
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

function sourceId(selection, paragraph) {
  const fileIndex = (selection.file.match(/^(\d{3})\./) || [null, "000"])[1];
  return `${ID_PREFIX}_${fileIndex}_${paragraph.index}`;
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
  return selections.filter((selection) => !proofreadDrops.has(selection.title)).map((selection, index) => {
    const paragraphs = getParagraphs(selection.file, cache).filter((paragraph) =>
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
      source_ids: paragraphs.map((paragraph) => sourceId(selection, paragraph)).join(";"),
      source_file: selection.file,
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
      `【${row.id}】${row.title}`,
      `书名：${row.book}`,
      `出处：${row.source_file}，${row.source_lines}行`,
      `字数：${row.char_count}`,
      "",
      row.story_text
    ].join("\n")
  );
  fs.writeFileSync(filePath, rows.length ? `${blocks.join("\n\n---\n\n")}\n` : "", "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
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

function bookSortKey(filePath) {
  const slug = path.basename(path.dirname(filePath));
  const index = BOOK_ORDER.indexOf(slug);
  return index >= 0 ? index : BOOK_ORDER.length + slug;
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
    .map((entry) => path.join(dataBooksDir, entry.name, "story_round1.csv"))
    .filter((filePath) => fs.existsSync(filePath))
    .sort((a, b) => {
      const left = bookSortKey(a);
      const right = bookSortKey(b);
      return typeof left === "number" && typeof right === "number"
        ? left - right
        : String(left).localeCompare(String(right));
    });

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
    sources: Array.from(new Set(rows.map((row) => `${row.book}｜${row.source_file}`))),
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
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    selectionCount: selections.length,
    proofreadDropCount: proofreadDrops.size,
    proofreadDrops: Array.from(proofreadDrops),
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    excludedByStandard: [
      "李敖自己的生活事件、交游场景和写作姿态",
      "纯论述、史料目录、文献校勘和观念归纳",
      "案件、书信、广告和办刊过程中的李敖本人事件",
      "附录中明确署名为他人的整篇文章，除非李敖正文直接转述",
      "只有资料性陈述、术语分类或名单串列而无故事转折的段落"
    ],
    proofreadTrimmed: [
      "吉翂挝鼓乞代父命",
      "高郢张绍组请代父死",
      "刘后推出银盆皇子劳军",
      "慕容霸摔牙改名慕容缺",
      "贝尔电话被当玩具",
      "斯大林大公审让被告自毁"
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
