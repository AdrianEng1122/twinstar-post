# 双星时报 · Twin Star Post 📰
> Awwwards 风格全景 3D 拟真数字报刊 · 星洲日报 × 中国报 联合特刊  
> An interactive 3D digital broadsheet newspaper aggregating real-time trending news from Malaysia's leading Chinese press.

---

## ✨ 核心特色 (Key Features)

1. **3D 物理纸张翻阅体验 (Interactive 3D Broadsheet)**
   - 基于 Three.js / React Three Fiber 与 Drei 构建。
   - 包含头版封面（Folded Cover）与对开大版面（Double Spread），拟真还原实体大报排版质感。
   - 纸张支持 4 款经典纸质色调切换（📜 经典米黄、☕ 晨间暖咖、🖨️ 黑白铅印、🗞️ 现代大报）。
   - 纸上所有报道、图片、摘要均支持点击，右侧平滑滑出抽屉（Drawer）查看完整长文。

2. **双报实时权威聚合 (Live News Aggregation)**
   - 自动聚合 **星洲日报 (Sin Chew Daily)** 与 **中国报 (China Press)** 实时焦点新闻。
   - 支持来源过滤（全部 / 星洲日报 / 中国报）及八大资讯分类筛选。

3. **双星 AI 温润晨间电台 (Doubao-style Humanized Voice Broadcaster)**
   - 0 延迟秒开纯客户端高速语音合成。
   - 预设 4 款精选拟人声线（🌸 晓晓 · 豆包治愈风、✨ 晓伊 · 晨读轻语、🎙️ 云希 · 暖心阳光、☕ 云健 · 专业新闻）。
   - 分篇章自动连续播报，支持 `⏮️ 上一条` / `⏭️ 下一条` 切歌及阅读原文联动。

4. **大马生活与市场脉搏 (Malaysia Living & Market Pulse)**
   - 实时汇率换算器（SGD / USD / CNY / GBP 兑 MYR）。
   - 马来西亚每周油价指标（RON95, RON97, Euro 5 Diesel）及马股综指（KLCI）。
   - 三大重点区域实时天气与 AQI 空气质量监测（吉隆坡、柔佛士姑来、哥打峇鲁）。

5. **全站聚光灯搜索 (Global Spotlight Search)**
   - 快捷键 `Ctrl + K` / `Cmd + K` 唤起全站毫秒级模糊匹配搜索。

6. **全览新闻资讯瀑布流 (More News Archive)**
   - 紧接本周热点雷达下方，支持杂志网格（Grid）与紧凑电讯（List）自由切换，无限分页加载更多。

---

## 🛠️ 技术栈 (Tech Stack)

* **框架**：Next.js 14 (App Router, Server & Client Components)
* **3D 引擎**：Three.js, `@react-three/fiber`, `@react-three/drei`
* **动效**：Framer Motion
* **样式**：Tailwind CSS (自适应暗色豪华报刊风格 + 字体排版)
* **图标**：Lucide React
* **数据聚合**：RSS Parser, 自建 Next.js API 路由与缓存

---

## 🚀 本地运行 (Local Development)

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器访问
# http://localhost:3005
```

---

## 🌐 公网部署 (Production Deployment)

推荐通过 **Vercel** 部署（0 配置一键上线）：

```bash
# 构建检查
npm run build

# 使用 Vercel 命令行直接部署
npx vercel
```
