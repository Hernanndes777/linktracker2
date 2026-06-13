import { getDb } from "../lib/db.js";

export default async function handler(req, res) {
  // Allow CORS — landing pages on other domains need this
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { click_id, slug, event_type } = req.body || {};

  if (!click_id || !slug || !event_type) {
    return res.status(400).json({ error: "click_id, slug e event_type são obrigatórios" });
  }

  const allowed = ["pageview", "whatsapp"];
  if (!allowed.includes(event_type)) {
    return res.status(400).json({ error: "event_type inválido" });
  }

  const sql = getDb();

  await sql`
    INSERT INTO events (click_id, slug, event_type, ip, ua, ref)
    VALUES (
      ${click_id},
      ${slug},
      ${event_type},
      ${req.headers["x-forwarded-for"] || null},
      ${req.headers["user-agent"] || null},
      ${req.headers["referer"] || null}
    )
  `;

  res.status(200).json({ ok: true });
}
