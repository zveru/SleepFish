# SleepFish

一个静态的个人博客仓库

基于 Astro 7 的静态站点。

## 当前进度

- 首屏欢迎页：全屏背景图 + 居中站名 + 逐字副标题 + 向下箭头

## 目录结构

```text
/
├── public/                  # 原样拷贝到站点根目录的静态文件
├── src/
│   ├── components/
│   │   └── Welcome.astro    # 首屏：结构 + 内容 props
│   ├── images/              # 背景图等源图片（参与 Astro 图片优化）
│   ├── layouts/
│   │   └── Layout.astro     # html / head / body / main 外壳
│   ├── pages/
|	|	├── blog/            # 用来放博客文章的文件夹
│   │   └── index.astro      # 首页
│   ├── scripts/
│   │   └── typewriter.ts    # 打字机效果
│   └── styles/
│       ├── tokens.css       # 设计变量（只放变量）
│       └── welcome.css      # 首屏样式，选择器统一挂在 .welcome 下
├── astro.config.mjs
└── package.json
```

## 借物表

- 欢迎页背景图@こうこうや pid：118616623
- 