const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖风流自传";
const SLUG = "li_ao_fengliu_zizhuan";
const ROUND = "story_round1";
const ID_PREFIX = "LAFZ";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "001.自传回忆类",
  "007.李敖风流自传"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const BOOK_ORDER = [
  "li_ao_zizhuan_yu_huiyi",
  "li_ao_zizhuan_yu_huiyi_xuji",
  "wo_zui_nanwang_de_shi_he_ren",
  "li_ao_huiyilu",
  "li_ao_kuaiyi_enchoulu",
  "li_ao_yitan_aisi_lu",
  "li_ao_fengliu_zizhuan"
];

const selections = [
  {
    file: "017.愿——我愿我是驯兽师.txt",
    title: "驯兽师儿子找爸爸",
    paragraphs: [2],
    start: "一个笑话说",
    end: "他说我在找我爸爸。"
  },
  {
    file: "019.狮妈妈外出时.txt",
    title: "狮妈妈外出时",
    paragraphs: [2]
  },
  {
    file: "020.斗鱼.txt",
    title: "斗鱼斗死自己",
    paragraphs: [4],
    start: "本来是照鱼贩嘱咐",
    end: "它把大号的自己累死了。"
  },
  {
    file: "040.蔡校长.txt",
    title: "蔡元培处理阅报纠纷",
    paragraphs: [2],
    start: "一天，在北大图书馆里"
  },
  {
    file: "064.心在胳肢窝里.txt",
    title: "老太太心在胳肢窝里",
    paragraphs: [2],
    start: "收音机中说相声的挖苦老太太",
    end: "其心之偏也可想。"
  },
  {
    file: "178.重温旧梦就是破坏旧梦.txt",
    title: "陆啸钊重逢旧情人",
    paragraphs: [2],
    start: "陆啸钊在一别半世纪后",
    end: "切忌白头重逢啊。”"
  },
  {
    file: "181.姚从吾.txt",
    title: "姚从吾逃难慢走",
    paragraphs: [3]
  },
  {
    file: "183.考入研究所.txt",
    title: "奥本海默反问主考",
    paragraphs: [2],
    start: "奥本海默在哈佛读书"
  },
  {
    file: "184.研究生与助教.txt",
    title: "范仲淹助孙秀才安于为学",
    paragraphs: [2],
    start: "范冲淹奇怪那个孙秀才",
    end: "犹将汨没而不见也！”"
  },
  {
    file: "207.打破了别人的梦.txt",
    title: "胡适说打破别人的梦",
    paragraphs: [2]
  },
  {
    file: "240.逃难学.txt",
    title: "全部财产一背一提",
    paragraphs: [2],
    end: "我比你的习惯还要好！”"
  },
  {
    file: "349.笑成一团，方足言骂.txt",
    title: "熊十力团报纸骂蒋",
    paragraphs: [3],
    start: "他曾告诉我",
    end: "以化怒气。"
  },
  {
    file: "350.书呆子趣闻.txt",
    title: "殷文丽喷湿亚里士多德",
    paragraphs: [2],
    start: "有一次他看一本Aristotle",
    end: "多好笑呀！"
  },
  {
    file: "350.书呆子趣闻.txt",
    title: "殷海光打电话满头大汗",
    paragraphs: [2],
    start: "还有，此公一辈子只打过四次电话",
    end: "好一阵子才恢复正常。"
  },
  {
    file: "350.书呆子趣闻.txt",
    title: "殷海光夏道平困电梯",
    paragraphs: [2],
    start: "有一天，他和政大的另一书呆夏道平教授",
    end: "原来还在一楼！"
  },
  {
    file: "614.四分之一世纪后.txt",
    title: "杨西崑替王世杰翻译",
    paragraphs: [4],
    start: "有一次王世杰在美国",
    end: "因为他也听不懂。"
  },
  {
    file: "642.我最向往的一种死法.txt",
    title: "阿提拉式甜蜜死",
    paragraphs: [2],
    start: "阿提拉是五世纪时的匈奴王",
    end: "即指此也。"
  }
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
    if (!fs.existsSync(fullPath)) throw new Error(`Source file not found: ${fileName}`);
    cache.set(
      fileName,
      new Map(splitParagraphs(readGb18030(fullPath)).map((paragraph) => [paragraph.index, paragraph]))
    );
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
      if (!paragraph) throw new Error(`${selection.file} has no paragraph ${paragraphIndex}`);
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
      source_lines: `${Math.min(...parts.map((part) => part.lineStart))}-${Math.max(
        ...parts.map((part) => part.lineEnd)
      )}`,
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
  fs.writeFileSync(path.join(ROOT, "web", "stories.js"), `window.STORY_DATA = ${JSON.stringify(webPayload, null, 2)};\n`, "utf8");

  return {
    rows,
    books,
    duplicateTextIds: duplicateTextPairs(rows)
  };
}

function validate(rows) {
  const duplicateTextIds = duplicateTextPairs(rows);
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

function writeMetadata(rows, validation) {
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
          "首轮经校对后，只收李敖文中讲出来且可独立成篇的寓言、笑话、掌故、第三方轶事和少量寓言化动物故事；删去李敖自己的履历事件、恋爱/婚姻/官司/入狱/问政经历、人物评语、政治论证材料、事实案例、随笔观察和前书已收重复故事；正文保留原文。"
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(ROOT, "notes", "li_ao_fengliu_zizhuan_story_round1.md"),
    [
      "# 李敖风流自传 story_round1",
      "",
      `- 输出条目：${rows.length}`,
      `- 总字数：${validation.totalChars}`,
      `- 最短/最长：${validation.minChars}/${validation.maxChars}`,
      "- 口径：按故事集从严处理，只收文中可独立成篇的小故事、笑话、寓言、掌故和少量寓言化动物故事；正文用原文。",
      "- 从严剔除：李敖自己的恋爱婚姻、入狱办刊、官司、问政、演讲、出版、交游事件，以及人物素描、政治论证、资料考证、事实案例和随笔观察。",
      "- 重复处理：曹梓华请瞄高一点、陈又亮假借卵子、王建人批公文、劳思光打电玩、罗永黎神仙老虎狗、卡车司机有刹车、乔家才拒绝换出狱等前书已收故事，本书不再重复。",
      "- 校对说明：本轮已删去偏事实案例、偏童年记忆、过薄比喻和随笔观察的条目，并裁去若干故事前后的说明性尾巴。"
    ].join("\n") + "\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(ROOT, "notes", "li_ao_fengliu_zizhuan_proofread_round1.md"),
    [
      "# 李敖风流自传 proofread_round1",
      "",
      "- 校对日期：2026-06-30",
      "- 输入条目：21",
      `- 输出条目：${rows.length}`,
      `- 总字数：${validation.totalChars}`,
      "- 口径：继续压成故事集，只留有具体人物、动作、转折或笑话收束的故事；删去事实案例、过薄比喻、随笔观察和李敖自己的记忆片段。",
      "- 同步输出：本书 story_round1.csv/txt、七本 all_stories.csv/txt、web/stories.js。",
      "",
      "## 本轮删去",
      "",
      "- 杜重远《闲话皇帝》获罪：偏历史事实案例和政治论证，不是独立故事。",
      "- 挑水伕求童子尿：偏李敖童年记忆片段，缺少用来说明道理的完整故事结构。",
      "- 青蛙咬绳：只有一句比喻，情节太薄。",
      "- 小公猴与小母狗：偏随笔观察和自我联想，故事收束不够明确。",
      "",
      "## 本轮调整",
      "",
      "- 范仲淹助孙秀才安于为学：删去“我想起”的引子，从范冲淹奇怪孙秀才处进入。",
      "- 全部财产一背一提：删去后半段概括和爱德华·李耳比较，保留施珂、陶泓对话主体。",
      "- 殷海光夏道平困电梯：删去“再谈他的鲜事”的引子。",
      "- 阿提拉式甜蜜死：删去后面教皇、法国总统的并列例子，只保留阿提拉故事主体。"
    ].join("\n") + "\n",
    "utf8"
  );
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(ROOT, "notes"), { recursive: true });

  const rows = buildRows();
  writeCsv(path.join(OUT_DIR, "story_round1.csv"), rows);
  writeTxt(path.join(OUT_DIR, "story_round1.txt"), rows);

  const validation = validate(rows);
  writeMetadata(rows, validation);
  const aggregate = writeAggregate();

  console.log(
    JSON.stringify(
      {
        book: BOOK,
        rows: rows.length,
        validationOk: validation.ok,
        aggregateRows: aggregate.rows.length,
        aggregateDuplicateTexts: aggregate.duplicateTextIds,
        aggregateBooks: aggregate.books
      },
      null,
      2
    )
  );
}

main();
