export type NewsSource = "sinchew" | "chinapress";

export type NewsCategory = 
  | "top"
  | "nation"
  | "international"
  | "business"
  | "entertainment"
  | "sports"
  | "tech";

export interface NewsArticle {
  id: string;
  source: NewsSource;
  sourceName: string;
  sourceLogo?: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  pubDate: string;
  timestamp: number;
  category: NewsCategory;
  categoryLabel: string;
  imageUrl?: string;
  author?: string;
  isBreaking?: boolean;
}

export interface NewspaperEdition {
  editionDate: string;
  lunarDate: string;
  issueNumber: string;
  totalArticles: number;
  topHeadlines: NewsArticle[];
  categories: Record<NewsCategory, NewsArticle[]>;
  updatedAt: string;
}
