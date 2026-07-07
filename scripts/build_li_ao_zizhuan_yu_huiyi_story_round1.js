const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const BOOK_TITLE = "李敖自传与回忆";
const BOOK_SLUG = "li_ao_zizhuan_yu_huiyi";
const ID_PREFIX = "LZZYHY";
const INPUT_ROUND = "proofread_round1";
const ROUND = "story_round1";
const STATUS = "story_selected";
const DATE = "2026-06-30";

const BOOK_OUTPUT_DIR = path.join(process.cwd(), "data", "books", BOOK_SLUG);
const ALL_OUTPUT_DIR = path.join(process.cwd(), "data");
const NOTES_DIR = path.join(process.cwd(), "notes");
const WEB_DIR = path.join(process.cwd(), "web");
const INPUT_CSV = path.join(BOOK_OUTPUT_DIR, `${INPUT_ROUND}.csv`);

const HEADERS = [
  "id",
  "book",
  "round",
  "status",
  "title",
  "source_ids",
  "source_file",
  "source_heading",
  "source_heading_line",
  "source_line_start",
  "source_line_end",
  "char_count",
  "text_sha1",
  "story_text",
];

const SELECTIONS = [
  { type: "full", id: "LZZYHY005", title: "尹女士羞医而死" },
  { type: "full", id: "LZZYHY008", title: "大爷算命" },
  { type: "full", id: "LZZYHY014", title: "张作霖向老师打躬作揖" },
  { type: "full", id: "LZZYHY017", title: "母亲以身护子" },
  { type: "full", id: "LZZYHY021" },
  { type: "full", id: "LZZYHY022" },
  { type: "full", id: "LZZYHY023" },
  { type: "full", id: "LZZYHY024", title: "奶奶斗气不说话" },
  { type: "full", id: "LZZYHY025" },
  { type: "full", id: "LZZYHY026" },
  { type: "full", id: "LZZYHY030", title: "五叔赚老妈子的钱" },
  { type: "full", id: "LZZYHY031" },
  { type: "full", id: "LZZYHY035" },
  { type: "full", id: "LZZYHY036", title: "姥爷叫姥姥挺背" },
  { type: "full", id: "LZZYHY045", title: "胡适不替爸爸介绍职业" },
  { type: "full", id: "LZZYHY046" },
  { type: "full", id: "LZZYHY047" },
  { type: "full", id: "LZZYHY051" },
  {
    type: "slice",
    id: "LZZYHY054",
    title: "马占山被十万人欢迎",
    start: "1947年4月16日，马占山将军万里荣归",
    end: "最后百无聊赖，回到北平。",
  },
  {
    type: "slice",
    id: "LZZYHY054",
    title: "我见到马占山",
    start: "我家那时租他们家的后院",
    end: "活了六十四岁。",
  },
  { type: "full", id: "LZZYHY060" },
  { type: "full", id: "LZZYHY063", title: "第一次看到女招待" },
  { type: "full", id: "LZZYHY064" },
  { type: "full", id: "LZZYHY067" },
  { type: "full", id: "LZZYHY070" },
  { type: "full", id: "LZZYHY073" },
  { type: "full", id: "LZZYHY074" },
  { type: "full", id: "LZZYHY076" },
  { type: "full", id: "LZZYHY077" },
  { type: "full", id: "LZZYHY078" },
  { type: "full", id: "LZZYHY079" },
  { type: "full", id: "LZZYHY082" },
  { type: "full", id: "LZZYHY084", title: "沈二爷救妓女" },
  { type: "full", id: "LZZYHY088" },
  {
    type: "merge",
    ids: ["LZZYHY091", "LZZYHY092", "LZZYHY093", "LZZYHY094"],
    title: "盲肠炎大病不死",
  },
  { type: "full", id: "LZZYHY098" },
  {
    type: "slice",
    id: "LZZYHY102",
    title: "初次上学和告老师",
    start: "我是1942年进新鲜胡同小学念一年级的",
    end: "把他揪出来。",
  },
  { type: "full", id: "LZZYHY103" },
  { type: "full", id: "LZZYHY105" },
  { type: "full", id: "LZZYHY110" },
  { type: "full", id: "LZZYHY111" },
  { type: "full", id: "LZZYHY115" },
  { type: "full", id: "LZZYHY117" },
  {
    type: "slice",
    id: "LZZYHY118",
    title: "伤兵烟与兄弟相杀",
    start: "在天津，最后等到了一班船",
    end: "原诗凄惨，我至今不能忘记。",
  },
  {
    type: "slice",
    id: "LZZYHY118",
    title: "胡适醉打警察",
    start: "胡适在上海落魄的时候",
    end: "才自动辞职。",
  },
  {
    type: "slice",
    id: "LZZYHY118",
    title: "小李飞刀扎班长",
    start: "不料好景不长，一天中午休息时间",
    end: "记大过一次。",
  },
  {
    type: "slice",
    id: "LZZYHY118",
    title: "黄浦滩抢兑黄金",
    start: "上海那时戒严宵禁",
    end: "这种目睹怪现状，也真二千年所未有也！",
  },
  {
    type: "slice",
    id: "LZZYHY118",
    title: "背着藏书逃难",
    start: "上船那天晚上，中兴轮全轮上下",
    end: "从上海到海上，我们又逃难了。",
  },
  {
    type: "slice",
    id: "LZZYHY119",
    title: "初三上甲组报贾祸",
    start: "他那时还兼事务主任",
    end: "固其来有自也！",
  },
  {
    type: "slice",
    id: "LZZYHY121",
    title: "严侨踢足球",
    start: "有一次高班生踢足球",
    end: "大踢特踢起来了。",
  },
  {
    type: "slice",
    id: "LZZYHY121",
    title: "严侨倒写自己的名字",
    start: "严侨上课，才华四溢",
    end: "师生之情，融成一片。",
  },
  {
    type: "slice",
    id: "LZZYHY121",
    title: "严侨批“超越不了空时”",
    start: "那时我们的数学作业有专门印好的“数学练习簿”",
    end: "他还会跟学生的引文打笔仗！",
  },
  { type: "full", id: "LZZYHY122" },
  {
    type: "slice",
    id: "LZZYHY123",
    title: "严侨投奔自由",
    start: "在多次跟严侨的夜谈中",
    end: "保了严侨。",
  },
  {
    type: "slice",
    id: "LZZYHY124",
    title: "严侨酒后归队梦",
    start: "一天晚上，严侨又喝醉了酒",
    end: "我18岁。",
  },
  {
    type: "slice",
    id: "LZZYHY124",
    title: "严侨被捕后谁还敢帮",
    start: "严侨被捕时我还不知情",
    end: "备受考验了。",
  },
  { type: "full", id: "LZZYHY128" },
  { type: "full", id: "LZZYHY137" },
  { type: "full", id: "LZZYHY142" },
  { type: "full", id: "LZZYHY143" },
  {
    type: "slice",
    id: "LZZYHY144",
    title: "狗熊式读书",
    start: "读书当然很重要",
    end: "我只能说他们选错了职业！",
  },
  {
    type: "slice",
    id: "LZZYHY144",
    title: "口试只问还穿长袍吗",
    start: "考研究所口试",
    end: "遂在大家一笑状态下，考取了。",
  },
  { type: "full", id: "LZZYHY147" },
  { type: "full", id: "LZZYHY153" },
  { type: "full", id: "LZZYHY154" },
  {
    type: "slice",
    id: "LZZYHY168",
    title: "王世杰问官司告一段落再来",
    start: "姚从吾老师信中提到毛子水",
    end: "我和姚从吾老师告辞而出。",
  },
  { type: "full", id: "LZZYHY172" },
  {
    type: "slice",
    id: "LZZYHY176",
    title: "谢聪敏骂走狗与魏廷朝山地训练",
    start: "和我同时被跟的，有谢聪敏与魏廷朝",
    end: "他的“山地训练”也就告一段落。",
  },
  {
    type: "slice",
    id: "LZZYHY176",
    title: "吃警察",
    start: "在长达十四个月的软禁过程里",
    end: "我说：“这就叫‘警民一家’啊！”",
  },
  { type: "full", id: "LZZYHY184" },
  { type: "full", id: "LZZYHY187" },
  { type: "full", id: "LZZYHY188" },
  { type: "full", id: "LZZYHY189" },
  {
    type: "slice",
    id: "LZZYHY190",
    title: "八号房的洞房",
    start: "我第一次做政治犯的时候",
    end: "才真是名符其实的“洞房”。",
  },
  {
    type: "slice",
    id: "LZZYHY190",
    title: "牢房里的太阳约会",
    start: "每天午饭后，到下午开始做运动前",
    end: "太阳反倒是朋友了。",
  },
  {
    type: "slice",
    id: "LZZYHY190",
    title: "稿纸糊墙",
    start: "为了使光线好一点",
    end: "活在一台千奇百怪的湿度计里。",
  },
  {
    type: "slice",
    id: "LZZYHY190",
    title: "时间的批发商",
    start: "因为太久太久没有钟也没有表",
    end: "竟没在这方面寻找证明。",
  },
  {
    type: "slice",
    id: "LZZYHY190",
    title: "张俊宏住进八号房",
    start: "但是，当我从许荣淑口中",
    end: "又还有什么呢？",
  },
  { type: "full", id: "LZZYHY191" },
  { type: "full", id: "LZZYHY193" },
  { type: "full", id: "LZZYHY195" },
  { type: "full", id: "LZZYHY199" },
  { type: "full", id: "LZZYHY200" },
  { type: "full", id: "LZZYHY201" },
];

const STRICT_STORY_TITLES = new Set([
  "尹女士羞医而死",
  "大爷算命",
  "张作霖向老师打躬作揖",
  "独战土匪",
  "慓悍的庄家",
  "“丑妇刁民”",
  "奶奶斗气不说话",
  "“要把我给磕死了”",
  "死得清醒利落",
  "五叔赚老妈子的钱",
  "四姑做妖姬状",
  "烧冷灶",
  "姥爷叫姥姥挺背",
  "挑水夫喝尿",
  "日本鬼子的刑求",
  "沈二爷救妓女",
  "伤兵烟与兄弟相杀",
  "胡适醉打警察",
  "严侨踢足球",
  "严侨倒写自己的名字",
  "问松：“我醉何如？”",
  "严侨投奔自由",
  "严侨酒后归队梦",
  "靠老婆吃饭",
  "谢聪敏骂走狗与魏廷朝山地训练",
  "吕留良案",
  "老子不杀儿子杀",
  "“感化”龚大炮失败",
  "“感化”于氏兄弟落败",
]);

function ensureDirs() {
  for (const dir of [BOOK_OUTPUT_DIR, ALL_OUTPUT_DIR, NOTES_DIR, WEB_DIR]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function parseCsv(text) {
  const clean = text.replace(/^\ufeff/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];
    const next = clean[i + 1];
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
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }

  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/u, ""));
  return rows
    .filter((values) => values.some((value) => value !== ""))
    .map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function sha1(text) {
  return crypto.createHash("sha1").update(text, "utf8").digest("hex");
}

function charCount(text) {
  return Array.from(text).length;
}

function intValue(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function lineOffset(text) {
  if (!text) return 0;
  return text.split("\n").length - 1;
}

function normalizeText(text) {
  return String(text || "").trim();
}

function sourceIds(row) {
  return row.source_ids || row.id;
}

function entryFromRow(row, title = row.title) {
  const storyText = normalizeText(row.story_text);
  return {
    title,
    source_ids: sourceIds(row),
    source_file: row.source_file,
    source_heading: row.source_heading,
    source_heading_line: row.source_heading_line,
    source_line_start: row.source_line_start,
    source_line_end: row.source_line_end,
    story_text: storyText,
  };
}

function entryFromMerge(rowsById, selection) {
  const rows = selection.ids.map((id) => {
    const row = rowsById.get(id);
    if (!row) throw new Error(`Missing row for merge: ${id}`);
    return row;
  });
  const storyText = rows.map((row) => normalizeText(row.story_text)).join("\n\n");
  return {
    title: selection.title,
    source_ids: rows.map((row) => sourceIds(row)).join("|"),
    source_file: Array.from(new Set(rows.map((row) => row.source_file))).join(" | "),
    source_heading: rows[0].source_heading,
    source_heading_line: Math.min(...rows.map((row) => intValue(row.source_heading_line))),
    source_line_start: Math.min(...rows.map((row) => intValue(row.source_line_start))),
    source_line_end: Math.max(...rows.map((row) => intValue(row.source_line_end))),
    story_text: storyText,
  };
}

function entryFromSlice(row, selection) {
  const text = row.story_text;
  const startIndex = text.indexOf(selection.start);
  if (startIndex < 0) {
    throw new Error(`Slice start not found in ${selection.id}: ${selection.start}`);
  }
  const endIndex = text.indexOf(selection.end, startIndex);
  if (endIndex < 0) {
    throw new Error(`Slice end not found in ${selection.id}: ${selection.end}`);
  }
  const storyText = normalizeText(text.slice(startIndex, endIndex + selection.end.length));
  const sourceStart = intValue(row.source_line_start) + lineOffset(text.slice(0, startIndex));
  const sourceEnd = sourceStart + lineOffset(storyText);
  return {
    title: selection.title,
    source_ids: sourceIds(row),
    source_file: row.source_file,
    source_heading: row.source_heading,
    source_heading_line: row.source_heading_line,
    source_line_start: sourceStart,
    source_line_end: sourceEnd,
    story_text: storyText,
  };
}

function buildRows() {
  const inputRows = parseCsv(fs.readFileSync(INPUT_CSV, "utf8"));
  const rowsById = new Map(inputRows.map((row) => [row.id, row]));
  const entries = [];

  for (const selection of SELECTIONS) {
    if (selection.type === "full") {
      const row = rowsById.get(selection.id);
      if (!row) throw new Error(`Missing row: ${selection.id}`);
      entries.push(entryFromRow(row, selection.title || row.title));
    } else if (selection.type === "merge") {
      entries.push(entryFromMerge(rowsById, selection));
    } else if (selection.type === "slice") {
      const row = rowsById.get(selection.id);
      if (!row) throw new Error(`Missing row: ${selection.id}`);
      entries.push(entryFromSlice(row, selection));
    } else {
      throw new Error(`Unknown selection type: ${selection.type}`);
    }
  }

  const strictEntries = entries.filter((entry) => STRICT_STORY_TITLES.has(entry.title));

  return {
    inputRows,
    rows: strictEntries.map((entry, index) => {
      const storyText = normalizeText(entry.story_text);
      return {
        id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
        book: BOOK_TITLE,
        round: ROUND,
        status: STATUS,
        title: entry.title,
        source_ids: entry.source_ids,
        source_file: entry.source_file,
        source_heading: entry.source_heading,
        source_heading_line: entry.source_heading_line,
        source_line_start: entry.source_line_start,
        source_line_end: entry.source_line_end,
        char_count: charCount(storyText),
        text_sha1: sha1(storyText),
        story_text: storyText,
      };
    }),
  };
}

function writeCsv(filePath, rows) {
  const lines = [HEADERS.join(",")];
  for (const row of rows) {
    lines.push(HEADERS.map((header) => csvEscape(row[header])).join(","));
  }
  fs.writeFileSync(filePath, `\ufeff${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const parts = [];
  for (const row of rows) {
    parts.push(
      [
        `## ${row.id} | ${row.title}`,
        `book: ${row.book}`,
        `round: ${row.round}`,
        `status: ${row.status}`,
        `source_ids: ${row.source_ids}`,
        `source_file: ${row.source_file}`,
        `source_lines: ${row.source_line_start}-${row.source_line_end}`,
        `char_count: ${row.char_count}`,
        "",
        row.story_text,
      ].join("\n")
    );
  }
  fs.writeFileSync(filePath, `${parts.join("\n\n---\n\n")}\n`, "utf8");
}

function summarizeByFile(rows) {
  const byFile = {};
  for (const row of rows) {
    byFile[row.source_file] = (byFile[row.source_file] || 0) + 1;
  }
  return byFile;
}

function writeManifestAndValidation(inputRows, rows) {
  const selectedSourceIds = new Set(
    rows.flatMap((row) => row.source_ids.split("|").map((id) => id.trim()).filter(Boolean))
  );
  const duplicateIds = rows.length - new Set(rows.map((row) => row.id)).size;
  const duplicateHashes = rows.length - new Set(rows.map((row) => row.text_sha1)).size;
  const emptyRows = rows.filter((row) => !row.story_text.trim()).map((row) => row.id);
  const duplicateTitles = rows
    .filter((row, index) => rows.findIndex((candidate) => candidate.title === row.title) !== index)
    .map((row) => row.id);

  const manifest = {
    book: BOOK_TITLE,
    slug: BOOK_SLUG,
    round: ROUND,
    status: STATUS,
    generated_on: DATE,
    input_round: INPUT_ROUND,
    input_count: inputRows.length,
    output_count: rows.length,
    selected_source_id_count: selectedSourceIds.size,
    by_source_file: summarizeByFile(rows),
    duplicate_ids: duplicateIds,
    duplicate_text_hashes: duplicateHashes,
    note:
      "Narrow story selection. Keeps Li Ao-told anecdotal stories with a usable point; excludes general background, resumes, letters, argument-only blocks, and loose chronology unless a self-contained story is sliced out.",
  };

  const validation = {
    ok: rows.length > 0 && duplicateIds === 0 && duplicateHashes === 0 && emptyRows.length === 0,
    input_count: inputRows.length,
    row_count: rows.length,
    selected_source_id_count: selectedSourceIds.size,
    duplicate_ids: duplicateIds,
    duplicate_text_hashes: duplicateHashes,
    duplicate_title_rows: duplicateTitles,
    empty_story_text_rows: emptyRows,
    min_char_count: rows.length ? Math.min(...rows.map((row) => row.char_count)) : 0,
    max_char_count: rows.length ? Math.max(...rows.map((row) => row.char_count)) : 0,
  };

  fs.writeFileSync(
    path.join(BOOK_OUTPUT_DIR, "story_manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(BOOK_OUTPUT_DIR, "story_validation.json"),
    `${JSON.stringify(validation, null, 2)}\n`,
    "utf8"
  );
}

function writeRoundNote(inputRows, rows) {
  const selectedSourceIds = new Set(
    rows.flatMap((row) => row.source_ids.split("|").map((id) => id.trim()).filter(Boolean))
  );
  const dropped = inputRows
    .filter((row) => !selectedSourceIds.has(row.id))
    .map((row) => `${row.id} ${row.title}`);
  const fileLines = Object.entries(summarizeByFile(rows))
    .map(([file, count]) => `- ${file}: ${count}`)
    .join("\n");
  const note = [
    `# ${BOOK_TITLE} ${ROUND}`,
    "",
    `- date: ${DATE}`,
    `- input_round: ${INPUT_ROUND}`,
    `- input_rows: ${inputRows.length}`,
    `- output_rows: ${rows.length}`,
    `- selected_source_id_count: ${selectedSourceIds.size}`,
    "- keep: 李敖文中讲出来的故事；主角不是李敖本人，且有具体人物、动作、转折或收束。",
    "- drop: 李敖自身经历/亲历节点、家族迁徙流水、制度说明、法律材料、资料清单、长篇论辩和松散背景。",
    "- split: 长候选中若只有一小段能独立成故事，只保留原文中的故事段落。",
    "",
    "## By Source File",
    "",
    fileLines,
    "",
    "## Dropped Source Candidates",
    "",
    dropped.map((line) => `- ${line}`).join("\n"),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(NOTES_DIR, `${BOOK_SLUG}_${ROUND}.md`), note, "utf8");
}

function writeWebData(rows) {
  const sources = Object.entries(summarizeByFile(rows)).map(([file, count]) => ({
    file,
    count,
  }));
  const payload = {
    book: BOOK_TITLE,
    slug: BOOK_SLUG,
    round: ROUND,
    generatedOn: DATE,
    count: rows.length,
    totalChars: rows.reduce((total, row) => total + row.char_count, 0),
    sources,
    stories: rows.map((row) => ({
      id: row.id,
      title: row.title,
      sourceIds: row.source_ids.split("|"),
      sourceFile: row.source_file,
      sourceLines: `${row.source_line_start}-${row.source_line_end}`,
      charCount: row.char_count,
      text: row.story_text,
    })),
  };
  fs.writeFileSync(
    path.join(WEB_DIR, "stories.js"),
    `window.LEEAO_STORIES = ${JSON.stringify(payload, null, 2)};\n`,
    "utf8"
  );
}

function main() {
  ensureDirs();
  const { inputRows, rows } = buildRows();
  const bookCsv = path.join(BOOK_OUTPUT_DIR, `${ROUND}.csv`);
  const bookTxt = path.join(BOOK_OUTPUT_DIR, `${ROUND}.txt`);
  writeCsv(bookCsv, rows);
  writeTxt(bookTxt, rows);
  writeCsv(path.join(ALL_OUTPUT_DIR, "all_stories.csv"), rows);
  writeTxt(path.join(ALL_OUTPUT_DIR, "all_stories.txt"), rows);
  writeManifestAndValidation(inputRows, rows);
  writeRoundNote(inputRows, rows);
  writeWebData(rows);
  console.log(
    JSON.stringify(
      {
        book: BOOK_TITLE,
        round: ROUND,
        input_rows: inputRows.length,
        output_rows: rows.length,
        book_csv: path.relative(process.cwd(), bookCsv),
        book_txt: path.relative(process.cwd(), bookTxt),
        web_data: path.relative(process.cwd(), path.join(WEB_DIR, "stories.js")),
      },
      null,
      2
    )
  );
}

main();
