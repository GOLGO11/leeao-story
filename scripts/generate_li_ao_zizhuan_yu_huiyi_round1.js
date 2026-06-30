const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const BOOK_TITLE = "\u674e\u6556\u81ea\u4f20\u4e0e\u56de\u5fc6";
const BOOK_SLUG = "li_ao_zizhuan_yu_huiyi";
const ID_PREFIX = "LZZYHY";
const ROUND = "extract_round1";
const STATUS = "needs_proofread";

const SOURCE_ROOT = path.join(
  process.cwd(),
  "\u300a\u5927\u674e\u6556\u5168\u96c66.0\u300b\u5206\u7ae0\u8282",
  "001.\u81ea\u4f20\u56de\u5fc6\u7c7b",
  "001.\u674e\u6556\u81ea\u4f20\u4e0e\u56de\u5fc6"
);

const BOOK_OUTPUT_DIR = path.join(process.cwd(), "data", "books", BOOK_SLUG);
const ALL_OUTPUT_DIR = path.join(process.cwd(), "data");
const NOTES_DIR = path.join(process.cwd(), "notes");

const decoder = new TextDecoder("gb18030");

const footerPatterns = [
  "\u674e\u6556\u5f71\u97f3E\u4e66",
  "\u674e\u6556\u6570\u5b57\u535a\u7269\u9986",
  "\u674e\u6556\u8d44\u6e90\u4e0b\u8f7d\u7ad9",
  "\u674e\u6556\u5bfc\u822a\u7ad9",
  "\u6cb9\u7ba1/\u6296\u97f3",
];

const skipExactTitles = new Set([
  "\u674e\u6556\u81ea\u4f20",
  "\u8c28\u795d",
  "\u795d",
  "\u4f60\u597d",
  "\u8fd1\u597d",
  "\u6625\u7ee5",
  "\u8fdb\u6b65",
  "\u597d",
  "\u4e07\u4e8b\u5982\u610f",
  "\u5f84\u542f\u8005\uff1a",
  "\u6bd5\u4e1a\u8bc1\u4e66",
  "\u5434\u7115\u7ae0",
  "\u6211\u7b49\u4e4b",
  "\u6211\u7b49\u4e3a\u5f92\u8005\u5b89\u6562\u4e0d\u53cd\u7701\uff0c\u5bf9",
  "\u4f9b\u8bcd\u524d\u540e\u77db\u76fe\u3002\u5982",
  "\u6216\u662f",
]);

const skipContains = [
  "\u674e\u6556\u5148\u751f\uff1a",
  "\u674e\u6556\u540c\u5b66\uff1a",
  "\u5b66\u826f\u5148\u751f\uff1a",
  "\u9002\u4e4b\u5148\u751f\uff1a",
  "\u4ece\u543e\u8001\u5e08\uff1a",
  "\u8001\u5e08\uff1a",
  "\u542f\u5e86\u5144\uff1a",
  "\u6556\u4e4b\uff1a",
  "\u6556\u4e4b\u5144\uff1a",
  "\u6556\u4e4b\u5f1f\uff1a",
  "\u6556\u4e4b\u540c\u5b66\uff1a",
  "\u4f4f\u5740\uff1a",
  "\u8eab\u4efd\u8bc1\u5b57\u53f7\uff1a",
  "\u89c1\u8bc1\u4eba\uff1a",
  "\u7acb\u548c\u89e3\u4e66\u4eba\uff1a",
  "\u5434\u4e3b\u5e2d\u7115\u7ae0\u81f4",
  "\u73b0\u4efb\u5174\u5b89\u7701\u653f\u5e9c\u4e3b\u5e2d",
  "\u4e27\u5c45\uff1a",
  "\u672a\u4ea1\u4eba\uff1a",
  "\u7956\u6148\u4f8d\u4e0b\uff1a",
  "\u5b64\u5b50\uff1a",
  "\u5b64\u5973\uff1a",
  "\u5973\u5a7f\uff1a",
  "\u4e2d\u534e\u6c11\u56fd",
  "\u674e\u6556\u5f71\u97f3",
  "\u674e\u6556\u6570\u5b57",
  "\u674e\u6556\u8d44\u6e90",
  "\u674e\u6556\u5bfc\u822a",
  "\u6cb9\u7ba1/",
];

function ensureDirs() {
  for (const dir of [BOOK_OUTPUT_DIR, ALL_OUTPUT_DIR, NOTES_DIR]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readSource(filePath) {
  return decoder.decode(fs.readFileSync(filePath)).replace(/\r\n/g, "\n");
}

function stripFooterAndSupplements(lines) {
  let end = lines.length;
  const footerIndex = lines.findIndex((line) =>
    footerPatterns.some((pattern) => line.includes(pattern))
  );
  if (footerIndex >= 0) end = Math.min(end, footerIndex);

  const supplementIndex = lines.findIndex((line, index) => {
    if (index < 2) return false;
    const text = cleanTitle(line);
    return /^(\(|\uff08)?\u9644\u5f55/.test(text);
  });
  if (supplementIndex >= 0) end = Math.min(end, supplementIndex);

  while (end > 0 && !lines[end - 1].trim()) end -= 1;
  return lines.slice(0, end);
}

function cleanTitle(line) {
  return line.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
}

function isDateOrSignature(text) {
  if (/^(19|20)\d{2}\u5e74/.test(text) && text.length <= 24) return true;
  if (/^\u4e00\u4e5d[\u4e00-\u9fff\u3007]+\u5e74/.test(text) && text.length <= 24) return true;
  if (/^[\u4e00-\u9fff\u3007]{2,8}\u5e74[\u3001,，]?\d{1,2}\u6708/.test(text) && text.length <= 28) return true;
  if (/^\d{1,2}\u6708\d{1,2}\u65e5/.test(text) && text.length <= 24) return true;
  if (/^\d{4}\u5e74?\d*\u6708?/.test(text) && text.length <= 24) return true;
  if (/^[\u4e00-\u9fff]{1,4}\s+\d/.test(text)) return true;
  if (/^\u674e\s*\u6556/.test(text)) return true;
  if (/^\u80e1\u9002\s/.test(text)) return true;
  if (/^\u59da\u4ece\u543e\s/.test(text)) return true;
  if (/^\u5434\u76f8\u6e58\s/.test(text)) return true;
  if (/^\u542f\u5e86\s/.test(text)) return true;
  if (/^\u5c0f\u5144/.test(text)) return true;
  if (/^\u5f1f[\u4e00-\u9fff\s]*\u542f/.test(text)) return true;
  if (/^\u5b66\u751f\s+\u674e/.test(text)) return true;
  if (/^\u611a[\u4e00-\u9fff]+\s/.test(text)) return true;
  if (/\u656c\u4e0a|\u624b\u542f|\u8c28\u542f|\u7559$/.test(text) && text.length <= 34) return true;
  if (/^(\u5f1f|\u59b9|\u4f84|\u4f84\u5973|\u7525|\u7525\u5973)[\uff1a:]/.test(text)) return true;
  return false;
}

function isLikelyHeading(lines, index, fileName) {
  const raw = lines[index];
  const text = cleanTitle(raw);
  if (!text) return false;
  if (skipExactTitles.has(text)) return false;
  if (skipContains.some((part) => text.includes(part))) return false;
  if (text.startsWith("\u2014\u2014")) return false;
  if (/^(\(|\uff08)?\u9644\u5f55/.test(text)) return false;
  if (isDateOrSignature(text)) return false;
  if (text.length > 34) return false;
  if (/[。？！；，,.!?]$/.test(text)) return false;
  if (/[：:]$/.test(text)) return false;
  if (text.includes("\u3002")) return false;
  if (/[\uff0c,][\u201d"]?$/.test(text)) return false;
  if (text.includes("\uff01") && /[\u201d"]?$/.test(text)) return false;
  if (text.includes("www.") || text.includes("http")) return false;
  if (/^[\u4e00-\u9fff]+[\u3001,]\u672c\u6848/.test(text)) return false;
  if (/^\uff08[\u4e00\u4e8c]\uff09/.test(text)) return false;
  if (/\u2014\u2014.*\u5173\u7cfb$/.test(text)) return false;
  if (/^\u5927\u624b\u5370\u5f92\u5f1f/.test(text)) return false;
  if (/^\u5e08\u5c0a/.test(text)) return false;
  if (/^\u8bfa\u90a3/.test(text)) return false;

  const prevBlank = index === 0 || lines[index - 1].trim() === "";
  const nextBlank = index + 1 >= lines.length || lines[index + 1].trim() === "";
  if (!prevBlank || !nextBlank) return false;

  if (index === 0) return true;

  const isFirstAutobiographyFile = fileName.startsWith("001.");
  if (isFirstAutobiographyFile && text === "\u674e\u6556\u81ea\u4f20") {
    return false;
  }

  return true;
}

function trimStoryText(lines) {
  let start = 0;
  let end = lines.length;
  while (start < end && !lines[start].trim()) start += 1;
  while (end > start && !lines[end - 1].trim()) end -= 1;
  while (end > start && isDateOrSignature(cleanTitle(lines[end - 1]))) end -= 1;
  while (end > start && !lines[end - 1].trim()) end -= 1;
  return {
    lines: lines.slice(start, end),
    offsetStart: start,
    offsetEnd: end,
  };
}

function splitFile(fileName, filePath) {
  const originalLines = readSource(filePath).split("\n");
  const lines = stripFooterAndSupplements(originalLines);
  const headingIndexes = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (isLikelyHeading(lines, i, fileName)) headingIndexes.push(i);
  }

  if (fileName.startsWith("001.")) {
    const rootIndex = headingIndexes.findIndex(
      (i) => cleanTitle(lines[i]) === "\u674e\u6556\u81ea\u4f20"
    );
    if (rootIndex >= 0) headingIndexes.splice(rootIndex, 1);
  }

  if (headingIndexes.length === 0) {
    headingIndexes.push(0);
  }

  const sections = [];
  for (let h = 0; h < headingIndexes.length; h += 1) {
    const headingIndex = headingIndexes[h];
    const nextHeadingIndex =
      h + 1 < headingIndexes.length ? headingIndexes[h + 1] : lines.length;
    const title = cleanTitle(lines[headingIndex]);
    const storyBlock = trimStoryText(lines.slice(headingIndex + 1, nextHeadingIndex));
    const storyText = storyBlock.lines.join("\n");
    if (storyText.replace(/\s/g, "").length < 20) continue;
    sections.push({
      title,
      sourceFile: fileName,
      sourceHeading: title,
      headingLine: headingIndex + 1,
      sourceLineStart: headingIndex + 1 + storyBlock.offsetStart + 1,
      sourceLineEnd: headingIndex + 1 + storyBlock.offsetEnd,
      storyText,
    });
  }
  return sections;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function sha1(text) {
  return crypto.createHash("sha1").update(text, "utf8").digest("hex");
}

function buildRows() {
  if (!fs.existsSync(SOURCE_ROOT)) {
    throw new Error(`Source root not found: ${SOURCE_ROOT}`);
  }

  const files = fs
    .readdirSync(SOURCE_ROOT)
    .filter((fileName) => /^\d{3}\..*\.txt$/.test(fileName))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

  const rows = [];
  for (const fileName of files) {
    const filePath = path.join(SOURCE_ROOT, fileName);
    const sections = splitFile(fileName, filePath);
    for (const section of sections) {
      const id = `${ID_PREFIX}${String(rows.length + 1).padStart(3, "0")}`;
      rows.push({
        id,
        book: BOOK_TITLE,
        round: ROUND,
        status: STATUS,
        title: section.title,
        source_file: section.sourceFile,
        source_heading: section.sourceHeading,
        source_heading_line: section.headingLine,
        source_line_start: section.sourceLineStart,
        source_line_end: section.sourceLineEnd,
        char_count: Array.from(section.storyText).length,
        text_sha1: sha1(section.storyText),
        story_text: section.storyText,
      });
    }
  }
  return rows;
}

function writeCsv(filePath, rows) {
  const headers = [
    "id",
    "book",
    "round",
    "status",
    "title",
    "source_file",
    "source_heading",
    "source_heading_line",
    "source_line_start",
    "source_line_end",
    "char_count",
    "text_sha1",
    "story_text",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
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

function writeManifest(rows) {
  const byFile = {};
  for (const row of rows) {
    byFile[row.source_file] = (byFile[row.source_file] || 0) + 1;
  }
  const duplicateIds = rows.length - new Set(rows.map((row) => row.id)).size;
  const duplicateHashes = rows.length - new Set(rows.map((row) => row.text_sha1)).size;
  const manifest = {
    book: BOOK_TITLE,
    slug: BOOK_SLUG,
    round: ROUND,
    status: STATUS,
    generated_on: "2026-06-30",
    source_encoding: "gb18030",
    source_root: path.relative(process.cwd(), SOURCE_ROOT),
    output_count: rows.length,
    by_source_file: byFile,
    duplicate_ids: duplicateIds,
    duplicate_text_hashes: duplicateHashes,
    note:
      "First-pass broad extraction. Story text is copied from the source blocks; all rows are marked needs_proofread for the next round.",
  };
  fs.writeFileSync(
    path.join(BOOK_OUTPUT_DIR, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  const validation = {
    ok: duplicateIds === 0 && rows.length > 0,
    row_count: rows.length,
    duplicate_ids: duplicateIds,
    duplicate_text_hashes: duplicateHashes,
    empty_story_text_rows: rows.filter((row) => !row.story_text.trim()).map((row) => row.id),
    min_char_count: rows.length ? Math.min(...rows.map((row) => row.char_count)) : 0,
    max_char_count: rows.length ? Math.max(...rows.map((row) => row.char_count)) : 0,
  };
  fs.writeFileSync(
    path.join(BOOK_OUTPUT_DIR, "validation.json"),
    `${JSON.stringify(validation, null, 2)}\n`,
    "utf8"
  );
}

function writeRoundNote(rows) {
  const byFile = {};
  for (const row of rows) {
    byFile[row.source_file] = (byFile[row.source_file] || 0) + 1;
  }
  const fileLines = Object.entries(byFile)
    .map(([file, count]) => `- ${file}: ${count}`)
    .join("\n");
  const note = [
    `# ${BOOK_TITLE} ${ROUND}`,
    "",
    `- date: 2026-06-30`,
    `- source_encoding: GB18030`,
    `- rows: ${rows.length}`,
    `- status: all rows are ${STATUS}`,
    "- scope: Li Ao-authored numbered source files only; table of contents, preface, e-book footer, and obvious supplements are excluded from this first pass.",
    "- method: split self-contained autobiography sections by source headings; preserve original story text as the description field; leave broad cuts for proofreading.",
    "",
    "## By Source File",
    "",
    fileLines,
    "",
    "## Next Proofread Round",
    "",
    "- remove non-story argument-only blocks if they do not carry narrative value.",
    "- merge headings that are only document labels or letter labels.",
    "- split long chapter-level stories where a clear embedded anecdote should stand alone.",
    "- confirm every kept row still has source-faithful story_text and stable source line references.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(NOTES_DIR, `${BOOK_SLUG}_${ROUND}.md`), note, "utf8");
}

function main() {
  ensureDirs();
  const rows = buildRows();
  const bookCsv = path.join(BOOK_OUTPUT_DIR, `${ROUND}.csv`);
  const bookTxt = path.join(BOOK_OUTPUT_DIR, `${ROUND}.txt`);
  writeCsv(bookCsv, rows);
  writeTxt(bookTxt, rows);
  writeCsv(path.join(ALL_OUTPUT_DIR, "all_stories.csv"), rows);
  writeTxt(path.join(ALL_OUTPUT_DIR, "all_stories.txt"), rows);
  writeManifest(rows);
  writeRoundNote(rows);
  console.log(
    JSON.stringify(
      {
        book: BOOK_TITLE,
        round: ROUND,
        rows: rows.length,
        book_csv: path.relative(process.cwd(), bookCsv),
        book_txt: path.relative(process.cwd(), bookTxt),
      },
      null,
      2
    )
  );
}

main();
