import { getDb } from "../lib/db.js";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  // slug comes from rewrite path /t/:slug → ?slug= via vercel, or we parse from URL
  const url = new URL(req.url, `https://${req.headers.host}`);
  const slug = url.pathname.replace(/^\/t\//, "").split("/")[0];

  if (!slug) {
    return res.status(400).json({ error: "slug ausente" });
  }

  const sql = getDb();

  // Fetch link
  const [link] = await sql`
    SELECT * FROM links WHERE slug = ${slug} LIMIT 1
  `;

  if (!link) {
    return res.status(404).send("Link não encontrado");
  }

  // Generate unique click_id
  const click_id = nanoid(16);

  // Record pageview event (fire-and-forget — don't await to keep redirect fast)
  sql`
    INSERT INTO events (click_id, slug, event_type, ip, ua, ref)
    VALUES (
      ${click_id},
      ${slug},
      'pageview',
      ${req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null},
      ${req.headers["user-agent"] || null},
      ${req.headers["referer"] || null}
    )
  `.catch(console.error);

  // Build destination URL — inject click_id as query param
  const dest = new URL(link.destination);
  dest.searchParams.set("click_id", click_id);

  // Pass through UTM params if present
  for (const [k, v] of url.searchParams.entries()) {
    if (k !== "click_id") dest.searchParams.set(k, v);
  }

  res.setHeader("Cache-Control", "no-store");
  res.redirect(302, dest.toString());
}
