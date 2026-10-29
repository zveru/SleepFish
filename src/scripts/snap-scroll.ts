/**
 * 整屏吸附：停在区块边缘时，一次滚动自动翻到相邻区块，向上同理。
 * 触控和键盘沿用 CSS scroll-snap，这里只接管滚轮——原生吸附会把小幅滚动吞掉。
 */
export function initSnapScroll(): void {
	const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-snap-section]"));
	if (sections.length < 2) return;

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	// 动画期间锁住滚轮，避免连翻两屏
	const LOCK = 700;
	// 松手后滚轮惯性还会继续触发事件，等它安静下来再解锁
	const QUIET = 200;

	let lockUntil = 0;

	const goTo = (index: number) => {
		lockUntil = performance.now() + LOCK;
		window.scrollTo({
			top: Math.round(sections[index].offsetTop),
			behavior: reduceMotion ? "auto" : "smooth",
		});
	};

	/** 当前停在（或已滚入）第几个区块 */
	const indexAt = (y: number) => {
		let index = 0;
		sections.forEach((section, i) => {
			if (y >= section.offsetTop - 1) index = i;
		});
		return index;
	};

	const onWheel = (event: WheelEvent) => {
		if (event.ctrlKey || event.deltaY === 0) return;

		const now = performance.now();
		if (now < lockUntil) {
			event.preventDefault();
			lockUntil = Math.max(lockUntil, now + QUIET);
			return;
		}

		const index = indexAt(window.scrollY);
		const section = sections[index];
		const atTop = window.scrollY <= section.offsetTop + 1;
		const atBottom =
			window.scrollY >= section.offsetTop + section.offsetHeight - window.innerHeight - 1;

		const next = event.deltaY > 0 && atBottom && index + 1 < sections.length;
		const prev = event.deltaY < 0 && atTop && index > 0;
		if (!next && !prev) return;

		event.preventDefault();
		goTo(next ? index + 1 : index - 1);
	};

	window.addEventListener("wheel", onWheel, { passive: false });

	// 站内锚点（比如首屏的向下箭头）也走同一套动画
	document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
		link.addEventListener("click", (event) => {
			const target = document.querySelector<HTMLElement>(link.hash);
			const index = target ? sections.indexOf(target) : -1;
			if (index < 0) return;
			event.preventDefault();
			goTo(index);
		});
	});
}
