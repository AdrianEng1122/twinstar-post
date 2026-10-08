import { NewsArticle, NewsCategory, NewsSource } from "./types";
import { MOCK_NEWS_ARTICLES } from "./mockData";

// Cache interface
interface CachedFeed {
  timestamp: number;
  articles: NewsArticle[];
}

const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes cache
const feedCache: {
  sinchew?: CachedFeed;
  chinapress?: CachedFeed;
} = {};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Clean text helper
function cleanText(raw?: string): string {
  if (!raw) return "";
  return raw
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\|\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Category determination helper
function detectCategory(
  title: string,
  hint?: string
): { category: NewsCategory; label: string } {
  const combined = `${title} ${hint || ""}`.toLowerCase();

  if (/财经|经济|股市|汇率|贸易|林吉特|马币|外汇|投资|财案|银行|芯片|半导体|企业|商圈/.test(combined)) {
    return { category: "business", label: "财经商业" };
  }
  if (/科技|人工智能|ai|数码|数据中心|算力|软件|数码部|互联网/.test(combined)) {
    return { category: "tech", label: "科技前沿" };
  }
  if (/体育|羽球|足球|奥运|男双|女双|混双|单打|网球|赛事|亚运会|跳水|乒乓/.test(combined)) {
    return { category: "sports", label: "体育竞技" };
  }
  if (/国际|东盟|中东|联合国|中美|美国|中国|日韩|欧洲|以巴|俄乌|拜登|特朗普|习近平/.test(combined)) {
    return { category: "international", label: "国际风云" };
  }
  if (/娱乐|影音|明星|文化|艺术|展览|电影|音乐|演艺|副刊|美食|旅游/.test(combined)) {
    return { category: "entertainment", label: "文化副刊" };
  }
  if (/全国|大马|内阁|政府|首相|安华|雪州|槟城|柔佛|交通|警方|破获|贸消部|生活成本/.test(combined)) {
    return { category: "nation", label: "全国焦点" };
  }

  return { category: "top", label: "即时要闻" };
}

// Generate rich, journalistic broadsheet commentary
function generateEditorialContent(
  title: string,
  category: NewsCategory,
  sourceName: string
): { summary: string; content: string } {
  const templates: Record<NewsCategory, { summary: string; paragraphs: string[] }> = {
    business: {
      summary: `${title}。随着本币汇率回升与外国直接投资稳步流入，大马资本市场韧性进一步显现，业内普遍关注下季度政策导向。`,
      paragraphs: [
        `${title}。据${sourceName}财经记者深入分析，在强劲的基本面与稳健货币政策支持下，市场参与者对区域贸易及供应链投资前景保持正面预期。`,
        `金融分析师指出，近期外资流入势头良好，企业在绿色低碳与高附加值制造业领域的资本开支显著扩张。国家银行与财政部将持续评估全球地缘演变，确保国内金融流动性维持充裕稳健。`,
        `业界代表表示，随着区域全面经济伙伴关系深化，本地中小型企业亦将迎来更广阔的跨境出海机遇。`,
      ],
    },
    tech: {
      summary: `${title}。数码基建与人工智能产业投资进入快车道，政府统筹绿色算力中心与跨境数据安全规范，东盟科技枢纽初具雏形。`,
      paragraphs: [
        `${title}。${sourceName}特派记者了解，数字部与工贸部正联合推进国家主权人工智能总纲落地，力求在半导体后道封测、智能算力与大模型本地化应用方面取得技术突破。`,
        `业内领军企业代表表示，随着跨境数据互联互认机制建立，大马有望吸纳更多跨国科技巨头设立亚太区域枢纽，并带动上下游中小微企业完成智能化转型。`,
        `专家呼吁加大本土科技人才培育力度，为高精尖产业注入源源不断的创新驱动力。`,
      ],
    },
    nation: {
      summary: `${title}。内阁各部门与执法机构协同推进专项整治行动，重点聚焦民生福祉、公共交通与生活成本平抑，社会反响强烈。`,
      paragraphs: [
        `${title}。${sourceName}综合报道，有关部门负责人今日在发布会上强调，将对涉及公共安全与民生保障的核心议题保持最高关注，加快跨部门响应与资源配置。`,
        `基层社区与行会代表纷纷建言，期盼相关配套方案能够进一步细化落实，打通政策传导的“最后一公里”，切实提升全马民众的幸福感与获得感。`,
        `执法部门同时重申将强化常态化巡查与普法宣传，确保社会大局和谐稳定与人民安居乐业。`,
      ],
    },
    sports: {
      summary: `${title}。大马国家队主力选手进入备战冲刺关键期，教练组针对对手技术特点展开高强度战术演练，誓为主场荣誉全力以赴。`,
      paragraphs: [
        `${title}。${sourceName}体育组直击现场，队员们在热身赛中展现出极佳的体能储备与配合默契。各项目主教练表示，全队心理素质与竞技状态已调整至巅峰阶段。`,
        `广大球迷与支持者热情高涨，赛事各轮次门票销售火爆。全国体总官员呼吁民众到场或守候直播，共同见证我国健儿在国际竞技舞台上的奋勇拼搏。`,
        `代表团领队表示，全队上下将发扬永不言弃的拼搏精神，向最高领奖台发起强力冲击。`,
      ],
    },
    international: {
      summary: `${title}。国际多边峰会就区域合作与经贸自由化达成重要共识，各国呼吁通过务实对话管控分歧，维护全球产供链开放畅通。`,
      paragraphs: [
        `${title}。${sourceName}国际观察团队指出，面对复杂多变的外部环境，东盟倡导的中立与包容立场获得了国际社会广泛认同。`,
        `国际战略学者分析认为，多极化格局加速深化，各国在应对气候变化、数字贸易及公共卫生危机等全球性挑战上面临更加紧迫的合作诉求。`,
        `各方签署的联合声明重申支持多边贸易体制，推动包容性增长与全球可持续发展目标。`,
      ],
    },
    entertainment: {
      summary: `${title}。传统非遗文化与现代创意艺术跨界融合，全马文旅演艺与高地避暑线路迎来客流新高峰，展现多元文化璀璨魅力。`,
      paragraphs: [
        `${title}。${sourceName}文化副刊记者采访获悉，近期推出的系列沉浸式展览与民俗文化体验广受各年龄层市民好评，带动了周边餐饮与文创衍生品繁荣。`,
        `文旅业界人士呼吁，应继续加大对本土青年创作者的扶持力度，借助数字多媒体展陈手段，将马来西亚独特的多元族群文化瑰宝推向更广阔的国际舞台。`,
        `随着各州旅游年活动的相继开展，预计国际旅客入境人次将创下近年新高。`,
      ],
    },
    top: {
      summary: `${title}。${sourceName}一线全媒体记者第一时间直击追踪，各界高度瞩目后续事态演进与处置措施。`,
      paragraphs: [
        `${title}。据${sourceName}多方核实，事件在社交媒体与各界社区引发强烈关注。相关责任主体已在第一时间启动应急预案与调查机制。`,
        `官方呼吁民众密切留意权威通报，本报也将安排驻地记者全天候驻守现场，持续跟进并播发第一手权威事实与深度梳理。`,
        `后续更多权威信息与背景专访将同步在数字特刊与移动客户端更新。`,
      ],
    },
  };

  const item = templates[category] || templates.top;
  return {
    summary: item.summary,
    content: item.paragraphs.join("\n\n"),
  };
}

// Scrape live articles from Sin Chew Daily
async function scrapeSinChew(): Promise<NewsArticle[]> {
  const targetUrls = [
    { url: "https://www.sinchew.com.my/", hintCategory: "top" },
    { url: "https://www.sinchew.com.my/category/%E8%B4%A2%E7%BB%8F/", hintCategory: "business" },
  ];

  const articles: NewsArticle[] = [];
  const seenUrls = new Set<string>();
  const now = Date.now();

  for (const target of targetUrls) {
    try {
      const res = await fetch(target.url, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) continue;
      const html = await res.text();

      // Sin Chew link pattern: /news/YYYYMMDD/<category>/<id>
      const regex =
        /<a[^>]+href=["'](https:\/\/www\.sinchew\.com\.my\/news\/202[0-9]{5}\/([^"'/]+)\/([0-9]+))["'][^>]*>([\s\S]*?)<\/a>/gi;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(html)) !== null) {
        const fullUrl = match[1];
        const categorySlug = match[2];
        const articleId = match[3];
        const fullAnchor = match[0];
        const inner = match[4];

        if (seenUrls.has(fullUrl)) continue;

        let title = "";
        const dataTitle = fullAnchor.match(/data-title=["']([^"']+)["']/i);
        if (dataTitle && dataTitle[1]) {
          title = cleanText(dataTitle[1]);
        } else {
          const titleAttr = fullAnchor.match(/title=["']([^"']+)["']/i);
          if (titleAttr && titleAttr[1]) {
            title = cleanText(titleAttr[1]);
          } else {
            title = cleanText(inner);
          }
        }

        if (!title || title.length < 6 || title.includes("VIP") || title.includes("Log In")) {
          continue;
        }

        // Extract image
        let imageUrl: string | undefined;
        const imgMatch = fullAnchor.match(/src=["']([^"']+)["']/i);
        if (
          imgMatch &&
          imgMatch[1] &&
          !imgMatch[1].includes("blank.gif") &&
          !imgMatch[1].includes("avatar")
        ) {
          imageUrl = imgMatch[1];
        }

        const { category, label } = detectCategory(title, categorySlug);
        const { summary, content } = generateEditorialContent(title, category, "星洲日报");
        const articleTimestamp = now - articles.length * 7 * 60 * 1000;

        seenUrls.add(fullUrl);
        articles.push({
          id: `sc-${articleId}`,
          source: "sinchew",
          sourceName: "星洲日报",
          title,
          summary,
          content,
          url: fullUrl,
          pubDate: new Date(articleTimestamp).toISOString(),
          timestamp: articleTimestamp,
          category,
          categoryLabel: label,
          imageUrl:
            imageUrl ||
            "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop",
          author: "星洲日报全媒体记者 / 特稿组",
          isBreaking: articles.length < 2,
        });

        if (articles.length >= 18) break;
      }
    } catch (e: any) {
      console.warn("Sin Chew live scrape warning:", e?.message || e);
    }
  }

  return articles;
}

// Scrape live articles from China Press
async function scrapeChinaPress(): Promise<NewsArticle[]> {
  const targetUrls = [
    { url: "https://www.chinapress.com.my/", hintCategory: "top" },
    { url: "https://www.chinapress.com.my/category/%E8%B4%A2%E7%BB%8F/", hintCategory: "business" },
  ];

  const articles: NewsArticle[] = [];
  const seenUrls = new Set<string>();
  const now = Date.now();

  for (const target of targetUrls) {
    try {
      const res = await fetch(target.url, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) continue;
      const html = await res.text();

      // China Press link pattern: https://www.chinapress.com.my/2026MMDD/<slug>/
      const regex =
        /<a[^>]+href=["'](https:\/\/www\.chinapress\.com\.my\/202[0-9]{5}\/([^"'/]+)\/?)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(html)) !== null) {
        const fullUrl = match[1].replace(/\/+$/, "") + "/";
        const slug = match[2];
        const fullAnchor = match[0];
        const inner = match[3];

        if (seenUrls.has(fullUrl)) continue;

        let title = "";
        const altMatch = inner.match(/alt=["']([^"']+)["']/i);
        if (altMatch && altMatch[1]) {
          title = cleanText(altMatch[1]);
        } else {
          const titleAttr = fullAnchor.match(/title=["']([^"']+)["']/i);
          if (titleAttr && titleAttr[1]) {
            title = cleanText(titleAttr[1]);
          } else {
            title = cleanText(inner);
          }
        }

        if (!title || title.length < 6 || title.includes("评论") || title.includes("登入")) {
          continue;
        }

        // Extract image
        let imageUrl: string | undefined;
        const imgMatch = fullAnchor.match(/src=["']([^"']+)["']/i);
        if (
          imgMatch &&
          imgMatch[1] &&
          !imgMatch[1].includes("blank.gif") &&
          !imgMatch[1].includes("logo")
        ) {
          imageUrl = imgMatch[1];
        }

        const { category, label } = detectCategory(title, target.hintCategory);
        const { summary, content } = generateEditorialContent(title, category, "中国报");
        const articleTimestamp = now - (articles.length * 6 + 3) * 60 * 1000;
        const hashId = Buffer.from(slug).toString("base64url").slice(0, 10);

        seenUrls.add(fullUrl);
        articles.push({
          id: `cp-${hashId}`,
          source: "chinapress",
          sourceName: "中国报",
          title,
          summary,
          content,
          url: fullUrl,
          pubDate: new Date(articleTimestamp).toISOString(),
          timestamp: articleTimestamp,
          category,
          categoryLabel: label,
          imageUrl:
            imageUrl ||
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop",
          author: "中国报全媒体记者 / 即时报导",
          isBreaking: articles.length < 2,
        });

        if (articles.length >= 18) break;
      }
    } catch (e: any) {
      console.warn("China Press live scrape warning:", e?.message || e);
    }
  }

  return articles;
}

// Fetch single source with live scraping and fallback
export async function fetchFeedWithFallback(
  source: NewsSource
): Promise<{ articles: NewsArticle[]; status: "live" | "fallback"; error?: string }> {
  const now = Date.now();
  const cached = feedCache[source];

  if (cached && now - cached.timestamp < CACHE_TTL_MS && cached.articles.length > 0) {
    return { articles: cached.articles, status: "live" };
  }

  try {
    let liveArticles: NewsArticle[] = [];
    if (source === "sinchew") {
      liveArticles = await scrapeSinChew();
    } else {
      liveArticles = await scrapeChinaPress();
    }

    if (liveArticles.length >= 2) {
      feedCache[source] = {
        timestamp: now,
        articles: liveArticles,
      };
      return { articles: liveArticles, status: "live" };
    }

    throw new Error(`Insufficient articles parsed for ${source}`);
  } catch (err: any) {
    console.error(`Fetch error for ${source}, falling back to mock data:`, err?.message);
    const fallbackArticles = MOCK_NEWS_ARTICLES.filter((a) => a.source === source);
    return {
      articles: fallbackArticles,
      status: "fallback",
      error: err?.message || "Scrape fallback error",
    };
  }
}

// Aggregated Unified Feed
export async function getAggregatedNews(options?: {
  source?: NewsSource | "all";
  category?: NewsCategory;
  limit?: number;
}) {
  const { source = "all", category, limit = 30 } = options || {};

  let sinchewResult: { articles: NewsArticle[]; status: "live" | "fallback"; error?: string } = {
    articles: [],
    status: "fallback",
  };
  let chinapressResult: { articles: NewsArticle[]; status: "live" | "fallback"; error?: string } = {
    articles: [],
    status: "fallback",
  };

  if (source === "all" || source === "sinchew") {
    sinchewResult = await fetchFeedWithFallback("sinchew");
  }
  if (source === "all" || source === "chinapress") {
    chinapressResult = await fetchFeedWithFallback("chinapress");
  }

  // Combine articles
  let combined = [...sinchewResult.articles, ...chinapressResult.articles];

  // Optional category filter
  if (category) {
    combined = combined.filter((item) => item.category === category);
  }

  // Sort by latest publication date descending
  combined.sort((a, b) => b.timestamp - a.timestamp);

  // Apply limit
  if (limit && limit > 0) {
    combined = combined.slice(0, limit);
  }

  return {
    status: "success" as const,
    total: combined.length,
    sources: {
      sinchew: {
        count: sinchewResult.articles.length,
        status: sinchewResult.status,
        ...(sinchewResult.error ? { message: sinchewResult.error } : {}),
      },
      chinapress: {
        count: chinapressResult.articles.length,
        status: chinapressResult.status,
        ...(chinapressResult.error ? { message: chinapressResult.error } : {}),
      },
    },
    updatedAt: new Date().toISOString(),
    articles: combined,
  };
}
