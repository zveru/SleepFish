/**
 * 分类页和标签页共用的文章数据：扫描 src/pages/blog/*.md，按标签分组。
 */

import type { ImageMetadata } from "astro";

export interface Post {
	slug: string;
	title: string;
	date: Date;
	description?: string;
	cover: ImageMetadata | null;
	tags: string[];
}

export interface TagGroup {
	tag: string;
	/** 用于 URL 的一段，中文原样保留，只把斜杠换掉 */
	slug: string;
	posts: Post[];
}

export const UNCATEGORIZED = "未分类";

const modules = import.meta.glob("/src/pages/blog/*.md", { eager: true }) as Record<string, any>;

// 封面图统一放在 src/pages/blog/cover/ 下
const covers = import.meta.glob("/src/pages/blog/cover/*.{jpg,jpeg,png,webp,avif}", {
	eager: true,
	import: "default",
}) as Record<string, ImageMetadata>;

// frontmatter 里写 ./cover/a.jpg、cover/a.jpg 或 a.jpg 都能找到
const resolveCover = (path?: string) => {
	if (!path) return null;

	const normalized = path.replace(/^\.\//, "");
	const key = normalized.startsWith("cover/")
		? `/src/pages/blog/${normalized}`
		: `/src/pages/blog/cover/${normalized}`;

	return covers[key] ?? null;
};

const pad = (value: number) => String(value).padStart(2, "0");

export const formatDate = (date: Date) =>
	`${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;

export const posts: Post[] = Object.entries(modules)
	.map(([file, mod]) => {
		const data = mod.frontmatter ?? {};
		const tags = Array.isArray(data.tags)
			? data.tags
					.filter((tag: unknown) => typeof tag === "string" && tag.trim() !== "")
					.map((tag: string) => tag.trim())
			: [];

		return {
			slug: file.split("/").pop()!.replace(/\.md$/, ""),
			title: data.title ?? file,
			date: data.date instanceof Date ? data.date : new Date(data.date ?? 0),
			description: typeof data.description === "string" ? data.description : undefined,
			cover: resolveCover(typeof data.cover === "string" ? data.cover : undefined),
			tags: [...new Set(tags)] as string[],
			draft: data.draft === true,
		};
	})
	.filter((post) => !post.draft && !Number.isNaN(post.date.getTime()))
	.sort((a, b) => b.date.getTime() - a.date.getTime())
	.map(({ slug, title, date, description, cover, tags }) => ({
		slug,
		title,
		date,
		description,
		cover,
		tags,
	}));

// 按标签分组，没写 tags 的文章归到「未分类」
const grouped = new Map<string, Post[]>();
for (const post of posts) {
	for (const tag of post.tags.length > 0 ? post.tags : [UNCATEGORIZED]) {
		const list = grouped.get(tag) ?? [];
		list.push(post);
		grouped.set(tag, list);
	}
}

// 文章多的标签在前，「未分类」固定排最后
export const tagGroups: TagGroup[] = [...grouped.entries()]
	.sort((a, b) => {
		if (a[0] === UNCATEGORIZED) return 1;
		if (b[0] === UNCATEGORIZED) return -1;
		return b[1].length - a[1].length || a[0].localeCompare(b[0], "zh-CN");
	})
	.map(([tag, list]) => ({
		tag,
		slug: tag.replace(/[/\\]/g, "-"),
		posts: list,
	}));

export const tagHref = (group: TagGroup, base = import.meta.env.BASE_URL) =>
	`${base}blog/categories/${encodeURIComponent(group.slug)}/`;
