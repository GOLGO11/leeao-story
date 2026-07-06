const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = process.cwd();
const BOOK = "挑战李敖";
const SLUG = "tiaozhan_li_ao";
const ROUND = "story_round1";
const STATUS = "校对轮";
const ID_PREFIX = "TZLA";
const OUT_DIR = path.join(ROOT, "data", "books", SLUG);
const NOTES_PATH = path.join(ROOT, "notes", `${SLUG}_story_round1.md`);
const CANDIDATE_SCAN = `notes/${SLUG}_candidate_scan.tsv`;

const selections = [
  { prefix: "001", paragraph: 10, title: "索摩查是我们的狗娘养的" },
  {
    prefix: "001",
    paragraph: 32,
    title: "日本官员怕分到韩国",
    start: "我告诉大家一个故事，过去在日本人统治韩国",
    end: "这是很了不起的人间正义。"
  },
  {
    prefix: "002",
    paragraph: 8,
    title: "父子骑驴被人一路批评",
    start: "使我们想起这个笑话里那个故事",
    end: "就是不晓得如何是好。"
  },
  {
    prefix: "002",
    paragraph: 30,
    title: "抢银人眼里只有银子",
    start: "就在中国古代的《列子》",
    end: "没有别的东西。"
  },
  {
    prefix: "003",
    paragraph: 8,
    title: "魏道明在联合国讲给蒋介石听",
    start: "我记得过去在联合国台湾还没有退出去的时候",
    end: "讲给他的领袖听。"
  },
  {
    prefix: "005",
    paragraph: 34,
    title: "洞山对老师半肯半不肯",
    start: "我讲一个故事给大家听，过去在禅宗里面",
    end: "所以我对老师要半肯半不肯，又肯定他，又不肯定他。"
  },
  {
    prefix: "007",
    paragraph: 42,
    title: "胡适说屋子底下都是爱国者",
    start: "我讲一个故事给你听，在1937年的时候",
    end: "没有人是汉奸。"
  },
  { prefix: "009", paragraph: 10, title: "老橡树上的黄丝带" },
  {
    prefix: "009",
    paragraph: 12,
    title: "老祖母的人死观",
    start: "讲到这里，我给大家讲一个故事",
    end: "这个老祖母是哲学家。"
  },
  {
    prefix: "009",
    paragraph: 13,
    title: "小女孩说我们七个",
    start: "这本书里面有一首诗",
    end: "这个诗人华兹华斯就问她说有人死掉了，她不管，还是七个。"
  },
  { prefix: "010", paragraph: 9, title: "巴顿打伤兵又说该吻他" },
  { prefix: "010", paragraph: 10, title: "清教徒让仆人上甲板打海盗" },
  {
    prefix: "010",
    paragraph: 15,
    title: "揭飞碗的人喊我包了",
    start: "我告诉大家这个典故，就是赌钱的时候",
    end: "就变成捞过界的叫揭飞碗。"
  },
  {
    prefix: "012",
    paragraph: 11,
    title: "吴稚晖补信说推荐作废",
    start: "这个人叫做吴稚晖",
    end: "你还是不要用这个张三。"
  },
  { prefix: "013", paragraph: 8, title: "玛丽安德森为旅馆女职员独唱" },
  {
    prefix: "013",
    paragraph: 12,
    title: "绑在铁轨上的太太夸体贴",
    start: "这幅漫画是一个人要把他太太杀掉了",
    end: "你虽然变态，可是你对别人体贴入微。"
  },
  {
    prefix: "014",
    paragraph: 7,
    title: "鹦鹉沾水救山火",
    start: "今天我先讲一个中国古代的寓言",
    end: "这是中国古代一个有名的叫做鹦鹉救火的寓言。"
  },
  {
    prefix: "017",
    paragraph: 5,
    title: "周公用玉跟祖先讨价还价",
    start: "所以你记得在古书里面记载周武王",
    end: "就好像哄小孩子一样。"
  },
  { prefix: "017", paragraph: 23, title: "鲁宾斯坦证明孩子没有钢琴天才" },
  { prefix: "017", paragraph: 26, title: "贵州强盗先杀人后抢钱" },
  { prefix: "017", paragraph: 27, title: "马太亨利被抢也感谢上帝" },
  { prefix: "018", paragraph: 30, title: "胡适们给小学生讲话全失败" },
  { prefix: "019", paragraph: 14, title: "萧振瀛做汉奸才让学生骂汉奸" },
  { prefix: "020", paragraph: 8, title: "放屁后拉椅子还是第一声最像" },
  {
    prefix: "022",
    paragraph: 38,
    title: "马武想让蒋介石一次买断皇帝票",
    start: "我记得过去一个老贼时代的国大代表叫做马武先生",
    end: "我们拿一大笔钱走路。"
  },
  {
    prefix: "024",
    paragraph: 9,
    title: "五十步笑百步",
    start: "在中国的古书里面，一部书叫《孟子》",
    end: "五十步怎么可以笑百步呢？"
  },
  {
    prefix: "024",
    paragraph: 12,
    title: "刘邦听到柏人当夜逃掉",
    start: "刘邦在这个《汉书》里面记载",
    end: "结果一个行刺案子被他躲掉了。"
  },
  {
    prefix: "024",
    paragraph: 20,
    title: "袁世凯说重要关口要有后备",
    start: "在袁世凯做总统的时候",
    end: "在任何重要的关口，都要有一个后备的人在后面。"
  },
  { prefix: "031", paragraph: 63, title: "拿破仑从科西嘉独立到法国皇帝" },
  {
    prefix: "035",
    paragraph: 9,
    title: "蒋介石说退党也要被我开除",
    start: "我讲个笑话给你听，过去国民党党员到了台湾来以后",
    end: "蒋介石桌子一拍说：不行，退党也不行，我要开除他！"
  },
  {
    prefix: "039",
    paragraph: 20,
    title: "田中角荣送钱给叛变手下",
    start: "我举个小故事给你听，我们所不喜欢的日本有一个首相叫做田中角荣",
    end: "每人送一笔钱给我走。"
  },
  { prefix: "040", paragraph: 19, title: "狱吏修理穷人给有钱人看" },
  { prefix: "041", paragraph: 6, title: "老郎官三代都不得志" },
  {
    prefix: "041",
    paragraph: 11,
    title: "死刑犯说马一年后可能飞起来",
    start: "美国一个有名的政治家",
    end: "一年之间有很多的机会，何况五十年。"
  },
  { prefix: "042", paragraph: 13, title: "李将军为了家乡回南方作战" },
  {
    prefix: "043",
    paragraph: 23,
    title: "老兵不求长腿只求力量",
    start: "一个老兵他的腿断掉了",
    end: "我只有一个腿还可以活下去。"
  },
  {
    prefix: "045",
    paragraph: 30,
    title: "梁启超一席话拜康有为为师",
    start: "记不记得当年一个小神童",
    end: "他们两个人就是康有为和梁启超。"
  },
  {
    prefix: "045",
    paragraph: 32,
    title: "塔列朗从战败国代表变主席",
    start: "大家记得西元1815年有所谓维也纳会议",
    end: "结果占尽了便宜。"
  },
  {
    prefix: "045",
    paragraph: 32,
    title: "伊诺努装聋听不清骂声",
    start: "在1923年洛桑会议的时候",
    end: "可是反是对土耳其有利的，他全部听得清楚。"
  },
  { prefix: "048", paragraph: 14, title: "小偷为使警察高兴承认多案" },
  {
    prefix: "051",
    paragraph: 7,
    title: "杜牧讨回妓女抽屉里的牙",
    start: "一个最有名的故事就是唐朝诗人杜牧的故事",
    end: "这妓女把抽屉一打开，自己找好了，里面全是牙。"
  },
  {
    prefix: "051",
    paragraph: 8,
    title: "刘玉川让妓女先喝毒酒自己跑掉",
    start: "所以文天祥就讲刘玉川的故事",
    end: "果然不出文天祥所料，最后大家都跑掉了，只剩下他一个人。"
  },
  {
    prefix: "051",
    paragraph: 31,
    title: "胡佛两个签名换贝比鲁斯一个",
    start: "大家记不记得美国当年的全垒打王叫做贝比鲁斯",
    end: "你这个总统的两个签名可以换一个全垒打王的签名。"
  },
  {
    prefix: "051",
    paragraph: 43,
    title: "陶渊明说此亦人子也",
    start: "陶渊明当年送了一个长工他儿子",
    end: "你要好好的对待他。"
  },
  {
    prefix: "051",
    paragraph: 49,
    title: "马英九梦里只接吻",
    start: "所以我还为小马哥编了一个笑话。",
    end: "就是小马哥本身问题就在这里。"
  },
  {
    prefix: "054",
    paragraph: 9,
    title: "宋太祖把后周幼主交给大臣照顾",
    start: "我告诉大家一个故事，你们都念过宋朝开国的时候",
    end: "因为一问的话，就是他使这个大臣很难处理，就表示宋太祖知道这种难题的问题我丢给你，我就不再问了。"
  },
  { prefix: "055", paragraph: 14, title: "撒切尔夫人先安慰闯祸女侍者" },
  { prefix: "056", paragraph: 11, title: "蓝色毛毯归来时农奴哭了" },
  { prefix: "056", paragraph: 18, title: "守寡老太太摸二百个铜钱" },
  { prefix: "056", paragraph: 19, title: "纪晓岚替被强暴寡妇说情" },
  {
    prefix: "056",
    paragraph: 25,
    title: "君王后砸碎玉连环",
    start: "看到齐国君王后的一个故事",
    end: "这就是解决问题的方法，你想到吗？"
  },
  {
    prefix: "056",
    paragraph: 25,
    title: "亚历山大斩开戈登结",
    start: "可是我们想想看，当亚历山大大帝东征的时候",
    end: "做了跟她人同此心，心同此理的事情。"
  },
  { prefix: "058", paragraph: 25, title: "银角大王喊名字收孙悟空" },
  { prefix: "058", paragraph: 36, title: "杜鲁门说政治系学生已是政治人物" },
  {
    prefix: "061",
    paragraph: 19,
    title: "笑林广记说只放下半截",
    start: "《笑林广记》这个笑话书有一个特色",
    end: "这么一个黄色的笑话。"
  },
  {
    prefix: "063",
    paragraph: 7,
    title: "柯立芝让工人跑去告诉总统夫人",
    start: "美国有一个总统叫做柯立芝",
    end: "好，你跑步到前面去告诉总统夫人。"
  },
  { prefix: "063", paragraphs: [8, 9], title: "农夫的驴先笑后哭" },
  { prefix: "063", paragraph: 17, title: "萧同兹坐半个月计程车等司机回头" },
  {
    prefix: "064",
    paragraph: 18,
    title: "贾岛推敲僧敲月下门",
    start: "唐朝一个诗人叫做贾岛",
    end: "所以1500多年来，大家就认为这个敲字是比推字好。"
  },
  {
    prefix: "070",
    paragraph: 27,
    title: "高斯速算一到一百",
    start: "大家记不记得，以前有一个有名的数学家叫做高斯",
    end: "他立刻就解出答案了。"
  },
  {
    prefix: "070",
    paragraph: 27,
    title: "小学生作文天雨停赛",
    start: "还有你们作文也发生这个现象",
    end: "天雨停赛。"
  },
  {
    prefix: "071",
    paragraph: 17,
    title: "欧阳修六字写狗被马踢死",
    start: "好比说我告诉你，欧阳修的时代",
    end: "一个字都不能改了。"
  },
  { prefix: "071", paragraph: 19, title: "甜蜜的十一月全是十一月三十日" },
  {
    prefix: "072",
    paragraph: 25,
    title: "修女宁做潘金莲不做吕秀莲",
    start: "我今天讲一个笑话给大家听。",
    end: "而是做吕秀莲。"
  },
  {
    prefix: "072",
    paragraph: 27,
    title: "流浪汉拿走女人的凯迪拉克",
    start: "这个笑话是说，有一个人是流浪汉",
    end: "所以我就拿走了她的凯迪拉克。"
  },
  {
    prefix: "076",
    paragraph: 9,
    title: "精神病人说鸡不知道我不是米",
    start: "我说一个人他得了精神病",
    end: "可是鸡不知道。"
  },
  {
    prefix: "076",
    paragraph: 50,
    title: "闯红灯的人没看到警察",
    start: "有一个人在开汽车，前面有红灯他就冲过去了",
    end: "台湾的这个红灯仅供参考，并不是阻止你的。"
  },
  {
    prefix: "077",
    paragraph: 30,
    title: "凯撒听见三月十五日还没过去",
    start: "在莎士比亚的剧本里面，有一次凯撒",
    end: "结果凯撒一走进去就被杀掉了。"
  },
  {
    prefix: "080",
    paragraph: 14,
    title: "阿加莎小说里四个尸体变五个",
    start: "使我想起一本小说",
    end: "反正你杀了四个，你杀五个算了，都丢给他了。"
  },
  {
    prefix: "081",
    paragraph: 2,
    title: "混沌被爱到七窍流血",
    start: "大家记得古代庄子一个有名的寓言",
    end: "你的爱害死了祂。"
  },
  {
    prefix: "081",
    paragraph: 7,
    title: "曾子临死也要换掉贵族席子",
    start: "大家记不记得曾子死的时候",
    end: "用一个高度标准来爱他。"
  },
  {
    prefix: "081",
    paragraph: 23,
    title: "亚玛里的妓女为革命筹款",
    start: "大家看到没有，俄国小说《亚玛》",
    end: "她是自我牺牲的。"
  },
  {
    prefix: "084",
    paragraph: 5,
    title: "崇祯挖李自成祖坟也挡不住亡国",
    start: "在中国明朝的末年",
    end: "李自成还是打进了北京。"
  },
  {
    prefix: "084",
    paragraph: 29,
    title: "艾森豪让尼克松替他选一个",
    start: "后来他们当选以后，艾森豪总统做了一件事情",
    end: "并且训练他怎么样解决这个问题。"
  },
  {
    prefix: "084",
    paragraph: 35,
    title: "西太后笑许世英不肯外放发财",
    start: "大家记不记得有一个有名的官叫做许世英",
    end: "给你A钱的机会，你不去A。"
  },
  {
    prefix: "085",
    paragraph: 60,
    title: "托斯卡尼尼说有音乐的地方就是圣地",
    start: "过去有名的世界级的指挥家托斯卡尼尼",
    end: "有音乐的地方就是圣地。"
  },
  {
    prefix: "085",
    paragraph: 67,
    title: "希特勒婚后第二天一起自杀",
    start: "我常常举一个人做例子，就是德国的杀人魔王希特勒",
    end: "做了新郎的第二天一起都自杀了。"
  },
  {
    prefix: "090",
    paragraph: 14,
    title: "疯子说凯撒已死这句也错了",
    start: "这是英国的哲学家罗素，他曾经讲过一个故事",
    end: "可是对他还不适合。"
  },
  {
    prefix: "091",
    paragraph: 27,
    title: "山东巡抚杀了出宫招摇的安德海",
    start: "你看看清朝的宦官没有，安德海",
    end: "你可以看到清朝是多么了不起，那么样有政府制度。"
  },
  {
    prefix: "092",
    paragraph: 16,
    title: "杜勒斯说小岛托管换来原子弹泄密",
    start: "我说美国的以前的国务卿叫杜勒斯",
    end: "为了太平洋几个小岛丢掉了原子弹的秘密。"
  },
  {
    prefix: "093",
    paragraph: 13,
    title: "俞济时说真的历史我们不告诉你",
    start: "有一天俞济时跟刘绍唐见面",
    end: "真的不告诉你。"
  },
  {
    prefix: "094",
    paragraph: 11,
    title: "李宗仁退选逼蒋介石不干涉",
    start: "我讲个历史故事给大家听",
    end: "所以他以退为进。"
  },
  {
    prefix: "097",
    paragraph: 23,
    title: "凯撒休掉超不出怀疑的太太",
    start: "事实上英国的文学家莎士比亚并没有讲过这句话",
    end: "甚至被人家怀疑她可能不规矩都不可以，她应该超出怀疑之上"
  },
  {
    prefix: "100",
    paragraph: 6,
    title: "腓特烈大帝让老百姓告皇帝",
    start: "所以在德国日耳曼时代就发生过那种腓特烈大帝和风车的故事",
    end: "认为法律比皇帝还重要。"
  },
  {
    prefix: "107",
    paragraph: 7,
    title: "狙公朝三暮四哄猴子",
    start: "大家记不记得中国古代寓言",
    end: "朝三暮四和暮四朝三是一回事情，加在一起。"
  },
  {
    prefix: "107",
    paragraph: 36,
    title: "认识甲的人都投乙的票",
    start: "美国的一个笑话，甲乙两个人共同竞选议员",
    end: "因为讨厌甲，所以要投乙的票。"
  },
  {
    prefix: "108",
    paragraph: 5,
    title: "神灯第三个愿望变成月经棉",
    start: "大家记不记得《天方夜谭》的故事",
    end: "他就变成了一条月经棉。"
  }
];

const excludedByStandard = [
  "李敖自己的官司、藏书、被查禁、家庭、朋友来往和选举操作经历，不作为故事条目。",
  "纯粹时政资料、文件摘录、候选人政见、党派攻防、来电发问和长篇评论不收。",
  "只有典故名或单句影射、没有人物行动和收束的材料不收。",
  "同一故事在本书内反复出现时，只留更完整、较少夹杂评论的一处。"
];

const ORIGINAL_EXTRACTION_COUNT = 84;

const proofreadDrops = new Map([
  ["张鸿学说搞革命你不敢", "立法院争吵中的一句机锋，人物行动和故事收束都太薄，校对轮删除。"],
  ["防风氏后至与孔子后问马", "主体是字义考证和古文解释，不是李敖讲成的小故事，校对轮删除。"],
  ["甘地说英国绅士私下支持印度独立", "只是一句自传式政治观察，缺少情节推进，校对轮删除。"],
  ["蒋介石礼拜天查张群办公室", "偏威权政治事件片段，缺少独立小故事的反转和收束，校对轮删除。"],
  ["艾德礼做丘吉尔副手", "主体是二战政治制度案例和人物履历说明，校对轮按事件材料删除。"],
  ["胡适父亲棺中无头", "偏史实疑案和材料说明，缺少李敖讲成故事的完整情节，校对轮删除。"]
]);

const proofreadAdds = [
  "宋太祖把后周幼主交给大臣照顾",
  "贾岛推敲僧敲月下门",
  "欧阳修六字写狗被马踢死",
  "凯撒听见三月十五日还没过去",
  "混沌被爱到七窍流血",
  "艾森豪让尼克松替他选一个"
];

const proofreadSplits = [
  "把“塔列朗从战败国代表变主席”段内的伊诺努装聋另列一条，避免一个条目混两则谈判故事。",
  "把“君王后砸玉连环亚历山大斩结”拆成君王后、亚历山大两条，标题与正文一一对应。",
  "把“高斯速算与作文天雨停赛”拆成高斯速算和天雨停赛两条，避免一个条目混两则课堂故事。"
];

const proofreadTrims = [
  "胡适说屋子底下都是爱国者",
  "周公用玉跟祖先讨价还价",
  "袁世凯说重要关口要有后备",
  "田中角荣送钱给叛变手下",
  "老兵不求长腿只求力量",
  "陶渊明说此亦人子也",
  "笑林广记说只放下半截",
  "柯立芝让工人跑去告诉总统夫人",
  "阿加莎小说里四个尸体变五个",
  "曾子临死也要换掉贵族席子",
  "亚玛里的妓女为革命筹款",
  "崇祯挖李自成祖坟也挡不住亡国",
  "希特勒婚后第二天一起自杀",
  "杜勒斯说小岛托管换来原子弹泄密",
  "俞济时说真的历史我们不告诉你",
  "李宗仁退选逼蒋介石不干涉",
  "认识甲的人都投乙的票",
  "神灯第三个愿望变成月经棉"
];

const candidateMarkers = [
  "故事",
  "笑话",
  "有一次",
  "有一天",
  "一天",
  "忽然",
  "突然",
  "不料",
  "结果",
  "后来",
  "最后",
  "原来",
  "问",
  "答",
  "说",
  "讲",
  "骂",
  "哭",
  "杀",
  "逃",
  "打",
  "骗",
  "偷",
  "抓",
  "跪",
  "求",
  "死",
  "梦",
  "醒",
  "嫁",
  "娶",
  "皇帝",
  "太后",
  "公主",
  "将军",
  "和尚",
  "妓女",
  "强盗",
  "监狱",
  "坐牢",
  "轶事",
  "趣闻",
  "典故",
  "寓言",
  "小孩",
  "儿子",
  "太太",
  "夫人",
  "父亲",
  "母亲",
  "老师",
  "学生",
  "医生",
  "律师"
];

function findSourceRoot() {
  const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
  if (!corpusDir) throw new Error("Cannot find corpus directory");
  const categoryDir = fs
    .readdirSync(path.join(ROOT, corpusDir))
    .find((name) => name.startsWith("010."));
  if (!categoryDir) throw new Error("Cannot find speech category directory");
  const bookDir = fs
    .readdirSync(path.join(ROOT, corpusDir, categoryDir))
    .find((name) => name.startsWith("002."));
  if (!bookDir) throw new Error("Cannot find source book directory");
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
    .filter((entry) => entry.isFile() && /^\d+\..*\.txt$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function fileForPrefix(prefix) {
  const fileName = sourceFiles().find((name) => name.startsWith(`${prefix}.`));
  if (!fileName) throw new Error(`Cannot find source file for prefix ${prefix}`);
  return fileName;
}

function lineNumberAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

function splitParagraphObjects(source) {
  let cursor = 0;
  return source
    .split(/\n\s*\n/u)
    .map((raw) => {
      const text = raw.trim();
      if (!text) return null;
      const startIndex = source.indexOf(text, cursor);
      if (startIndex < 0) throw new Error(`Cannot locate paragraph text near ${cursor}`);
      const endIndex = startIndex + text.length;
      cursor = endIndex;
      return { text, startIndex, endIndex };
    })
    .filter(Boolean);
}

function selectByMarkers(source, selection) {
  const startIndex = source.indexOf(selection.start);
  if (startIndex < 0) throw new Error(`Start marker not found for ${selection.title}`);
  const endIndex = source.indexOf(selection.end, startIndex);
  if (endIndex < 0) throw new Error(`End marker not found for ${selection.title}`);
  const endExclusive = endIndex + selection.end.length;
  return {
    text: source.slice(startIndex, endExclusive).trim(),
    lineRange: `${lineNumberAt(source, startIndex)}-${lineNumberAt(source, endExclusive)}`
  };
}

function selectByParagraphs(source, selection) {
  const paragraphs = splitParagraphObjects(source);
  const numbers = selection.paragraphs || [selection.paragraph];
  const selected = numbers.map((number) => {
    const paragraph = paragraphs[number - 1];
    if (!paragraph) throw new Error(`Paragraph ${number} not found for ${selection.title}`);
    return paragraph;
  });
  return {
    text: selected.map((paragraph) => paragraph.text).join("\n\n"),
    lineRange: `${lineNumberAt(source, selected[0].startIndex)}-${lineNumberAt(
      source,
      selected[selected.length - 1].endIndex
    )}`
  };
}

function selectStory(selection) {
  const sourceFile = fileForPrefix(selection.prefix);
  const source = readSource(sourceFile);
  const selected =
    selection.start && selection.end
      ? selectByMarkers(source, selection)
      : selectByParagraphs(source, selection);
  return { ...selected, sourceFile };
}

function storyId(index) {
  return `${ID_PREFIX}${String(index + 1).padStart(3, "0")}`;
}

function buildRows() {
  return selections.map((selection, index) => {
    const selected = selectStory(selection);
    const sourceId = selection.paragraphs
      ? selection.paragraphs.map((number) => `${selection.prefix}#P${number}`).join(";")
      : `${selection.prefix}#P${selection.paragraph || "segment"}`;
    return {
      id: storyId(index),
      book: BOOK,
      book_slug: SLUG,
      title: selection.title,
      source_ids: sourceId,
      source_file: selected.sourceFile,
      source_lines: selected.lineRange,
      char_count: String(selected.text.length),
      story_text: selected.text
    };
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/u.test(text)) return `"${text.replace(/"/gu, '""')}"`;
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
  fs.writeFileSync(
    filePath,
    `${[headers.join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))]
      .join("\n")
      .trim()}\n`,
    "utf8"
  );
}

function writeTxt(filePath, rows) {
  const blocks = rows.map((row) =>
    [
      `【${row.id}】${row.title}`,
      `书名：${row.book}`,
      `来源：${row.source_file}:${row.source_lines}`,
      `字数：${row.char_count}`,
      "",
      row.story_text
    ].join("\n")
  );
  fs.writeFileSync(filePath, `${blocks.join("\n\n---\n\n")}\n`, "utf8");
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function parseCsv(text) {
  const rows = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    current += char;
    if (char === '"' && text[i + 1] === '"') {
      current += text[i + 1];
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "\n" && !quoted) {
      rows.push(parseCsvLine(current.replace(/\r?\n$/u, "")));
      current = "";
    }
  }
  if (current.trim()) rows.push(parseCsvLine(current));
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
    throw new Error(
      `Duplicate story ids in aggregate: ${duplicateIds.map((row) => row.id).join(", ")}`
    );
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
  if (/故事|笑话|轶事|趣闻|典故|寓言|有一次|有一天/u.test(paragraph)) score += 6;
  if (/问|答|说|讲/u.test(paragraph)) score += 2;
  if ((paragraph.match(/[“”]/gu) || []).length >= 4) score += 2;
  if (/骂|哭|杀|逃|打|骗|偷|抓|跪|求|死|梦|醒|嫁|娶|抢|跑/u.test(paragraph)) {
    score += 2;
  }
  if (
    /皇帝|太后|公主|将军|和尚|妓女|强盗|监狱|坐牢|小孩|儿子|太太|夫人|父亲|母亲|老师|学生|医生|律师/u.test(
      paragraph
    )
  ) {
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
      const actionHeavy =
        /故事|笑话|有一次|有一天|忽然|突然|不料|结果|后来|最后|原来|问|答|说|讲|骂|哭|杀|逃|打|骗|偷|抓|跪|求|死|梦|醒|嫁|娶|抢|跑|皇帝|太后|公主|将军|和尚|妓女|强盗|监狱|坐牢|轶事|趣闻|典故|寓言|小孩|儿子|太太|夫人|父亲|母亲|老师|学生|医生|律师/u.test(
          paragraph.text
        );
      if (!found.length && !quoteHeavy && !actionHeavy) return;
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
  return Math.max(0, fs.readFileSync(candidatePath, "utf8").trim().split(/\r?\n/u).length - 1);
}

function writeNotes(rows, validation, aggregate, manifest) {
  fs.mkdirSync(path.dirname(NOTES_PATH), { recursive: true });
  const proofreadDropLines = Array.from(proofreadDrops, ([title, reason]) => `- ${title}：${reason}`);
  const proofreadAddLines = proofreadAdds.map((title) => `- ${title}`);
  const proofreadSplitLines = proofreadSplits.map((item) => `- ${item}`);
  const proofreadTrimLines = proofreadTrims.map((title) => `- ${title}`);
  const lines = [
    "# 挑战李敖故事校对轮",
    "",
    `- 轮次：${ROUND}`,
    `- 状态：${STATUS}`,
    `- 来源目录：${path.relative(ROOT, SOURCE_ROOT)}`,
    `- 候选扫描：${CANDIDATE_SCAN}`,
    `- 候选条数：${manifest.candidateCount}`,
    `- 提取轮初选：${manifest.originalExtractionCount} 条`,
    `- 校对轮删除：${manifest.proofreadDropCount} 条`,
    `- 校对轮补入：${manifest.proofreadAddCount} 条`,
    `- 校对轮拆分：${manifest.proofreadSplitCount} 处`,
    `- 校对轮截短：${manifest.proofreadTrimCount} 条`,
    `- 校对轮保留：${validation.count} 条`,
    `- 单书总字数：${validation.totalChars}`,
    `- 汇总总数：${aggregate.rows.length} 条`,
    "",
    "## 口径",
    "",
    "《挑战李敖》是连续节目逐字稿，包含大量时政论述、来电问答、文件展示和李敖个人选举/维权经历。校对轮继续收紧：只收李敖讲出来、可从节目语境中独立复述、带人物行动或问答反转、并明显用于说明道理的小故事、笑话、寓言、掌故和人物短事；删除政治事件片段、制度材料、李敖自身经历和只有一句机锋的条目。",
    "",
    "## 入选条目",
    "",
    ...rows.map(
      (row) => `- ${row.id} ${row.title}：${row.source_file}:${row.source_lines}（${row.char_count}字）`
    ),
    "",
    "## 本轮排除重点",
    "",
    ...excludedByStandard.map((item) => `- ${item}`),
    "",
    "## 校对轮删除",
    "",
    ...proofreadDropLines,
    "",
    "## 校对轮补入",
    "",
    ...proofreadAddLines,
    "",
    "## 校对轮拆分",
    "",
    ...proofreadSplitLines,
    "",
    "## 校对轮截短",
    "",
    ...proofreadTrimLines,
    "",
    "## 提取说明",
    "",
    `- 候选扫描覆盖全书 ${manifest.sourceFileCount} 个正文文件，机器候选 ${manifest.candidateCount} 条。`,
    `- 提取轮初选 ${manifest.originalExtractionCount} 条；校对轮删除 ${manifest.proofreadDropCount} 条，补入 ${manifest.proofreadAddCount} 条，拆分 ${manifest.proofreadSplitCount} 处，保留 ${validation.count} 条。`,
    "- 校对轮重点处理节目逐字稿里的长论述包裹问题：正文仍为源文原句，只缩小起止边界。",
    "- 本书内重复出现的同一故事只留较完整、较少夹杂现场评论的一处，如“蓝色毛毯”“马飞起来”等。",
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
    selectionCount: selections.length,
    originalExtractionCount: ORIGINAL_EXTRACTION_COUNT,
    proofreadDropCount: proofreadDrops.size,
    proofreadDrops: Array.from(proofreadDrops, ([title, reason]) => ({ title, reason })),
    proofreadAddCount: proofreadAdds.length,
    proofreadAdds,
    proofreadSplitCount: proofreadSplits.length,
    proofreadSplits,
    proofreadTrimCount: proofreadTrims.length,
    proofreadTrims,
    count: rows.length,
    totalChars: validation.totalChars,
    aggregateCount: aggregate.rows.length,
    aggregateBooks: aggregate.books,
    criteria:
      "只收李敖在节目中讲成可独立复述、带人物行动或问答反转、并用于说明道理的小故事、笑话、寓言、掌故和人物短事；排除李敖自身事件、纯时政连续叙述、文件材料、来电提问、政见和无情节典故。",
    excludedByStandard,
    extractionNotes: [
      `候选扫描覆盖 ${sourceFiles().length} 个正文文件，通用候选 ${candidateCount()} 条。`,
      `提取轮初选 ${ORIGINAL_EXTRACTION_COUNT} 条；校对轮删除 ${proofreadDrops.size} 条，补入 ${proofreadAdds.length} 条，拆分 ${proofreadSplits.length} 处，保留 ${rows.length} 条。`,
      `校对轮截短 ${proofreadTrims.length} 条被现场问答、时政评论或后续例证包住的条目；故事正文未改写，均按源文原段或段内原文截取。`,
      "本轮对重复故事只留一处，并优先选择较完整、较少夹杂现场评论的版本。"
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
        candidateCount: candidateCount(),
        ok: validation.ok
      },
      null,
      2
    )
  );
}

main();
