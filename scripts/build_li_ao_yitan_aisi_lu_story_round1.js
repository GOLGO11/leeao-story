const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖议坛哀思录";
const SLUG = "li_ao_yitan_aisi_lu";
const ROUND = "story_round1";
const ID_PREFIX = "LAYT";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "001.自传回忆类",
  "006.李敖议坛哀思录"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const BOOK_ORDER = [
  "li_ao_zizhuan_yu_huiyi",
  "li_ao_zizhuan_yu_huiyi_xuji",
  "wo_zui_nanwang_de_shi_he_ren",
  "li_ao_huiyilu",
  "li_ao_kuaiyi_enchoulu",
  "li_ao_yitan_aisi_lu"
];

const selections = [
  {
    file: "004.以玩笑出之.txt",
    title: "参议员睡醒先反对",
    paragraphs: [2],
    start: "美国参议院有个笑话",
    end: "其实这正是正义议员该有的基本态度。"
  },
  {
    file: "016.挡军购，宋楚瑜有前功.txt",
    title: "刘秀赞吴汉差强人意",
    paragraphs: [28]
  },
  {
    file: "018.我告诉你，就是狗.txt",
    title: "何应钦听投降计划",
    paragraphs: [17],
    start: "过去我也见过一位四星将军",
    end: "为我们的文化保留命脉。"
  },
  {
    file: "018.我告诉你，就是狗.txt",
    title: "鲁宾斯坦证明没前途",
    paragraphs: [20],
    start: "有一天，钢琴家鲁宾斯坦",
    end: "不要再学琴了。"
  },
  {
    file: "019.我闻过他们的臭脚.txt",
    title: "老兵遗嘱送袜子",
    paragraphs: [8],
    start: "过去我在当排长的时候",
    end: "这样有什么不对？"
  },
  {
    file: "019.我闻过他们的臭脚.txt",
    title: "老兵不愿穿袜洗脚",
    paragraphs: [8],
    start: "此外，当时蒋经国是总政战部主任",
    end: "所以我不要戴套子。"
  },
  {
    file: "019.我闻过他们的臭脚.txt",
    title: "士官长回乡分钱",
    paragraphs: [9],
    start: "我再讲最后一个故事给你听",
    end: "最后这笔钱到哪里去了？"
  },
  {
    file: "022.我高潮，你刹车.txt",
    title: "卡车司机有刹车",
    paragraphs: [6],
    start: "一个人开卡车从山上下来",
    end: "但只有司机有刹车。"
  },
  {
    file: "027.历史会证明我们同归于尽.txt",
    title: "德国军人分四类",
    paragraphs: [7],
    start: "德国参谋本部说了一个笑话",
    end: "这种人最恐怖。"
  },
  {
    file: "027.历史会证明我们同归于尽.txt",
    title: "教皇的军队在天上",
    paragraphs: [9],
    start: "霍普金斯去谈判时发生了一则笑话",
    end: "他可以看到我的军队在天上。”"
  },
  {
    file: "030.民进党中有我“卧底”的.txt",
    title: "爱因斯坦太太懂爱因斯坦",
    paragraphs: [11],
    start: "当年爱因斯坦推出相对论",
    end: "可是她懂爱因斯坦。"
  },
  {
    file: "035.钢笔事件.txt",
    title: "汉弗莱喝一瓶啤酒",
    paragraphs: [15],
    start: "以前的美国副总统汉弗莱",
    end: "一瓶啤酒就能收买我汉弗莱吗？"
  },
  {
    file: "045.香蕉好吃吗？.txt",
    title: "林肯消灭敌人",
    paragraphs: [9],
    start: "林肯总统曾说过某人是政敌",
    end: "他是我的朋友。"
  },
  {
    file: "052.请你闭嘴！.txt",
    title: "潜艇找不到下水理由",
    paragraphs: [55],
    start: "李海东去视察",
    end: "可以找出100个下水之后浮不起来的理由。"
  },
  {
    file: "057.李敖就军购案说帖.txt",
    title: "国税局问死者死期",
    paragraphs: [49, 50, 51],
    start: "附告笑话",
    end: "是由亡者供应（provide）死讯也。"
  },
  {
    file: "077.不要像李远哲这样子迷失.txt",
    title: "蓝色毛毯归还逃兵",
    paragraphs: [7],
    start: "俄国农奴被地主恶霸抢走",
    end: "可是打倒地主恶霸的过程中，我是一名逃兵。"
  },
  {
    file: "103.游锡堃的爸爸是外省士官.txt",
    title: "老陈无家可归",
    paragraphs: [10],
    start: "谁是老陈？",
    end: "直到死在郝家。"
  },
  {
    file: "104.我是反对你出任的.txt",
    title: "张纲埋轮问豺狼",
    paragraphs: [15],
    start: "这是汉朝的一个故事",
    end: "豺狼当道，安问狐狸？"
  },
  {
    file: "127.“中国智慧党”智慧测量表.txt",
    title: "徐甲离老子成枯骨",
    paragraphs: [90],
    start: "晋朝《神仙传》里记老子的追随者徐甲"
  },
  {
    file: "130.蒋介石阴魂不散.txt",
    title: "小狮子登记成猴子",
    paragraphs: [2],
    start: "上帝开了一家UN动物园"
  },
  {
    file: "130.蒋介石阴魂不散.txt",
    title: "农耕队办公室在田里",
    paragraphs: [10],
    start: "蒋介石当年靠非洲",
    end: "就在田里。”"
  },
  {
    file: "139.立法院公报第96卷第27期院会纪录.txt",
    title: "梁肃戎回打耳光",
    paragraphs: [67],
    start: "当年你们的前行政院院长",
    end: "管什么国会形象。"
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
          "本书以议坛发言和问政材料为主，只收李敖在论证中讲出来的小故事、笑话、寓言、历史轶事；删去李敖自己的参选问政事件、政治主张、质询攻防、人物评语、档案材料和重复讲法；正文保留原文。"
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(ROOT, "notes", "li_ao_yitan_aisi_lu_story_round1.md"),
    [
      "# 李敖议坛哀思录 story_round1",
      "",
      `- 输出条目：${rows.length}`,
      `- 总字数：${validation.totalChars}`,
      `- 最短/最长：${validation.minChars}/${validation.maxChars}`,
      "- 口径：只收李敖在议坛论证中讲出来的小故事、笑话、寓言和历史轶事；正文用原文。",
      "- 从严剔除：李敖自己的参选、问政、质询攻防、政治主张、人物评语、文件说明、附录状子、重复讲法。",
      "- 重复处理：鲁宾斯坦、蓝色毛毯、何应钦投降计划等多处重述的故事，只保留较早或较完整的一处。",
      "- 说明：本书议论密度高，第一轮宁可少收；校对轮可继续删去偏笑话或偏政治材料的条目。"
    ].join("\n") + "\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(ROOT, "notes", "li_ao_yitan_aisi_lu_proofread_round1.md"),
    [
      "# 李敖议坛哀思录 proofread_round1",
      "",
      "- 校对日期：2026-06-30",
      "- 输入条目：25",
      `- 输出条目：${rows.length}`,
      `- 总字数：${validation.totalChars}`,
      "- 口径：继续按故事集处理，只留有具体人物、动作、转折或笑话收束的故事；删去只是词义考释、典故说明、事实案例或政治论证材料的条目。",
      "- 同步输出：本书 story_round1.csv/txt、六本 all_stories.csv/txt、web/stories.js。",
      "",
      "## 本轮删去",
      "",
      "- 莫须有是等着瞧：偏词义考释和典故解释，不是完整故事。",
      "- 覆巢之下安有完卵：只有典故来源说明，情节太薄。",
      "- 台湾赤蛙错认三十五年：偏科学事实案例和本土论证，不是人物故事。",
      "",
      "## 本轮调整",
      "",
      "- 鲁宾斯坦证明没前途：删去“本席告诉大家一个小故事”的议坛引子，从鲁宾斯坦听琴处进入。",
      "- 卡车司机有刹车：删去“不太文雅的笑话”的引子，从卡车下山处进入。",
      "- 汉弗莱喝一瓶啤酒：删去“我要讲个故事给你听”的引子。",
      "- 潜艇找不到下水理由：删去“以下是我编的故事”的引子。",
      "- 蓝色毛毯归还逃兵：删去“这篇文章写的是”的说明口气，从俄国农奴被抢毛毯进入。",
      "- 小狮子登记成猴子：删去“一个笑话正足以描写”的论证引子。"
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
