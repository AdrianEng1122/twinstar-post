export type PaperThemeId = "vintage" | "sepia" | "monochrome" | "modern";

export interface PaperThemeConfig {
  id: PaperThemeId;
  name: string;
  icon: string;
  desc: string;
  paperBg: string;
  paperBorder: string;
  inkText: string;
  mutedText: string;
  stripBg: string;
  boxBg: string;
  badgeRed: string;
  badgeBlue: string;
  meshColor: string;
}

export const PAPER_THEMES: Record<PaperThemeId, PaperThemeConfig> = {
  vintage: {
    id: "vintage",
    name: "经典米黄",
    icon: "📜",
    desc: "传统报章米黄羊皮纸质感，墨香沉稳",
    paperBg: "#F6F0E6",
    paperBorder: "#141414",
    inkText: "#141414",
    mutedText: "#555555",
    stripBg: "#EAE2D4",
    boxBg: "#EAE2D4",
    badgeRed: "#B91C1C",
    badgeBlue: "#1E3A5F",
    meshColor: "#F6F0E6",
  },
  sepia: {
    id: "sepia",
    name: "晨间暖咖",
    icon: "☕",
    desc: "暖咖色调温润护眼，如伴咖啡晨读",
    paperBg: "#EDE2CD",
    paperBorder: "#2E1C12",
    inkText: "#22130C",
    mutedText: "#5E483A",
    stripBg: "#E1D2BA",
    boxBg: "#E1D2BA",
    badgeRed: "#9E2A2B",
    badgeBlue: "#274C77",
    meshColor: "#EDE2CD",
  },
  monochrome: {
    id: "monochrome",
    name: "黑白铅印",
    icon: "🖨️",
    desc: "1950年代经典新闻排字铅印，高对比黑白",
    paperBg: "#EFEFEF",
    paperBorder: "#111111",
    inkText: "#000000",
    mutedText: "#4A4A4A",
    stripBg: "#E2E2DF",
    boxBg: "#E2E2DF",
    badgeRed: "#262626",
    badgeBlue: "#3B3B3B",
    meshColor: "#EFEFEF",
  },
  modern: {
    id: "modern",
    name: "现代大报",
    icon: "🗞️",
    desc: "现代顶级大报微白纸张，极度清晰明快",
    paperBg: "#FCFBF8",
    paperBorder: "#181818",
    inkText: "#111111",
    mutedText: "#555555",
    stripBg: "#F2EFE8",
    boxBg: "#F2EFE8",
    badgeRed: "#B91C1C",
    badgeBlue: "#1E3A5F",
    meshColor: "#FCFBF8",
  },
};
