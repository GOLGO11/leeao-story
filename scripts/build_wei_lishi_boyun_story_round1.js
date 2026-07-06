const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "为历史拨云";
const SLUG = "wei_lishi_boyun";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "WLSBY";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;

const selections = [
  {
    prefix: "002",
    paragraph: 2,
    title: "孟子去齐自许五百年第一名",
    start: "《孟子·公孙丑下》有这样一段",
    end: "五百年后的第一名，还有谁呀？"
  },
  {
    prefix: "003",
    paragraph: 5,
    title: "延州妓女被说成舍身菩萨",
    start: "《西湖二集》有一个故事说",
    end: "其为菩萨心肠，明矣！"
  },
  {
    prefix: "003",
    paragraph: 6,
    title: "胡僧礼拜锁骨菩萨墓",
    start: "《续玄怪录》有这样一段",
    end: "此即锁骨菩萨。’”"
  },
  {
    prefix: "003",
    paragraph: 6,
    title: "金沙滩卖鱼女人现观音身",
    start: "“观世音菩萨寻声救苦普门示现图”中引《观音感应传》说",
    end: "可能空忙一场！"
  },
  {
    prefix: "004",
    paragraph: 2,
    title: "富翁问汗水到哪里去了",
    start: "中国笑话书《哈哈笑》中",
    end: "“在小的身上。”"
  },
  {
    prefix: "004",
    paragraph: 3,
    title: "陈纪滢问水怎么跑到谢冰莹身上",
    start: "这类笑话，降至国民党统治下的台湾",
    end: "怎么跑到谢冰莹身上了？”"
  },
  {
    prefix: "004",
    paragraph: 6,
    title: "孙淦被错当孙汶弟兄",
    start: "《破涕录》有这样一段",
    end: "竟可荒唐到这种程度了。"
  },
  {
    prefix: "005",
    paragraph: 5,
    title: "南唐贿赵普又被宋太祖暗中退回",
    start: "南唐以五万两银子贿赂宋朝赵普",
    end: "数目正与五万两银子相等！"
  },
  {
    prefix: "006",
    paragraph: 6,
    title: "乐广说名教内自有乐地",
    start: "所谓自然，在《晋书乐广传》中有个例子",
    end: "还在乎什么礼法呢？"
  },
  {
    prefix: "006",
    paragraph: 72,
    title: "张桂芳呼名落马叫不动哪吒",
    start: "《封神演义》上有个张桂芳能够“呼名落马”",
    end: "因为哪吒是莲花化身，没有魂的。"
  },
  {
    prefix: "006",
    paragraph: 72,
    title: "银角大王叫名收孙行者",
    start: "《西游记》上有个银角大王",
    end: "因为有名就有魂了。"
  },
  {
    prefix: "007",
    paragraph: "2-4",
    title: "仲叔于奚有功请繁缨",
    start: "《左传》里记孔夫子一段话",
    end: "俱慎名器，则下服其命。"
  },
  {
    prefix: "009",
    paragraph: 4,
    title: "宋太祖用毛笔抹赵普脸",
    start: "有一天，宋太祖要改元为“乾德”",
    end: "真是一场活剧。"
  },
  {
    prefix: "009",
    paragraph: 7,
    title: "赵普说半部论语佐太祖",
    start: "太宗欲相赵普",
    end: "尚有一半，可以辅陛下。’太宗释然，卒相之。"
  },
  {
    prefix: "011",
    paragraph: 2,
    title: "蒋梦麟被骂无大臣之风后辞职",
    start: "蒋梦麟《西潮》里提到一个故事",
    end: "文曰：“无大臣之风。”"
  },
  {
    prefix: "011",
    paragraph: 4,
    title: "周勃流汗陈平不管细务",
    start: "汉文帝向大臣周勃问行政业务",
    end: "就是有“大臣之风”。"
  },
  {
    prefix: "011",
    paragraph: 5,
    title: "丙吉不问群架只问牛喘",
    start: "汉宣帝时大臣丙吉外出",
    end: "就是有“大臣之风”。"
  },
  {
    prefix: "012",
    paragraph: 4,
    title: "晏子说国君为私死不必跟死",
    start: "晏子在齐庄公被崔武子杀了以后",
    end: "谁又会跟着死呢？"
  },
  {
    prefix: "012",
    paragraph: 4,
    title: "冯道说动契丹少屠城",
    start: "再以冯道为例",
    end: "使老百姓少受了不少血光之灾。"
  },
  {
    prefix: "015",
    paragraph: 2,
    title: "叔向不理乐王鲋等祁大夫",
    start: "《左传·襄公二十一年》有这样一段",
    end: "祁大夫就正是这样的正人君子。”）"
  },
  {
    prefix: "015",
    paragraph: 3,
    title: "祁奚举仇人又举儿子",
    start: "《史记·晋世家》说",
    end: "这不就是祁奚吗？”）"
  },
  {
    prefix: "016",
    paragraph: 8,
    title: "伍子胥掘墓鞭楚平王",
    start: "伍子胥的父亲伍奢",
    end: "打了三百鞭。"
  },
  {
    prefix: "017",
    paragraph: 3,
    title: "苻登叹姚苌何其厄哉",
    start: "是时〔姚〕苌疾病",
    end: "遂罢师还雍。"
  },
  {
    prefix: "018",
    paragraph: 4,
    title: "皋陶审判靠神羊触人",
    start: "传说中的中国司法官之祖兼立法官之祖",
    end: "无非是陪审制度的陪审员。"
  },
  {
    prefix: "018",
    paragraph: 9,
    title: "卖饼文盲向皇帝讨御史",
    start: "既然法律上曲直可由一触得之",
    end: "但为国触罪人而已。”（《朝野佥载》）"
  },
  {
    prefix: "019",
    paragraph: 4,
    title: "处女大腿生擒洋麒麟",
    start: "洋麒麟在印度、希腊、罗马的传说中",
    end: "早已画中有诗了。"
  },
  {
    prefix: "019",
    paragraph: 6,
    title: "狮子躲树反咬独角兽",
    start: "中国文献《坤舆图说》中有“独角兽”之条",
    end: "遗风至今犹在。"
  },
  {
    prefix: "021",
    paragraph: 3,
    title: "刘秀当众烧掉通敌黑资料",
    start: "《后汉书·光武帝纪》记刘秀",
    end: "这是何等气派！"
  },
  {
    prefix: "021",
    paragraph: 4,
    title: "曹操焚毁许下军中通敌书",
    start: "《三国志·魏书·武帝纪》记曹操打败袁绍",
    end: "是人之常情啊！"
  },
  {
    prefix: "021",
    paragraph: 5,
    title: "陆象先焚投名保全众人",
    start: "《新唐书·陆象先传》记太平公主夺权",
    end: "当时无知者。”——唐玄宗平定了敌人，从敌人那边卤获到叛徒黑资料，叫陆象先惩治，陆象先却烧掉黑资料以“安反侧者”，这是何等气派！"
  },
  {
    prefix: "021",
    paragraph: 6,
    title: "明成祖焚毁干犯封事",
    start: "郑晓《吾学编·逊国臣纪》记明成祖",
    end: "这是何等气派！"
  },
  {
    prefix: "024",
    paragraph: 8,
    title: "孟夫子见孟太太箕踞要离婚",
    start: "《韩诗外传》记孟夫子回家",
    end: "其理在此。"
  },
  {
    prefix: "026",
    paragraph: 9,
    title: "蝙蝠两次改口逃过黄鼠狼",
    start: "《伊索寓言》里有一则《蝙蝠和黄鼠狼》",
    end: "最后又被放掉了。"
  },
  {
    prefix: "026",
    paragraph: 9,
    title: "鸟兽议和后蝙蝠昼伏夜出",
    start: "另一则寓言是《鸟兽和蝙蝠》",
    end: "只好昼伏夜出了。"
  },
  {
    prefix: "026",
    paragraph: 17,
    title: "朱温把清流投进黄河",
    start: "公元905年，朱温",
    end: "写完这篇文章，我忽然想到浊水溪！"
  },
  {
    prefix: "027",
    paragraph: 4,
    title: "周厉王禁谤后三年被流放",
    start: "厉王虐，国人谤王",
    end: "三年，乃流王于彘。"
  },
  {
    prefix: "028",
    paragraph: 2,
    title: "许由洗耳巢父牵牛上游",
    start: "《高士传·许由》里说",
    end: "以免喝到洗耳的脏水。"
  },
  {
    prefix: "028",
    paragraph: 2,
    title: "北人无择投清泠之渊",
    start: "《庄子·让王》里说",
    end: "把自己淹死了。"
  },
  {
    prefix: "029",
    paragraph: 4,
    title: "孔子借子贡家哭伯高",
    start: "《礼记·檀弓上》有这么一段",
    end: "为了和伯高有交情而来哭的，你就算了。"
  },
  {
    prefix: "029",
    paragraph: 6,
    title: "子思哭改嫁母被学生纠正",
    start: "《礼记·檀弓下》就有这么一段",
    end: "也不能哭错了地方！"
  },
  {
    prefix: "029",
    paragraph: 9,
    title: "金圣叹因哭庙同日被斩",
    start: "不过，这种“哭庙”的动作",
    end: "就云散烟消了。"
  },
  {
    prefix: "030",
    paragraph: 2,
    title: "大臣奉命哭皇帝爱姬却自哭其妾",
    start: "稗史中有皇帝死了爱姬",
    end: "我哭的是我死去的姨太太啊！）"
  },
  {
    prefix: "030",
    paragraph: 5,
    title: "王著醉哭世宗宋太祖放过",
    start: "《国老谈苑》记宋太祖",
    end: "何能为也。’”"
  },
  {
    prefix: "030",
    paragraph: 8,
    title: "鲁缪公怕齐在异姓庙哭陈庄子",
    start: "在《礼记·檀弓上》中",
    end: "是一种没办法中的办法。"
  },
  {
    prefix: "034",
    paragraph: 2,
    title: "曾子临死叫学生看手脚",
    start: "《论语》记曾子临死前",
    end: "我的学生啊！）"
  },
  {
    prefix: "034",
    paragraph: 6,
    title: "乐正子春摔伤脚几个月忧色",
    start: "《礼记》记曾子学生乐正子春",
    end: "可见这种“不敢毁伤”的大道理，是何等深入人心！"
  },
  {
    prefix: "034",
    paragraph: 7,
    title: "范宣伤手指哭不为痛",
    start: "《世说新语》记范宣八岁时",
    end: "可见这种“不敢毁伤”的大道理，是何等深入人心！"
  },
  {
    prefix: "034",
    paragraph: 8,
    title: "夏侯惇拔矢啖睛",
    start: "《三国演义》第十八回",
    end: "可见这种“不敢毁伤”的大道理，是何等深入人心！"
  },
  {
    prefix: "034",
    paragraph: 9,
    title: "王阳畏九折坂王尊快马前进",
    start: "汉朝王阳做益州刺史",
    end: "（《世说新语》）"
  },
  {
    prefix: "036",
    paragraph: "2-6",
    title: "冯起炎拦皇帝请做媒被发奴",
    start: "“故宫博物院”《清代文字狱档》",
    end: "后果该有多严重！"
  },
  {
    prefix: "038",
    paragraph: "3-6",
    title: "朱文圭两岁幽高墙五十七岁放出",
    start: "明成祖靖难成功",
    end: "垂老被垂怜，似更可信。"
  },
  {
    prefix: "039",
    paragraph: 12,
    title: "孔子入太庙每事问",
    start: "以知礼闻名的孔子",
    end: "行家眼里一定给予拆穿。"
  },
  {
    prefix: "041",
    paragraph: "5-6",
    title: "张居正夺情在官守制",
    start: "最妙的一个例，就是明朝的张居正",
    end: "就在这种血肉横飞中横行起飞了。"
  },
  {
    prefix: "042",
    paragraph: 5,
    title: "孙诒让收章太炎做本师撑腰",
    start: "刘成禺《世载堂杂忆》",
    end: "可说是一件最有趣的师门争夺战。"
  },
  {
    prefix: "043",
    paragraph: "6-7",
    title: "吴稚晖初见实事求是莫做调人",
    start: "有一次，——三十多年前",
    end: "“实事求是，莫做调人”八个字的精神。"
  },
  {
    prefix: "044",
    paragraph: 4,
    title: "直不疑认下误拿的金子也不辩偷嫂",
    start: "直不疑，南阳人也",
    end: "不好立名，称为长者。"
  },
  {
    prefix: "044",
    paragraph: "6-8",
    title: "隽不疑母亲问他平反活几人",
    start: "另一个不疑——隽不疑",
    end: "以光古之妇人也！"
  },
  {
    prefix: "045",
    paragraph: 5,
    title: "范仲淹冻粥力学有钱即散",
    start: "范仲淹年轻时穷得每天煮一锅粥",
    end: "这是何等怀抱！"
  },
  {
    prefix: "045",
    paragraph: 6,
    title: "晏殊怒责范仲淹反被说惭",
    start: "《涑水纪闻》说",
    end: "殊惭无以应。”"
  },
  {
    prefix: "045",
    paragraph: 6,
    title: "范仲淹修史梦中受威胁仍不改",
    start: "《随园随笔》引《画墁录》说",
    end: "已而纯仁病愈。”"
  },
  {
    prefix: "045",
    paragraph: 6,
    title: "范仲淹把风水宅基捐作学舍",
    start: "《昨非庵日纂》记一个故事",
    end: "苏州府学是也。”"
  },
  {
    prefix: "045",
    paragraph: 7,
    title: "范仲淹反对富弼杀高邮官吏",
    start: "有强盗打到了高邮",
    end: "又是何等怀抱！"
  },
  {
    prefix: "045",
    paragraph: 8,
    title: "明太祖因范仲淹名句免范文从",
    start: "最有趣的，明太祖要杀范文从",
    end: "范仲淹真泽及后人矣！"
  }
];

const proofreadDrops = new Map([
  [
    "孟子去齐自许五百年第一名",
    "主体是“五百年”思想的经典阐释，虽有问答场景，但更像思想出处说明，不够像独立小故事。"
  ],
  [
    "处女大腿生擒洋麒麟",
    "这是洋麒麟物性传说的说明，缺少具体人物行动和完整转折；保留后面狮子与独角兽一条即可。"
  ],
  [
    "明成祖焚毁干犯封事",
    "同属“烧掉黑资料”主题的补充短例，情节过于压缩；本轮保留刘秀、曹操、陆象先三条更完整故事。"
  ],
  [
    "孟夫子见孟太太箕踞要离婚",
    "只有一句典故点名，缺少故事展开和收束，校对轮不单列。"
  ],
  [
    "朱温把清流投进黄河",
    "这是附记里的史料梗和反讽联想，故事边界较弱，容易落回材料摘录。"
  ]
]);

const candidateMarkers = [
  "故事",
  "笑话",
  "寓言",
  "问",
  "答",
  "曰",
  "谓",
  "说",
  "告诉",
  "骂",
  "哭",
  "杀",
  "死",
  "梦",
  "捐",
  "辞",
  "奏",
  "请",
  "打",
  "放",
  "流",
  "烧",
  "抓",
  "献",
  "赐",
  "怒",
  "荐",
  "审判",
  "告状",
  "拦路",
  "落马",
  "观音",
  "菩萨",
  "孙行者",
  "孔子",
  "范仲淹",
  "张居正",
  "伍子胥",
  "宋太祖",
  "刘秀",
  "曹操",
  "许由",
  "金圣叹",
  "曾子",
  "冯起炎",
  "朱文圭"
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("009."));
  if (!categoryDir) throw new Error("Cannot find history category directory");
  const bookDir = fs
    .readdirSync(path.join(ROOT, corpusDir, categoryDir))
    .find((name) => name.startsWith("003.") && name.includes(BOOK));
  if (!bookDir) throw new Error(`Cannot find source book directory for ${BOOK}`);
  return path.join(ROOT, corpusDir, categoryDir, bookDir);
}

const SOURCE_ROOT = findSourceRoot();

function decodeText(filePath) {
  return new TextDecoder("gb18030").decode(fs.readFileSync(filePath));
}

function stripFooter(text) {
  return text.replace(/\s*李敖影音E书[\s\S]*$/u, "").trim();
}

function readSource(fileName) {
  return stripFooter(decodeText(path.join(SOURCE_ROOT, fileName))).replace(/\r\n/g, "\n");
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^\d{3}\./u.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function splitParagraphs(source) {
  return source
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!fileName) throw new Error(`Cannot find source file for prefix ${prefix}`);
  return fileName;
}

function lineNumberAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

function selectText(source, selection) {
  const startIndex = source.indexOf(selection.start);
  if (startIndex < 0) throw new Error(`Start marker not found: ${selection.title}`);
  const endIndex = source.indexOf(selection.end, startIndex);
  if (endIndex < 0) throw new Error(`End marker not found: ${selection.title}`);
  return {
    text: source.slice(startIndex, endIndex + selection.end.length).trim(),
    lineRange: `${lineNumberAt(source, startIndex)}-${lineNumberAt(
      source,
      endIndex + selection.end.length
    )}`
  };
}

function storyId(index) {
  return `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`;
}

function sourceId(selection) {
  return `${ID_PREFIX}_${selection.prefix}_${String(selection.paragraph).replace(/-/g, "_")}`;
}

function buildRows() {
  const cache = new Map();
  return selections
    .filter((selection) => !proofreadDrops.has(selection.title))
    .map((selection, index) => {
      const sourceFile = fileForPrefix(selection.prefix);
      if (!cache.has(sourceFile)) cache.set(sourceFile, readSource(sourceFile));
      const selected = selectText(cache.get(sourceFile), selection);
      return {
        id: storyId(index),
        book: BOOK,
        book_slug: SLUG,
        title: selection.title,
        source_ids: sourceId(selection),
        source_file: sourceFile,
        source_lines: selected.lineRange,
        char_count: Array.from(selected.text).length,
        story_text: selected.text
      };
    });
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
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
  fs.writeFileSync(
    filePath,
    `${[
      headers.join(","),
      ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
    ].join("\n")}\n`,
    "utf8"
  );
}

function writeTxt(filePath, rows) {
  fs.writeFileSync(
    filePath,
    `${rows
      .map((row) =>
        [
          `【${row.id}】${row.title}`,
          `书名：${row.book}`,
          `来源：${row.source_file}:${row.source_lines}`,
          "",
          row.story_text
        ].join("\n")
      )
      .join("\n\n---\n\n")}\n`,
    "utf8"
  );
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

function existingBookOrder() {
  const webPath = path.join(ROOT, "web", "stories.js");
  if (!fs.existsSync(webPath)) return [];
  const raw = fs.readFileSync(webPath, "utf8");
  try {
    return JSON.parse(raw.replace(/^window\.STORY_DATA = /u, "").replace(/;\s*$/u, "")).books.map(
      (book) => book.slug
    );
  } catch {
    return [];
  }
}

function compareBookFiles(a, b) {
  const order = existingBookOrder();
  if (!order.includes(SLUG)) order.push(SLUG);
  const slugA = path.basename(path.dirname(a));
  const slugB = path.basename(path.dirname(b));
  const orderA = order.indexOf(slugA);
  const orderB = order.indexOf(slugB);
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
    throw new Error(`Duplicate story ids: ${duplicateIds.map((row) => row.id).join(", ")}`);
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
  return { rows, books, duplicateTextIds: duplicateTextPairs(rows) };
}

function validateSourceMatches(rows) {
  const cache = new Map();
  return rows
    .filter((row) => {
      if (!cache.has(row.source_file)) {
        cache.set(row.source_file, normalizeText(readSource(row.source_file)));
      }
      return !cache.get(row.source_file).includes(normalizeText(row.story_text));
    })
    .map((row) => row.id);
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
    status: STATUS,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + Number(row.char_count || 0), 0),
    minChars: rows.length ? Math.min(...rows.map((row) => Number(row.char_count || 0))) : 0,
    maxChars: rows.length ? Math.max(...rows.map((row) => Number(row.char_count || 0))) : 0,
    duplicateTextIds,
    missingSourceTextIds
  };
}

function candidateScore(paragraph, found) {
  let score = found.length;
  if (/故事|笑话|寓言/u.test(paragraph)) score += 8;
  if (/问|答|回答|曰|谓|说|告诉/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/观音|赵普|丙吉|晏子|祁奚|伍子胥|姚苌|皋陶|刘秀|曹操|陆象先|周厉王|许由|金圣叹|曾子|范仲淹/u.test(paragraph)) {
    score += 3;
  }
  if (/杀|死|哭|梦|捐|辞|奏|请|打|放|流|烧|抓|献|赐|怒|荐|审判/u.test(paragraph)) {
    score += 2;
  }
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphs(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.includes(marker));
      const quoteHeavy = (paragraph.match(/[“”]/gu) || []).length >= 6;
      const actionHeavy = /杀|死|哭|梦|捐|辞|奏|请|打|放|流|烧|抓|献|赐|怒|荐|审判/u.test(
        paragraph
      );
      if (!found.length && !quoteHeavy && !actionHeavy) return;
      rows.push({
        file: fileName,
        paragraph: index + 1,
        score: candidateScore(paragraph, found),
        markers: found.join("|"),
        text: paragraph.replace(/\s+/gu, " ").slice(0, 900)
      });
    });
  }
  rows.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file, "zh-Hans-CN"));
  fs.mkdirSync(path.dirname(path.join(ROOT, CANDIDATE_SCAN)), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, CANDIDATE_SCAN),
    `${[
      ["file", "paragraph", "score", "markers", "text"].join("\t"),
      ...rows.map((row) =>
        [row.file, row.paragraph, row.score, row.markers, row.text]
          .map((value) => String(value).replace(/\t/gu, " "))
          .join("\t")
      )
    ].join("\n")}\n`,
    "utf8"
  );
}

function candidateCount() {
  const candidatePath = path.join(ROOT, CANDIDATE_SCAN);
  if (!fs.existsSync(candidatePath)) return 0;
  return Math.max(0, fs.readFileSync(candidatePath, "utf8").trim().split(/\r?\n/u).length - 1);
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const proofreadDropLines = Array.from(proofreadDrops, ([title, reason]) => `- ${title}：${reason}`);
  const lines = [
    "# 为历史拨云故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮入选：${selections.length} 条`,
    `- 校对轮删除：${proofreadDrops.size} 条`,
    `- 入选：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《为历史拨云》多为历史文化、制度和政治史论。校对轮只保留李敖文中讲成可独立复述、带人物行动、问答、反讽、奇事或明确后果，并用来说明思想、制度、政治伦理或历史判断的小故事、寓言、笑话和掌故；删去纯概念辨析、制度沿革、文献罗列、当代政论材料、李敖自己的议论、只有一句名言/典故名的材料，以及同主题中较弱的补例。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 校对轮删除",
    "",
    ...proofreadDropLines,
    "",
    "## 本轮排除重点",
    "",
    "- 《中国史的拨云见日》《中国人的汉贼问题》《从科举到选举》《论“大夫无私交”》《从官逼民反到民逼官反》《限时专判》《郝柏村岂可朝淫祠上香！》《中国印》《图章政治》《“生稊”与“生华”》《中国的家》《岳飞案的另一面》《捺钵文化和比较》《既不“盛世”，也不“修史”，更不“春秋”》主体为概念、制度、史论或当代政论，未整体转为故事条目。",
    "- 《政治椅子学》中的宋太祖撤椅子与前书已有同类故事，孟夫子箕踞又过短，校对轮均不收。",
    "- 《立肺石》《拦路告状不可拦！》主要是制度说明和当代告状案件，暂不收作故事。",
    "- 《烧掉黑资料》《蝙蝠和清流》同主题中只保留情节较完整的故事，删去过短补例。",
    "- 《范仲淹的四大坚持》因连续讲了多个独立掌故，按故事边界拆收并保留。",
    "",
    "## 提取与校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，得到 ${manifest.candidateCount} 条候选。`,
    `- 提取轮入选 ${selections.length} 条；校对轮删除 ${proofreadDrops.size} 条，保留 ${validation.count} 条。`,
    "- 故事正文未改写，均按源文原句截取；长段只截故事本体，尽量排除前后铺陈和政论结论。",
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
  writeCandidateScan();
  const rows = buildRows();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  writeCsv(path.join(OUT_DIR, `${ROUND}.csv`), rows);
  writeTxt(path.join(OUT_DIR, `${ROUND}.txt`), rows);
  const validation = validate(rows);
  const aggregate = writeAggregate();
  const aggregateDuplicatesForThisBook = aggregate.duplicateTextIds.filter((pair) =>
    pair.some((id) => id.startsWith(ID_PREFIX))
  );
  const manifest = {
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    status: STATUS,
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    sourceFileCount: sourceFiles().length,
    candidateScan: CANDIDATE_SCAN,
    candidateCount: candidateCount(),
    selectionCount: selections.length,
    proofreadDropCount: proofreadDrops.size,
    proofreadDrops: Array.from(proofreadDrops, ([title, reason]) => ({ title, reason })),
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "校对轮只保留李敖文中讲成可独立复述、带人物行动、问答、反讽、奇事或明确后果，并用来说明思想、制度、政治伦理或历史判断的小故事、寓言、笑话和掌故；排除纯概念辨析、制度沿革、文献罗列、当代政论材料、李敖自己的议论、只有一句名言/典故名的材料，以及同主题中较弱的补例。",
    excludedByStandard: [
      "纯历史概念、制度沿革、文献罗列和政论判断不收。",
      "当代新闻/政治事件若只是李敖论敌材料，不收。",
      "只有一句典故名、名言、书目或例证，不足以独立复述者不收。",
      "与前书已有同类概念故事者，优先避免重复收录。"
    ],
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `提取轮入选 ${selections.length} 条；校对轮删除 ${proofreadDrops.size} 条，保留 ${rows.length} 条。`,
      "故事正文未改写，均按源文原句截取。",
      "长篇史论中只截取故事本体，尽量删去前后铺陈、制度解释和政论结论。",
      "校对轮删去孟子五百年思想、处女腿生擒洋麒麟、明成祖焚封事、孟夫子箕踞、朱温投清流五条。"
    ],
    aggregateDuplicateTextIds: aggregate.duplicateTextIds,
    generatedAt: new Date().toISOString()
  };
  fs.writeFileSync(
    path.join(OUT_DIR, "story_manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "story_validation.json"),
    `${JSON.stringify(validation, null, 2)}\n`,
    "utf8"
  );
  writeNotes(rows, validation, aggregate, manifest);
  if (!validation.ok) throw new Error(`Validation failed: ${JSON.stringify(validation)}`);
  if (aggregateDuplicatesForThisBook.length) {
    throw new Error(
      `Duplicate story text for ${BOOK}: ${JSON.stringify(aggregateDuplicatesForThisBook)}`
    );
  }
  console.log(
    JSON.stringify(
      {
        book: BOOK,
        rows: rows.length,
        aggregateRows: aggregate.rows.length,
        sourceFileCount: sourceFiles().length,
        candidateCount: candidateCount(),
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
