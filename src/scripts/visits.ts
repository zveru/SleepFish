// 侧栏访客信息：今天的独立访客数和当前访客 IP
// 统计由同源的 Pages Function 提供，不需要配置接口地址
const ENDPOINT = `${import.meta.env.BASE_URL}api/visit`;

interface VisitData {
	ip?: string;
	today?: number;
}

export async function initVisits() {
	const todayEl = document.querySelector<HTMLElement>("[data-visits-today]");
	const ipEl = document.querySelector<HTMLElement>("[data-visits-ip]");

	if (!todayEl || !ipEl) return;

	try {
		const response = await fetch(ENDPOINT, { cache: "no-store" });
		if (!response.ok) return;

		const data = (await response.json()) as VisitData;

		if (typeof data.today === "number") {
			todayEl.textContent = String(data.today);
		}

		if (data.ip) {
			ipEl.textContent = data.ip;
			ipEl.title = data.ip;
		}
	} catch {
		// 服务不可用时保留占位符「—」，不影响页面其他部分
	}
}
