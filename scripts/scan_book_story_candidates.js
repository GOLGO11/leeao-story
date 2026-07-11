const fs = require("fs");
const path = require("path");

const sourceRoot = path.resolve(process.cwd(), process.argv[2] || "");
const outputPath = process.argv[3] ? path.resolve(process.cwd(), process.argv[3]) : "";
const decoder = new TextDecoder("gb18030");

const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖导航站",
  "油管/抖音",
];

const storyPatterns = [
  /有一次/g,
  /有一天/g,
  /一天/g,
  /那天/g,
  /忽然/g,
  /突然/g,
  /不料/g,
  /结果/g,
  /最后/g,
  /我记得/g,
  /我看到/g,
  /我收到/g,
  /我问/g,
  /他说/g,
  /她说/g,
  /故事/g,
  /笑话/g,
  /大笑/g,
  /被捕/g,
  /入狱/g,
  /坐牢/g,
  /逃难/g,
  /来信/g,
  /回信/g,
  /见到/g,
  /撞/g,
  /打/g,
  /哭/g,
];

function readSource(filePath) {
  return decoder.decode(fs.readFileSync(filePath)).replace(/\r\n/g, "\n");
}

function stripFooter(text) {
  const lines = text.split("\n");
  const footerIndex = lines.findIndex((line) =>
    footerPatterns.some((pattern) => line.includes(pattern))
  );
  const kept = footerIndex >= 0 ? lines.slice(0, footerIndex) : lines;
  return kept.join("\n").trim();
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
        startLine,
        endLine: index,
        text: current.join("\n").trim(),
      });
      current = [];
    }
  }
  if (current.length) {
    blocks.push({
      startLine,
      endLine: lines.length,
      text: current.join("\n").trim(),
    });
  }
  return blocks;
}

function score(text) {
  let value = 0;
  for (const pattern of storyPatterns) {
    const matches = text.match(pattern);
    if (matches) value += matches.length;
  }
  if (/[“”"]/.test(text)) value += 1;
  if (/：/.test(text)) value += 1;
  if (text.length >= 80 && text.length <= 1400) value += 1;
  if (/^[一二三四五六七八九十]+[、.．]/.test(text.trim())) value -= 1;
  return value;
}

function cleanSnippet(text) {
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > 180 ? `${compact.slice(0, 180)}...` : compact;
}

function main() {
  if (!sourceRoot || !fs.existsSync(sourceRoot)) {
    throw new Error(`Source root not found: ${sourceRoot}`);
  }

  const rows = [
    [
      "file",
      "paragraph",
      "line_start",
      "line_end",
      "char_count",
      "score",
      "snippet",
    ].join("\t"),
  ];

  const files = fs
    .readdirSync(sourceRoot)
    .filter((fileName) => /^\d{3}(?:\.|(?=\D)).*\.txt$/u.test(fileName))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

  for (const fileName of files) {
    const paragraphs = splitParagraphs(stripFooter(readSource(path.join(sourceRoot, fileName))));
    paragraphs.forEach((paragraph, index) => {
      const text = paragraph.text;
      const value = score(text);
      if (value < 3) return;
      rows.push(
        [
          fileName,
          index + 1,
          paragraph.startLine,
          paragraph.endLine,
          Array.from(text).length,
          value,
          cleanSnippet(text),
        ].join("\t")
      );
    });
  }

  const output = `${rows.join("\n")}\n`;
  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, output, "utf8");
  } else {
    process.stdout.write(output);
  }
}

main();
