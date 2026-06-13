import { getDb, setupSchema } from "../lib/db.js";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { destination, campaign, adset, slug: customSlug } = req.body || {};

  if (!destination) {
    return res.status(400).json({ error: "destination é obrigatório" });
  }

  // Validate URL
  try { new URL(destination); }
  catch { return res.status(400).json({ error: "destination inválida" }); }

  await setupSchema(); // idempotent — creates tables if not exist

  const sql = getDb();
  const slug = customSlug || nanoid(8);

  const [link] = await sql`
    INSERT INTO links (slug, destination, campaign, adset)
    VALUES (${slug}, ${destination}, ${campaign || null}, ${adset || null})
    ON CONFLICT (slug) DO NOTHING
    RETURNING *
  `;

  if (!link) {
    return res.status(409).json({ error: "Slug já existe. Tente outro." });
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.host}`;
  link.tracking_url = `${base}/t/${slug}`;

  res.status(201).json(link);
}
