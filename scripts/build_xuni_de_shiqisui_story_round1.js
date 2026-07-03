const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "虚拟的十七岁";
const SLUG = "xuni_de_shiqisui";
const ROUND = "story_round1";
const ID_PREFIX = "XN17";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", "xuni_de_shiqisui_story_round1.md");

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
  "li_ao_zawenji",
  "qianqiu_wansui_bianwaiji",
  "beijing_fayuansi",
  "shangshan_shangshan_ai",
  "hongse_11",
  "xuni_de_shiqisui"
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("004."));
  if (!categoryDir) throw new Error("Cannot find fiction category directory");
  const bookDir = fs
    .readdirSync(path.join(ROOT, corpusDir, categoryDir))
    .find((name) => name.startsWith("004."));
  if (!bookDir) throw new Error("Cannot find source book directory");
  return path.join(ROOT, corpusDir, categoryDir, bookDir);
}

const SOURCE_ROOT = findSourceRoot();

const selections = [
  {
    prefix: "002",
    paragraph: 38,
    line: "75-75",
    title: "老富翁给器官祝寿",
    start: "讲个笑话给你吧。一个老富翁",
    end: "‘你要活着，也一百岁了。’"
  },
  {
    prefix: "003",
    paragraph: 5,
    line: "9-9",
    title: "庄子说道在屎溺",
    start: "东郭子问庄子道在哪里？",
    end: "自然大便小便里也有。"
  },
  {
    prefix: "003",
    paragraph: 13,
    line: "25-25",
    title: "赵州和文远比下贱",
    start: "佛门中有‘赵州从稔禅师’",
    end: "‘我在避暑乘凉啊！’"
  },
  {
    prefix: "003",
    paragraph: 13,
    line: "25-25",
    title: "赵州小便悟道",
    start: "这位赵州禅师，还有一个跟尿有关的故事。",
    end: "别人何尝帮得上忙？"
  },
  {
    prefix: "003",
    paragraph: 13,
    line: "25-25",
    title: "张三喝水李四撒尿",
    start: "不过中国有个笑话是，张三喝水",
    end: "笑话中小便是可以找人代替的。"
  },
  {
    prefix: "003",
    paragraph: 27,
    line: "53-53",
    title: "法国富翁不求女伶的心",
    start: "用个法国笑话吧。",
    end: "我的希望并没有那么高。”"
  },
  {
    prefix: "005",
    paragraph: 62,
    line: "123-123",
    title: "小女孩丢十块钱还想二十块",
    start: "让我告诉你小女孩与十块钱的故事。",
    end: "如果那十块不丢，就有二十块了？"
  },
  {
    prefix: "007",
    paragraph: 25,
    line: "49-49",
    title: "达尔润普寻找南大陆",
    start: "18世纪到19世纪的英国地理学家、也是水文专家Alexander Dalrymple",
    end: "证明根本没有这块大陆。"
  },
  {
    prefix: "008",
    paragraph: 30,
    line: "59-59",
    title: "恶狗守骨头",
    start: "一条恶狗，找到一根骨头",
    end: "因为它四条腿。"
  },
  {
    prefix: "009",
    paragraph: 42,
    line: "83-83",
    title: "死囚让皇帝的马飞起来",
    start: "巴鲁克说过一个故事。",
    end: "可能那匹马真的飞起来了。’"
  },
  {
    prefix: "011",
    paragraph: 60,
    line: "119-119",
    title: "斐憐要重建亚历山大毁掉的城",
    start: "提到‘蜚蠊’，我就用接近同音的串连方法",
    end: "亚历山大毁了的城，斐憐给重建起来。"
  },
  {
    prefix: "012",
    paragraph: 49,
    line: "97-97",
    title: "穷书生用耳光反驳和尚",
    start: "一个故事说，一个穷书生",
    end: "不打人就是打人。’"
  },
  {
    prefix: "016",
    paragraph: 110,
    line: "219-219",
    title: "六十七岁富翁娶十七岁少女",
    start: "我有个笑话讲给你。",
    end: "她要死，我没办法。”"
  },
  {
    prefix: "024",
    paragraph: 152,
    line: "303-303",
    title: "辜鸿铭咖啡店反击英国商人",
    start: "辜鸿铭是北京大学教授",
    end: "太不可思议了。"
  },
  {
    prefix: "034",
    paragraph: 55,
    line: "109-109",
    title: "贞德动摇后选择殉死",
    start: "贞德是在1430年11月",
    end: "宣告悔过作废。"
  },
  {
    prefix: "040",
    paragraph: 10,
    line: "19-19",
    title: "女学生只见过勃起图形",
    start: "笑话是在解剖学课堂上",
    end: "‘我见过的，只有这种。’”"
  },
  {
    prefix: "042",
    paragraph: 4,
    line: "7-7",
    title: "卓别林扮卓别林没得冠军",
    start: "我知道有一个关于大明星Chaplin（卓别林）的故事",
    end: "他本人并没得到冠军。"
  },
  {
    prefix: "044",
    paragraph: 15,
    line: "29-29",
    title: "电脑建议买停掉的手表",
    start: "我讲个可爱的电脑故事给你：",
    end: "要一百二十年才指出正确时间一次。’"
  },
  {
    prefix: "044",
    paragraph: 44,
    line: "87-87",
    title: "宴会客人用汤匙证明时空",
    start: "故事说一个宴会中",
    end: "乃是未来。’"
  },
  {
    prefix: "046",
    paragraph: 130,
    line: "259-259",
    title: "鲁班用脚画水神",
    start: "古代的水神名字好怪",
    end: "郦道元写的《水经注》。"
  },
  {
    prefix: "048",
    paragraph: 71,
    line: "141-141",
    title: "幻想病人从总统变无名小卒",
    start: "一个笑话说：精神病医生恭喜病人",
    end: "你会开心吗？"
  },
  {
    prefix: "049",
    paragraph: 110,
    line: "219-219",
    title: "哈代心脏归葬前妻坟墓",
    start: "想想英国文学家哈代吧",
    end: "多么多情动人的故事呀。"
  },
  {
    prefix: "051",
    paragraph: 19,
    line: "37-37",
    title: "福特电机故障的一条粉笔线",
    start: "就像当年美国Ford（福特）公司电机出了故障",
    end: "知道在哪里画线，九千九百九十九元！"
  },
  {
    prefix: "052",
    paragraph: 90,
    line: "179-179",
    title: "陆判给朱尔旦换心",
    start: "你知道中国古小说《聊斋》的故事吗？",
    end: "被大神附体。"
  },
  {
    prefix: "055",
    paragraph: 106,
    line: "211-211",
    title: "红楼女读者哭喊烧杀宝玉",
    start: "《红楼梦》有一个女读者",
    end: "奈何烧杀我宝玉！”"
  },
  {
    prefix: "055",
    paragraph: 238,
    line: "475-475",
    title: "苏东坡佛印与苏小妹",
    start: "有一个苏东坡和佛印和尚的故事。",
    end: "你输了。”"
  },
  {
    prefix: "056",
    paragraph: 117,
    line: "233-233",
    title: "牧师说新旧约之间通常空白",
    start: "就如同一则笑话说的",
    end: "The page, madam, is usually a bland!”"
  },
  {
    prefix: "056",
    paragraph: 188,
    line: "375-375",
    title: "亚历山大劈开戈登结",
    start: "希腊神话中Phrygia国王Gordius",
    end: "以劈成两半解决了问题。"
  },
  {
    prefix: "056",
    paragraph: 192,
    line: "383-383",
    title: "数学老师比十七岁疯一倍",
    start: "一个笑话说，有个数学老师",
    end: "because you are twice as crazy.）"
  },
  {
    prefix: "056",
    paragraph: 196,
    line: "391-391",
    title: "猜谜专家被同一谜底放平",
    start: "让我用一则笑话答复你。",
    end: "只不过我把它放平了而已。’"
  },
  {
    prefix: "059",
    paragraph: 4,
    line: "7-7",
    title: "方仲永泯然众人",
    start: "我想到宋朝王安石和他那篇《伤仲永》。",
    end: "泯然众人矣！”"
  }
];

function decodeText(filePath) {
  return new TextDecoder("gb18030").decode(fs.readFileSync(filePath));
}

function stripFooter(text) {
  return text.replace(/\s*上一页\s+回目录\s+下一页\s*$/u, "").trim();
}

function fileForPrefix(prefix) {
  const fileName = fs
    .readdirSync(SOURCE_ROOT)
    .find((name) => name.startsWith(`${prefix}.`) && name.endsWith(".txt"));
  if (!fileName) throw new Error(`Cannot find source file for prefix ${prefix}`);
  return fileName;
}

function readSource(fileName) {
  return stripFooter(decodeText(path.join(SOURCE_ROOT, fileName)));
}

function selectText(source, selection) {
  const startIndex = source.indexOf(selection.start);
  if (startIndex < 0) throw new Error(`Start marker not found for ${selection.title}`);
  const endIndex = source.indexOf(selection.end, startIndex);
  if (endIndex < 0) throw new Error(`End marker not found for ${selection.title}`);
  return source.slice(startIndex, endIndex + selection.end.length).trim();
}

function storyId(index) {
  return `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`;
}

function buildRows() {
  const sourceCache = new Map();
  return selections.map((selection, index) => {
    const sourceFile = fileForPrefix(selection.prefix);
    if (!sourceCache.has(sourceFile)) sourceCache.set(sourceFile, readSource(sourceFile));
    const storyText = selectText(sourceCache.get(sourceFile), selection);
    const id = storyId(index);
    return {
      id,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: `${ID_PREFIX}_${selection.prefix}_${selection.paragraph}`,
      source_file: sourceFile,
      source_lines: selection.line,
      char_count: Array.from(storyText).length,
      story_text: storyText
    };
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
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
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const text = rows
    .map((row) =>
      [
        `【${row.id}】${row.title}`,
        `书名：${row.book}`,
        `来源：${row.source_file}（${row.source_lines}）`,
        "",
        row.story_text
      ].join("\n")
    )
    .join("\n\n---\n\n");
  fs.writeFileSync(filePath, `${text}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [rawHeaders, ...body] = rows;
  if (!rawHeaders) return [];
  const headers = rawHeaders.map((header, index) =>
    index === 0 ? header.replace(/^\uFEFF/u, "") : header
  );
  return body
    .filter((values) => values.some((value) => value !== ""))
    .map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))
    );
}

function compareBookFiles(a, b) {
  const slugA = path.basename(path.dirname(a));
  const slugB = path.basename(path.dirname(b));
  const orderA = BOOK_ORDER.indexOf(slugA);
  const orderB = BOOK_ORDER.indexOf(slugB);
  if (orderA !== -1 || orderB !== -1) {
    if (orderA === -1) return 1;
    if (orderB === -1) return -1;
    return orderA - orderB;
  }
  return slugA.localeCompare(slugB);
}

function normalizeAggregateRow(row, fallbackSlug) {
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || fallbackSlug,
    title: row.title,
    source_ids: row.source_ids,
    source_file: row.source_file,
    source_lines:
      row.source_lines ||
      [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count,
    story_text: row.story_text
  };
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, "");
}

function duplicateTextPairs(rows) {
  const seen = new Map();
  const duplicates = [];
  for (const row of rows) {
    const key = normalizeText(row.story_text);
    if (seen.has(key)) duplicates.push([seen.get(key), row.id]);
    else seen.set(key, row.id);
  }
  return duplicates;
}

function validateSourceMatches(rows) {
  const sourceCache = new Map();
  return rows
    .filter((row) => {
      if (!sourceCache.has(row.source_file)) {
        sourceCache.set(row.source_file, normalizeText(readSource(row.source_file)));
      }
      return !sourceCache.get(row.source_file).includes(normalizeText(row.story_text));
    })
    .map((row) => row.id);
}

function writeAggregate() {
  const csvFiles = fs
    .readdirSync(path.join(ROOT, "data", "books"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(ROOT, "data", "books", entry.name, `${ROUND}.csv`))
    .filter((filePath) => fs.existsSync(filePath))
    .sort(compareBookFiles);

  const rows = csvFiles.flatMap((filePath) => {
    const bookSlug = path.basename(path.dirname(filePath));
    return parseCsv(fs.readFileSync(filePath, "utf8")).map((row) =>
      normalizeAggregateRow(row, bookSlug)
    );
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
    rows
      .reduce((map, row) => {
        const current = map.get(row.book_slug) || { book: row.book, slug: row.book_slug, count: 0 };
        current.count += 1;
        map.set(row.book_slug, current);
        return map;
      }, new Map())
      .values()
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
  const missingSourceTextIds = validateSourceMatches(rows);
  return {
    ok:
      duplicateTextIds.length === 0 &&
      missingSourceTextIds.length === 0 &&
      rows.every((row) => Number(row.char_count) > 0),
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + Number(row.char_count || 0), 0),
    minChars: rows.length ? Math.min(...rows.map((row) => Number(row.char_count || 0))) : 0,
    maxChars: rows.length ? Math.max(...rows.map((row) => Number(row.char_count || 0))) : 0,
    duplicateTextIds,
    missingSourceTextIds
  };
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function writeNotes(validation, aggregate) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const rows = buildRows();
  const lines = [
    "# 虚拟的十七岁故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    "- 状态：校对轮",
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《虚拟的十七岁》为小说，本轮不拆朱仑、徐太太、住院、巫神医、脑前瞻工程等主线情节；只收叙述者或人物明确讲出的嵌入故事、笑话、寓言、掌故和历史轶事。",
    "",
    "## 保留条目",
    "",
    ...rows.map((row) => `- ${row.id} ${row.title}（${row.source_file}:${row.source_lines}，${row.char_count}字）`),
    "",
    "## 本轮排除重点",
    "",
    "- 楔子、女学生复现、住院、买房、邻居、朱仑模特儿、裸泳、烛浴、昏迷与重逢等主线情节不拆条。",
    "- 巫神医、脑前瞻工程、活体实验、晶片、机器人、医学诊断等说明段落，偏设定或议论者不收。",
    "- 李敖自己的坐牢、住院、手术、买屋、晒太阳等自述经历不收。",
    "- 灰姑娘来源、梵志吐壶、画皮、安蒂冈与聂荣、皇帝的新衣、泰山鬼神等只是标签或未讲成完整故事者不收。",
    "- 丹尼·蓬已在总表收录；君王后椎破玉连环已在《世论新语》收录，本轮不重复。",
    "",
    "## 校对处理",
    "",
    "- 删除“狄蜜特烧凡身被误会”：只是压缩神话标签，原文未讲成完整故事。",
    "- 删除“麦格隆满尼王误译”：偏翻译错误材料，不是可复述的小故事。",
    "- 删除“林语堂中文打字机生不逢时”：偏人物发明失败案例，故事动作不足。",
    "- 收窄“贞德动摇后选择殉死”：删去大段英文引文和议论尾巴，保留受审、动摇、恢复自我的故事本体。",
    "- 补齐“六十七岁富翁娶十七岁少女”“女学生只见过勃起图形”的原文结尾引号；“陆判给朱尔旦换心”改到完整句末。",
    "",
    "## 校验",
    "",
    `- 单书重复正文：${JSON.stringify(validation.duplicateTextIds)}`,
    `- 单书正文回源失败：${JSON.stringify(validation.missingSourceTextIds)}`,
    `- 汇总重复正文：${JSON.stringify(aggregate.duplicateTextIds)}`
  ];
  fs.writeFileSync(NOTES_PATH, `${lines.join("\n")}\n`, "utf8");
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
    criteria:
      "本书为小说，只收小说中人物或叙述者明确讲出的独立小故事、笑话、寓言、掌故与历史轶事；不收主线情节、李敖自身事件、医学/科技设定说明、纯议论或过短标签。",
    excludedByStandard: [
      "朱仑、徐太太、住院、巫神医、脑前瞻工程、模特儿与重逢等主线情节不拆条。",
      "李敖自己的坐牢、住院、手术、买屋、晒太阳等自述经历不作为故事条目。",
      "灰姑娘来源、梵志吐壶、画皮、安蒂冈与聂荣、皇帝的新衣、泰山鬼神等只作标签或未讲成完整故事者不收。",
      "丹尼·蓬与玉连环同题故事已在汇总表出现，本轮不重复收录。"
    ],
    extractionNotes: [
      "候选扫描覆盖 60 个正文文件与目录文件；后记仅写创作说明，未新增独立故事。",
      "保留笑话类条目，如老富翁给器官祝寿、小女孩十块钱、飞马囚犯、和尚耳光、老富翁娶少女、解剖课画图、总统幻想症、数学老师年龄、放平谜题等。",
      "保留掌故类条目，如庄子道在屎溺、赵州禅师、达尔润普、斐憐、辜鸿铭、贞德、卓别林、鲁班水神、哈代、福特粉笔、陆判、苏东坡佛印、戈登结、方仲永等。",
      "对同段多故事按独立主题拆取；已收同题的玉连环只取前半的戈登结。"
    ],
    proofreadDropCount: 3,
    proofreadDrops: [
      "狄蜜特烧凡身被误会",
      "麦格隆满尼王误译",
      "林语堂中文打字机生不逢时"
    ],
    proofreadTrimCount: 1,
    proofreadTrims: ["贞德动摇后选择殉死"],
    proofreadBoundaryFixCount: 3,
    proofreadBoundaryFixes: [
      "六十七岁富翁娶十七岁少女",
      "女学生只见过勃起图形",
      "陆判给朱尔旦换心"
    ],
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
  writeNotes(validation, aggregate);

  if (!validation.ok) {
    throw new Error(`Validation failed for ${BOOK}: ${JSON.stringify(validation)}`);
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
