import { getDb } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Método não permitido" });

  const { slug } = new URL(req.url, `https://${req.headers.host}`).searchParams;
  if (!slug) return res.status(400).json({ error: "slug obrigatório" });

  const sql = getDb();
  await sql`DELETE FROM events WHERE slug = ${slug}`;
  await sql`DELETE FROM links  WHERE slug = ${slug}`;

  res.status(200).json({ ok: true });
}
