# SleepFish

一个静态的个人博客仓库

基于 Astro 7 的静态站点，部署在 Cloudflare Pages。


## 目录结构

```text
/
├── functions/                     # Cloudflare Pages Functions，只在线上运行
│   ├── README.md                  # 访客统计的部署说明
│   └── api/
│       └── visit.js               # /api/visit：今日访客数 + 访客 IP
├── public/                        # 原样拷贝到站点根目录的静态文件
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── components/                # 页面区块，样式各自跟随
│   │   ├── Welcome.astro          # 首页首屏：站名 + 逐字副标题 + 向下箭头
│   │   ├── Direction.astro        # 首页第二屏：水下方向页
│   │   ├── Nav.astro              # 首页导航
│   │   ├── BackNav.astro          # 内页左上角返回链接
│   │   ├── About.astro            # 关于页
│   │   ├── Blog.astro             # 博客列表：左侧卡片 + 右侧资料栏
│   │   └── PostCard.astro         # 文章卡片，博客列表和标签页共用
│   ├── images/                    # 源图片（背景图、头像，参与 Astro 图片优化）
│   ├── layouts/
│   │   ├── Layout.astro           # 全站外壳：html / head / 导航 / main
│   │   └── PostLayout.astro       # 文章页外壳：日期、标题、标签、正文排版
│   ├── lib/
│   │   └── posts.ts               # 扫描文章、解析封面、按标签分组
│   ├── pages/                     # 一个文件就是一个路由
│   │   ├── index.astro            # /
│   │   ├── about.astro            # /about/
│   │   └── blog/
│   │       ├── index.astro        # /blog/ 文章列表
│   │       ├── categories.astro   # /blog/categories/ 分类总览
│   │       ├── categories/
│   │       │   └── [tag].astro    # /blog/categories/<标签>/ 标签页
│   │       └── cover/             # 卡片封面图（不生成页面）
│   ├── scripts/
│   │   ├── typewriter.ts          # 打字机效果
│   │   ├── hero-scroll.ts         # 首屏滚动衔接
│   │   ├── snap-scroll.ts         # 首页整屏吸附
│   │   └── visits.ts              # 请求 /api/visit，填充侧栏
│   └── styles/                    # 一个组件一个样式文件
│       ├── tokens.css             # 设计变量（只放变量）
│       ├── layout.css             # 全站基础布局
│       ├── welcome.css            # 首屏
│       ├── direction.css          # 水下方向页
│       ├── nav.css                # 首页导航
│       ├── backnav.css            # 内页返回链接
│       ├── about.css              # 关于页
│       ├── blog.css               # 博客列表
│       ├── postcard.css           # 文章卡片
│       ├── categories.css         # 分类总览和标签页
│       └── post.css               # 文章页
├── astro.config.mjs
└── package.json
```

## 借物表

- 欢迎页背景图@こうこうや pid：118616623
- 
