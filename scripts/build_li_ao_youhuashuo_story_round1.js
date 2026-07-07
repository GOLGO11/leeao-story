const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖有话说";
const SLUG = "li_ao_youhuashuo";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "LAYH";
const ORIGINAL_EXTRACTION_COUNT = 88;
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "012",
    paragraph: 6,
    title: "琼斯说还没开始打",
    start: "美国有个海军之父",
    end: "我还没开始打呢！"
  },
  {
    prefix: "015",
    paragraph: 2,
    title: "蒋介石让大家站起来投票",
    start: "我讲个笑话给你们听",
    end: "好，大家站起来通过了。"
  },
  {
    prefix: "018",
    paragraphs: [3, 4, 5],
    title: "七金人教授不捡散金",
    start: "我提醒大家",
    end: "多有气派啊！"
  },
  {
    prefix: "022",
    paragraph: 3,
    title: "唐太宗不抹侯君集功劳",
    start: "在中国古代我举一个人",
    end: "我没有抹杀。"
  },
  {
    prefix: "035",
    paragraphs: [2, 3],
    title: "木偶奇遇记里的蟋蟀良心",
    start: "我们看过外国迪斯尼",
    end: "这个唠叨就是言论自由。"
  },
  {
    prefix: "037",
    paragraphs: [2, 3, 4],
    title: "爱迪生看留声机被淘汰",
    start: "过去美国有一个大发明家",
    end: "第二次你会亲眼看到你的失败。"
  },
  { prefix: "038", paragraph: 2, title: "阿拉丁神灯有求必应" },
  { prefix: "039", paragraph: 5, title: "《灰色马》孩子找父亲战友" },
  {
    prefix: "046",
    paragraph: 9,
    title: "守寡老太太摸铜钱",
    start: "清朝有一个故事",
    end: "想办法改嫁了算了。"
  },
  {
    prefix: "052",
    paragraph: 6,
    title: "老富翁体力好记忆差",
    start: "我讲个笑话给你听",
    end: "忘了。"
  },
  { prefix: "053", paragraph: 2, title: "《卡萨布兰卡》让恋人与情敌走" },
  { prefix: "055", paragraph: 5, title: "捆妻铁轨仍体贴" },
  { prefix: "056", paragraph: 12, title: "猎户连老鼠头也挂墙" },
  { prefix: "060", paragraph: 6, title: "蓝色毛毯回来才知自己是逃兵" },
  {
    prefix: "061",
    paragraph: 2,
    title: "和尚闭眼仍被打",
    start: "中国有很多老式的的笑话",
    end: "非常的唯心论的。"
  },
  {
    prefix: "062",
    paragraph: 9,
    title: "狙公朝三暮四",
    start: "这使我们想到",
    end: "给法不同，它就变得喜怒无常。"
  },
  { prefix: "066", paragraph: 2, title: "动物农庄里猪统治农庄" },
  {
    prefix: "070",
    paragraph: 10,
    title: "清教徒让别人抗海盗",
    start: "大家看",
    end: "来保护我们。"
  },
  { prefix: "071", paragraph: 5, title: "混沌被凿七窍而死" },
  {
    prefix: "072",
    paragraph: 8,
    title: "庖丁解牛游刃有余",
    start: "《庄子》里面有一个故事",
    end: "我有这么好的技术。"
  },
  {
    prefix: "075",
    paragraph: 2,
    title: "庄周梦蝶",
    start: "《庄子》里面有个故事",
    end: "现在的我难道不是蝴蝶在做梦吗？"
  },
  {
    prefix: "077",
    paragraph: 12,
    title: "三机构抓兔子",
    start: "我讲个笑话给大家听",
    end: "浣熊承认它是兔子。"
  },
  {
    prefix: "079",
    paragraph: 7,
    title: "守襄阳先哭关公也守不住",
    start: "清朝有一个故事",
    end: "我怎么守得住呢？"
  },
  {
    prefix: "093",
    paragraph: 45,
    title: "史怀哲代签爱因斯坦",
    start: "史怀哲在非洲做医生",
    end: "把这个问题化掉了。"
  },
  {
    prefix: "096",
    paragraph: 11,
    title: "此地无银与隔壁王二",
    start: "钱埋下去以后",
    end: "泄了底。"
  },
  {
    prefix: "099",
    paragraph: 3,
    title: "俞济时说写半天都是假的",
    start: "台湾有一个非常有名",
    end: "因为我会抓到这个真相。"
  },
  { prefix: "116", paragraph: 7, title: "三毛卖自己不如假娃娃" },
  { prefix: "178", paragraph: 9, title: "兄弟作文同一条狗" },
  {
    prefix: "181",
    paragraph: 12,
    title: "罗宾汉一箭之地",
    start: "大家看这我手里拿的英国罗宾汉的故事",
    end: "这个故事就是一箭之地。"
  },
  {
    prefix: "193",
    paragraph: 12,
    title: "阿斗乐不思蜀活下来",
    start: "刘备的儿子就是刘禅",
    end: "一路活下来了。"
  },
  { prefix: "208", paragraph: 2, title: "驾照考试应踩刹车" },
  { prefix: "209", paragraph: 5, title: "狼吃羊不愁理由" },
  { prefix: "212", paragraph: 13, title: "卡车司机有刹车" },
  {
    prefix: "245",
    paragraph: 13,
    title: "借一千还十万",
    start: "有一本书叫做《胡适留学日记》",
    end: "把这好事回馈回去。"
  },
  {
    prefix: "250",
    paragraph: 10,
    title: "女佣丈夫让生活值得一活",
    start: "我看到一个外国的小故事",
    end: "需要研究一下。"
  },
  {
    prefix: "263",
    paragraph: 7,
    title: "母狮回到原野抢公狮子",
    start: "我看过一本书就是《生来自由》",
    end: "他们成功了。"
  },
  { prefix: "263", paragraph: 10, title: "女友最后一次探监" },
  { prefix: "270", paragraph: 3, title: "通奸妻先责丈夫不信任" },
  { prefix: "295", paragraph: 7, title: "林肯消灭敌人成朋友" },
  { prefix: "303", paragraph: 2, title: "鸡不知道你不是米" },
  { prefix: "309", paragraph: 14, title: "Mires在重庆被用脚写字带走" },
  {
    prefix: "320",
    paragraphs: [2, 3],
    title: "数学老师问自己几岁",
    start: "今天讲的笑话",
    end: "就这么个故事。"
  },
  {
    prefix: "326",
    paragraph: 11,
    title: "袁枚母亲临终替儿擦泪",
    start: "中国清朝的文学家袁枚",
    end: "一边自己就死掉了。"
  },
  {
    prefix: "329",
    paragraph: 7,
    title: "放羊孩子狼来了",
    start: "寓言中放羊的孩子",
    end: "可是没有人信了"
  },
  {
    prefix: "357",
    paragraph: 12,
    title: "斗牛士受伤还要牛排",
    start: "我还收集了一些漫画",
    end: "这是一种性格。"
  },
  {
    prefix: "361",
    paragraph: 8,
    title: "大卫用弹弓打倒巨人",
    start: "基督教的圣经",
    end: "来打了哥利亚。"
  },
  {
    prefix: "361",
    paragraph: 11,
    title: "拳击休息时打点滴",
    start: "我给大家看过一张漫画",
    end: "没有这个规则！"
  },
  {
    prefix: "380",
    paragraph: 4,
    title: "旧女婿做新女婿",
    start: "《邵氏闻见录》里面有个故事",
    end: "这么个关系。"
  },
  {
    prefix: "391",
    paragraphs: [9, 10],
    title: "蔡邕听琴听出杀气",
    start: "有一个插曲的故事",
    end: "这个说法正好如此。"
  },
  {
    prefix: "426",
    paragraph: 9,
    title: "拿破仑从科西嘉独立梦到法国皇帝",
    start: "拿破仑他是生在科西嘉",
    end: "他的名字就叫作拿破仑。"
  },
  { prefix: "443", paragraph: 11, title: "老马不干了" },
  { prefix: "443", paragraph: 12, title: "父子花两块钱救回狗" },
  { prefix: "445", paragraph: 8, title: "斗牛士探病来的是牛" },
  { prefix: "445", paragraph: 11, title: "父子救错游泳的人" },
  {
    prefix: "455",
    paragraph: 4,
    title: "瓶中家书漂流八十五年",
    start: "第一次世界大战的一个家书",
    end: "传来85年前的一个讯息。"
  },
  {
    prefix: "476",
    paragraph: 3,
    title: "夏燮看洋人制裸妇人",
    start: "夏燮写过一部书",
    end: "其巧而丧心如此。"
  },
  {
    prefix: "480",
    paragraph: 6,
    title: "妇产科乡下女人叫医生先脱",
    start: "一个有名的妇产科医师",
    end: "你怎么叫人家先脱？"
  },
  {
    prefix: "491",
    paragraph: 2,
    title: "吕洞宾点石成金指头",
    start: "八仙过海",
    end: "这个指头我可以点石成金，没有这个方法，你就得不到这个效果。"
  },
  { prefix: "508", paragraph: 6, title: "孟子牵牛衅钟" },
  { prefix: "535", paragraph: 6, title: "蝙蝠在鸟兽之间变身份" },
  { prefix: "539", paragraph: 11, title: "福尔摩斯喊失火逼凶手出墙" },
  { prefix: "544", paragraph: 9, title: "Free love不是免费sex" },
  {
    prefix: "561",
    paragraph: 8,
    title: "乔路易斯挨打不还手",
    start: "有一个故事描写乔·路易斯",
    end: "他宁愿挨打，他也不会还手。"
  },
  { prefix: "574", paragraph: 14, title: "子路杀虎又想杀孔子" },
  {
    prefix: "579",
    paragraph: 12,
    title: "乔治五世重复笑话",
    start: "乔治五世他就是现在英国女王的祖父",
    end: "你说的跟我那个笑话一样好。"
  },
  { prefix: "589", paragraph: 3, title: "法庭问在哪里被强奸" },
  {
    prefix: "589",
    paragraph: 4,
    title: "Oliver Twist多要一点饭",
    start: "所以大家看英国《双城记》的作者狄更斯",
    end: "把他卖掉了。"
  },
  {
    prefix: "605",
    paragraph: 3,
    title: "罗素越狱队伍里的大头脑",
    start: "英国最了不起的一个大头脑",
    end: "他是最智慧的。"
  },
  {
    prefix: "611",
    paragraph: 6,
    title: "刘玉章怕自己的布告",
    start: "有个故事讲到他",
    end: "什么私事都不敢做了"
  },
  {
    prefix: "626",
    paragraphs: [3, 4],
    title: "雷利临刑仍开玩笑",
    start: "这个大臣雷利是什么人？",
    end: "这就是我李敖所真正赞美的叫做视死如归。"
  },
  {
    prefix: "626",
    paragraph: 5,
    title: "金圣叹临刑喝酒说痛快",
    start: "在我们中国想起来",
    end: "好，还有这么一个传说。"
  },
  {
    prefix: "626",
    paragraph: 6,
    title: "玛丽安唐妮从容赴断头台",
    start: "最后法国大革命了",
    end: "就这样死掉了。"
  },
  { prefix: "626", paragraph: 8, title: "晋惠帝问何不食肉糜" },
  {
    prefix: "626",
    paragraph: 9,
    title: "苏格拉底喝毒酒仍谈哲学",
    start: "我们谈到希腊",
    end: "这种死起来就很快乐了。"
  },
  { prefix: "626", paragraph: 10, title: "王景文毒酒不劝客" },
  {
    prefix: "626",
    paragraph: 11,
    title: "静子夫人先死给广田看",
    start: "战犯里面最重要的是七个战犯",
    end: "给他做先行者。"
  },
  {
    prefix: "626",
    paragraph: 12,
    title: "齐燮元临刑说三汉奸",
    start: "还有一个有名的所谓汉奸叫做齐燮元",
    end: "死的很从容很勇敢。"
  },
  {
    prefix: "632",
    paragraphs: [7, 8, 9],
    title: "杨贵妃给道士密语作证",
    start: "我跟大家说《长恨歌》",
    end: "道士回来向唐明皇报告。"
  },
  { prefix: "640", paragraph: 10, title: "吴稚晖说见洋人会笑" },
  {
    prefix: "646",
    paragraph: 4,
    title: "毕加索说格尔尼卡是你们干的",
    start: "最重要的一个就是当西班牙内战的时候",
    end: "这种人就是大画家。"
  },
  { prefix: "646", paragraph: 7, title: "毕加索也假造毕加索画" },
  { prefix: "647", paragraph: 9, title: "摸错陌生狮子" },
  {
    prefix: "655",
    paragraph: 7,
    title: "蔡元培收红包交国库",
    start: "蔡元培了不起在什么地方",
    end: "交还国库，交还公家。"
  },
  { prefix: "656", paragraph: 9, title: "清教徒女囚修指甲" },
  { prefix: "657", paragraph: 5, title: "杜鲁门毁掉艾森豪情书" },
  { prefix: "666", paragraph: 8, title: "算命算出人人千亿" },
  {
    prefix: "723",
    paragraph: 11,
    title: "韩福瑞喝一瓶啤酒退礼",
    start: "就像美国詹森总统时代",
    end: "可是给你面子给足。"
  },
  {
    prefix: "733",
    paragraph: 2,
    title: "农场女孩把马当没角牛",
    start: "请大家先看一个笑话",
    end: "根本就在这里。"
  }
];

const proofreadDrops = [
  {
    title: "借一千还十万",
    source: "245.2005-02-11：滴水之恩的回报.txt:25-25",
    reason: "只是《胡适留学日记》里一个报恩材料的概述，人物、场景和转折都过薄，校对轮按非故事删除。"
  },
  {
    title: "拿破仑从科西嘉独立梦到法国皇帝",
    source: "426.2005-10-24：台湾人要学习拿破仑.txt:17-17",
    reason: "主体是拿破仑身世和政治选择小传，偏历史进程概括，不是李敖讲成的独立小故事。"
  },
  {
    title: "夏燮看洋人制裸妇人",
    source: "476.2006-01-02：性玩具无伤风化.txt:5-5",
    reason: "核心是古书器物资料展示和性玩具说明，缺少人物行动、对话和情节收束，校对轮删除。"
  },
  {
    title: "刘玉章怕自己的布告",
    source: "611.2006-07-10：我们要活的很丰富.txt:11-11",
    reason: "只是一句自嘲式口述材料，引文边界也不完整，故事体量不足，校对轮删除。"
  }
];

const proofreadAdds = [
  {
    prefix: "007",
    paragraph: 8,
    title: "拉椅子掩屁第一声最像",
    start: "今天我们可以看到一个笑话",
    end: "只有第一声就是屁，真的屁。"
  },
  {
    prefix: "013",
    paragraph: 4,
    title: "哈台说自己卖牙签",
    start: "有一个喜剧片里面有这么一段",
    end: "他说我是卖牙签的。"
  },
  {
    prefix: "016",
    paragraph: 2,
    title: "鲁宾斯坦判孩子别弹琴",
    start: "先讲一个故事",
    end: "从此好好去念书，不要想做钢琴家了。"
  },
  {
    prefix: "048",
    paragraph: 7,
    title: "晋侯借道灭虞又收礼",
    start: "有一段《左传》里面的古文",
    end: "目前算账当然不是时候，就是这么简单。"
  },
  {
    prefix: "090",
    paragraph: 4,
    title: "宗炳卧在床上游山",
    start: "《二十四史》的《宋书》有一段讲到宗炳",
    end: "欲令众山皆响（音乐响的时候，图画里去过的山都会跟着动）。"
  },
  {
    prefix: "118",
    paragraph: 4,
    title: "扳道工找妹妹看撞车",
    start: "铁路局招扳这个switch的工人时",
    end: "可是我妹妺喜欢看热闹，她爱看火车相撞。"
  },
  {
    prefix: "118",
    paragraph: 12,
    title: "秦失吊老子哭三声",
    start: "我们看《庄子》里面的故事",
    end: "他自己应付他的好朋友老子的死，也表达得非常的洒脱。"
  },
  {
    prefix: "233",
    paragraph: 14,
    title: "关云长刮骨疗毒仍下棋",
    start: "我们讲到《三国演义》",
    end: "在《三国演义》小说里面的这么一个故事。"
  },
  {
    prefix: "294",
    paragraph: 11,
    title: "章太炎不怕胡适偷树",
    start: "过去有过一个故事",
    end: "换句话说万里长城那么长的时候，不怕别人挖墙脚。"
  },
  {
    prefix: "380",
    paragraph: 5,
    title: "刘贡父用大姨小姨挖苦欧阳修",
    start: "欧阳修在薛家从旧女婿变成新女婿",
    end: "先搞人家大小姐，大姨，然后搞人家妹妹，再弄小姨。"
  },
  {
    prefix: "400",
    paragraph: 8,
    title: "银行职员只准说一次YES",
    start: "就好像那个笑话一样",
    end: "这就是一次例外。"
  },
  {
    prefix: "419",
    paragraph: 11,
    title: "威尔逊说有利GM也有利美国",
    start: "美国以前总统艾森豪威尔",
    end: "就是对通用公司有利的，对美国也有利。"
  },
  {
    prefix: "427",
    paragraph: 9,
    title: "老和尚势利被书生打耳光",
    start: "有一个笑话",
    end: "就你的逻辑给你个耳光。"
  },
  {
    prefix: "589",
    paragraph: 7,
    title: "初学剃头须千手观音",
    start: "我想起中国笑话书里一段话",
    end: "才能盖住这些伤口）。"
  },
  {
    prefix: "650",
    paragraph: 6,
    title: "宋仁宗忍饿忍渴怕扰人",
    start: "我举个例子给大家听",
    end: "从很小的地方就看出来了，宋仁宗这个故事就告诉了我们这种情况。"
  },
  {
    prefix: "654",
    paragraph: 9,
    title: "吉姆爵爷第二次可以不死却死了",
    start: "英国文学家康拉德",
    end: "第二次他可以不死他死了。"
  },
  {
    prefix: "729",
    paragraph: 4,
    title: "孔子先问人后问马",
    start: "在中国的《论语》的书里面讲孔子的一个故事",
    end: "问了人，也问了动物，这才是孔子。"
  },
  {
    prefix: "735",
    paragraph: 5,
    title: "威尔第茶花女首演砸锅",
    start: "大家看，这就是大音乐家威尔第",
    end: "这个《茶花女》的歌剧因为请来的这个花腔女高音请错了，所以搞砸了。"
  }
];

const proofreadTrimOverrides = new Map([
  [
    "爱迪生看留声机被淘汰",
    {
      start: "我告诉各位，爱迪生在发明这个留声机的时候",
      end: "第二次你会亲眼看到你的失败。"
    }
  ],
  [
    "狙公朝三暮四",
    {
      start: "这使我们想到什么一个故事呢？",
      end: "猴子不会算这个帐，它不晓得加在一起还是七个。"
    }
  ],
  [
    "阿斗乐不思蜀活下来",
    {
      start: "投降以后呢，最后送到司马昭",
      end: "结果阿斗就一路活下来了。"
    }
  ],
  [
    "卡车司机有刹车",
    {
      start: "大家看这篇故事，这卡车司机就是开下来了",
      end: "等你来刹车。"
    }
  ],
  [
    "女佣丈夫让生活值得一活",
    {
      start: "我看到一个外国的小故事",
      end: "使我讨来的生活值得一活。"
    }
  ],
  [
    "斗牛士受伤还要牛排",
    {
      start: "我还收集了一些漫画",
      end: "代表那种不屈服的性格。"
    }
  ],
  [
    "蔡邕听琴听出杀气",
    {
      start: "后来这个蔡邕有一次他的邻居用酒食",
      end: "这个说法正好如此。"
    }
  ],
  [
    "妇产科乡下女人叫医生先脱",
    {
      start: "一个有名的妇产科医师",
      end: "还是她说那你先脱吧。"
    }
  ],
  [
    "雷利临刑仍开玩笑",
    {
      start: "最后怎么样？最后判他死刑。",
      end: "死的时候还能开玩笑。"
    }
  ],
  [
    "苏格拉底喝毒酒仍谈哲学",
    {
      start: "我们谈到希腊的祖师爷",
      end: "还在谈他的哲学，谈他的人生道理，并且他死以前，不许女人在他身边，诸如此类。"
    }
  ],
  [
    "杨贵妃给道士密语作证",
    {
      start: "结果这个道士就跟杨贵妃谈判",
      end: "道士回来向唐明皇报告。"
    }
  ],
  [
    "毕加索说格尔尼卡是你们干的",
    {
      start: "当时德国人进到法国的时候",
      end: "这种人就是大画家。"
    }
  ],
  [
    "毕加索也假造毕加索画",
    {
      start: "毕加索还有一个有趣的故事",
      end: "我有时候，也假造毕加索画。"
    }
  ],
  [
    "清教徒女囚修指甲",
    {
      start: "然后大家看，一个漫画出现了",
      end: "在痛苦之中还在修指甲，美化我自己。"
    }
  ],
  [
    "杜鲁门毁掉艾森豪情书",
    {
      start: "当时在第二次世界大战",
      end: "我都毁掉了。"
    }
  ]
]);

const proofreadTrims = Array.from(proofreadTrimOverrides.keys());
const proofreadDropTitles = new Set(proofreadDrops.map((item) => item.title));

const excludedByStandard = [
  "李敖自己的坐牢、官司、家庭、立院活动、节目流程和个人交游经历，除非段内转述的是独立故事，否则排除。",
  "连续时政复盘、历史证据铺陈、政策论证、书籍版本说明、人物小传、器物资料和法律材料，缺少独立情节的不列为故事。",
  "同一书内重复出现的寓言、笑话和漫画，只取较完整、较适合独立阅读的一处。",
  "来宾、报导或文件本身的材料不直接作为故事；只有李敖转述成可复述的小故事、典故、笑话、寓言、漫画、文学/电影故事才收。",
  "色情或攻击性笑话只在确有完整情节和明确论证功能时保留；单纯插科打诨排除。"
];

const candidateMarkers = [
  "故事",
  "笑话",
  "寓言",
  "典故",
  "漫画",
  "电影",
  "小说",
  "童话",
  "有一次",
  "有一天",
  "忽然",
  "结果",
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
  "油管/抖音"
];

function findSourceRoot() {
  const editionRoot = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!editionRoot) throw new Error("Missing 大李敖全集6.0 source directory");
  const categoryRoot = path.join(
    ROOT,
    editionRoot,
    fs.readdirSync(path.join(ROOT, editionRoot)).find((name) => name.startsWith("010."))
  );
  const bookDir = fs.readdirSync(categoryRoot).find((name) => name.startsWith("007."));
  if (!bookDir) throw new Error("Missing 007.李敖有话说 source directory");
  return path.join(categoryRoot, bookDir);
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

  if (typeof selection.paragraph === "string" && selection.paragraph.includes("-")) {
    const [start, end] = selection.paragraph.split("-").map((value) => Number(value));
    const picked = paragraphs.slice(start - 1, end);
    if (picked.length !== end - start + 1) {
      throw new Error(`Missing paragraph range ${selection.paragraph} in ${fileName}`);
    }
    return {
      fileName,
      sourceId: `${selection.prefix}#P${selection.paragraph}`,
      sourceLines: `${picked[0].startLine}-${picked[picked.length - 1].endLine}`,
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

function selectionParagraphStart(selection) {
  if (Array.isArray(selection.paragraphs)) return Number(selection.paragraphs[0]);
  if (typeof selection.paragraph === "string" && selection.paragraph.includes("-")) {
    return Number(selection.paragraph.split("-")[0]);
  }
  return Number(selection.paragraph);
}

function activeSelections() {
  return [...selections, ...proofreadAdds]
    .map((selection, originalIndex) => ({ ...selection, originalIndex }))
    .filter((selection) => !proofreadDropTitles.has(selection.title))
    .map((selection) => ({
      ...selection,
      ...(proofreadTrimOverrides.get(selection.title) || {})
    }))
    .sort(
      (a, b) =>
        Number(a.prefix) - Number(b.prefix) ||
        selectionParagraphStart(a) - selectionParagraphStart(b) ||
        a.originalIndex - b.originalIndex
    );
}

function buildRows(selectionList = activeSelections()) {
  return selectionList.map((selection, index) => {
    const paragraph = paragraphForSelection(selection);
    const storyText = selectedText(selection, paragraph.text);
    return {
      id: `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
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
  if (/故事|笑话|轶事|趣闻|典故|寓言|成语|漫画|电影|小说/u.test(paragraph)) score += 6;
  if (/问|答|说|讲/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/哭|笑|杀|逃|打|骗|偷|抓|跪|求|死|梦|醒|嫁|娶|抢|跑|问|答|撞/u.test(paragraph)) {
    score += 2;
  }
  return score;
}

function writeCandidateScan() {
  const rows = [];
  for (const fileName of sourceFiles()) {
    const paragraphs = splitParagraphObjects(readSource(fileName));
    paragraphs.forEach((paragraph, index) => {
      const found = candidateMarkers.filter((marker) => paragraph.text.includes(marker));
      const quoteHeavy = (paragraph.text.match(/[“”]/gu) || []).length >= 6;
      if (!found.length && !quoteHeavy) return;
      const score = candidateScore(paragraph.text, found);
      if (score < 7 && !quoteHeavy) return;
      rows.push({
        file: fileName,
        paragraph: index + 1,
        score,
        markers: found.join("|"),
        text: paragraph.text.replace(/\s+/gu, " ").slice(0, 900)
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
  const text = fs.readFileSync(candidatePath, "utf8").trim();
  return text ? Math.max(0, text.split(/\r?\n/u).length - 1) : 0;
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const lines = [
    "# 李敖有话说故事校对轮",
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
    "《李敖有话说》是长篇电视节目逐字稿，时政和资料展示密度很高。校对轮继续收紧：只收李敖在节目中讲成可独立复述、带人物行动或问答反转、并用来说明一个道理的小故事、笑话、典故、寓言、漫画故事、文学/电影故事；不把李敖自己的活动、连续案情复盘、人物小传、器物资料、法律材料和纯概念解释当故事。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 校对删除",
    "",
    ...manifest.proofreadDrops.map((item) => `- ${item.title}：${item.source}。${item.reason}`),
    "",
    "## 校对补入",
    "",
    ...manifest.proofreadAdds.map(
      (item) => `- ${item.title}：${item.prefix}#P${item.paragraph}，补入为独立小故事。`
    ),
    "",
    "## 校对修边",
    "",
    ...manifest.proofreadTrims.map((title) => `- ${title}`),
    "",
    "## 排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 提取说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 提取轮初选 ${manifest.originalExtractionCount} 条；校对轮删除 ${manifest.proofreadDropCount} 条、补入 ${manifest.proofreadAddCount} 条、修边 ${manifest.proofreadTrimCount} 条，保留 ${validation.count} 条。`,
    "- 故事正文均来自源文原段或段内原文截取，没有改写。",
    "- 对长段只截故事本体和必要的原文收束语，尽量去掉后续时政发挥、节目自述、人物小传和资料铺陈。",
    "- 同书重复出现的孔子问马、朝三暮四、蓝色毛毯、打点滴拳击、老富翁记忆差等故事，只取较完整、较适合独立阅读的一处。",
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
  const selectionList = activeSelections();
  const rows = buildRows(selectionList);
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
    originalExtractionCount: ORIGINAL_EXTRACTION_COUNT,
    selectionCount: selectionList.length,
    proofreadDropCount: proofreadDrops.length,
    proofreadDrops,
    proofreadTrimCount: proofreadTrims.length,
    proofreadTrims,
    proofreadAddCount: proofreadAdds.length,
    proofreadAdds,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖讲成可独立复述、带人物行动或问答反转、并用于说明一个道理的小故事、笑话、典故、寓言、漫画故事和文学/电影故事；排除李敖自身事件、纯时政连续叙述、人物小传、器物资料、法律材料、节目流程和无情节概念。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮初选 ${ORIGINAL_EXTRACTION_COUNT} 条；校对轮删除 ${proofreadDrops.length} 条，补入 ${proofreadAdds.length} 条，修边 ${proofreadTrims.length} 条，保留 ${rows.length} 条。`,
      "正文均按源文原段或段内原文截取。",
      "本册体量大且重复故事多，本轮补入漏掉的强故事条目，同时压掉人物小传、器物资料和过薄材料。"
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
