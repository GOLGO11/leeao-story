const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "独白下的传统";
const SLUG = "dubai_xia_de_chuantong";
const ROUND = "story_round1";
const ID_PREFIX = "DBXDCT";
const SOURCE_ROOT = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "002.精品散文类",
  "003.独白下的传统"
);
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
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
  "dubai_xia_de_chuantong"
];

const selections = [
  {
    file: "001.快看《独白下的传统》.txt",
    title: "文天祥一部十七史从何处说起",
    paragraphs: [5]
  },
  {
    file: "001.快看《独白下的传统》.txt",
    title: "黄宗羲两年读史仍乱人名",
    paragraphs: [6]
  },
  {
    file: "001.快看《独白下的传统》.txt",
    title: "司马光《资治通鉴》只王胜之看完",
    paragraphs: [8]
  },
  {
    file: "001.快看《独白下的传统》.txt",
    title: "法美互笑找不到老爸爸",
    paragraphs: [51]
  },
  {
    file: "001.快看《独白下的传统》.txt",
    title: "刘邦溺儒冠与郑成功焚儒巾",
    paragraphs: [55],
    end: "这一溺一焚之间，真有学问。"
  },
  {
    file: "002.直笔——“乱臣贼子惧”.txt",
    title: "孔子拿刀刻《春秋》",
    paragraphs: [
      7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
      24, 25, 26, 27, 28, 29
    ]
  },
  {
    file: "002.直笔——“乱臣贼子惧”.txt",
    title: "成王桐叶封叔虞",
    paragraphs: [49, 50]
  },
  {
    file: "002.直笔——“乱臣贼子惧”.txt",
    title: "董狐直书赵盾弑君",
    paragraphs: [52, 53, 54, 55]
  },
  {
    file: "002.直笔——“乱臣贼子惧”.txt",
    title: "齐太史兄弟直书崔杼",
    paragraphs: [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68]
  },
  {
    file: "003.避讳——“非常不敢说”.txt",
    title: "冯道学生不敢说《老子》",
    paragraphs: [9, 10, 11, 12, 13, 14, 15, 16, 17]
  },
  {
    file: "003.避讳——“非常不敢说”.txt",
    title: "庄光被避讳成严光",
    paragraphs: [39]
  },
  {
    file: "003.避讳——“非常不敢说”.txt",
    title: "李贺因父讳不得考进士",
    paragraphs: [49]
  },
  {
    file: "003.避讳——“非常不敢说”.txt",
    title: "田登放火三日",
    paragraphs: [51]
  },
  {
    file: "003.避讳——“非常不敢说”.txt",
    title: "王国钧名字断前程",
    paragraphs: [71]
  },
  {
    file: "004.谏诤——“宁鸣而死，不默而生！”.txt",
    title: "比干谏纣被挖心",
    paragraphs: [37]
  },
  {
    file: "004.谏诤——“宁鸣而死，不默而生！”.txt",
    title: "唐太宗怕魏征不去南山",
    paragraphs: [42]
  },
  {
    file: "004.谏诤——“宁鸣而死，不默而生！”.txt",
    title: "唐太宗藏鸟闷死",
    paragraphs: [43]
  },
  {
    file: "004.谏诤——“宁鸣而死，不默而生！”.txt",
    title: "傅良拉住光宗衣服",
    paragraphs: [57, 58, 59]
  },
  {
    file: "004.谏诤——“宁鸣而死，不默而生！”.txt",
    title: "申屠刚头塞车轮",
    paragraphs: [69]
  },
  {
    file: "004.谏诤——“宁鸣而死，不默而生！”.txt",
    title: "陈禾撕破宋徽宗衣",
    paragraphs: [71]
  },
  {
    file: "004.谏诤——“宁鸣而死，不默而生！”.txt",
    title: "朱云请剑斩佞臣",
    paragraphs: [73],
    start: "汉朝成帝的时候"
  },
  {
    file: "004.谏诤——“宁鸣而死，不默而生！”.txt",
    title: "宋太祖弹弓打掉牙",
    paragraphs: [77],
    start: "宋朝的太祖赵匡胤"
  },
  {
    file: "005.传令——全国大跑马.txt",
    title: "汉昭帝识破霍光诬告",
    paragraphs: [65, 66, 67]
  },
  {
    file: "005.传令——全国大跑马.txt",
    title: "杨贵妃一骑红尘荔枝来",
    paragraphs: [71, 72, 73, 74, 75, 76, 77],
    start: "唐朝玄宗"
  },
  {
    file: "005.传令——全国大跑马.txt",
    title: "岳飞十二道金牌",
    paragraphs: [117, 118, 119, 120]
  },
  {
    file: "006.新闻——报纸像杂志.txt",
    title: "张芾请办报被骂",
    paragraphs: [19, 20, 21]
  },
  {
    file: "006.新闻——报纸像杂志.txt",
    title: "《中外纪闻》白送也没人敢收",
    paragraphs: [23, 24, 25, 26],
    start: "当时的中国人",
    end: "最后也拒绝代送了。"
  },
  {
    file: "006.新闻——报纸像杂志.txt",
    title: "《苏报》案章邹入狱",
    paragraphs: [31, 32, 33, 34, 35, 36]
  },
  {
    file: "007.征兆——来头可不小.txt",
    title: "周祖弃子鸟覆翼",
    paragraphs: [33]
  },
  {
    file: "007.征兆——来头可不小.txt",
    title: "刘邦母亲龙孕",
    paragraphs: [36]
  },
  {
    file: "007.征兆——来头可不小.txt",
    title: "隋文帝长角被摔",
    paragraphs: [45]
  },
  {
    file: "007.征兆——来头可不小.txt",
    title: "李世民四岁相士消失",
    paragraphs: [46]
  },
  {
    file: "007.征兆——来头可不小.txt",
    title: "朱全忠红蛇睡相",
    paragraphs: [47]
  },
  {
    file: "007.征兆——来头可不小.txt",
    title: "李克用敲鼓出世烈火护身",
    paragraphs: [48]
  },
  {
    file: "007.征兆——来头可不小.txt",
    title: "朱元璋红光邻人救火",
    paragraphs: [54]
  },
  {
    file: "007.征兆——来头可不小.txt",
    title: "孔夫子黑帝梦与全套异象",
    paragraphs: [59]
  },
  {
    file: "008.吃人——动物吃人，人也吃人.txt",
    title: "孙二娘人肉黑店",
    paragraphs: [7]
  },
  {
    file: "008.吃人——动物吃人，人也吃人.txt",
    title: "李逵割李鬼腿肉",
    paragraphs: [11]
  },
  {
    file: "008.吃人——动物吃人，人也吃人.txt",
    title: "李逵慢割黄文炳",
    paragraphs: [13]
  },
  {
    file: "008.吃人——动物吃人，人也吃人.txt",
    title: "张巡睢阳杀妾给军士吃",
    paragraphs: [65]
  },
  {
    file: "008.吃人——动物吃人，人也吃人.txt",
    title: "广陵围城杀人卖肉",
    paragraphs: [67]
  },
  {
    file: "008.吃人——动物吃人，人也吃人.txt",
    title: "凤翔城人肉不如狗肉",
    paragraphs: [71]
  },
  {
    file: "008.吃人——动物吃人，人也吃人.txt",
    title: "朱粲烹吃小孩女人",
    paragraphs: [101]
  },
  {
    file: "008.吃人——动物吃人，人也吃人.txt",
    title: "赵思绾吞人胆",
    paragraphs: [103]
  },
  {
    file: "008.吃人——动物吃人，人也吃人.txt",
    title: "秦氏姐妹脑浆大腿入药",
    paragraphs: [111]
  },
  {
    file: "008.吃人——动物吃人，人也吃人.txt",
    title: "慈禧割肉骗毁密令",
    paragraphs: [121],
    start: "另一个最富有政治作用的例子"
  },
  {
    file: "009.喝酒——喝也不行，不喝也不行.txt",
    title: "纪昀题酉斋讽铁匠",
    paragraphs: [2, 3, 4, 5, 6, 7, 8]
  },
  {
    file: "009.喝酒——喝也不行，不喝也不行.txt",
    title: "蔡元培只送袁世凯到门口",
    paragraphs: [18]
  },
  {
    file: "009.喝酒——喝也不行，不喝也不行.txt",
    title: "夏禹赶走仪狄戒酒",
    paragraphs: [23]
  },
  {
    file: "009.喝酒——喝也不行，不喝也不行.txt",
    title: "刘章酒史杀外戚",
    paragraphs: [28],
    start: "后来汉高祖死了"
  },
  {
    file: "009.喝酒——喝也不行，不喝也不行.txt",
    title: "孙权拔剑要杀虞翻",
    paragraphs: [30]
  },
  {
    file: "009.喝酒——喝也不行，不喝也不行.txt",
    title: "王恺劝酒杀女",
    paragraphs: [32, 33]
  },
  {
    file: "009.喝酒——喝也不行，不喝也不行.txt",
    title: "刘伶骗妻买五斗酒",
    paragraphs: [35, 36, 37, 38, 39, 40, 41, 42]
  },
  {
    file: "009.喝酒——喝也不行，不喝也不行.txt",
    title: "刘伶死便埋我",
    paragraphs: [43]
  },
  {
    file: "009.喝酒——喝也不行，不喝也不行.txt",
    title: "钟毓钟会偷酒论礼",
    paragraphs: [51, 52],
    start: "钟毓和钟会"
  },
  {
    file: "010.音乐——华夷交响乐.txt",
    title: "孔子听韶三月不知肉味",
    paragraphs: [8],
    start: "韶乐传到春秋时代"
  },
  {
    file: "010.音乐——华夷交响乐.txt",
    title: "孔子正乐败给齐国美女歌曲",
    paragraphs: [9],
    start: "他在鲁国当政"
  },
  {
    file: "010.音乐——华夷交响乐.txt",
    title: "伯牙断弦谢知音",
    paragraphs: [22],
    start: "古人有的一个人弹"
  },
  {
    file: "010.音乐——华夷交响乐.txt",
    title: "南郭先生滥竽充数",
    paragraphs: [24],
    start: "齐宣王的时候"
  },
  {
    file: "010.音乐——华夷交响乐.txt",
    title: "蔺相如逼秦王击缶",
    paragraphs: [25],
    start: "战国时候秦王和赵王"
  },
  {
    file: "011.家族——人愈多愈好.txt",
    title: "曾子被父亲打昏",
    paragraphs: [9],
    start: "曾子有一天种瓜"
  },
  {
    file: "011.家族——人愈多愈好.txt",
    title: "张公艺百忍维持九世同居",
    paragraphs: [34]
  },
  {
    file: "011.家族——人愈多愈好.txt",
    title: "方孝孺被诛十族",
    paragraphs: [40],
    start: "明朝方孝孺"
  },
  {
    file: "012.女性——牌坊要大，金莲要小.txt",
    title: "李林甫弄獐之喜",
    paragraphs: [7, 8, 9],
    start: "唐朝有个宰相叫李林甫"
  },
  {
    file: "012.女性——牌坊要大，金莲要小.txt",
    title: "程颢饿死失节说",
    paragraphs: [51]
  },
  {
    file: "012.女性——牌坊要大，金莲要小.txt",
    title: "戚家寡妇女鬼求旌表",
    paragraphs: [55]
  },
  {
    file: "012.女性——牌坊要大，金莲要小.txt",
    title: "岑德固火山孝子",
    paragraphs: [57]
  },
  {
    file: "012.女性——牌坊要大，金莲要小.txt",
    title: "李鸿章母大脚见西太后",
    paragraphs: [63],
    start: "李鸿章的妈妈也有大脚"
  },
  {
    file: "013.光绪朝对节妇贞女的旌表.txt",
    title: "乔氏存孤后自尽明节",
    paragraphs: [3, 4, 5, 6, 7, 8, 9]
  },
  {
    file: "014.从高玉树为儿子“冥婚”看中国两面文化.txt",
    title: "高玉树为儿子补办冥婚",
    paragraphs: [2],
    start: "5月29号中午"
  },
  {
    file: "014.从高玉树为儿子“冥婚”看中国两面文化.txt",
    title: "曹操为曹冲冥婚",
    paragraphs: [3, 4, 5, 6, 7]
  },
  {
    file: "014.从高玉树为儿子“冥婚”看中国两面文化.txt",
    title: "韦后弟弟冥婚后又离婚",
    paragraphs: [35, 36, 37, 38, 39, 40]
  },
  {
    file: "015.欢喜佛.txt",
    title: "某喇嘛造欢喜佛劝婚",
    paragraphs: [14, 15, 16]
  },
  {
    file: "015.欢喜佛.txt",
    title: "嘉靖大喜殿欢喜佛",
    paragraphs: [31, 32, 33]
  },
  {
    file: "016.中国民族“性”.txt",
    title: "秦宣太后以性喻救韩",
    paragraphs: [23, 24, 25, 26, 27]
  },
  {
    file: "016.中国民族“性”.txt",
    title: "陈灵公夏姬内衣戏朝",
    paragraphs: [28, 29, 30]
  },
  {
    file: "017.人能感动蝙蝠论.txt",
    title: "韩愈祭文逐鳄鱼",
    paragraphs: [21, 22, 23],
    start: "唐朝的韩愈到潮州",
    end: "据说鳄鱼看了他的文章，就都搬走了。"
  },
  {
    file: "017.人能感动蝙蝠论.txt",
    title: "孔庙斋戒作文驱蝙蝠",
    paragraphs: [33, 34, 35, 36, 37, 38, 39, 40, 41]
  },
  {
    file: "017.人能感动蝙蝠论.txt",
    title: "冯希乐说老虎过路",
    paragraphs: [45]
  },
  {
    file: "018.人能感动老虎论.txt",
    title: "童恢审问两只老虎",
    paragraphs: [23, 24, 25, 26, 27]
  },
  {
    file: "018.人能感动老虎论.txt",
    title: "张昺限虎五日到庭",
    paragraphs: [47],
    start: "有寡妇止一人"
  },
  {
    file: "019.鼓声咚咚的中国之音.txt",
    title: "涂山氏误鼓见熊生启",
    paragraphs: [9]
  },
  {
    file: "019.鼓声咚咚的中国之音.txt",
    title: "宋襄公不鼓未成列",
    paragraphs: [11],
    start: "这个是不该击而击，击出了祸",
    end: "我也不向没摆好阵势的敌人鸣鼓而攻。”(11)"
  },
  {
    file: "019.鼓声咚咚的中国之音.txt",
    title: "曹刿一鼓作气",
    paragraphs: [11],
    start: "中国历史上，有个最能把握击鼓时机的纪录"
  },
  {
    file: "019.鼓声咚咚的中国之音.txt",
    title: "邵广二子击登闻鼓乞恩",
    paragraphs: [36]
  },
  {
    file: "019.鼓声咚咚的中国之音.txt",
    title: "青文胜鼓下自经",
    paragraphs: [40, 41, 42]
  },
  {
    file: "019.鼓声咚咚的中国之音.txt",
    title: "张反击登闻鼓救夫",
    paragraphs: [48],
    start: "张反的丈夫"
  },
  {
    file: "020.一种失传了的言论道具.txt",
    title: "蔡京复相尽逐求言者",
    paragraphs: [42, 43],
    end: "善类于是尽矣！"
  },
  {
    file: "021.记一个不合作主义者.txt",
    title: "李可从拔牙出战",
    paragraphs: [9]
  },
  {
    file: "021.记一个不合作主义者.txt",
    title: "李二曲劝母不殉夫",
    paragraphs: [11]
  },
  {
    file: "021.记一个不合作主义者.txt",
    title: "李二曲母教他自学",
    paragraphs: [13]
  },
  {
    file: "021.记一个不合作主义者.txt",
    title: "李二曲徒步寻父遗骨",
    paragraphs: [15]
  },
  {
    file: "021.记一个不合作主义者.txt",
    title: "李二曲拒绝回拜收礼",
    paragraphs: [17]
  },
  {
    file: "021.记一个不合作主义者.txt",
    title: "李二曲被抬床强召",
    paragraphs: [47]
  },
  {
    file: "021.记一个不合作主义者.txt",
    title: "李二曲敷衍谢表",
    paragraphs: [49, 50, 51]
  }
];

const proofreadDrops = new Set([
  "黄宗羲两年读史仍乱人名",
  "司马光《资治通鉴》只王胜之看完",
  "张芾请办报被骂",
  "《苏报》案章邹入狱",
  "广陵围城杀人卖肉",
  "凤翔城人肉不如狗肉",
  "朱粲烹吃小孩女人",
  "赵思绾吞人胆",
  "秦氏姐妹脑浆大腿入药",
  "程颢饿死失节说",
  "高玉树为儿子补办冥婚",
  "嘉靖大喜殿欢喜佛"
]);

function readGb18030(filePath) {
  return new TextDecoder("gb18030").decode(fs.readFileSync(filePath));
}

function stripNoise(text) {
  return text
    .replace(/\r\n/g, "\n")
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
    const paragraphs = splitParagraphs(readGb18030(fullPath));
    const byIndex = new Map(paragraphs.map((paragraph) => [paragraph.index, paragraph]));
    const byLine = new Map();
    paragraphs.forEach((paragraph) => {
      for (let line = paragraph.lineStart; line <= paragraph.lineEnd; line += 1) {
        byLine.set(line, paragraph);
      }
    });
    cache.set(fileName, { byIndex, byLine, paragraphs });
  }
  return cache.get(fileName);
}

const titleStopChars = new Set(
  "的一是在和与及把被给为之了而以于不有来去成说论看中下上出入做"
);

function titleScore(title, text) {
  const chars = [...new Set([...title].filter((char) => /\p{Script=Han}/u.test(char)))].filter(
    (char) => !titleStopChars.has(char)
  );
  return chars.reduce((score, char) => score + (text.includes(char) ? 1 : 0), 0);
}

function uniqueParagraphs(paragraphs) {
  const seen = new Set();
  return paragraphs.filter((paragraph) => {
    if (!paragraph || seen.has(paragraph.index)) return false;
    seen.add(paragraph.index);
    return true;
  });
}

function paragraphsByIndex(lookup, locators) {
  return uniqueParagraphs(locators.map((locator) => lookup.byIndex.get(locator)));
}

function paragraphsByLine(lookup, locators, offset = 0) {
  return uniqueParagraphs(locators.map((locator) => lookup.byLine.get(locator + offset)));
}

function chooseParagraphs(selection, lookup) {
  const candidates = [
    paragraphsByIndex(lookup, selection.paragraphs),
    paragraphsByLine(lookup, selection.paragraphs),
    paragraphsByLine(lookup, selection.paragraphs, 1),
    paragraphsByLine(lookup, selection.paragraphs, -1),
    paragraphsByLine(lookup, selection.paragraphs, 2),
    paragraphsByLine(lookup, selection.paragraphs, -2)
  ].filter((paragraphs) => paragraphs.length);

  if (!candidates.length) {
    throw new Error(`${selection.file} missing locators ${selection.paragraphs.join(",")}`);
  }

  let best = candidates[0];
  let bestScore = -Infinity;
  candidates.forEach((paragraphs, candidateIndex) => {
    const text = paragraphs.map((paragraph) => paragraph.text).join("\n\n");
    let score = titleScore(selection.title, text) * 10;
    if (selection.start) score += text.includes(selection.start) ? 1000 : -1000;
    if (selection.end) score += text.includes(selection.end) ? 1000 : -1000;
    if (candidateIndex === 0) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = paragraphs;
    }
  });
  return best;
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
  return selections.filter((selection) => !proofreadDrops.has(selection.title)).map((selection, index) => {
    const lookup = getParagraphMap(selection.file, cache);
    const paragraphs = chooseParagraphs(selection, lookup);
    const storyText = sliceText(paragraphs.map((paragraph) => paragraph.text).join("\n\n"), selection);
    const lineStart = paragraphs[0].lineStart;
    const lineEnd = paragraphs[paragraphs.length - 1].lineEnd;
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: `${ID_PREFIX}_${selection.file.slice(0, 3)}_${selection.paragraphs.join("_")}`,
      source_file: selection.file,
      source_lines: `${lineStart}-${lineEnd}`,
      char_count: [...storyText].length,
      story_text: storyText
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
  fs.writeFileSync(filePath, rows.length ? `${blocks.join("\n\n---\n\n")}\n` : "", "utf8");
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
    ok: duplicateTextIds.length === 0 && rows.every((row) => Number(row.char_count) > 0),
    book: BOOK,
    slug: SLUG,
    round: ROUND,
    count: rows.length,
    totalChars: rows.reduce((sum, row) => sum + Number(row.char_count || 0), 0),
    minChars: rows.length ? Math.min(...rows.map((row) => Number(row.char_count || 0))) : 0,
    maxChars: rows.length ? Math.max(...rows.map((row) => Number(row.char_count || 0))) : 0,
    duplicateTextIds
  };
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
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
    sourceRoot: path.relative(ROOT, SOURCE_ROOT),
    sourceFiles: sourceFiles(),
    selectionCount: selections.length,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    excludedByStandard: [
      "导论性说明、字义训诂、制度沿革和资料清单",
      "只有一行记录但未展开人物行动的例子",
      "长篇引文中纯理论或纯文献出处",
      "李敖自己的评论、附记和当下论战"
    ],
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(OUT_DIR, "story_manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "story_validation.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");

  if (!validation.ok) {
    throw new Error(`Validation failed for ${BOOK}`);
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
