const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖回忆录";
const SLUG = "li_ao_huiyilu";
const ROUND = "story_round1";
const ID_PREFIX = "LAHYL";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "001.自传回忆类",
  "004.李敖回忆录"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const BOOK_ORDER = [
  "li_ao_zizhuan_yu_huiyi",
  "li_ao_zizhuan_yu_huiyi_xuji",
  "wo_zui_nanwang_de_shi_he_ren",
  "li_ao_huiyilu"
];

const selections = [
  {
    file: "005.上海（1948-1949·13到14岁）.txt",
    title: "张乐平为冻死难童画三毛",
    paragraphs: [18],
    start: "张乐平在1947年年初",
    end: "向不合理的社会制度提出严厉的控诉。”"
  },
  {
    file: "008.军队（1959-1961·24到26岁）.txt",
    title: "曹梓华转述请瞄高一点",
    paragraphs: [17],
    start: "有个老兵叫曹梓华"
  },
  { file: "008.军队（1959-1961·24到26岁）.txt", title: "妓女抓走连长帽子", paragraphs: [22] },
  { file: "008.军队（1959-1961·24到26岁）.txt", title: "尹俊嘉奖哨兵", paragraphs: [23] },
  { file: "008.军队（1959-1961·24到26岁）.txt", title: "老兵问蒋经国穿袜洗脚吗", paragraphs: [24] },
  {
    file: "008.军队（1959-1961·24到26岁）.txt",
    title: "潘毓刚炮火外训话",
    paragraphs: [32],
    start: "潘毓刚非国民党",
    end: "此后人人说我们排长真勇敢，人人都服了。"
  },
  {
    file: "010.文献会（1962-1963·27到28岁）.txt",
    title: "于右任找不到自己的签名",
    paragraphs: [45],
    start: "有一次，文献会重金买到"
  },
  {
    file: "010.文献会（1962-1963·27到28岁）.txt",
    title: "胡秋原叫成李匪帮",
    paragraphs: [66],
    start: "胡秋原有一次",
    end: "所以吓人倒怪。"
  },
  {
    file: "010.文献会（1962-1963·27到28岁）.txt",
    title: "陈顾远法庭上帮倒忙",
    paragraphs: [66],
    start: "还有一次胡秋原加请法学家陈顾远",
    end: "气得胡秋原再也不请他了。"
  },
  {
    file: "011.《文星》（1962-1966·27到31岁）.txt",
    title: "老彭不肯打主人小报告",
    paragraphs: [108],
    start: "当天下午5点"
  },
  {
    file: "012.星沉（1966-1970·31到35岁）.txt",
    title: "刘家昌原来是凯子",
    paragraphs: [48],
    start: "有一天有次牌局",
    end: "不知原来亡者乃自己之国也。"
  },
  {
    file: "012.星沉（1966-1970·31到35岁）.txt",
    title: "刘家昌叫把拔借赌本",
    paragraphs: [48],
    start: "又有一次刘家昌全部输光",
    end: "可是赌本却借到了。”"
  },
  {
    file: "012.星沉（1966-1970·31到35岁）.txt",
    title: "刘家昌非做王八不可",
    paragraphs: [48],
    start: "后来，刘家昌怀疑李翰祥",
    end: "何必自寻烦恼啊！”"
  },
  {
    file: "012.星沉（1966-1970·31到35岁）.txt",
    title: "刘维斌装睡骗查勤",
    paragraphs: [48],
    start: "有一次大家在刘维斌家赌钱",
    end: "深叹刘维斌演技精绝。"
  },
  {
    file: "012.星沉（1966-1970·31到35岁）.txt",
    title: "居浩然风月场姓张",
    paragraphs: [49],
    start: "有一次与居浩然上舞厅",
    end: "永远找不到我们的居校长！"
  },
  { file: "014.监狱（1971-1976·36到41岁）.txt", title: "谢聪敏被逼编两个木", paragraphs: [4] },
  { file: "014.监狱（1971-1976·36到41岁）.txt", title: "罗永黎说自己是神仙老虎狗", paragraphs: [38] },
  { file: "014.监狱（1971-1976·36到41岁）.txt", title: "范子文打蚊子当打沈之岳", paragraphs: [39] },
  {
    file: "014.监狱（1971-1976·36到41岁）.txt",
    title: "小林马桶夹缝带信",
    paragraphs: [40],
    start: "谢聪敏在牢中替李敖翻案",
    end: "把信从夹缝中带了出来。”"
  },
  { file: "014.监狱（1971-1976·36到41岁）.txt", title: "陈留恨被反咬带信", paragraphs: [41] },
  { file: "014.监狱（1971-1976·36到41岁）.txt", title: "高中生以为宪法是真的", paragraphs: [42] },
  {
    file: "014.监狱（1971-1976·36到41岁）.txt",
    title: "蔡俊军穿睡衣赴死",
    paragraphs: [45],
    start: "“成大共产党”领袖是蔡俊军",
    end: "十五年后出狱。"
  },
  {
    file: "014.监狱（1971-1976·36到41岁）.txt",
    title: "蔡俊军共你的产",
    paragraphs: [45],
    start: "我的同案李政一曾和蔡俊军同房",
    end: "我要共你的产啊！’”"
  },
  {
    file: "014.监狱（1971-1976·36到41岁）.txt",
    title: "叶迫冒充会理发",
    paragraphs: [48],
    start: "有一次，押房里缺个理发的"
  },
  {
    file: "014.监狱（1971-1976·36到41岁）.txt",
    title: "黄中国上天堂投机",
    paragraphs: [49],
    start: "有山东米商黄中国",
    end: "反倒下了所有的地狱！”"
  },
  { file: "014.监狱（1971-1976·36到41岁）.txt", title: "胡炎汉被还有你吓坏", paragraphs: [50] },
  { file: "014.监狱（1971-1976·36到41岁）.txt", title: "胡炎汉关进来问好", paragraphs: [51] },
  { file: "014.监狱（1971-1976·36到41岁）.txt", title: "欧卡曾许诺脱衣舞", paragraphs: [52] },
  {
    file: "017.“二进宫”（1981-1982·46岁）.txt",
    title: "王拓的战争与和平被查扣",
    paragraphs: [14],
    start: "王拓住在这边的时候",
    end: "显示了这些公务人员的程度。"
  },
  {
    file: "017.“二进宫”（1981-1982·46岁）.txt",
    title: "雷震从背面新闻补出真相",
    paragraphs: [14],
    start: "雷震同我说",
    end: "原来是什么了。”"
  },
  {
    file: "017.“二进宫”（1981-1982·46岁）.txt",
    title: "石柏苍背诗验明读者",
    paragraphs: [23],
    start: "另一位是石柏苍",
    end: "我顿时验明正身无误。"
  },
  { file: "018.笔伐（1982-1992·47到57岁）.txt", title: "郑南榕洗掉水杯手印", paragraphs: [11] },
  {
    file: "020.前程（1997-·62岁以后）.txt",
    title: "侯榕生发现方豪是神父",
    paragraphs: [11],
    start: "据说方豪从小家里穷",
    end: "言下不胜得意。"
  },
  {
    file: "020.前程（1997-·62岁以后）.txt",
    title: "戴高乐嫌刺客枪法差",
    paragraphs: [26],
    start: "我佩服的法国英雄戴高乐",
    end: "“这些家伙的枪法真差劲！”"
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
          "只保留李敖文中讲出来的故事；故事焦点不是李敖本人的生平事件，且有具体人物、动作、转折或收束；李敖自身经历、出版经过、法律材料、背景说明、单纯论辩和目录式资料从严剔除；正文保留原文。"
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(ROOT, "notes", "li_ao_huiyilu_story_round1.md"),
    [
      "# 李敖回忆录 story_round1",
      "",
      `- 输出条目：${rows.length}`,
      `- 总字数：${validation.totalChars}`,
      `- 最短/最长：${validation.minChars}/${validation.maxChars}`,
      "- 口径：只收李敖文中讲出来、故事焦点不是李敖本人、且有具体人物动作和转折收束的小故事；正文为原文。",
      "- 从严剔除：李敖自己的求学、恋爱、坐牢、出版、官司、软禁反制等自传事件；单纯制度说明、政治论辩、背景材料、书信目录式内容。",
      "- 本轮另剔除边缘叙事：李凤亭逃荒丧母、两代开除恩怨、王季高先逃北平、马占山万里荣归，原因是偏家世/史事材料，不够像独立小故事。",
      "- 校对轮删去：郑竹梅说爸爸像太阳、黄宏成雨中说服章孝慈、三毛被问黑暗中的黄人、金庸信佛被问财产、徐神父二十万买证明、方豪不再做奋斗的好人、张大为说乒乓只剩乒；原因是偏诗句、会面事件、论战或李敖亲自抗辩，不够独立小故事。",
      "- 校对轮新增：潘毓刚炮火外训话。",
      "- 校对轮裁剪：曹梓华、于右任、老彭、叶迫、黄中国、侯榕生等条目只保留故事主体，减少背景材料和评论铺陈。",
      "- 跳过明显重述：独战土匪、慓悍的庄家、严侨踢足球/倒写/投奔自由、张永亭的若干老兵轶事、许性德慢慢刮马桶等此前已收故事。"
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
