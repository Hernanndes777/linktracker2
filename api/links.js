import { getDb } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Método não permitido" });

  const sql = getDb();

  const links = await sql`
    SELECT
      l.id,
      l.slug,
      l.destination,
      l.campaign,
      l.adset,
      l.created_at,
      COUNT(DISTINCT CASE WHEN e.event_type = 'pageview'  THEN e.click_id END) AS pageviews,
      COUNT(DISTINCT CASE WHEN e.event_type = 'whatsapp'  THEN e.click_id END) AS whatsapp_clicks,
      ROUND(
        CASE
          WHEN COUNT(DISTINCT CASE WHEN e.event_type = 'pageview' THEN e.click_id END) = 0 THEN 0
          ELSE COUNT(DISTINCT CASE WHEN e.event_type = 'whatsapp' THEN e.click_id END)::numeric
             / COUNT(DISTINCT CASE WHEN e.event_type = 'pageview'  THEN e.click_id END) * 100
        END, 1
      ) AS conversion_rate
    FROM links l
    LEFT JOIN events e ON e.slug = l.slug
    GROUP BY l.id
    ORDER BY l.created_at DESC
  `;

  res.status(200).json(links);
}
