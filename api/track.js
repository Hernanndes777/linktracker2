import { getDb } from "../lib/db.js";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const slug = url.pathname.replace(/^\/t\//, "").split("/")[0];

  if (!slug) return res.status(400).json({ error: "slug ausente" });

  // Ignora prefetch e bots
  const purpose = req.headers["purpose"] || req.headers["x-purpose"] || "";
  const ua = req.headers["user-agent"] || "";
  const isBot = /bot|crawl|spider|prefetch|preview|slack|telegram|whatsapp|facebook|twitter|linkedin/i.test(ua);
  const isPrefetch = purpose === "prefetch" || req.headers["x-moz"] === "prefetch";

  const sql = getDb();

  const [link] = await sql`
    SELECT * FROM links WHERE slug = ${slug} LIMIT 1
  `;

  if (!link) return res.status(404).send("Link não encontrado");

  // Build destination URL
  const dest = new URL(link.destination);
  dest.searchParams.set("click_id", nanoid(16));
  for (const [k, v] of url.searchParams.entries()) {
    if (k !== "click_id") dest.searchParams.set(k, v);
  }

  // Só registra se for clique real
  if (!isBot && !isPrefetch) {
    const click_id = dest.searchParams.get("click_id");
    sql`
      INSERT INTO events (click_id, slug, event_type, ip, ua, ref)
      VALUES (
        ${click_id}, ${slug}, 'pageview',
        ${req.headers["x-forwarded-for"] || null},
        ${ua || null},
        ${req.headers["referer"] || null}
      )
    `.catch(console.error);
  }

  res.setHeader("Cache-Control", "no-store");
  res.redirect(302, dest.toString());
}
