import { NewsArticle } from "./types";

export interface WeeklyHotArticle extends NewsArticle {
  rank: number;
  heatScore: number; // e.g. 99.8
  heatScoreFormatted: string; // e.g. "99.8k"
  trendStatus: "hot" | "surging" | "steady";
  trendBadge: string; // e.g. "连续4天霸榜 Top 1"
  timeAgoLabel: string; // e.g. "4天前 · 周一"
  sinChewPerspective?: string; // 星洲日报报道切角
  chinaPressPerspective?: string; // 中国报报道切角
  discussionCount?: string; // e.g. "18.6万 条全网讨论"
  timeline?: {
    time: string;
    title: string;
    desc: string;
  }[];
}

const now = Date.now();
const day = 24 * 3600 * 1000;

export const WEEKLY_TRENDING_ARTICLES: WeeklyHotArticle[] = [
  {
    id: "week-hot-1",
    rank: 1,
    source: "sinchew",
    sourceName: "星洲日报",
    title: "内阁拍板全面加速国家AI基础设施建设 拨款20亿设立南马与东马超级算力中心",
    summary:
      "数字部在布城宣布《国家主权人工智能发展总纲》正式获批，计划通过公私合营模式在柔佛和砂拉越建立两座绿色算力中心。多家具备国际领军实力的科技集团已签署意向备忘录，将带动数万个高薪科技岗位，成为本周全网最受瞩目的经济转型大动作。",
    content:
      "数字部部长在布城宣布，内阁今日审议通过《国家主权人工智能发展总纲》，计划通过公私合营模式在柔佛和砂拉越建立两座绿色算力中心，以满足东盟区域对算力与大数据处理的爆发式增长需求。多家具备国际领军实力的科技集团已初步签署意向备忘录，预计将带动数万个高薪科技岗位。\n\n分析人士指出，随着绿色能源走廊的铺设与跨海高容量光缆的接入，大马正从传统的半导体封测基地快速蜕变为东南亚数据中枢。财政部承诺将对算力生态入驻企业提供前所未有的税赋减免与绿色电价支持。",
    url: "https://www.sinchew.com.my/category/%E8%B4%A2%E7%BB%8F/",
    pubDate: new Date(now - 4 * day).toISOString(),
    timestamp: now - 4 * day,
    category: "tech",
    categoryLabel: "科技与产业",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    author: "星洲特派记者 / 张晓敏",
    isBreaking: true,
    heatScore: 99.8,
    heatScoreFormatted: "99.8k",
    trendStatus: "hot",
    trendBadge: "连续4天霸榜 Top 1 · 全网沸腾",
    timeAgoLabel: "4天前 · 周一重磅",
    discussionCount: "28.4万 全网热度",
    sinChewPerspective:
      "【星洲观察】聚焦国家经济转型长远红利，强调高校人才本土培养体系与中小企业智能化普及政策衔接。",
    chinaPressPerspective:
      "【中国报独家】深入柔佛算力走廊一线探访，独家披露外资科技巨头百亿资本入场时间表与周边地产商圈联动。",
    timeline: [
      {
        time: "4天前 (周一) 09:30",
        title: "内阁例会拍板总纲",
        desc: "数字部正式提交《国家主权AI发展总纲》，内阁批准20亿先期扶持资金。",
      },
      {
        time: "2天前 (周三) 14:00",
        title: "首批国际巨头签约",
        desc: "三家国际超大规模云服务商在吉隆坡签署联合意向书，柔佛基地同步奠基。",
      },
      {
        time: "昨日 (周四) 18:00",
        title: "双报持续头版跟进",
        desc: "星洲日报刊登万字智库解读，中国报独家专访跨国科技高管，热度持续霸榜。",
      },
    ],
  },
  {
    id: "week-hot-2",
    rank: 2,
    source: "sinchew",
    sourceName: "星洲日报",
    title: "林吉特兑美元汇率攀升至4.20大关 创18个月新高 央行维持稳健货币政策",
    summary:
      "受强劲外资直接投资（FDI）流入及本地经济基本面走强带动，马币在外汇市场连续数日强势上涨，突破关键心理阻力位。分析师普遍看好下季度本币资产吸引力，民间理财与跨境消费热度持续攀升。",
    content:
      "在强劲的外国直接投资（FDI）流入及本地经济基本面持续走强带动下，马币在今日外汇交易市场表现坚挺，银行分析师普遍看好下季度本币资产的吸引力与外汇储备充裕度。国家银行最新声明指出，将继续密切关注地缘政治演变，确保金融体系保持高韧性。",
    url: "https://www.sinchew.com.my/category/%E8%B4%A2%E7%BB%8F/",
    pubDate: new Date(now - 3 * day).toISOString(),
    timestamp: now - 3 * day,
    category: "business",
    categoryLabel: "财经大盘",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop",
    author: "星洲财经组 / 李冠宏",
    heatScore: 97.6,
    heatScoreFormatted: "97.6k",
    trendStatus: "surging",
    trendBadge: "全马关注 · 飙升 +92%",
    timeAgoLabel: "3天前 · 周二突围",
    discussionCount: "19.8万 讨论量",
    sinChewPerspective:
      "【星洲财经】专访国家银行前副总裁，详解汇率走强对进出口贸易与通胀水平的平衡影响。",
    chinaPressPerspective:
      "【中国报热线】直击各大钱币兑换商与海外代购商，民间换汇潮涌现，马币资产成热搜关键词。",
  },
  {
    id: "week-hot-3",
    rank: 3,
    source: "chinapress",
    sourceName: "中国报",
    title: "国内燃油与主要必需品物价平抑机制奏效 贸消部跨州突击巡查严打囤积哄抬",
    summary:
      "国内贸易及生活成本部在全马启动代号为“守护行动”的常态化跨州突击巡查，重点监测柴油、食用油、鸡蛋等民生物资供应链，确保补贴物资质优价稳，平抑生活成本。",
    content:
      "国内贸易及生活成本部在全国各地展开地毯式突击检查，副部长今日在发布会上保证，主要生活物资库存充裕，政府将对哄抬物价行为采取最严厉的法律追究。执法组同时设立了24小时公众投诉热线，鼓励消费者提供违规线索。",
    url: "https://www.chinapress.com.my/",
    pubDate: new Date(now - 2 * day).toISOString(),
    timestamp: now - 2 * day,
    category: "nation",
    categoryLabel: "民生焦点",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop",
    author: "中国报热线组 / 郑志伟",
    heatScore: 95.4,
    heatScoreFormatted: "95.4k",
    trendStatus: "hot",
    trendBadge: "民生热议榜首",
    timeAgoLabel: "2天前 · 周三",
    discussionCount: "16.5万 互动量",
    sinChewPerspective:
      "【星洲社论】呼吁健全长期市场竞争与补贴靶向机制，从根源上减轻中低收入群体的菜篮子负担。",
    chinaPressPerspective:
      "【中国报突击】随同执法人员深入清晨批发公市，现场抓拍价格标示违规，首发前线执法现场图集。",
  },
  {
    id: "week-hot-4",
    rank: 4,
    source: "sinchew",
    sourceName: "星洲日报",
    title: "雪兰莪与吉隆坡轻轨第3期贯通方案出炉 沿线增设6座换乘枢纽舒缓早晚高峰",
    summary:
      "陆路公共交通机构（APAD）公布综合轨道网络扩建细则，重点打通巴生谷至蒲种与莎阿南关键瓶颈路段，预计全线通车后日均载客量将提升35%以上，成为巴生谷通勤族全周热话。",
    content:
      "陆路公共交通机构（APAD）今日公布综合轨道网络扩建细则，重点打通巴生谷至蒲种与莎阿南关键瓶颈路段，预计日均载客量将提升35%以上。新方案融入了智慧车厢感知与无感支付闸机系统，全方位提升乘客出行便利度。",
    url: "https://www.sinchew.com.my/",
    pubDate: new Date(now - 3 * day).toISOString(),
    timestamp: now - 3 * day,
    category: "nation",
    categoryLabel: "都市交通",
    imageUrl:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop",
    author: "星洲采访组 / 陈文彬",
    heatScore: 93.1,
    heatScoreFormatted: "93.1k",
    trendStatus: "steady",
    trendBadge: "通勤族热转 · 必看路线",
    timeAgoLabel: "3天前 · 周二",
    discussionCount: "12.3万 讨论量",
  },
  {
    id: "week-hot-5",
    rank: 5,
    source: "sinchew",
    sourceName: "星洲日报",
    title: "东盟数字贸易一体化框架会议吉隆坡揭幕 十国央行推进跨境二维码统一结算协议",
    summary:
      "东盟财长及央行行长联合工作组就区域跨境数字支付清算系统达成突破性进展，未来东盟旅客和商户只需使用本土电子钱包即可无缝扫码结算，进出口换汇成本有望大降四成。",
    content:
      "东盟财长及央行行长联合工作组今日就区域跨境数字支付清算系统达成重要阶段性共识，中小微企业进出口结算成本有望压缩近四成。马来西亚作为倡导国之一，积极推进标准规范与反洗钱监管互认机制的落地。",
    url: "https://www.sinchew.com.my/category/%E5%9B%BD%E9%99%85/",
    pubDate: new Date(now - 5 * day).toISOString(),
    timestamp: now - 5 * day,
    category: "international",
    categoryLabel: "东盟风云",
    imageUrl:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop",
    author: "星洲国际组 / 林志峰",
    heatScore: 90.8,
    heatScoreFormatted: "90.8k",
    trendStatus: "steady",
    trendBadge: "区域经贸里程碑",
    timeAgoLabel: "5天前 · 上周末延续",
    discussionCount: "9.7万 讨论量",
  },
  {
    id: "week-hot-6",
    rank: 6,
    source: "chinapress",
    sourceName: "中国报",
    title: "槟城大桥扩建与智能潮汐车道启用首周 交通早高峰拥堵指数骤降40%",
    summary:
      "槟州公共工程局与交警联合通报，启用智能潮汐车道控制系统第一周，往返槟岛与威省的早高峰通行耗时平均缩短近25分钟，智能导流摄像头与动态限速标牌成效显著。",
    content:
      "槟州公共工程局与交警联合通报，启用智能潮汐车道控制系统第一周，往返槟岛与威省的早高峰通行耗时平均缩短近25分钟。当局表示下一步将联合导航软件推进实时路况推送，引导货运车辆错峰通行。",
    url: "https://www.chinapress.com.my/",
    pubDate: new Date(now - 4 * day).toISOString(),
    timestamp: now - 4 * day,
    category: "nation",
    categoryLabel: "北马要闻",
    imageUrl:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1000&auto=format&fit=crop",
    author: "中国报北马组 / 许家铭",
    heatScore: 88.6,
    heatScoreFormatted: "88.6k",
    trendStatus: "steady",
    trendBadge: "好评如潮 · 出行通畅",
    timeAgoLabel: "4天前 · 周一",
    discussionCount: "8.2万 讨论量",
  },
  {
    id: "week-hot-7",
    rank: 7,
    source: "sinchew",
    sourceName: "星洲日报",
    title: "全马华小文化传承嘉年华在槟城开幕 逾两千名师生共绘百米传统水墨长卷",
    summary:
      "由华总与星洲日报文教基金会联合主办的年度文化节在韩江中学礼堂隆重登场，两千余名师生同场创作，展现华文教育在马来西亚多元文化环境中的蓬勃生命力。",
    content:
      "由华总与星洲日报文教基金会联合主办的年度文化节今日在韩江中学礼堂隆重登场，展现华文教育在多元马来西亚社会中的坚实根基与蓬勃生机。活动现场设立了活字印刷演示、书法挥春擂台与传统华乐合奏等十余个沉浸式展区。",
    url: "https://www.sinchew.com.my/news/20260924/sports/7870592",
    pubDate: new Date(now - 1 * day).toISOString(),
    timestamp: now - 1 * day,
    category: "entertainment",
    categoryLabel: "文化副刊",
    imageUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1000&auto=format&fit=crop",
    author: "星洲北马特派员 / 黄诗琴",
    heatScore: 86.4,
    heatScoreFormatted: "86.4k",
    trendStatus: "hot",
    trendBadge: "文教年度焦点",
    timeAgoLabel: "昨日 · 持续展出",
    discussionCount: "7.9万 赞赏",
  },
  {
    id: "week-hot-8",
    rank: 8,
    source: "chinapress",
    sourceName: "中国报",
    title: "2026全英羽球公开赛前瞻：大马头号男双被列头号种子 力争打破十年冠军荒",
    summary:
      "全英羽球超级1000赛签表揭晓，我国国家队第一男双组合因近期连夺两站巡回赛冠军，以世界第一积分位列赛会一号种子，教练组透露已展开封闭式针对性备战。",
    content:
      "2026全英羽毛球公开赛种子排位今日出炉。我国头号男双凭借过去两个月的连胜战绩稳居榜首。大马羽总名宿在专访中表示，全队心理素质与默契程度已臻成熟，是近年来最具争冠相的一届。",
    url: "https://www.chinapress.com.my/",
    pubDate: new Date(now - 2 * day).toISOString(),
    timestamp: now - 2 * day,
    category: "sports",
    categoryLabel: "体坛风云",
    imageUrl:
      "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=1000&auto=format&fit=crop",
    author: "中国报体育组 / 蔡金发",
    heatScore: 84.7,
    heatScoreFormatted: "84.7k",
    trendStatus: "surging",
    trendBadge: "羽坛焦点 · 全城助威",
    timeAgoLabel: "2天前 · 周三",
    discussionCount: "11.2万 助威量",
  },
];
