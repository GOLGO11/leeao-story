const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "我最难忘的事和人";
const SLUG = "wo_zui_nanwang_de_shi_he_ren";
const ROUND = "story_round1";
const ID_PREFIX = "WZNW";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "001.自传回忆类",
  "003.我最难忘的事和人"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);

const selections = [
  { file: "003.我最难忘的一片小湖.txt", title: "鹅湖之会", paragraphs: [7] },
  { file: "005.我最难忘的一个组织.txt", title: "班纳森创办国际特赦", paragraphs: [4] },
  { file: "007.我最难忘的一个官僚同学.txt", title: "王孟仁不给施启扬说情", paragraphs: [9] },
  { file: "007.我最难忘的一个官僚同学.txt", title: "施启扬起草假离婚证书", paragraphs: [11] },
  { file: "007.我最难忘的一个官僚同学.txt", title: "施启扬索要红包", paragraphs: [82] },
  { file: "007.我最难忘的一个官僚同学.txt", title: "施启扬要给政府留余地", paragraphs: [89] },
  { file: "008.我最难忘的一个邻居.txt", title: "新科立委不知道裴存藩", paragraphs: [7] },
  { file: "011.我最难忘的一个老兵.txt", title: "张永亭被死者回头看", paragraphs: [5] },
  { file: "011.我最难忘的一个老兵.txt", title: "张永亭把子弹卖废铁", paragraphs: [8] },
  { file: "011.我最难忘的一个老兵.txt", title: "张永亭的伤都在背后", paragraphs: [9] },
  { file: "011.我最难忘的一个老兵.txt", title: "张永亭赤身归回", paragraphs: [12] },
  { file: "011.我最难忘的一个老兵.txt", title: "张永亭的男女伦理", paragraphs: [13] },
  { file: "011.我最难忘的一个老兵.txt", title: "张永亭赎表又输表", paragraphs: [14] },
  { file: "011.我最难忘的一个老兵.txt", title: "张永亭送热洗脚水", paragraphs: [16] },
  { file: "011.我最难忘的一个老兵.txt", title: "张永亭雨中取干内衣", paragraphs: [17] },
  { file: "013.我最难忘的一位教授.txt", title: "台静农的新式炸弹案", paragraphs: [6] },
  { file: "014.我最难忘的一个“反共义士”.txt", title: "曲军成两句话入狱", paragraphs: [4, 5, 6, 9] },
  { file: "014.我最难忘的一个“反共义士”.txt", title: "曲军成施展壁虎功", paragraphs: [10] },
  { file: "014.我最难忘的一个“反共义士”.txt", title: "曲军成奔走平反", paragraphs: [13, 14, 18] },
  { file: "015.我最难忘的一位残障人士.txt", title: "邱铭笙开刀前飞吻", paragraphs: [10, 11, 13, 14] },
  { file: "015.我最难忘的一位残障人士.txt", title: "邱铭笙和连培如一周", paragraphs: [17, 18, 19, 20, 21, 22, 23] },
  { file: "015.我最难忘的一位残障人士.txt", title: "相士说邱铭笙要破相", paragraphs: [27] },
  { file: "015.我最难忘的一位残障人士.txt", title: "卢神棍为手术祈福", paragraphs: [31] },
  {
    file: "015.我最难忘的一位残障人士.txt",
    title: "泥土和玫瑰",
    paragraphs: [34],
    start: "有一则波斯故事",
    end: "我曾经和玫瑰花在一起。”"
  },
  { file: "016.我最难忘的一个国特.txt", title: "乔家才不把遗产分给共产党", paragraphs: [2] },
  { file: "016.我最难忘的一个国特.txt", title: "乔家才拒绝换出狱", paragraphs: [47, 48] },
  { file: "016.我最难忘的一个国特.txt", title: "李广和做和平使者", paragraphs: [179, 180, 181, 182] },
  { file: "016.我最难忘的一个国特.txt", title: "毛教授第二天搬走", paragraphs: [195, 196, 197, 198, 199] },
  { file: "016.我最难忘的一个国特.txt", title: "刘秋芳换籍竞选", paragraphs: [202] },
  { file: "016.我最难忘的一个国特.txt", title: "何思源查刘秋芳选票", paragraphs: [211, 212, 213] },
  { file: "016.我最难忘的一个国特.txt", title: "傅作义推荐乔家才", paragraphs: [265, 268, 269] },
  { file: "016.我最难忘的一个国特.txt", title: "灯市口五花大绑", paragraphs: [277, 279, 281] },
  { file: "016.我最难忘的一个国特.txt", title: "乔家才的最后晚餐", paragraphs: [285] },
  { file: "016.我最难忘的一个国特.txt", title: "找错门牌进黑牢", paragraphs: [295] },
  { file: "016.我最难忘的一个国特.txt", title: "墨涂新闻透出无期徒刑", paragraphs: [319] },
  { file: "016.我最难忘的一个国特.txt", title: "茅山县长缝包袱", paragraphs: [320] },
  { file: "016.我最难忘的一个国特.txt", title: "总统府来视察黑牢", paragraphs: [376] },
  { file: "016.我最难忘的一个国特.txt", title: "乔家才不写悔过书", paragraphs: [393, 394] },
  { file: "016.我最难忘的一个国特.txt", title: "郑介民遗命办证明", paragraphs: [452, 453] }
];

function readGb18030(filePath) {
  return new TextDecoder("gb18030").decode(fs.readFileSync(filePath));
}

function stripNoise(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n\s*好读书柜《典藏版》，网址：.*$/gmu, "")
    .replace(/\n\s*扫描校对制作：.*$/gmu, "")
    .replace(/\n\s*本书由.*$/gmu, "")
    .replace(/\n\s*李敖影音E书.*$/gmu, "")
    .replace(/\n\s*李敖数字博物馆.*$/gmu, "")
    .replace(/\n\s*李敖资源下载站.*$/gmu, "")
    .replace(/\n\s*油管\/抖音.*$/gmu, "")
    .trim();
}

function splitParagraphs(text) {
  const lines = stripNoise(text).split("\n");
  const paragraphs = [];
  let buffer = [];
  let start = 1;

  function flush(endLine) {
    const raw = buffer.join("\n").trim();
    if (raw) {
      paragraphs.push({
        index: paragraphs.length + 1,
        text: raw.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n"),
        lineStart: start,
        lineEnd: endLine
      });
    }
    buffer = [];
  }

  lines.forEach((line, index) => {
    if (/^\s*$/.test(line)) {
      flush(index);
      start = index + 2;
      return;
    }
    if (buffer.length === 0) start = index + 1;
    buffer.push(line);
  });
  flush(lines.length);
  return paragraphs;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function getParagraphMap(fileName, cache) {
  if (!cache.has(fileName)) {
    const fullPath = path.join(SOURCE_ROOT, fileName);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Source file not found: ${fileName}`);
    }
    const paragraphs = splitParagraphs(readGb18030(fullPath));
    cache.set(fileName, new Map(paragraphs.map((paragraph) => [paragraph.index, paragraph])));
  }
  return cache.get(fileName);
}

function sliceText(text, selection) {
  let output = text;
  if (selection.start) {
    const startIndex = output.indexOf(selection.start);
    if (startIndex < 0) {
      throw new Error(`${selection.file} ${selection.title} missing slice start: ${selection.start}`);
    }
    output = output.slice(startIndex);
  }
  if (selection.end) {
    const endIndex = output.indexOf(selection.end);
    if (endIndex < 0) {
      throw new Error(`${selection.file} ${selection.title} missing slice end: ${selection.end}`);
    }
    output = output.slice(0, endIndex + selection.end.length);
  }
  return output.trim();
}

function buildRows() {
  const cache = new Map();
  return selections.map((selection, index) => {
    const paragraphMap = getParagraphMap(selection.file, cache);
    const parts = selection.paragraphs.map((paragraphIndex) => {
      const paragraph = paragraphMap.get(paragraphIndex);
      if (!paragraph) {
        throw new Error(`${selection.file} has no paragraph ${paragraphIndex}`);
      }
      return paragraph;
    });

    const text = sliceText(parts.map((part) => part.text).join("\n\n"), selection);
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: selection.paragraphs.map((paragraphIndex) => `${selection.file}#P${paragraphIndex}`).join(";"),
      source_file: selection.file,
      source_lines: `${Math.min(...parts.map((part) => part.lineStart))}-${Math.max(...parts.map((part) => part.lineEnd))}`,
      char_count: [...text].length,
      story_text: text
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
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  }
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
  fs.writeFileSync(filePath, `${blocks.join("\n\n---\n\n")}\n`, "utf8");
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
    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
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
  const sourceLines = row.source_lines || [row.source_line_start, row.source_line_end].filter(Boolean).join("-");
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || bookSlug,
    title: row.title,
    source_ids: row.source_ids,
    source_file: row.source_file,
    source_lines: sourceLines,
    char_count: row.char_count || [...storyText].length,
    story_text: storyText
  };
}

function writeAggregate() {
  const dataBooksDir = path.join(ROOT, "data", "books");
  const csvFiles = fs
    .readdirSync(dataBooksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dataBooksDir, entry.name, "story_round1.csv"))
    .filter((filePath) => fs.existsSync(filePath))
    .sort();

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

  return { rows, books };
}

function validate(rows) {
  const textHashes = new Map();
  const duplicateTextIds = [];
  for (const row of rows) {
    const normalized = row.story_text.replace(/\s+/g, "");
    if (textHashes.has(normalized)) {
      duplicateTextIds.push([textHashes.get(normalized), row.id]);
    } else {
      textHashes.set(normalized, row.id);
    }
  }

  return {
    ok: duplicateTextIds.length === 0 && rows.every((row) => row.char_count > 0),
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + row.char_count, 0),
    minChars: Math.min(...rows.map((row) => row.char_count)),
    maxChars: Math.max(...rows.map((row) => row.char_count)),
    duplicateTextIds
  };
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(ROOT, "notes"), { recursive: true });

  const rows = buildRows();
  writeCsv(path.join(OUT_DIR, "story_round1.csv"), rows);
  writeTxt(path.join(OUT_DIR, "story_round1.txt"), rows);

  const validation = validate(rows);
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
  fs.writeFileSync(
    path.join(OUT_DIR, "story_manifest.json"),
    `${JSON.stringify(
      {
        book: BOOK,
        slug: SLUG,
        round: ROUND,
        sourceRoot: path.relative(ROOT, SOURCE_ROOT),
        outputs: ["story_round1.csv", "story_round1.txt", "story_manifest.json", "story_validation.json"],
        criteria:
          "只保留李敖文中讲出来的故事；主角不是李敖本人，且有具体人物、动作、转折或收束；李敖自身经历、制度说明、法律材料、背景说明、单纯论辩和目录式资料从严剔除；正文保留原文。"
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(ROOT, "notes", "wo_zui_nanwang_de_shi_he_ren_story_round1.md"),
    [
      "# 我最难忘的事和人 story_round1",
      "",
      `- 输出条目：${rows.length}`,
      `- 总字数：${validation.totalChars}`,
      `- 最短/最长：${validation.minChars}/${validation.maxChars}`,
      "- 口径：保留李敖文中讲出来的故事；主角不是李敖本人，且有具体人物、动作、转折或收束；描述文字为原文。",
      "- 从严剔除：李敖自身演讲/旅行/出版往来事件、制度说明、书信材料、法律材料、背景说明、单纯论辩和目录式资料。",
      "- 保留重点：张永亭、曲军成、邱铭笙、乔家才等人物篇中可独立复述的轶事。"
    ].join("\n") + "\n",
    "utf8"
  );

  const aggregate = writeAggregate();
  console.log(
    JSON.stringify(
      {
        book: BOOK,
        rows: rows.length,
        validationOk: validation.ok,
        aggregateRows: aggregate.rows.length,
        aggregateBooks: aggregate.books
      },
      null,
      2
    )
  );
}

main();
