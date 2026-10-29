/**
 * 首屏副标题逐字打出。
 * 系统开启“减少动态效果”时直接显示完整文字，无 JS 时由 <noscript> 兜底。
 */
export function initTypewriter(): void {
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	document.querySelectorAll<HTMLElement>("[data-welcome]").forEach((root) => {
		const target = root.querySelector<HTMLElement>("[data-typed-text]");
		const text = target?.dataset.typedText ?? "";

		if (!target || !text) return;

		if (reduceMotion) {
			target.textContent = text;
			return;
		}

		root.classList.add("is-typing");

		let index = 0;
		const type = () => {
			target.textContent = text.slice(0, ++index);
			if (index < text.length) window.setTimeout(type, 140);
		};

		window.setTimeout(type, 800);
	});
}
