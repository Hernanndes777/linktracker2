export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(HTML);
}

const HTML = `<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>LinkTracker</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root[data-theme="light"] {
    --bg:       #f5f5f4;
    --surface:  #ffffff;
    --border:   #e5e5e3;
    --border2:  #d4d4d1;
    --text:     #1c1c1a;
    --muted:    #78716c;
    --accent:   #16a34a;
    --accent2:  #2563eb;
    --danger:   #dc2626;
    --tag-bg:   #f0fdf4;
    --tag-color:#16a34a;
    --shadow:   0 1px 3px rgba(0,0,0,0.08);
  }

  :root[data-theme="dark"] {
    --bg:       #141412;
    --surface:  #1c1c1a;
    --border:   #2a2a27;
    --border2:  #333330;
    --text:     #e8e8e4;
    --muted:    #78716c;
    --accent:   #22c55e;
    --accent2:  #3b82f6;
    --danger:   #ef4444;
    --tag-bg:   #1a2e1a;
    --tag-color:#22c55e;
    --shadow:   0 1px 3px rgba(0,0,0,0.3);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    min-height: 100vh;
    transition: background 0.2s, color 0.2s;
  }

  .wrap { max-width: 1120px; margin: 0 auto; padding: 32px 24px 80px; }

  /* HEADER */
  header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px; padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; }
  .logo-text { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; color: var(--text); }
  .logo-text span { color: var(--muted); font-weight: 400; }

  .header-right { display: flex; align-items: center; gap: 12px; }
  .theme-toggle {
    width: 32px; height: 32px; border-radius: 6px;
    border: 1px solid var(--border2); background: var(--surface);
    color: var(--muted); cursor: pointer; display: grid; place-items: center;
    transition: border-color 0.15s;
  }
  .theme-toggle:hover { border-color: var(--border2); color: var(--text); }
  .version { font-size: 11px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }

  /* FILTER */
  .filter-bar {
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 24px; flex-wrap: wrap;
  }
  .filter-btn {
    font-size: 12px; padding: 5px 12px; border-radius: 6px;
    border: 1px solid var(--border); background: var(--surface);
    color: var(--muted); cursor: pointer; transition: all 0.15s;
    font-family: inherit;
  }
  .filter-btn:hover { border-color: var(--border2); color: var(--text); }
  .filter-btn.active { border-color: var(--accent); color: var(--accent); background: var(--tag-bg); }
  .filter-sep { color: var(--border2); }
  .date-input {
    font-size: 12px; padding: 5px 10px; border-radius: 6px;
    border: 1px solid var(--border); background: var(--surface);
    color: var(--text); outline: none; font-family: 'JetBrains Mono', monospace;
    transition: border-color 0.15s;
  }
  .date-input:focus { border-color: var(--accent); }

  /* STATS */
  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 18px 20px;
    box-shadow: var(--shadow);
  }
  .stat-label { font-size: 11px; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
  .stat-value { font-size: 26px; font-weight: 600; letter-spacing: -0.02em; }
  .stat-card.s-green .stat-value { color: var(--accent); }
  .stat-card.s-blue  .stat-value { color: var(--accent2); }
  .stat-card.s-red   .stat-value { color: var(--danger); }

  /* CHART */
  .chart-panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 18px 20px; margin-bottom: 24px;
    box-shadow: var(--shadow);
  }
  .panel-title { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px; }
  .chart-wrap { height: 130px; }
  canvas { width: 100% !important; height: 130px !important; }

  /* CREATE */
  .create-panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 20px; margin-bottom: 24px;
    box-shadow: var(--shadow);
  }
  .form-grid { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; align-items: end; }
  .field label { display: block; font-size: 11px; color: var(--muted); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.06em; }
  .field input {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    color: var(--text); font-size: 13px; padding: 8px 11px;
    border-radius: 7px; outline: none; transition: border-color 0.15s;
    font-family: inherit;
  }
  .field input:focus { border-color: var(--accent); }
  .field input::placeholder { color: var(--muted); }
  .btn-primary {
    background: var(--accent); color: #fff; font-weight: 500; font-size: 13px;
    padding: 8px 18px; border: none; border-radius: 7px; cursor: pointer;
    white-space: nowrap; transition: opacity 0.15s; font-family: inherit;
  }
  .btn-primary:hover { opacity: 0.88; }
  .btn-primary:disabled { opacity: 0.45; cursor: default; }

  /* TABLE */
  .table-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; overflow: hidden; box-shadow: var(--shadow);
    margin-bottom: 24px;
  }
  .table-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-bottom: 1px solid var(--border);
  }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--bg); }
  th {
    font-size: 11px; color: var(--muted); text-transform: uppercase;
    letter-spacing: 0.06em; padding: 10px 16px; text-align: left; font-weight: 500;
    border-bottom: 1px solid var(--border);
  }
  td { padding: 11px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg); }

  .slug-cell { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent); }
  .dest-cell { font-size: 12px; color: var(--muted); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .tag { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 4px; background: var(--tag-bg); color: var(--tag-color); font-weight: 500; }
  .num { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
  .num.green { color: var(--accent); }
  .num.blue  { color: var(--accent2); }
  .date-cell { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); }

  .conv-bar { display: flex; align-items: center; gap: 8px; }
  .bar-bg { flex: 1; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; min-width: 40px; }
  .bar-fill { height: 100%; background: var(--danger); border-radius: 2px; }

  .actions { display: flex; gap: 6px; }
  .btn-sm {
    font-size: 11px; padding: 4px 10px; border-radius: 5px;
    border: 1px solid var(--border); background: none; color: var(--muted);
    cursor: pointer; transition: all 0.15s; font-family: inherit; white-space: nowrap;
  }
  .btn-sm:hover { border-color: var(--border2); color: var(--text); }
  .btn-sm.danger:hover { border-color: var(--danger); color: var(--danger); }

  .empty { text-align: center; color: var(--muted); font-size: 13px; padding: 40px; }
  .loading-row td { text-align: center; color: var(--muted); font-size: 12px; padding: 36px; animation: pulse 1.2s infinite; }
  @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }

  /* SNIPPET */
  .snippet-panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; overflow: hidden; box-shadow: var(--shadow);
  }
  .snippet-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-bottom: 1px solid var(--border);
  }
  pre {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    line-height: 1.65; padding: 18px; overflow-x: auto; color: var(--muted);
  }
  pre .kw  { color: var(--accent2); }
  pre .str { color: var(--accent); }
  pre .cmt { color: var(--border2); }

  /* MODAL CONFIRM */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.4);
    display: none; place-items: center; z-index: 200;
  }
  .modal-overlay.open { display: grid; }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 28px; max-width: 360px; width: 90%;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  }
  .modal h3 { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
  .modal p  { font-size: 13px; color: var(--muted); margin-bottom: 20px; line-height: 1.5; }
  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; }

  /* TOAST */
  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text); font-size: 13px; padding: 11px 18px;
    border-radius: 8px; z-index: 100; box-shadow: var(--shadow);
    transform: translateY(60px); opacity: 0;
    transition: transform 0.2s, opacity 0.2s; max-width: 320px;
  }
  .toast.show { transform: translateY(0); opacity: 1; }
  .toast.err  { border-color: var(--danger); color: var(--danger); }
  .toast.ok   { border-color: var(--accent); color: var(--accent); }

  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .section-title { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }

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
      <div class="logo-dot"></div>
      <span class="logo-text">LinkTracker <span>· independente do Meta</span></span>
    </div>
    <div class="header-right">
      <span class="version">v2.1</span>
      <button class="theme-toggle" onclick="toggleTheme()" title="Alternar tema">
        <svg id="themeIcon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </button>
    </div>
  </header>

  <!-- FILTROS -->
  <div class="filter-bar">
    <button class="filter-btn active" onclick="setPreset('hoje', this)">Hoje</button>
    <button class="filter-btn" onclick="setPreset('ontem', this)">Ontem</button>
    <button class="filter-btn" onclick="setPreset('7d', this)">7 dias</button>
    <button class="filter-btn" onclick="setPreset('30d', this)">30 dias</button>
    <button class="filter-btn" onclick="setPreset('tudo', this)">Tudo</button>
    <span class="filter-sep">|</span>
    <input class="date-input" type="date" id="dateFrom" onchange="setCustom()" />
    <span class="filter-sep">até</span>
    <input class="date-input" type="date" id="dateTo" onchange="setCustom()" />
  </div>

  <!-- STATS -->
  <div class="stats-row">
    <div class="stat-card s-green"><div class="stat-label">Total de links</div><div class="stat-value" id="statLinks">—</div></div>
    <div class="stat-card s-blue"><div class="stat-label">Chegadas no período</div><div class="stat-value" id="statPageviews">—</div></div>
    <div class="stat-card s-red"><div class="stat-label">Cliques WhatsApp</div><div class="stat-value" id="statWA">—</div></div>
  </div>

  <!-- GRÁFICO -->
  <div class="chart-panel">
    <div class="panel-title">Chegadas por dia</div>
    <div class="chart-wrap"><canvas id="chartCanvas"></canvas></div>
  </div>

  <!-- CREATE -->
  <div class="section-header"><span class="section-title">Novo link</span></div>
  <div class="create-panel">
    <div class="form-grid">
      <div class="field">
        <label>URL de destino *</label>
        <input id="fDest" type="url" placeholder="https://suapagina.com.br" />
      </div>
      <div class="field">
        <label>Campanha</label>
        <input id="fCamp" type="text" placeholder="campanha-junho" />
      </div>
      <div class="field">
        <label>Conjunto / Adset</label>
        <input id="fAdset" type="text" placeholder="publico-frio" />
      </div>
      <button class="btn-primary" id="btnCreate" onclick="createLink()">+ Criar</button>
    </div>
  </div>

  <!-- TABLE -->
  <div class="section-header">
    <span class="section-title">Funil por link</span>
    <button class="btn-sm" onclick="loadAll()">↻ Atualizar</button>
  </div>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Slug</th>
          <th>Destino</th>
          <th>Campanha</th>
          <th>Conjunto</th>
          <th>Chegadas</th>
          <th>WhatsApp</th>
          <th>Conversão</th>
          <th>Criado em</th>
          <th></th>
        </tr>
      </thead>
      <tbody id="linksBody">
        <tr class="loading-row"><td colspan="9">carregando...</td></tr>
      </tbody>
    </table>
  </div>

  <!-- SNIPPET -->
  <div class="snippet-panel">
    <div class="snippet-header">
      <span class="section-title">Pixel — cole antes do &lt;/body&gt; da landing page</span>
      <button class="btn-sm" onclick="copySnippet()">Copiar código</button>
    </div>
    <pre><span class="cmt">// Cole antes do &lt;/body&gt; da sua página de destino</span>
<span class="kw">const</span> params   = <span class="kw">new</span> URLSearchParams(location.search);
<span class="kw">const</span> click_id = params.get(<span class="str">'click_id'</span>);
<span class="kw">const</span> slug     = params.get(<span class="str">'slug'</span>) || click_id?.slice(0,8);

document.querySelectorAll(<span class="str">'a[href*="wa.me"], a[href*="whatsapp"]'</span>).forEach(btn => {
  btn.addEventListener(<span class="str">'click'</span>, () => {
    <span class="kw">if</span> (!click_id) <span class="kw">return</span>;
    fetch(<span class="str">'https://linktracker2-f3va.vercel.app/api/event'</span>, {
      method: <span class="str">'POST'</span>,
      headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
      body: JSON.stringify({ click_id, slug, event_type: <span class="str">'whatsapp'</span> })
    });
  });
});</pre>
  </div>

</div>

<!-- MODAL CONFIRM DELETE -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <h3>Deletar link?</h3>
    <p id="modalMsg">Essa ação remove o link e todos os dados de rastreamento. Não pode ser desfeita.</p>
    <div class="modal-actions">
      <button class="btn-sm" onclick="closeModal()">Cancelar</button>
      <button class="btn-sm danger" id="modalConfirm" style="border-color:var(--danger);color:var(--danger)">Deletar</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const BASE = window.location.origin;
let currentFrom = null, currentTo = null, chartInstance = null;

// THEME
function toggleTheme() {
  const html = document.documentElement;
  const next = html.dataset.theme === 'light' ? 'dark' : 'light';
  html.dataset.theme = next;
  localStorage.setItem('lt-theme', next);
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; loadChart(); }
}
(function() {
  const saved = localStorage.getItem('lt-theme') || 'light';
  document.documentElement.dataset.theme = saved;
})();

// DATE
function today() { return new Date().toISOString().slice(0,10); }
function daysAgo(n) { const d=new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); }

function setPreset(p, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (p==='hoje')  { currentFrom=today();     currentTo=today(); }
  if (p==='ontem') { currentFrom=daysAgo(1);  currentTo=daysAgo(1); }
  if (p==='7d')    { currentFrom=daysAgo(6);  currentTo=today(); }
  if (p==='30d')   { currentFrom=daysAgo(29); currentTo=today(); }
  if (p==='tudo')  { currentFrom=null;         currentTo=null; }
  document.getElementById('dateFrom').value = currentFrom||'';
  document.getElementById('dateTo').value   = currentTo||'';
  loadAll();
}

function setCustom() {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  currentFrom = document.getElementById('dateFrom').value||null;
  currentTo   = document.getElementById('dateTo').value||null;
  loadAll();
}

function dateParams() {
  const p = new URLSearchParams();
  if (currentFrom) p.set('from', currentFrom);
  if (currentTo)   p.set('to',   currentTo);
  return p.toString() ? '?'+p.toString() : '';
}

async function loadAll() { loadLinks(); loadChart(); }

async function loadLinks() {
  const tbody = document.getElementById('linksBody');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="9">carregando...</td></tr>';
  try {
    const res = await fetch('/api/links'+dateParams());
    if (!res.ok) throw new Error('HTTP '+res.status);
    const links = await res.json();

    const totalPV = links.reduce((a,l)=>a+Number(l.pageviews||0),0);
    const totalWA = links.reduce((a,l)=>a+Number(l.whatsapp_clicks||0),0);
    document.getElementById('statLinks').textContent     = links.length;
    document.getElementById('statPageviews').textContent = totalPV.toLocaleString('pt-BR');
    document.getElementById('statWA').textContent        = totalWA.toLocaleString('pt-BR');

    if (!links.length) {
      tbody.innerHTML='<tr><td colspan="9" class="empty">Nenhum link criado ainda.</td></tr>';
      return;
    }

    tbody.innerHTML = links.map(l => {
      const trackUrl = BASE+'/t/'+l.slug;
      const conv = Number(l.conversion_rate||0);
      const barW = Math.min(conv*2,100);
      const criado = new Date(l.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit'});
      return \`<tr data-slug="\${l.slug}">
        <td><span class="slug-cell">/t/\${l.slug}</span></td>
        <td><span class="dest-cell" title="\${l.destination}">\${l.destination}</span></td>
        <td>\${l.campaign?\`<span class="tag">\${l.campaign}</span>\`:'<span style="color:var(--muted)">—</span>'}</td>
        <td>\${l.adset?\`<span class="tag">\${l.adset}</span>\`:'<span style="color:var(--muted)">—</span>'}</td>
        <td><span class="num green pv-num">\${Number(l.pageviews).toLocaleString('pt-BR')}</span></td>
        <td><span class="num blue wa-num">\${Number(l.whatsapp_clicks).toLocaleString('pt-BR')}</span></td>
        <td>
          <div class="conv-bar">
            <div class="bar-bg"><div class="bar-fill" style="width:\${barW}%"></div></div>
            <span class="num cv-num" style="min-width:34px;color:var(--danger)">\${conv}%</span>
          </div>
        </td>
        <td><span class="date-cell">\${criado}</span></td>
        <td>
          <div class="actions">
            <button class="btn-sm" onclick="copyUrl('\${trackUrl}')">Copiar</button>
            <button class="btn-sm danger" onclick="confirmDelete('\${l.slug}')">Deletar</button>
          </div>
        </td>
      </tr>\`;
    }).join('');
  } catch(e) {
    tbody.innerHTML=\`<tr><td colspan="9" class="empty" style="color:var(--danger)">Erro: \${e.message}</td></tr>\`;
  }
}

async function loadChart() {
  try {
    const res = await fetch('/api/daily'+dateParams());
    if (!res.ok) return;
    const rows = await res.json();
    const labels   = rows.map(r=>new Date(r.dia).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}));
    const chegadas = rows.map(r=>Number(r.chegadas));
    const whatsapp = rows.map(r=>Number(r.whatsapp));
    const isDark   = document.documentElement.dataset.theme==='dark';
    const gridColor = isDark ? '#2a2a27' : '#e5e5e3';
    const tickColor = isDark ? '#78716c' : '#a8a29e';

    const ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label:'Chegadas', data:chegadas, backgroundColor: isDark?'rgba(34,197,94,0.2)':'rgba(22,163,74,0.15)', borderColor: isDark?'#22c55e':'#16a34a', borderWidth:1.5, borderRadius:3 },
          { label:'WhatsApp', data:whatsapp,  backgroundColor: isDark?'rgba(59,130,246,0.2)':'rgba(37,99,235,0.15)', borderColor: isDark?'#3b82f6':'#2563eb', borderWidth:1.5, borderRadius:3 }
        ]
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ labels:{ color:tickColor, font:{ family:'JetBrains Mono', size:10 } } } },
        scales:{
          x:{ grid:{ color:gridColor }, ticks:{ color:tickColor, font:{ family:'JetBrains Mono', size:10 } } },
          y:{ grid:{ color:gridColor }, ticks:{ color:tickColor, font:{ family:'JetBrains Mono', size:10 }, precision:0 } }
        }
      }
    });
  } catch(e) { console.error(e); }
}

async function createLink() {
  const btn   = document.getElementById('btnCreate');
  const dest  = document.getElementById('fDest').value.trim();
  const camp  = document.getElementById('fCamp').value.trim();
  const adset = document.getElementById('fAdset').value.trim();
  if (!dest) { showToast('Informe a URL de destino', 'err'); return; }
  btn.disabled=true; btn.textContent='...';
  try {
    const res = await fetch('/api/create',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({destination:dest, campaign:camp||null, adset:adset||null})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error||'Erro');
    showToast('Link criado e copiado!','ok');
    copyUrl(data.tracking_url, false);
    document.getElementById('fDest').value='';
    document.getElementById('fCamp').value='';
    document.getElementById('fAdset').value='';
    loadAll();
  } catch(e) { showToast(e.message,'err'); }
  finally { btn.disabled=false; btn.textContent='+ Criar'; }
}

function copyUrl(url, toast=true) {
  navigator.clipboard.writeText(url).then(()=>{ if(toast) showToast('URL copiada!','ok'); });
}

function copySnippet() {
  const code = \`const params   = new URLSearchParams(location.search);
const click_id = params.get('click_id');
const slug     = params.get('slug') || click_id?.slice(0,8);
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
  navigator.clipboard.writeText(code).then(()=>showToast('Snippet copiado!','ok'));
}

// DELETE
let slugToDelete = null;
function confirmDelete(slug) {
  slugToDelete = slug;
  document.getElementById('modalMsg').textContent = \`Deletar /t/\${slug} e todos os dados? Não pode ser desfeito.\`;
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('modalConfirm').onclick = doDelete;
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); slugToDelete=null; }
async function doDelete() {
  if (!slugToDelete) return;
  const slug = slugToDelete;
  closeModal();
  try {
    const res = await fetch('/api/delete?slug='+slug, {method:'DELETE'});
    const data = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(data.error||'Erro ao deletar');
    showToast('Link deletado','ok');
  } catch(e) { showToast(e.message,'err'); }
  finally { loadAll(); }
}
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

let toastTimer;
function showToast(msg, type='ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show '+(type==='err'?'err':'ok');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ t.className='toast'; }, 3000);
}

document.addEventListener('keydown', e => {
  if (e.key==='Enter' && document.activeElement?.closest('.create-panel')) createLink();
  if (e.key==='Escape') closeModal();
});

// Init
const todayStr = new Date().toISOString().slice(0,10);
currentFrom = todayStr; currentTo = todayStr;
document.getElementById('dateFrom').value = todayStr;
document.getElementById('dateTo').value   = todayStr;
loadAll();

// Auto-refresh a cada 60s — só atualiza números, sem re-renderizar tabela
setInterval(() => { refreshNumbers(); loadChart(); }, 60000);

async function refreshNumbers() {
  try {
    const res = await fetch('/api/links'+dateParams());
    if (!res.ok) return;
    const links = await res.json();
    const totalPV = links.reduce((a,l)=>a+Number(l.pageviews||0),0);
    const totalWA = links.reduce((a,l)=>a+Number(l.whatsapp_clicks||0),0);
    document.getElementById('statLinks').textContent      = links.length;
    document.getElementById('statPageviews').textContent  = totalPV.toLocaleString('pt-BR');
    document.getElementById('statWA').textContent         = totalWA.toLocaleString('pt-BR');
    // Atualiza só os números em cada linha sem re-renderizar
    links.forEach(l => {
      const row = document.querySelector(\`[data-slug="\${l.slug}"]\`);
      if (!row) return;
      const pv   = Number(l.pageviews||0);
      const wa   = Number(l.whatsapp_clicks||0);
      const conv = Number(l.conversion_rate||0);
      const barW = Math.min(conv*2,100);
      const pvEl = row.querySelector('.pv-num');
      const waEl = row.querySelector('.wa-num');
      const cvEl = row.querySelector('.cv-num');
      const barEl= row.querySelector('.bar-fill');
      if (pvEl) pvEl.textContent = pv.toLocaleString('pt-BR');
      if (waEl) waEl.textContent = wa.toLocaleString('pt-BR');
      if (cvEl) cvEl.textContent = conv+'%';
      if (barEl) barEl.style.width = barW+'%';
    });
  } catch(e) { console.error(e); }
}
</script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</body>
</html>`;
