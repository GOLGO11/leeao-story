const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "李敖政论综艺集";
const SLUG = "li_ao_zhenglun_zongyi";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "LAZZY";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;
const decoder = new TextDecoder("gb18030");

const selections = [
  {
    prefix: "003",
    paragraph: 19,
    title: "石壕吏夜捉老妇",
    start: "我们想想看，一千两百三十四年以前",
    end: "去做伙夫。"
  },
  {
    prefix: "003",
    paragraph: 39,
    title: "王晓波母亲为党嫁宪兵团长",
    start: "台湾的共产党是假的",
    end: "最后被发现被枪毙了。"
  },
  {
    prefix: "003",
    paragraph: 41,
    title: "温生才刺杀孚琦",
    start: "当年孙中山找到了温生才",
    end: "然后他就被砍头了。"
  },
  {
    prefix: "007",
    paragraph: 23,
    title: "林肯朋友分两次报马死",
    start: "我们先插播一个故事",
    end: "怕你一次哭得太难过了。"
  },
  {
    prefix: "003",
    paragraph: 62,
    title: "吴凤拒交人头被杀",
    start: "什么是真的？就是吴凤跟高山族接触",
    end: "这不是别人，吴凤是台湾人，怎么可以毁掉呢？"
  },
  {
    prefix: "004",
    paragraph: 12,
    title: "程婴立赵氏孤儿",
    start: "赵盾重新掌握晋国国政以后",
    end: "二十年后，很容易的去死了。"
  },
  {
    prefix: "006",
    paragraph: 41,
    title: "长生不老社区气死殡仪馆老板",
    start: "我举一个例子",
    end: "自己气死了！（众笑）"
  },
  {
    prefix: "006",
    paragraph: 42,
    title: "关尹扣留老子写道德经",
    start: "中国的老子",
    end: "不愿意住的地方。"
  },
  {
    prefix: "007",
    paragraph: 12,
    title: "国父不死还有精神",
    start: "过去我们在部队里面有一个口号",
    end: "他再喊“还有精神”！"
  },
  {
    prefix: "007",
    paragraph: 51,
    title: "塔列朗在维也纳会议反客为主",
    start: "各位想想看，1815年维也纳会议的时候",
    end: "大家知道吗？（掌声）"
  },
  {
    prefix: "009",
    paragraph: 22,
    title: "鲁宾斯坦证明孩子不宜弹琴",
    start: "我讲个故事给大家听",
    end: "最有趣的，她用大师来证明你没有资格。"
  },
  {
    prefix: "013",
    paragraph: 14,
    title: "傅积宽喊自己万岁判五年",
    start: "我举个故事给你听",
    end: "就因为喊自己万岁就判了五年。"
  },
  {
    prefix: "013",
    paragraph: 32,
    title: "梁启超听康有为一席话",
    start: "我讲过，一个小男孩子是个神童",
    end: "常常一个人的一席话可以影响你的一生。"
  },
  {
    prefix: "013",
    paragraph: 60,
    title: "巴鲁克囚犯等马飞",
    start: "美国一个有名的企业家叫巴鲁克",
    end: "我在等明年三月十八号马飞起来。"
  },
  {
    prefix: "014",
    paragraph: 12,
    title: "朝三暮四的猴子栗子",
    start: "古代那个《列子》里面有名的笑话",
    end: "猴子就高兴。"
  },
  {
    prefix: "014",
    paragraph: 18,
    title: "苏秋镇憋尿守预算",
    start: "我讲过这个笑话",
    end: "所有法案通不过。"
  },
  {
    prefix: "014",
    paragraph: 18,
    title: "陈水扁上厕所记预算",
    start: "阿扁正好相反",
    end: "阿扁小便太多。"
  },
  {
    prefix: "016",
    paragraph: 6,
    title: "李远哲转化学系得诺贝尔奖",
    start: "我在台大历史系一年级的时候",
    end: "他的名字就是李远哲。"
  },
  {
    prefix: "057",
    paragraph: 126,
    title: "蓝色毛毯归还农夫",
    start: "《开明少年》有篇文章叫做《蓝色的毛毯》",
    end: "我没有参加，我逃掉了。"
  },
  {
    prefix: "018",
    paragraph: 8,
    title: "文天祥慢慢成为英雄",
    start: "果然不出文天祥所料",
    end: "人不是一开始就变成圣人的。"
  },
  {
    prefix: "018",
    paragraph: 8,
    title: "刘玉川殉情临阵逃跑",
    start: "所以文天祥就讲刘玉川的故事",
    end: "男方跑掉了。"
  },
  {
    prefix: "018",
    paragraph: 9,
    title: "张白帆殉情后逃跑",
    start: "大家记不记得，在1949年淡水河",
    end: "因为有一个人肯定会跑。"
  },
  {
    prefix: "018",
    paragraph: 9,
    title: "梅耶林皇太子殉情守信",
    start: "以前我们讲第一次世界大战是斐迪南被刺",
    end: "自己打死自己，很守信用的。"
  },
  {
    prefix: "018",
    paragraph: 43,
    title: "陶渊明叮嘱善待长工儿子",
    start: "我举个例子给你看，大家念过陶渊明《归去来辞》。",
    end: "拿人当人是很重要的一点。"
  },
  {
    prefix: "018",
    paragraph: 69,
    title: "老处女用望远镜看裸泳",
    start: "我告诉大家，这就是一个有名的故事",
    end: "你要用我用望远镜去看才看得到。"
  },
  {
    prefix: "027",
    paragraph: 17,
    title: "欧阳修六字写马踢狗",
    start: "好比说我告诉你，欧阳修的时代",
    end: "把这语言用到极致，用绝了。"
  },
  {
    prefix: "027",
    paragraph: 39,
    title: "富翁考四个笨女婿",
    start: "我可以讲个故事给大家听",
    end: "别人用的多，而我用的少。"
  },
  {
    prefix: "029",
    paragraph: 24,
    title: "哈台把牙签说成木材生意",
    start: "我讲过一个笑话",
    end: "牙签那时也是木头做的。"
  },
  {
    prefix: "037",
    paragraph: 22,
    title: "周处除三害",
    start: "中国古代的晋朝有个有名的故事",
    end: "第三害就是你自己，你就是个大流氓。"
  },
  {
    prefix: "037",
    paragraph: 52,
    title: "刘贡父反问王安石儿子",
    start: "大家记得宋朝有一个有名的文学家",
    end: "每个人都是神童！”"
  },
  {
    prefix: "039",
    paragraph: 23,
    title: "罗斯福为美国利益出卖外蒙古",
    start: "我告诉大家一个历史的故事",
    end: "为了美国的利益，我们只好这样做。"
  },
  {
    prefix: "039",
    paragraph: 28,
    title: "阿斗乐不思蜀",
    start: "所以严格说起来，蜀国不算是一个真正刘家的天下。",
    end: "乐不思蜀就这个典故。"
  },
  {
    prefix: "041",
    paragraph: 23,
    title: "郑成功清洗母亲尸体",
    start: "什么叫做反求诸己？我给大家讲一个故事",
    end: "心理的压力和痛苦。"
  },
  {
    prefix: "041",
    paragraph: 25,
    title: "《雅玛》妓女称精神处女",
    start: "俄国有个小说家叫库布林",
    end: "你们不了解我。"
  },
  {
    prefix: "020",
    paragraph: 13,
    title: "丘吉尔宁喝毒药",
    start: "在二次大战以前，一个女的国会议员骂他",
    end: "不要做你这种货色的丈夫。"
  },
  {
    prefix: "020",
    paragraph: 13,
    title: "丘吉尔陪大使还汤匙",
    start: "我告诉你他怎么处理问题",
    end: "你们知道政治智慧多么高。"
  },
  {
    prefix: "023",
    paragraph: 13,
    title: "撒切尔先安慰女侍者",
    start: "我举个例子，英国有一个了不起的女人",
    end: "人情练达是最重要的一点。"
  },
  {
    prefix: "023",
    paragraph: 13,
    title: "玛丽安德森为旅馆歌迷唱歌",
    start: "大家记不记得一位有名的黑人女歌星",
    end: "这种人情练达是多么重要的一点。"
  },
  {
    prefix: "038",
    paragraph: 22,
    title: "刘玉章说脱光更神勇",
    start: "从前张大千喜欢巴结国民党大官",
    end: "“我脱光了更神勇！”（众笑）"
  },
  {
    prefix: "041",
    paragraph: 65,
    title: "辛巴达背上甩不掉的老头",
    start: "《辛巴达七航妖岛》",
    end: "你要养他。"
  },
  {
    prefix: "043",
    paragraph: 29,
    title: "林肯把敌人变朋友",
    start: "所以过去林肯总统说",
    end: "变成我的朋友了吗？（掌声）"
  },
  {
    prefix: "042",
    paragraph: 39,
    title: "修华德买下阿拉斯加",
    start: "美国林肯总统时代的国务卿叫修华德",
    end: "不是吗？"
  },
  {
    prefix: "046",
    paragraph: 42,
    title: "林肯请一家人留机会给别人",
    start: "林肯收到一位女士给他的信",
    end: "请留点机会给别人好吗？"
  },
  {
    prefix: "046",
    paragraph: 91,
    title: "李师科抢钱给小女孩",
    start: "曾经有一个老兵叫李师科",
    end: "他被枪毙了。"
  },
  {
    prefix: "047",
    paragraph: 5,
    title: "阿登纳拒绝希特勒党员大会",
    start: "我一再举的一个例子",
    end: "去对抗一个坏的中央政府。"
  },
  {
    prefix: "048",
    paragraph: 29,
    title: "杰克逊误捏女秘书大腿",
    start: "我讲个故事，当年美国的总统叫杰克逊",
    end: "你拧的是我的大腿。"
  },
  {
    prefix: "048",
    paragraph: 51,
    title: "爱因斯坦太太懂丈夫",
    start: "我告诉你一个故事",
    end: "我懂爱因斯坦，我懂我丈夫。"
  },
  {
    prefix: "048",
    paragraph: 66,
    title: "科西嘉独立失败与拿破仑",
    start: "我讲个历史故事",
    end: "不要被他们搞得这么小气。"
  },
  {
    prefix: "048",
    paragraph: 81,
    title: "王安石最后选绿字",
    start: "王安石写过一首诗",
    end: "最后选择“绿”字。"
  },
  {
    prefix: "050",
    paragraph: 45,
    title: "逃亡女抓尸游到香港",
    start: "我告诉大家一个故事",
    end: "很动人的一个故事。"
  },
  {
    prefix: "052",
    paragraphs: [7, 8],
    title: "唐太宗偷兰亭殉葬",
    start: "大家看唐太宗",
    end: "很可能。"
  },
  {
    prefix: "052",
    paragraph: 9,
    title: "吴问卿焚画侄子救出富春山居图",
    start: "现在问题出现了",
    end: "最小的一段。"
  },
  {
    prefix: "052",
    paragraph: 11,
    title: "毒气室祖母逗孙子笑",
    start: "我讲个故事给大家听",
    end: "最后的笑容，你还可以掌握。"
  },
  {
    prefix: "052",
    paragraph: 14,
    title: "毕加索也造自己的假画",
    start: "毕加索有一次画了一幅画",
    end: "有的时候会造自己的假画。"
  },
  {
    prefix: "052",
    paragraph: 17,
    title: "毕加索说格尔尼卡是你们干的",
    start: "这是最有名的一张",
    end: "得到相当的尊敬跟自由。"
  },
  {
    prefix: "052",
    paragraphs: [18, 19, 20],
    title: "乾隆错判富春山居图反保全真迹",
    start: "乾隆皇帝干了件什么事情呢",
    end: "因祸得福。"
  },
  {
    prefix: "052",
    paragraph: 31,
    title: "董其昌卖自己的假画",
    start: "《富春山居图》在被烧掉以前",
    end: "卖自己假画的方法。"
  },
  {
    prefix: "052",
    paragraphs: [33, 34],
    title: "顾维钧学政治也要修矿物学",
    start: "顾维钧是什么人呢",
    end: "就是矿物学的石头。"
  },
  {
    prefix: "052",
    paragraph: 36,
    title: "范蠡功成身退成陶朱公",
    start: "从越王勾践讲起",
    end: "叫做陶朱公。"
  },
  {
    prefix: "052",
    paragraphs: [37, 38, 39, 40, 41],
    title: "陶朱公长子救弟败事",
    start: "他家的老二",
    end: "这才是我们念书的目的，谢谢各位。"
  },
  {
    prefix: "054",
    paragraph: 5,
    title: "乔治第五忘记笑话来源",
    start: "乔治第五听了哈哈大笑",
    end: "笑话的来源。"
  },
  {
    prefix: "054",
    paragraph: 5,
    title: "温莎公爵卖父亲信",
    start: "当温莎公爵小的时候",
    end: "还赚了大钱。"
  },
  {
    prefix: "055",
    paragraph: 59,
    title: "高玉树开票胜出后被摆平",
    start: "台湾选台北市市长的时候",
    end: "我有办法把你摆平。"
  },
  {
    prefix: "057",
    paragraph: 59,
    title: "顾维钧带五块钱散步",
    start: "顾维钧怎么个好法",
    end: "就是赞助费，就这么细腻的一个人。"
  }
];

const ORIGINAL_EXTRACTION_COUNT = selections.length;
const proofreadDrops = [
  { title: "国父不死还有精神", reason: "跨书重复，已由《上山·上山·爱》收录同一笑话。" },
  { title: "鲁宾斯坦证明孩子不宜弹琴", reason: "跨书重复，已由《挑战李敖》收录同一故事。" },
  { title: "傅积宽喊自己万岁判五年", reason: "跨书重复，已由《李敖快意恩仇录》收录同一故事。" },
  { title: "巴鲁克囚犯等马飞", reason: "跨书重复，已由《虚拟的十七岁》《挑战李敖》收录同一笑话。" },
  { title: "朝三暮四的猴子栗子", reason: "跨书重复，已由《坐牢家爸爸给女儿的八十封信》收录同一寓言。" },
  { title: "苏秋镇憋尿守预算", reason: "跨书重复，已由《笑傲六十年·有话说李敖》收录同一故事。" },
  { title: "陈水扁上厕所记预算", reason: "跨书重复，已由《笑傲六十年·有话说李敖》收录同一故事。" },
  { title: "蓝色毛毯归还农夫", reason: "跨书重复，已由《李敖议坛哀思录》收录同一故事。" },
  { title: "刘玉川殉情临阵逃跑", reason: "跨书重复，已由《挑战李敖》收录同一故事。" },
  { title: "陶渊明叮嘱善待长工儿子", reason: "跨书重复，已由《挑战李敖》收录同一故事。" },
  { title: "老处女用望远镜看裸泳", reason: "跨书重复，已由《李敖书简集》收录同一笑话。" },
  { title: "欧阳修六字写马踢狗", reason: "跨书重复，已由《挑战李敖》收录同一故事。" },
  { title: "刘贡父反问王安石儿子", reason: "跨书重复，已由《李敖访谈录1990-2018》收录同一故事。" },
  { title: "《雅玛》妓女称精神处女", reason: "跨书重复，已由《中国思想趋向求答案》《李敖大哥大》收录同一故事。" },
  { title: "丘吉尔宁喝毒药", reason: "跨书重复，已由《李敖语妙天下》收录同一笑话。" },
  { title: "丘吉尔陪大使还汤匙", reason: "跨书重复，已由《李敖语妙天下》收录同一故事。" },
  { title: "撒切尔先安慰女侍者", reason: "跨书重复，已由《挑战李敖》《李敖语妙天下》收录同一故事。" },
  { title: "玛丽安德森为旅馆歌迷唱歌", reason: "跨书重复，已由《挑战李敖》《李敖语妙天下》收录同一故事。" },
  { title: "林肯把敌人变朋友", reason: "跨书重复，已由《李敖议坛哀思录》《李敖有话说》收录同一故事。" },
  { title: "修华德买下阿拉斯加", reason: "跨书重复，已由《李敖文存二集》收录同一故事。" },
  { title: "李师科抢钱给小女孩", reason: "跨书重复，已由《李敖颠倒众生》《笑傲六十年·有话说李敖》收录同一故事。" },
  { title: "阿登纳拒绝希特勒党员大会", reason: "跨书重复，已由《李敖对话录》收录同一故事。" },
  { title: "爱因斯坦太太懂丈夫", reason: "跨书重复，已由《李敖议坛哀思录》收录同一故事。" },
  { title: "董其昌卖自己的假画", reason: "跨书重复，已由《李敖语妙天下》收录同一故事。" },
  { title: "顾维钧学政治也要修矿物学", reason: "跨书重复，已由《李敖秘密书房》收录同一故事。" }
];
const proofreadAdds = [
  {
    prefix: "006",
    paragraph: 50,
    title: "银行经理听见一个YES",
    start: "我们看电影里面I Love Lucy",
    end: "说了一句YES。"
  },
  {
    prefix: "007",
    paragraph: 44,
    title: "小学生反问铅笔哪里去了",
    start: "再讲个笑话，一个小学生写文章写字造句",
    end: "那铅笔哪里去了？"
  },
  {
    prefix: "006",
    paragraph: 106,
    title: "施性忠父亲摔跤也要捡东西",
    start: "我的好朋友新竹以前的市长施性忠",
    end: "这一跤也不白摔，我很喜欢这种人，就是机会主义者。"
  },
  {
    prefix: "025",
    paragraph: 11,
    title: "阿加莎小说第五具尸体",
    start: "大家记不记得英国一个有名的小说家阿加莎克里斯蒂",
    end: "这个人也是你杀的。"
  },
  {
    prefix: "038",
    paragraph: 17,
    title: "毛遂持刀逼楚王出兵",
    start: "《史记》平原君传有“毛遂自荐”的故事",
    end: "所谓因人成事者也”。"
  }
];
const proofreadTrims = [
  {
    title: "乾隆错判富春山居图反保全真迹",
    reason: "截去后面另起的“塞翁失马”寓言和重复解释，只保留乾隆误判真伪反而保全真迹这一则故事。"
  }
];
const proofreadDropTitles = new Set(proofreadDrops.map((item) => item.title));

const roundSelections = [
  {
    prefix: "009",
    paragraph: 102,
    title: "达尔文撕下新书第一页",
    start: "达尔文买一本新书",
    end: "还是撕下来好。”"
  },
  {
    prefix: "017",
    paragraph: 104,
    title: "聊斋女鬼留衣呼名",
    start: "中国一个有名的书叫《聊斋》",
    end: "然后就离开。"
  },
  {
    prefix: "017",
    paragraph: 241,
    title: "阅微女鬼化作所念之人",
    start: "有一个有名的书叫做《阅微草堂笔记》",
    end: "这界面有这么一个故事。"
  },
  {
    prefix: "039",
    paragraph: 61,
    title: "各查各的字典定义",
    start: "一个定义就是大家说一切要看字典的定义。",
    end: "各有各的定义。"
  },
  {
    prefix: "048",
    paragraph: 44,
    title: "王晓籁孙子的香水记忆",
    start: "你知道上海有个名人叫王晓籁",
    end: "就这么一个故事。"
  },
  {
    prefix: "050",
    paragraph: 78,
    title: "胡适识破陈垣公开信代笔",
    start: "当年胡适在美国的时候",
    end: "赖不掉的。"
  },
  {
    prefix: "100",
    paragraph: 90,
    title: "宋美龄抓考尔斯夫人",
    start: "在抗战的时候，考尔斯陪着威尔基到了重庆。",
    end: "蒋介石的老婆宋美龄就如此。"
  },
  {
    prefix: "101",
    paragraph: 145,
    title: "周恩来指出马歇尔调停偏向",
    start: "当年美国的五星上将叫马歇尔元帅",
    end: "这是周总理很了不起的一个故事。"
  },
  {
    prefix: "131",
    paragraph: 108,
    title: "聊斋蝴蝶托梦说玩命",
    start: "中国一部书叫《聊斋》",
    end: "对我们是玩命。"
  },
  {
    prefix: "149",
    paragraph: 170,
    title: "邵毓麟只用支票理发",
    start: "陈仪做台湾行政长官的时候",
    end: "不算贪污。"
  },
  {
    prefix: "158",
    paragraph: 37,
    title: "张鸿学挨打后批朱高正",
    start: "张鸿学，在抗战的时候",
    end: "搞革命，你不敢。"
  },
  {
    prefix: "160",
    paragraph: 37,
    title: "哈利法克斯山洞亲手",
    start: "英国的政治家哈利法克斯",
    end: "我就把你搅乱。"
  },
  {
    prefix: "166",
    paragraph: 267,
    title: "李铁拐借尸还魂",
    start: "八仙过海有一个李铁拐是不是？",
    end: "可是用他来还魂。"
  },
  {
    prefix: "180",
    paragraph: 15,
    title: "费太太进门先说不是我",
    start: "歌星费翔的妈妈费太太毕丽娜",
    end: "它是一个人扭曲了。"
  }
];
const roundProofreadDrops = [
  {
    title: "张鸿学挨打后批朱高正",
    reason:
      "只是一段受刑背景加一句政治评价，人物行动和情节反转不足，校对轮删除，避免把政治事件或语录误收为故事。"
  }
];
const roundProofreadAdds = [
  {
    prefix: "051",
    paragraph: 39,
    title: "蔡元培拒收教育部公文",
    start: "北洋军阀最了不起的一点",
    end: "跟你不来往。"
  },
  {
    prefix: "123",
    paragraph: 67,
    title: "战友父母隐瞒儿子死讯",
    start: "英国的甲乙两个兵一起作战",
    end: "破坏你一天的兴致。"
  }
];
const roundProofreadTrims = [];
const roundProofreadDropTitles = new Set(roundProofreadDrops.map((item) => item.title));

const excludedByStandard = [
  "李敖自己的抵台、军中、办刊、坐牢、官司、家庭和节目回顾经历不直接收，除非段内转述的是独立外部故事。",
  "主持人提问、人物评价、书籍资料、政治材料和新闻论证，缺少完整人物行动或情节反转的，不列为故事。",
  "同一段里的多个故事拆成可独立阅读的小条；只保留故事本体和必要的原文收束语。",
  "只是一句典故、比喻、概念判断或口号式引文的，排除。",
  "低俗笑话只在情节完整且明显服务李敖论证时保留；单纯插科打诨排除。"
];

const candidateMarkers = [
  "故事",
  "笑话",
  "典故",
  "有趣",
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
  "油管/抖音"
];

function findSourceRoot() {
  const editionRoot = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!editionRoot) throw new Error("Missing 大李敖全集6.0 source directory");
  const editionPath = path.join(ROOT, editionRoot);
  const categoryDir = fs
    .readdirSync(editionPath, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.startsWith("010."));
  if (!categoryDir) throw new Error("Missing 010.节目演讲类 source directory");
  const categoryRoot = path.join(editionPath, categoryDir.name);
  const bookDir = fs
    .readdirSync(categoryRoot, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.startsWith("012."));
  if (!bookDir) throw new Error("Missing 012.李敖政论综艺集 source directory");
  return path.join(categoryRoot, bookDir.name);
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
  return [...roundSelections, ...roundProofreadAdds]
    .filter((selection) => !roundProofreadDropTitles.has(selection.title))
    .map((selection, index) => {
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
  if (/故事|笑话|轶事|趣闻|典故|寓言|成语|电影|小说/u.test(paragraph)) score += 6;
  if (/问|答|说|讲/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/哭|笑|杀|逃|打|骗|偷|抓|跪|求|死|嫁|娶|抢|跑|问|答|赏/u.test(paragraph)) {
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
      if (score < 8 && !quoteHeavy) return;
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
    "# 李敖政论综艺集故事校对轮",
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
    "《李敖政论综艺集》由大量节目访谈、政论现场和综艺谈话组成，候选里混有主持人提问、来宾发言、李敖自述、选举攻防和历史资料。本轮继续按故事集口径收窄：只收李敖讲出来、可以独立复述、带人物行动或问答反转、并用来说明一层意思的小故事、笑话、历史掌故；李敖自己的事件和纯材料说明不收。",
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
    ...(manifest.proofreadDrops.length
      ? manifest.proofreadDrops.map((item) => `- ${item.title}：${item.reason}`)
      : ["- 无"]),
    "",
    "## 校对补入",
    "",
    ...(manifest.proofreadAdds.length
      ? manifest.proofreadAdds.map((item) => `- ${item.title}`)
      : ["- 无"]),
    "",
    "## 校对修边",
    "",
    ...(manifest.proofreadTrims.length
      ? manifest.proofreadTrims.map((item) => `- ${item.title}：${item.reason}`)
      : ["- 无"]),
    "",
    "## 校对说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 提取轮初选 ${manifest.originalExtractionCount} 条；校对删除 ${manifest.proofreadDropCount} 条、补入 ${manifest.proofreadAddCount} 条、修边 ${manifest.proofreadTrimCount} 条，保留 ${validation.count} 条。`,
    "- 删除重点是故事动作不足、容易变成政治事件或语录的条目。",
    "- 补入重点是总表未收、段内可独立复述且能说明一层意思的小故事。",
    "- 故事正文均来自源文原段或段内原文截取，没有改写。",
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
  if (process.argv.includes("--scan-only")) {
    console.log(
      JSON.stringify(
        {
          book: BOOK,
          sourceRoot: path.relative(ROOT, SOURCE_ROOT),
          sourceFileCount: sourceFiles().length,
          candidateScan: CANDIDATE_SCAN,
          candidateCount: candidateCount()
        },
        null,
        2
      )
    );
    return;
  }
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
    originalExtractionCount: roundSelections.length,
    selectionCount: roundSelections.length,
    proofreadDropCount: roundProofreadDrops.length,
    proofreadDrops: roundProofreadDrops,
    proofreadTrimCount: roundProofreadTrims.length,
    proofreadTrims: roundProofreadTrims,
    proofreadAddCount: roundProofreadAdds.length,
    proofreadAdds: roundProofreadAdds,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖亲自讲成可独立复述、带人物行动或问答反转、并用于说明道理的小故事、笑话、历史掌故；排除李敖自身事件、节目流程、纯时政连续叙述、资料展示和无情节概念。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，机器候选 ${candidateCount()} 条。`,
      `提取轮初选 ${roundSelections.length} 条；校对删除 ${roundProofreadDrops.length} 条、补入 ${roundProofreadAdds.length} 条、修边 ${roundProofreadTrims.length} 条，保留 ${rows.length} 条。`,
      "正文均按源文原段或段内原文截取。",
      "校对轮继续剔除事件化、语录化条目，并补入遗漏的独立故事。"
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
