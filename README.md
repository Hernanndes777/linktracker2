# LinkTracker2

Tracker de links próprio, independente do pixel Meta. Rastreia chegadas na página e cliques no WhatsApp com funil completo por campanha/conjunto.

## Stack

- **Vercel** — hospedagem + funções serverless Node.js
- **Neon Postgres** — banco de dados
- **nanoid** — geração de `click_id` único por clique

---

## Setup rápido

### 1. Clone e instale

```bash
git clone https://github.com/SEU_USUARIO/linktracker2
cd linktracker2
npm install
```

### 2. Variáveis de ambiente

No painel da Vercel → Settings → Environment Variables:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | String de conexão do Neon (`postgres://...`) |
| `NEXT_PUBLIC_BASE_URL` | URL do seu deploy (ex: `https://linktracker2.vercel.app`) |

### 3. Deploy

```bash
vercel --prod
```

O schema do banco é criado automaticamente na primeira chamada ao `/api/create`.

---

## Como usar

### Criar um link rastreado

`POST /api/create`

```json
{
  "destination": "https://wa.me/5511999999999?text=Oi",
  "campaign": "campanha-maio",
  "adset": "publico-frio"
}
```

Retorna:
```json
{
  "slug": "abc12345",
  "tracking_url": "https://linktracker2.vercel.app/t/abc12345",
  ...
}
```

### Fluxo de rastreamento

```
Usuário clica no anúncio
  → /t/abc12345  (gera click_id único, redireciona)
  → Landing page recebe ?click_id=xyz
  → Pixel JS detecta clique no botão WhatsApp
  → POST /api/event  { click_id, slug, event_type: 'whatsapp' }
```

### Pixel JS (colar na landing page)

```js
const params = new URLSearchParams(location.search);
const click_id = params.get('click_id');
const slug     = '<SEU_SLUG>'; // ou params.get('slug')

document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!click_id) return;
    fetch('https://SEU_DOMINIO.vercel.app/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ click_id, slug, event_type: 'whatsapp' })
    });
  });
});
```

---

## Rotas da API

| Rota | Método | Descrição |
|------|--------|-----------|
| `/t/:slug` | GET | Redireciona + registra chegada |
| `/api/create` | POST | Cria novo link rastreado |
| `/api/links` | GET | Lista links com funil |
| `/api/stats` | GET | Funil agrupado por campanha |
| `/api/event` | POST | Registra evento (ex: clique WA) |
| `/` | GET | Dashboard |

---

## Por que o 404 acontecia

O `vercel.json` precisa de rewrites explícitos para rotas dinâmicas. A configuração correta é:

```json
{
  "rewrites": [
    { "source": "/t/:slug", "destination": "/api/track" },
    ...
    { "source": "/(.*)", "destination": "/api/dashboard" }
  ]
}
```

**O wildcard `/(.*)`  deve ser sempre o último** — ele captura tudo que não casou antes e serve o dashboard.
