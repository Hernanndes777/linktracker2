import { getDb } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Método não permitido" });

  // Neon serverless no Vercel às vezes não parseia query string direto
  // então extraímos manualmente da URL
  const rawUrl = req.url || "";
  const qs = rawUrl.includes("?") ? rawUrl.split("?")[1] : "";
  const params = new URLSearchParams(qs);
  const slug = params.get("slug");

  if (!slug) return res.status(400).json({ error: "slug obrigatório", url: rawUrl });

  const sql = getDb();
  await sql`DELETE FROM events WHERE slug = ${slug}`;
  await sql`DELETE FROM links  WHERE slug = ${slug}`;

  res.status(200).json({ ok: true, slug });
}
