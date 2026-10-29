/**
 * 首屏滚动联动：向下滚时镜头缓慢推近，文字淡出。
 * 进度写进 --scroll-progress（0–1），具体数值交给 CSS。
 * 系统开启“减少动态效果”时不做任何处理。
 */
export function initHeroScroll(): void {
	const hero = document.querySelector<HTMLElement>("[data-welcome]");
	if (!hero) return;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	let frame = 0;

	const update = () => {
		frame = 0;
		const height = hero.offsetHeight || window.innerHeight;
		const progress = Math.min(Math.max(window.scrollY / height, 0), 1);
		hero.style.setProperty("--scroll-progress", progress.toFixed(3));
	};

	const onScroll = () => {
		if (frame) return;
		frame = window.requestAnimationFrame(update);
	};

	update();
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll);
}
