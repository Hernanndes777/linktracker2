import { getDb } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Método não permitido" });

  const sql = getDb();
  const { campaign } = new URL(req.url, `https://${req.headers.host}`).searchParams;

  const rows = await sql`
    SELECT
      l.campaign,
      l.adset,
      l.slug,
      COUNT(DISTINCT CASE WHEN e.event_type = 'pageview'  THEN e.click_id END) AS chegadas,
      COUNT(DISTINCT CASE WHEN e.event_type = 'whatsapp'  THEN e.click_id END) AS whatsapp,
      ROUND(
        CASE
          WHEN COUNT(DISTINCT CASE WHEN e.event_type = 'pageview' THEN e.click_id END) = 0 THEN 0
          ELSE COUNT(DISTINCT CASE WHEN e.event_type = 'whatsapp' THEN e.click_id END)::numeric
             / COUNT(DISTINCT CASE WHEN e.event_type = 'pageview'  THEN e.click_id END) * 100
        END, 1
      ) AS taxa_conversao
    FROM links l
    LEFT JOIN events e ON e.slug = l.slug
    ${campaign ? sql`WHERE l.campaign = ${campaign}` : sql``}
    GROUP BY l.campaign, l.adset, l.slug
    ORDER BY chegadas DESC
  `;

  res.status(200).json(rows);
}
