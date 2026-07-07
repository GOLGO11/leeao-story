const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖语妙天下";
const SLUG = "li_ao_yumiao_tianxia";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "LAYM";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "003",
    paragraph: 5,
    title: "空城计退司马懿",
    start: "空城计是说",
    end: "这就是典型的空城计。"
  },
  {
    prefix: "005",
    paragraph: 3,
    title: "汉学家说诸葛亮是音乐家",
    start: "过去研究中国的一个外国历史学者",
    end: "所以闹过这些笑话。"
  },
  {
    prefix: "005",
    paragraph: 3,
    title: "汉学家说陶渊明是斜眼",
    start: "还有一个笑话，也是外国的汉学家所说的",
    end: "所以陶渊明，叫做陶斜眼。"
  },
  {
    prefix: "005",
    paragraph: 6,
    title: "曹操疑华佗养病",
    start: "曹操时代有一个有名的医生",
    end: "曹操想不到杀了华佗有这么严重的后果。"
  },
  {
    prefix: "006",
    paragraph: 7,
    title: "曹冲死后冥婚立后",
    start: "现在我们又看到了，看到了曹操的故事。",
    end: "这样子才有意义，才有深度。"
  },
  {
    prefix: "010",
    paragraphs: [9, 10],
    title: "灰色马英雄回国赴死",
    start: "刚才我跟大家谈到西班牙内战",
    end: "可是为了一个小男孩子的梦，他回去了。"
  },
  {
    prefix: "010",
    paragraphs: [13, 14],
    title: "项羽乌江赠马赠头",
    start: "现在我谈到了",
    end: "可是项羽最后把他头做了人情。"
  },
  {
    prefix: "011",
    paragraph: 6,
    title: "俄国的一月二月将军",
    start: "先插播一个故事",
    end: "大家注意有趣的说法，尼古拉一世。"
  },
  {
    prefix: "012",
    paragraph: 10,
    title: "布莱克诗里的叹息夺爱",
    start: "我给大家讲，我手里拿着一本诗选",
    end: "只用一个暗示就可以抓到女人。"
  },
  {
    prefix: "013",
    paragraph: 3,
    title: "拳击手边打边打点滴",
    start: "我举个例子，大家看这张漫画",
    end: "虽然没有规定不可以，可事实上你不可以一边打拳、一边打点滴。"
  },
  {
    prefix: "014",
    paragraph: 5,
    title: "坏人投胎要做母狗",
    start: "先给大家讲一个笑话",
    end: "笑话！"
  },
  {
    prefix: "016",
    paragraph: 5,
    title: "张苍凭一身白肉免死",
    start: "《史记》讲到张丞相列传",
    end: "还可以喝女人的奶水来活。"
  },
  {
    prefix: "017",
    paragraph: 6,
    title: "曹操赎回蔡文姬",
    start: "后来曹操稳定了中原",
    end: "这是有名的一个故事。"
  },
  {
    prefix: "018",
    paragraph: 3,
    title: "阿里斯泰迪斯代写放逐票",
    start: "希腊有一个有名的政治家",
    end: "大家受不了了。"
  },
  {
    prefix: "028",
    paragraph: 8,
    title: "麦克阿瑟不给杜鲁门敬礼",
    start: "杜鲁门总统跟一个美国的骄兵悍将",
    end: "现在又来了，他的继任者杜鲁门也讲狗粮养的。"
  },
  {
    prefix: "032",
    paragraph: 4,
    title: "听诊器由纸筒发明",
    start: "听诊器怎么来的？",
    end: "需要工具，需要方法。"
  },
  {
    prefix: "036",
    paragraph: 7,
    title: "碧姬芭铎阉邻居公驴",
    start: "刚才我谈到法国过气的",
    end: "问题就麻烦了。"
  },
  {
    prefix: "037",
    paragraph: 16,
    title: "小女孩问为何不找高个跳芭蕾",
    start: "一个有钱的妈妈",
    end: "为什么不找高一点的人来跳？"
  },
  {
    prefix: "039",
    paragraph: 3,
    title: "撒切尔先安慰闯祸女仆",
    start: "就是她请客的时候",
    end: "赶紧换西装。"
  },
  {
    prefix: "039",
    paragraph: 24,
    title: "屠格涅夫握乞丐的手",
    start: "俄国的文学家屠格涅夫有一个故事",
    end: "不一定说非给钱不可。"
  },
  {
    prefix: "040",
    paragraph: 11,
    title: "闯红灯只因没看见警察",
    start: "他讲了一个笑话",
    end: "不能够当真的。"
  },
  {
    prefix: "043",
    paragraph: 16,
    title: "牛津黑人用叉子吃人肉",
    start: "讲到一个英国的探险家",
    end: "这个笑话就正好来描写了，刚才我所说的这些东西，是用西餐的叉子来吃人肉。"
  },
  {
    prefix: "043",
    paragraph: 17,
    title: "王三姑娘饿死殉夫",
    start: "中国的一部小说《儒林外史》",
    end: "很戏谑性的，讽刺性的历史。"
  },
  {
    prefix: "047",
    paragraph: 2,
    title: "杰克逊身上的子弹归杰克逊",
    start: "多少年以后啊，杰克逊当了总统",
    end: "有这么一个有趣的，敌友之间转变的一个佳话，就是这个故事。"
  },
  {
    prefix: "047",
    paragraphs: [5, 6],
    title: "俾斯麦不敢吃香肠决斗",
    start: "又来了，德国的，这个决斗最多的国家。",
    end: "这就是整个的过程。"
  },
  {
    prefix: "047",
    paragraph: 6,
    title: "刘邦斗智不斗力",
    start: "为什么这么笨呢？大家看看项羽跟刘邦",
    end: "我不跟你这样玩。"
  },
  {
    prefix: "047",
    paragraphs: [6, 7, 8],
    title: "韩信忍胯下之辱",
    start: "还有呢，就是韩信。",
    end: "就这么一个故事。"
  },
  {
    prefix: "050",
    paragraph: 8,
    title: "袁枚母亲临终擦泪",
    start: "我讲一个动人的小故事",
    end: "天下还有还有不死的人吗？"
  },
  {
    prefix: "051",
    paragraph: 12,
    title: "保险公司四十五楼就赔钱",
    start: "我剪下一本书来",
    end: "证明了我们保险公司的效率，信用多么好。"
  },
  {
    prefix: "051",
    paragraph: 12,
    title: "三个小孩比爸爸谁快",
    start: "我就想到这个故事，小孩子比赛什么是快",
    end: "所以我爸爸比你们爸爸全快。"
  },
  {
    prefix: "052",
    paragraph: 3,
    title: "林肯要买格兰特喝的酒",
    start: "格兰特是什么人？",
    end: "你告诉我是哪一种牌子，我买给他喝，林肯总统的了不起就是通情达理。"
  },
  {
    prefix: "052",
    paragraph: 14,
    title: "新加坡蜜蜂也会好吃懒做",
    start: "我讲个笑话给大家听",
    end: "因为环境使它改变了。"
  },
  {
    prefix: "056",
    paragraphs: [5, 6, 7],
    title: "商山四皓替太子撑腰",
    start: "大家看最早一个故事。",
    end: "当时有这么一个整个的故事，我讲给大家听。"
  },
  {
    prefix: "057",
    paragraph: 3,
    title: "吉姆爵爷两次逃与不逃",
    start: "英国有一个文学家叫做康拉德",
    end: "有的时候第二次做的事情是比你第一次做的更完整，更补偿了第一次的遗憾。"
  },
  {
    prefix: "062",
    paragraph: 2,
    title: "两个女人躲过敌人却遇自己人",
    start: "在1961年演过一部电影叫做Two Women",
    end: "当然苏非亚罗兰演的是深受其害，就是碰到自己人的时候，并非碰到救星。"
  },
  {
    prefix: "065",
    paragraph: 11,
    title: "凯撒看见布鲁塔斯",
    start: "当凯撒拿着小匕首",
    end: "今天还没有过去，今天不能让它过去。"
  },
  {
    prefix: "067",
    paragraph: 3,
    title: "欧阳修从大姨夫变小姨夫",
    start: "大家看宋朝的欧阳修",
    end: "有这么一个典故。"
  },
  {
    prefix: "072",
    paragraph: 6,
    title: "明武宗大圈圈小圈圈",
    start: "我们看戏剧里面有一部戏叫做《游龙戏凤》",
    end: "明武宗调戏李凤姐，说他这个圈圈论。"
  },
  {
    prefix: "076",
    paragraph: 10,
    title: "袁了凡算茶壶命丧棍下",
    start: "袁了凡从此做了大官",
    end: "就是人有命，一个茶壶都有命。"
  },
  {
    prefix: "078",
    paragraph: 6,
    title: "董其昌家里养假董其昌",
    start: "刚才我谈到讲过行万里路",
    end: "真的画画给他。"
  },
  {
    prefix: "078",
    paragraph: 6,
    title: "毕加索也画假毕加索",
    start: "毕加索也干这个事情",
    end: "所以他们自己来造自己的假画。"
  },
  {
    prefix: "085",
    paragraph: 4,
    title: "精神病人怕鸡不知道",
    start: "有以个笑话是说",
    end: "你以为在鸡身上。"
  },
  {
    prefix: "085",
    paragraph: 11,
    title: "丘吉尔愿喝毒咖啡",
    start: "有一次，有一次跟英国的首相丘吉尔干上了",
    end: "我不要活。"
  },
  {
    prefix: "085",
    paragraph: 11,
    title: "丘吉尔陪大使还叉子",
    start: "还有一个传说，是在英国的国宴里面",
    end: "现挂，就是机智，机智的不得了。"
  },
  {
    prefix: "087",
    paragraph: 13,
    title: "曹操捉刀见匈奴使",
    start: "三国时候曹操有一个故事",
    end: "威严是很重要的一个象征。"
  },
  {
    prefix: "090",
    paragraph: 2,
    title: "马克吐温叫朋友也搬床",
    start: "美国文学家马克·吐温",
    end: "然后来表达我们的思想。"
  },
  {
    prefix: "090",
    paragraph: 13,
    title: "爱因斯坦说三战以后用什么打",
    start: "一个笑话，爱因斯坦说的",
    end: "可以把整个未来都给你毁掉。"
  },
  {
    prefix: "092",
    paragraph: 5,
    title: "北非谍影成全情敌",
    start: "当年老一辈的人都看过这部电影",
    end: "劳燕分飞。"
  },
  {
    prefix: "092",
    paragraph: 5,
    title: "玛丽安德森为旅馆歌迷唱歌",
    start: "我举个例子给大家看，大家看这个人叫玛丽安德森",
    end: "可是我会过来单独为你唱一首。"
  },
  {
    prefix: "092",
    paragraph: 5,
    title: "西贝流士嫌屋顶太矮",
    start: "玛丽安德森在芬兰的大音乐家",
    end: "他的感觉是我家的屋顶太矮了。"
  },
  {
    prefix: "094",
    paragraph: 2,
    title: "林肯讲两匹马分两次死",
    start: "先给大家讲一个笑话",
    end: "太伤心了。"
  },
  {
    prefix: "095",
    paragraph: 4,
    title: "柯立芝夫妇参观养鸡场",
    start: "柯立芝是有名的沉默寡言的总统",
    end: "你赶紧跑过去告诉总统夫人这个情况。"
  },
  {
    prefix: "095",
    paragraph: 5,
    title: "丈夫转生成种猪",
    start: "先讲一个笑话，一对夫妻",
    end: "所以每天有性生活，可是并不能够乐在其中。"
  },
  {
    prefix: "096",
    paragraph: 3,
    title: "哈台说自己卖牙签",
    start: "有一次有个电影有一个对话",
    end: "我是卖牙签的。"
  },
  {
    prefix: "097",
    paragraph: 4,
    title: "宋仁宗夜里不点烧羊",
    start: "宋朝有一个有名的皇帝",
    end: "就是这么样的麻烦。"
  },
  {
    prefix: "097",
    paragraph: 4,
    title: "宋仁宗渴了不叫水官",
    start: "还有一次，他的这个出来",
    end: "让他人受到处分。"
  },
  {
    prefix: "097",
    paragraph: 4,
    title: "旅馆大王半夜要苹果",
    start: "美国也有一个人，他叫做Statler",
    end: "人有的时候要忍耐，要体谅别人。"
  },
  {
    prefix: "097",
    paragraph: 5,
    title: "胡适不洗澡怕麻烦服务生",
    start: "胡适去住旅馆的时候",
    end: "他宁肯不洗澡。"
  },
  {
    prefix: "097",
    paragraph: 5,
    title: "胡适承认没讲过的话",
    start: "胡适还有一个故事",
    end: "可是他的用心，非常地令我们觉得好，觉得有趣。"
  },
  {
    prefix: "099",
    paragraph: 9,
    title: "吴大猷说物理太好没得奖",
    start: "人家就问他",
    end: "这就是吴大猷。"
  },
  {
    prefix: "099",
    paragraph: 13,
    title: "女孩说在这个地方被强奸",
    start: "请大家看在美国陪审制度底下",
    end: "他又没有答错，就变成漫画。"
  },
  {
    prefix: "103",
    paragraph: 9,
    title: "黄山谷把腿伸出城楼淋雨",
    start: "他有一次就移送到一个地方",
    end: "这个细腻的感觉就是黄山谷所有的"
  },
  {
    prefix: "103",
    paragraph: 10,
    title: "芸娘把素云放进丈夫怀里",
    start: "《浮生六记》有一个故事很好玩的",
    end: "所以林语堂严格讲是翻译错了。"
  },
  {
    prefix: "104",
    paragraph: 7,
    title: "克里蒙梭不死在女人面前",
    start: "有一个老先生",
    end: "在法国被称为老虎总理。"
  },
  {
    prefix: "107",
    paragraph: 7,
    title: "于右任请女明星看看也好",
    start: "有一天请客",
    end: "不过呢看看也好。"
  },
  {
    prefix: "110",
    paragraph: 12,
    title: "蔡元培片言解学生纠纷",
    start: "我爸爸在北京大学做学生的时候",
    end: "请看李敖语妙天下。"
  },
  {
    prefix: "112",
    paragraph: 5,
    title: "庖丁解牛知道窍门",
    start: "中国历史上一个有名的故事",
    end: "因为他知道窍，窍门的窍。"
  },
  {
    prefix: "112",
    paragraph: 10,
    title: "浑沌被凿七窍而死",
    start: "我们念中国的《庄子》这个故事",
    end: "这些人其实是很可怕的。"
  },
  {
    prefix: "112",
    paragraph: 11,
    title: "德国参谋本部四类军人",
    start: "德国的参谋本部有个笑话",
    end: "这种人会闯祸，又笨又勤快的。"
  }
];

const proofreadDrops = [
  {
    title: "俄国的一月二月将军",
    reason: "更像一句历史说法/比喻，没有完整人物行动和故事反转。"
  },
  {
    title: "爱因斯坦说三战以后用什么打",
    reason: "只是单句问答笑话，情节过薄，不作为独立故事。"
  },
  {
    title: "西贝流士嫌屋顶太矮",
    reason: "更像一句赞美妙语，缺少可独立复述的小故事结构。"
  }
];

const proofreadTrims = [
  {
    title: "凯撒看见布鲁塔斯",
    end: "就死了。",
    reason: "原条目后半转入翻译优劣和节目论述，校对轮收束到凯撒遇刺故事本体。"
  },
  {
    title: "曹操捉刀见匈奴使",
    end: "魏武闻之，追杀此使。",
    reason: "原条目后半转入台湾教授译法和威严分析，校对轮收束到《世说新语》故事本体。"
  },
  {
    title: "黄山谷把腿伸出城楼淋雨",
    end: "他说那种感觉，我生平没有这样的快乐过。",
    reason: "原条目后半转入香气与书法感觉，校对轮只留黄山谷困中取乐的故事。"
  },
  {
    title: "芸娘把素云放进丈夫怀里",
    end: "真正的女人是不经意地碰到了、摸到了，这才是会摸女人的人。",
    reason: "原条目结尾转入林语堂翻译评论，校对轮收束到《浮生六记》故事和李敖原文收束语。"
  }
];

const proofreadDropTitles = new Set(proofreadDrops.map((item) => item.title));
const proofreadTrimMap = new Map(
  proofreadTrims.map((item) => [item.title, Object.fromEntries(Object.entries(item).filter(([key]) => key !== "reason"))])
);

const excludedByStandard = [
  "李敖自己的参选、坐牢、家庭、交友、节目现场和文物收藏经历不直接收录，除非段内转述的是独立外部故事。",
  "主持人或来宾引出的故事不直接收，必须是李敖接着复述并讲成完整故事的内容。",
  "纯时政论证、人物评议、资料展示、书目说明、语词考据和单句比喻，缺少人物行动或情节反转的不列为故事。",
  "同一段里连续出现多个故事时，拆成可独立阅读的小条目；只保留故事本体和必要的原文收束语。",
  "低俗笑话或性笑话只在情节完整、且明显服务于李敖论证时保留。"
];

const candidateMarkers = [
  "故事",
  "笑话",
  "典故",
  "寓言",
  "漫画",
  "小说",
  "电影",
  "有一次",
  "有一天",
  "忽然",
  "结果",
  "后来",
  "最后",
  "问",
  "回答",
  "说"
];

const footerPatterns = [
  "李敖影音E书",
  "李敖数字博物馆",
  "李敖资源下载站",
  "李敖导航站",
  "油管/抖音",
  "www.LaoBox.com",
  "大李敖全集"
];

function findSourceRoot() {
  const editionRoot = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!editionRoot) throw new Error("Missing 大李敖全集6.0 source directory");
  const editionPath = path.join(ROOT, editionRoot);
  const category = fs.readdirSync(editionPath).find((name) => name.startsWith("010."));
  if (!category) throw new Error("Missing 010.节目演讲类 source directory");
  const categoryPath = path.join(editionPath, category);
  const bookDir = fs.readdirSync(categoryPath).find((name) => name.startsWith("009."));
  if (!bookDir) throw new Error("Missing 009.李敖语妙天下 source directory");
  return path.join(categoryPath, bookDir);
}

const SOURCE_ROOT = findSourceRoot();

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_ROOT)
    .filter((name) => /^\d{3}\..*\.txt$/u.test(name))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));
}

function stripFooter(text) {
  const lines = text.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n").split("\n");
  const footerIndex = lines.findIndex((line) =>
    footerPatterns.some((pattern) => line.includes(pattern))
  );
  return (footerIndex >= 0 ? lines.slice(0, footerIndex) : lines).join("\n").trim();
}

function readSource(fileName) {
  return stripFooter(
    decoder.decode(fs.readFileSync(path.join(SOURCE_ROOT, fileName))).replace(/^\uFEFF/u, "")
  );
}

function splitParagraphObjects(text) {
  const lines = text.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n").split("\n");
  const paragraphs = [];
  let buffer = [];
  let startLine = 0;

  const flush = (endLine) => {
    const paragraph = buffer
      .map((line) => line.trim())
      .join(" ")
      .replace(/\s+/gu, " ")
      .trim();
    if (paragraph) paragraphs.push({ text: paragraph, startLine, endLine });
    buffer = [];
    startLine = 0;
  };

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    if (!line.trim()) {
      if (buffer.length) flush(lineNo - 1);
      return;
    }
    if (!buffer.length) startLine = lineNo;
    buffer.push(line);
  });
  if (buffer.length) flush(lines.length);
  return paragraphs;
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!fileName) throw new Error(`Missing source file for prefix ${prefix}`);
  return fileName;
}

function paragraphForSelection(selection) {
  const fileName = fileForPrefix(selection.prefix);
  const paragraphs = splitParagraphObjects(readSource(fileName));
  const pick = (number) => {
    const paragraph = paragraphs[Number(number) - 1];
    if (!paragraph) throw new Error(`Missing paragraph ${number} in ${fileName}`);
    return { paragraphNumber: Number(number), ...paragraph };
  };

  if (Array.isArray(selection.paragraphs)) {
    const picked = selection.paragraphs.map(pick);
    return {
      fileName,
      sourceId: picked.map((paragraph) => `${selection.prefix}#P${paragraph.paragraphNumber}`).join(";"),
      sourceLines: picked.map((paragraph) => `${paragraph.startLine}-${paragraph.endLine}`).join(";"),
      text: picked.map((paragraph) => paragraph.text).join("\n\n")
    };
  }

  const paragraph = pick(selection.paragraph);
  return {
    fileName,
    sourceId: `${selection.prefix}#P${selection.paragraph}`,
    sourceLines: `${paragraph.startLine}-${paragraph.endLine}`,
    text: paragraph.text
  };
}

function selectedText(selection, paragraphText) {
  let text = paragraphText;
  if (selection.start) {
    const startIndex = text.indexOf(selection.start);
    if (startIndex < 0) throw new Error(`Start marker not found for ${selection.title}`);
    text = text.slice(startIndex);
  }
  if (selection.end) {
    const endIndex = text.indexOf(selection.end);
    if (endIndex < 0) throw new Error(`End marker not found for ${selection.title}`);
    text = text.slice(0, endIndex + selection.end.length);
  }
  return text.trim();
}

function charCount(text) {
  return Array.from(text).length;
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/gu, "");
}

function buildRows() {
  return selections.filter((selection) => !proofreadDropTitles.has(selection.title)).map((selection, index) => {
    const effectiveSelection = { ...selection, ...(proofreadTrimMap.get(selection.title) || {}) };
    const paragraph = paragraphForSelection(effectiveSelection);
    const storyText = selectedText(effectiveSelection, paragraph.text);
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: effectiveSelection.title,
      source_ids: paragraph.sourceId,
      source_file: paragraph.fileName,
      source_lines: paragraph.sourceLines,
      char_count: charCount(storyText),
      story_text: storyText
    };
  });
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (/[",\r\n]/u.test(stringValue)) return `"${stringValue.replace(/"/gu, '""')}"`;
  return stringValue;
}

function writeCsv(filePath, rows) {
  const columns = [
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
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const body = rows
    .map((row) =>
      [
        `【${row.id}】${row.title}`,
        `书名：${row.book}`,
        `来源：${row.source_file}:${row.source_lines}`,
        `字数：${row.char_count}`,
        "",
        row.story_text,
        "---"
      ].join("\n")
    )
    .join("\n\n");
  fs.writeFileSync(filePath, `${body}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') inQuotes = true;
    else if (char === ",") {
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
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...records] = rows.filter((item) => item.length > 1 || item[0]);
  if (!header) return [];
  const columns = header.map((column) => column.replace(/^\uFEFF/u, ""));
  return records.map((record) =>
    Object.fromEntries(columns.map((column, index) => [column, record[index] ?? ""]))
  );
}

function readRowsFromCsv(filePath) {
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function normalizeAggregateRow(row, bookSlug) {
  const storyText = row.story_text || row.text || "";
  return {
    id: row.id,
    book: row.book,
    book_slug: row.book_slug || bookSlug || "",
    title: row.title,
    source_ids: row.source_ids || row.source_id || "",
    source_file: row.source_file,
    source_lines:
      row.source_lines || [row.source_line_start, row.source_line_end].filter(Boolean).join("-"),
    char_count: row.char_count || charCount(storyText),
    story_text: storyText
  };
}

function duplicateTextPairs(rows) {
  const seen = new Map();
  const duplicates = [];
  rows.forEach((row) => {
    const normalized = normalizeText(row.story_text);
    if (seen.has(normalized)) duplicates.push([seen.get(normalized), row.id]);
    else seen.set(normalized, row.id);
  });
  return duplicates;
}

function existingBookOrder() {
  const aggregatePath = path.join(ROOT, "data", "all_stories.csv");
  if (!fs.existsSync(aggregatePath)) return [];
  const order = [];
  readRowsFromCsv(aggregatePath).forEach((row) => {
    const slug = row.book_slug;
    if (slug && !order.includes(slug)) order.push(slug);
  });
  return order;
}

function buildAggregateRows() {
  const booksRoot = path.join(ROOT, "data", "books");
  const slugs = fs
    .readdirSync(booksRoot)
    .filter((slug) => fs.existsSync(path.join(booksRoot, slug, `${ROUND}.csv`)));
  const order = existingBookOrder();
  const orderedSlugs = [
    ...order.filter((slug) => slugs.includes(slug)),
    ...slugs.filter((slug) => !order.includes(slug)).sort()
  ];
  return orderedSlugs.flatMap((slug) =>
    readRowsFromCsv(path.join(booksRoot, slug, `${ROUND}.csv`)).map((row) =>
      normalizeAggregateRow(row, slug)
    )
  );
}

function writeAggregate() {
  const rows = buildAggregateRows();
  const books = [];
  rows.forEach((row) => {
    let book = books.find((item) => item.slug === row.book_slug);
    if (!book) {
      book = { book: row.book, slug: row.book_slug, count: 0 };
      books.push(book);
    }
    book.count += 1;
  });

  writeCsv(path.join(ROOT, "data", "all_stories.csv"), rows);
  writeTxt(path.join(ROOT, "data", "all_stories.txt"), rows);

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
  if (/故事|笑话|轶事|趣闻|典故|寓言|成语|漫画|电影|小说/u.test(paragraph)) score += 8;
  if (/我.*讲|告诉大家|举个例子|先给大家讲|有一次|有一天/u.test(paragraph)) score += 3;
  if (/问|答|说|结果|后来|忽然|最后|杀|逃|投降|拒绝/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 2) score += 2;
  if (paragraph.length > 90 && paragraph.length < 1200) score += 1;
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphObjects(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.text.includes(marker));
      const quoteHeavy = (paragraph.text.match(/[“”]/gu) || []).length >= 4;
      if (!found.length && !quoteHeavy) return;
      const score = candidateScore(paragraph.text, found);
      if (score < 10 && !quoteHeavy) return;
      rows.push({
        file: fileName,
        paragraph: index + 1,
        score,
        markers: found.join("|"),
        text: paragraph.text.replace(/\s+/gu, " ").slice(0, 900)
      });
    });
  }
  rows.sort(
    (a, b) =>
      b.score - a.score ||
      a.file.localeCompare(b.file, "zh-Hans-CN", { numeric: true }) ||
      a.paragraph - b.paragraph
  );
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
  const text = fs.readFileSync(candidatePath, "utf8").trim();
  return text ? Math.max(0, text.split(/\r?\n/u).length - 1) : 0;
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 李敖语妙天下故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮初选：${manifest.originalExtractionCount} 条`,
    `- 校对删除：${manifest.proofreadDropCount} 条`,
    `- 校对补入：${manifest.proofreadAddCount} 条`,
    `- 校对修边：${manifest.proofreadTrimCount} 条`,
    `- 校对保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《李敖语妙天下》是节目逐字稿，时政评论、节目串场、李敖自身经历和资料展示很多。校对轮继续只收李敖讲成可独立复述、带人物行动或问答反转、并用来说明一个道理的小故事、笑话、典故、小说/电影故事和历史掌故；标题压缩，正文保持源文原句。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 校对删除",
    "",
    ...(proofreadDrops.length
      ? proofreadDrops.map((item) => `- ${item.title}：${item.reason}`)
      : ["- 无"]),
    "",
    "## 校对修边",
    "",
    ...(proofreadTrims.length
      ? proofreadTrims.map((item) => `- ${item.title}：${item.reason}`)
      : ["- 无"]),
    "",
    "## 校对补入",
    "",
    "- 无",
    "",
    "## 提取说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 提取轮初选 ${manifest.originalExtractionCount} 条；校对轮删除 ${manifest.proofreadDropCount} 条、补入 ${manifest.proofreadAddCount} 条、修边 ${manifest.proofreadTrimCount} 条，保留 ${validation.count} 条。`,
    "- 正文均来自源文原段或段内原文截取，没有改写。",
    "- 本书故事密度高但杂讯也高，校对轮建议重点复核性笑话、时政夹带故事和较长电影/历史故事的边界。",
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
  if (!fs.existsSync(SOURCE_ROOT)) throw new Error(`Missing source root: ${SOURCE_ROOT}`);
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
    originalExtractionCount: selections.length,
    selectionCount: selections.length,
    proofreadDropCount: proofreadDrops.length,
    proofreadDrops,
    proofreadTrimCount: proofreadTrims.length,
    proofreadTrims,
    proofreadAddCount: 0,
    proofreadAdds: [],
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖亲自讲成可独立复述、带人物行动或问答反转、并用于说明道理的小故事、笑话、典故、古书掌故、小说/电影故事和历史轶事；排除李敖自身事件、节目流程、纯时政连续叙述、资料展示、语词考据和无情节概念。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮初选 ${selections.length} 条；校对轮删除 ${proofreadDrops.length} 条，补入 0 条，修边 ${proofreadTrims.length} 条，保留 ${rows.length} 条。`,
      "正文均按源文原段或段内原文截取。",
      "节目类文本杂讯多，校对轮按故事性和边界继续收窄。"
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

  if (!validation.ok) {
    throw new Error(`Validation failed for ${BOOK}: ${JSON.stringify(validation)}`);
  }
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
        sourceFileCount: manifest.sourceFileCount,
        candidateCount: manifest.candidateCount,
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
