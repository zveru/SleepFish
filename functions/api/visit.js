/**
 * 访客统计：Cloudflare Pages Function，路由 /api/visit
 *
 * GET /api/visit → { ip, date, today }
 *   ip     当前访客 IP（来自 CF-Connecting-IP）
 *   date   按北京时间算的日期，如 2026-11-06
 *   today  当天独立访客数（按 IP 哈希去重）
 *
 * 只存 IP 的 SHA-256 哈希，48 小时后过期，不存明文。
 * 需要在 Pages 项目的 Bindings 里把 KV 命名空间绑定为 VISITS。
 */

const DAY_TTL = 60 * 60 * 48;

export async function onRequestGet({ request, env }) {
	if (!env.VISITS) {
		return json({ error: "kv_not_bound" }, 500);
	}

	const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
	// 统一用北京时间划分“今天”，避免不同时区的访客算到不同日期
	const date = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);

	const salt = env.IP_SALT ?? "sleepfish";
	const key = `uv:${date}:${await sha256(`${salt}:${ip}:${date}`)}`;

	const seen = await env.VISITS.get(key);
	if (!seen) {
		await env.VISITS.put(key, "1", { expirationTtl: DAY_TTL });
	}

	const today = await countPrefix(env.VISITS, `uv:${date}:`);
	return json({ ip, date, today });
}

// 同源调用只会有 GET，其余方法统一拒绝
export function onRequest() {
	return json({ error: "method_not_allowed" }, 405);
}

function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

async function sha256(text) {
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
	return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

// KV 没有原子自增，直接数当天写入的唯一键；个人站点量级足够
async function countPrefix(kv, prefix) {
	let cursor;
	let count = 0;

	do {
		const page = await kv.list({ prefix, cursor, limit: 1000 });
		count += page.keys.length;
		cursor = page.list_complete ? undefined : page.cursor;
	} while (cursor);

	return count;
}
