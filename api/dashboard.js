export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(HTML);
}

const HTML = /* html */`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>LinkTracker</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0a0a0c;
    --surface:   #111115;
    --border:    #1e1e24;
    --border2:   #2a2a34;
    --text:      #e8e8f0;
    --muted:     #555566;
    --accent:    #00ff88;
    --accent2:   #0066ff;
    --warn:      #ff4455;
    --mono:      'JetBrains Mono', monospace;
    --sans:      'Syne', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Grid noise texture */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
  }

  .wrap {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  /* HEADER */
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 48px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border2);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    width: 36px; height: 36px;
    background: var(--accent);
    border-radius: 6px;
    display: grid; place-items: center;
  }

  .logo-icon svg { color: #000; }

  .logo-text {
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .logo-text span { color: var(--accent); }

  .header-tag {
    font-family: var(--mono);
    font-size: 0.7rem;
    color: var(--muted);
    background: var(--surface);
    border: 1px solid var(--border2);
    padding: 4px 10px;
    border-radius: 4px;
  }

  /* STATS ROW */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 40px;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 8px;
    padding: 20px 24px;
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }
  .stat-card.green::before  { background: var(--accent); }
  .stat-card.blue::before   { background: var(--accent2); }
  .stat-card.red::before    { background: var(--warn); }

  .stat-label {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .stat-card.green .stat-value  { color: var(--accent); }
  .stat-card.blue  .stat-value  { color: var(--accent2); }
  .stat-card.red   .stat-value  { color: var(--warn); }

  /* SECTIONS */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 0.75rem;
    font-family: var(--mono);
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* CREATE FORM */
  .create-panel {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 32px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 12px;
    align-items: end;
  }

  .field label {
    display: block;
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .field input {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border2);
    color: var(--text);
    font-family: var(--mono);
    font-size: 0.8rem;
    padding: 10px 12px;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.15s;
  }

  .field input:focus { border-color: var(--accent); }
  .field input::placeholder { color: var(--muted); }

  .btn-create {
    background: var(--accent);
    color: #000;
    font-family: var(--sans);
    font-weight: 700;
    font-size: 0.8rem;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.15s, transform 0.1s;
  }

  .btn-create:hover   { opacity: 0.85; }
  .btn-create:active  { transform: scale(0.97); }
  .btn-create:disabled { opacity: 0.4; cursor: default; }

  /* TOAST */
  .toast {
    position: fixed;
    bottom: 28px; right: 28px;
    background: var(--surface);
    border: 1px solid var(--accent);
    color: var(--accent);
    font-family: var(--mono);
    font-size: 0.75rem;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 100;
    transform: translateY(80px);
    opacity: 0;
    transition: transform 0.25s, opacity 0.25s;
    max-width: 340px;
  }
  .toast.show { transform: translateY(0); opacity: 1; }
  .toast.err  { border-color: var(--warn); color: var(--warn); }

  /* TABLE */
  .table-wrap {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 8px;
    overflow: hidden;
  }

  table { width: 100%; border-collapse: collapse; }

  thead {
    background: var(--bg);
    border-bottom: 1px solid var(--border2);
  }

  th {
    font-family: var(--mono);
    font-size: 0.6rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 12px 16px;
    text-align: left;
    font-weight: 500;
  }

  td {
    padding: 13px 16px;
    font-size: 0.82rem;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }

  tr:hover td { background: rgba(255,255,255,0.02); }

  .slug-cell {
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--accent);
  }

  .dest-cell {
    font-size: 0.75rem;
    color: var(--muted);
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tag {
    display: inline-block;
    font-family: var(--mono);
    font-size: 0.65rem;
    padding: 2px 8px;
    border-radius: 4px;
    background: var(--border2);
    color: var(--muted);
  }

  .num { font-family: var(--mono); font-size: 0.8rem; }
  .num.green { color: var(--accent); }
  .num.blue  { color: var(--accent2); }

  .conv-bar {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bar-bg {
    flex: 1;
    height: 4px;
    background: var(--border2);
    border-radius: 2px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: var(--warn);
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  .copy-btn {
    background: none;
    border: 1px solid var(--border2);
    color: var(--muted);
    font-family: var(--mono);
    font-size: 0.65rem;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }

  .copy-btn:hover { border-color: var(--accent); color: var(--accent); }

  .empty {
    text-align: center;
    color: var(--muted);
    font-family: var(--mono);
    font-size: 0.8rem;
    padding: 48px;
  }

  .loading-row td {
    text-align: center;
    color: var(--muted);
    font-family: var(--mono);
    font-size: 0.75rem;
    padding: 40px;
    animation: pulse 1.2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1; }
  }

  /* SNIPPET */
  .snippet-panel {
    margin-top: 32px;
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 8px;
    overflow: hidden;
  }

  .snippet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
  }

  .snippet-title {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  pre {
    font-family: var(--mono);
    font-size: 0.75rem;
    line-height: 1.6;
    padding: 20px;
    overflow-x: auto;
    color: #aaa;
  }

  pre .kw  { color: var(--accent2); }
  pre .str { color: var(--accent); }
  pre .cmt { color: #444; }

  @media (max-width: 700px) {
    .form-grid { grid-template-columns: 1fr; }
    .stats-row { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<div class="wrap">

  <header>
    <div class="logo">
      <div class="logo-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
      </div>
      <span class="logo-text">Link<span>Tracker</span></span>
    </div>
    <span class="header-tag">v2.0 · independente do Meta</span>
  </header>

  <!-- STATS -->
  <div class="stats-row" id="statsRow">
    <div class="stat-card green"><div class="stat-label">Total de links</div><div class="stat-value" id="statLinks">—</div></div>
    <div class="stat-card blue"><div class="stat-label">Chegadas (total)</div><div class="stat-value" id="statPageviews">—</div></div>
    <div class="stat-card red"><div class="stat-label">Cliques WhatsApp</div><div class="stat-value" id="statWA">—</div></div>
  </div>

  <!-- CREATE -->
  <div class="section-header"><span class="section-title">// Novo link</span></div>
  <div class="create-panel">
    <div class="form-grid">
      <div class="field">
        <label>URL de destino *</label>
        <input id="fDest" type="url" placeholder="https://wa.me/5511..." />
      </div>
      <div class="field">
        <label>Campanha</label>
        <input id="fCamp" type="text" placeholder="campanha-maio" />
      </div>
      <div class="field">
        <label>Conjunto / Adset</label>
        <input id="fAdset" type="text" placeholder="publico-frio" />
      </div>
      <button class="btn-create" id="btnCreate" onclick="createLink()">+ Criar</button>
    </div>
  </div>

  <!-- TABLE -->
  <div class="section-header">
    <span class="section-title">// Funil por link</span>
    <button class="copy-btn" onclick="loadLinks()">↻ Atualizar</button>
  </div>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Slug</th>
          <th>Destino</th>
          <th>Campanha</th>
          <th>Chegadas</th>
          <th>WhatsApp</th>
          <th>Conversão</th>
          <th></th>
        </tr>
      </thead>
      <tbody id="linksBody">
        <tr class="loading-row"><td colspan="7">carregando...</td></tr>
      </tbody>
    </table>
  </div>

  <!-- PIXEL SNIPPET -->
  <div class="snippet-panel">
    <div class="snippet-header">
      <span class="snippet-title">// Pixel de rastreamento — cole na sua landing page</span>
      <button class="copy-btn" onclick="copySnippet()">Copiar código</button>
    </div>
    <pre id="snippetPre"><span class="cmt">// Cole antes do &lt;/body&gt; da sua página de destino</span>
<span class="kw">const</span> params = <span class="kw">new</span> URLSearchParams(location.search);
<span class="kw">const</span> click_id = params.get(<span class="str">'click_id'</span>);
<span class="kw">const</span> slug     = params.get(<span class="str">'slug'</span>) || <span class="str">'&lt;SEU_SLUG&gt;'</span>; <span class="cmt">// substitua pelo slug fixo se preferir</span>

<span class="cmt">// Rastrear clique no botão de WhatsApp</span>
document.querySelectorAll(<span class="str">'a[href*="wa.me"], a[href*="whatsapp"]'</span>).forEach(btn => {
  btn.addEventListener(<span class="str">'click'</span>, () => {
    <span class="kw">if</span> (!click_id) <span class="kw">return</span>;
    fetch(<span class="str">'https://SEU_DOMINIO.vercel.app/api/event'</span>, {
      method: <span class="str">'POST'</span>,
      headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
      body: JSON.stringify({ click_id, slug, event_type: <span class="str">'whatsapp'</span> })
    });
  });
});</pre>
  </div>

</div><!-- /wrap -->

<div class="toast" id="toast"></div>

<script>
const BASE = window.location.origin;

async function loadLinks() {
  const tbody = document.getElementById('linksBody');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="7">carregando...</td></tr>';

  try {
    const res = await fetch('/api/links');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const links = await res.json();

    // Update stats
    const totalPageviews = links.reduce((a, l) => a + Number(l.pageviews || 0), 0);
    const totalWA        = links.reduce((a, l) => a + Number(l.whatsapp_clicks || 0), 0);
    document.getElementById('statLinks').textContent     = links.length;
    document.getElementById('statPageviews').textContent = totalPageviews.toLocaleString('pt-BR');
    document.getElementById('statWA').textContent        = totalWA.toLocaleString('pt-BR');

    if (!links.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty">Nenhum link criado ainda.</td></tr>';
      return;
    }

    tbody.innerHTML = links.map(l => {
      const trackUrl = BASE + '/t/' + l.slug;
      const conv = Number(l.conversion_rate || 0);
      const barW = Math.min(conv * 2, 100); // scale bar (50% conv = full bar)
      return \`
        <tr>
          <td><span class="slug-cell">/t/\${l.slug}</span></td>
          <td><span class="dest-cell" title="\${l.destination}">\${l.destination}</span></td>
          <td>\${l.campaign ? \`<span class="tag">\${l.campaign}</span>\` : '<span style="color:var(--muted)">—</span>'}</td>
          <td><span class="num green">\${Number(l.pageviews).toLocaleString('pt-BR')}</span></td>
          <td><span class="num blue">\${Number(l.whatsapp_clicks).toLocaleString('pt-BR')}</span></td>
          <td>
            <div class="conv-bar">
              <div class="bar-bg"><div class="bar-fill" style="width:\${barW}%"></div></div>
              <span class="num" style="min-width:38px;color:var(--warn)">\${conv}%</span>
            </div>
          </td>
          <td><button class="copy-btn" onclick="copyUrl('\${trackUrl}')">Copiar URL</button></td>
        </tr>
      \`;
    }).join('');
  } catch(e) {
    tbody.innerHTML = \`<tr><td colspan="7" class="empty" style="color:var(--warn)">Erro ao carregar: \${e.message}</td></tr>\`;
  }
}

async function createLink() {
  const btn  = document.getElementById('btnCreate');
  const dest = document.getElementById('fDest').value.trim();
  const camp = document.getElementById('fCamp').value.trim();
  const adset = document.getElementById('fAdset').value.trim();

  if (!dest) { showToast('Informe a URL de destino', true); return; }

  btn.disabled = true;
  btn.textContent = '...';

  try {
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination: dest, campaign: camp || null, adset: adset || null })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro desconhecido');

    showToast('✓ ' + data.tracking_url);
    copyUrl(data.tracking_url);

    // Clear form
    document.getElementById('fDest').value  = '';
    document.getElementById('fCamp').value  = '';
    document.getElementById('fAdset').value = '';

    loadLinks();
  } catch(e) {
    showToast(e.message, true);
  } finally {
    btn.disabled = false;
    btn.textContent = '+ Criar';
  }
}

function copyUrl(url) {
  navigator.clipboard.writeText(url).then(() => showToast('URL copiada!'));
}

function copySnippet() {
  const code = \`const params = new URLSearchParams(location.search);
const click_id = params.get('click_id');
const slug     = params.get('slug') || '<SEU_SLUG>';

document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!click_id) return;
    fetch('\${BASE}/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ click_id, slug, event_type: 'whatsapp' })
    });
  });
});\`;
  navigator.clipboard.writeText(code).then(() => showToast('Snippet copiado!'));
}

let toastTimer;
function showToast(msg, err = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (err ? ' err' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = 'toast'; }, 3500);
}

// Allow Enter key on form
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.activeElement?.closest('.create-panel')) createLink();
});

loadLinks();
</script>
</body>
</html>`;
