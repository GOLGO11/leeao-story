const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const BOOK_TITLE = "李敖自传与回忆";
const BOOK_SLUG = "li_ao_zizhuan_yu_huiyi";
const ID_PREFIX = "LZZYHY";
const INPUT_ROUND = "extract_round1";
const ROUND = "proofread_round1";
const STATUS = "proofread";
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

const MERGES = [
  ["LZZYHY083", "LZZYHY082", "协会证明并回吴焕章仗义一事"],
  ["LZZYHY114", "LZZYHY113", "小学毕业证书落款并回第一张文凭"],
  ["LZZYHY132", "LZZYHY131", "严侨英文落款并回七年隔世一信"],
  ["LZZYHY141", "LZZYHY140", "皈命礼文书并回严侨皈依佛门"],
  ["LZZYHY176", "LZZYHY175", "信末落款并回文星垮台后的往来"],
  ["LZZYHY182", "LZZYHY181", "和解书并回最难忘的警察"],
  ["LZZYHY192", "LZZYHY191", "案情论证小节并回十四点"],
  ["LZZYHY193", "LZZYHY191", "案情论证小节并回十四点"],
  ["LZZYHY199", "LZZYHY198", "牢房章节误拆并回一篇"],
  ["LZZYHY200", "LZZYHY198", "牢房章节误拆并回一篇"],
  ["LZZYHY201", "LZZYHY198", "牢房章节误拆并回一篇"],
  ["LZZYHY202", "LZZYHY198", "牢房章节误拆并回一篇"],
  ["LZZYHY203", "LZZYHY198", "牢房章节误拆并回一篇"],
  ["LZZYHY215", "LZZYHY214", "训导组落款并回感化李敖一事"],
];

const RETITLES = new Map([
  ["LZZYHY109", "炉子与摇煤球"],
  ["LZZYHY191", "黄中国案十四点"],
  ["LZZYHY198", "我最难忘的一间牢房"],
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

  const headers = rows.shift();
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

function joinStoryText(parentText, childText) {
  const left = String(parentText || "").trimEnd();
  const right = String(childText || "").trim();
  if (!left) return right;
  if (!right) return left;
  return `${left}\n\n${right}`;
}

function normalizeInputRows(rows) {
  return rows.map((row) => ({
    ...row,
    source_ids: [row.id],
    _removed: false,
    _merge_notes: [],
  }));
}

function mergeRows(rows) {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const applied = [];

  for (const [childId, parentId, reason] of MERGES) {
    const child = byId.get(childId);
    const parent = byId.get(parentId);
    if (!child || !parent) {
      throw new Error(`Missing merge row: ${childId} -> ${parentId}`);
    }
    parent.story_text = joinStoryText(parent.story_text, child.story_text);
    parent.source_ids.push(...child.source_ids);
    parent.source_line_start = String(
      Math.min(intValue(parent.source_line_start), intValue(child.source_line_start))
    );
    parent.source_line_end = String(
      Math.max(intValue(parent.source_line_end), intValue(child.source_line_end))
    );
    parent.source_heading_line = String(
      Math.min(intValue(parent.source_heading_line), intValue(child.source_heading_line))
    );
    if (parent.source_file !== child.source_file) {
      parent.source_file = Array.from(new Set([parent.source_file, child.source_file])).join(" | ");
    }
    parent._merge_notes.push(`${childId}: ${reason}`);
    child._removed = true;
    applied.push({ childId, parentId, reason });
  }

  return applied;
}

function retitleRows(rows) {
  const applied = [];
  for (const row of rows) {
    if (!RETITLES.has(row.id)) continue;
    const oldTitle = row.title;
    row.title = RETITLES.get(row.id);
    applied.push({ id: row.id, from: oldTitle, to: row.title });
  }
  return applied;
}

function buildProofreadRows() {
  if (!fs.existsSync(INPUT_CSV)) {
    throw new Error(`Input CSV not found: ${INPUT_CSV}`);
  }

  const inputRows = normalizeInputRows(parseCsv(fs.readFileSync(INPUT_CSV, "utf8")));
  const merges = mergeRows(inputRows);
  const retitles = retitleRows(inputRows);
  const keptRows = inputRows.filter((row) => !row._removed);

  return {
    inputCount: inputRows.length,
    merges,
    retitles,
    rows: keptRows.map((row, index) => {
      const storyText = row.story_text.trim();
      return {
        id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
        book: BOOK_TITLE,
        round: ROUND,
        status: STATUS,
        title: row.title,
        source_ids: row.source_ids.join("|"),
        source_file: row.source_file,
        source_heading: row.source_heading,
        source_heading_line: row.source_heading_line,
        source_line_start: row.source_line_start,
        source_line_end: row.source_line_end,
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

function writeManifestAndValidation({ inputCount, rows, merges, retitles }) {
  const duplicateIds = rows.length - new Set(rows.map((row) => row.id)).size;
  const duplicateHashes = rows.length - new Set(rows.map((row) => row.text_sha1)).size;
  const emptyRows = rows.filter((row) => !row.story_text.trim()).map((row) => row.id);
  const badSourceIds = rows.filter((row) => !row.source_ids.trim()).map((row) => row.id);
  const byFile = summarizeByFile(rows);

  const manifest = {
    book: BOOK_TITLE,
    slug: BOOK_SLUG,
    round: ROUND,
    status: STATUS,
    generated_on: DATE,
    source_encoding: "gb18030",
    input_round: INPUT_ROUND,
    input_count: inputCount,
    output_count: rows.length,
    merged_rows: merges.length,
    retitled_rows: retitles.length,
    by_source_file: byFile,
    duplicate_ids: duplicateIds,
    duplicate_text_hashes: duplicateHashes,
    note:
      "Proofread round 1 merges document labels, signatures, and mis-split chapter fragments back into their parent stories. Story text is still copied from source text, with no paraphrasing.",
  };

  const validation = {
    ok:
      rows.length > 0 &&
      duplicateIds === 0 &&
      duplicateHashes === 0 &&
      emptyRows.length === 0 &&
      badSourceIds.length === 0,
    input_count: inputCount,
    row_count: rows.length,
    merged_rows: merges.length,
    retitled_rows: retitles.length,
    duplicate_ids: duplicateIds,
    duplicate_text_hashes: duplicateHashes,
    empty_story_text_rows: emptyRows,
    missing_source_ids_rows: badSourceIds,
    min_char_count: rows.length ? Math.min(...rows.map((row) => row.char_count)) : 0,
    max_char_count: rows.length ? Math.max(...rows.map((row) => row.char_count)) : 0,
  };

  fs.writeFileSync(
    path.join(BOOK_OUTPUT_DIR, "proofread_manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(BOOK_OUTPUT_DIR, "proofread_validation.json"),
    `${JSON.stringify(validation, null, 2)}\n`,
    "utf8"
  );
}

function writeRoundNote({ inputCount, rows, merges, retitles }) {
  const fileLines = Object.entries(summarizeByFile(rows))
    .map(([file, count]) => `- ${file}: ${count}`)
    .join("\n");
  const mergeLines = merges
    .map((item) => `- ${item.childId} -> ${item.parentId}: ${item.reason}`)
    .join("\n");
  const retitleLines = retitles
    .map((item) => `- ${item.id}: ${item.from} -> ${item.to}`)
    .join("\n");
  const note = [
    `# ${BOOK_TITLE} ${ROUND}`,
    "",
    `- date: ${DATE}`,
    `- input_round: ${INPUT_ROUND}`,
    `- input_rows: ${inputCount}`,
    `- output_rows: ${rows.length}`,
    `- status: ${STATUS}`,
    "- principle: keep the original story text; only merge mistaken boundaries and normalize obviously bad titles.",
    "",
    "## By Source File",
    "",
    fileLines,
    "",
    "## Merged Rows",
    "",
    mergeLines,
    "",
    "## Retitled Rows",
    "",
    retitleLines,
    "",
    "## Web Output",
    "",
    "- web/index.html reads web/stories.js and displays the proofread rows.",
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
  const result = buildProofreadRows();
  const bookCsv = path.join(BOOK_OUTPUT_DIR, `${ROUND}.csv`);
  const bookTxt = path.join(BOOK_OUTPUT_DIR, `${ROUND}.txt`);
  writeCsv(bookCsv, result.rows);
  writeTxt(bookTxt, result.rows);
  writeCsv(path.join(ALL_OUTPUT_DIR, "all_stories.csv"), result.rows);
  writeTxt(path.join(ALL_OUTPUT_DIR, "all_stories.txt"), result.rows);
  writeManifestAndValidation(result);
  writeRoundNote(result);
  writeWebData(result.rows);
  console.log(
    JSON.stringify(
      {
        book: BOOK_TITLE,
        round: ROUND,
        input_rows: result.inputCount,
        output_rows: result.rows.length,
        merged_rows: result.merges.length,
        retitled_rows: result.retitles.length,
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
