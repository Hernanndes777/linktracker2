import { getDb } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Método não permitido" });

  const sql = getDb();
  const params = new URL(req.url, `https://${req.headers.host}`).searchParams;
  const from = params.get("from");
  const to   = params.get("to");

  const rows = await sql`
    SELECT
      e.created_at::date AS dia,
      COUNT(DISTINCT CASE WHEN e.event_type = 'pageview' THEN e.click_id END) AS chegadas,
      COUNT(DISTINCT CASE WHEN e.event_type = 'whatsapp' THEN e.click_id END) AS whatsapp
    FROM events e
    WHERE
      (${from}::date IS NULL OR e.created_at::date >= ${from}::date)
      AND (${to}::date IS NULL OR e.created_at::date <= ${to}::date)
    GROUP BY e.created_at::date
    ORDER BY dia ASC
  `;

  res.status(200).json(rows);
}
