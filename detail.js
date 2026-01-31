(async function(){
  function qs(name){
    return new URLSearchParams(location.search).get(name);
  }

  const nomeParam = qs('nome');
  const rootName = document.getElementById('itemName');
  const rootDesc = document.getElementById('itemDesc');
  const rootDate = document.getElementById('itemDate');
  const rootTags = document.getElementById('itemTags');
  const rootMore = document.getElementById('moreInfo');
  const docLink = document.getElementById('docLink');
  const badgeHolder = document.getElementById('badgeHolder');

  if (!nomeParam) {
    rootName.textContent = 'Item não especificado';
    rootDesc.textContent = 'Use a busca e clique em "Saiba mais" em um item.';
    return;
  }

  let dados = [];
  try {
    const resp = await fetch('data.json');
    dados = await resp.json();
  } catch (err) {
    rootName.textContent = nomeParam;
    rootDesc.textContent = 'Não foi possível carregar os dados.';
    console.error(err);
    return;
  }

  let match = dados.find(d => (d.nome||'').toLowerCase() === decodeURIComponent(nomeParam).toLowerCase());
  if (!match) {
    const lower = decodeURIComponent(nomeParam).toLowerCase();
    const fuzzy = dados.find(d => (d.nome||'').toLowerCase().includes(lower));
    if (!fuzzy) {
      rootName.textContent = decodeURIComponent(nomeParam);
      rootDesc.textContent = 'Item não encontrado no catálogo.';
      return;
    }
    match = fuzzy;
  }

  rootName.textContent = match.nome || '';
  rootDesc.innerHTML = `<p>${(match.descricao||'').replace(/\n/g,'<br>')}</p>`;
  rootDate.textContent = match.data_criacao ? `Criado em ${match.data_criacao}` : '';
  docLink.href = match.link_oficial || match.link || '#';

  rootTags.innerHTML = '';
  if (Array.isArray(match.tags)) {
    for (const t of match.tags) {
      const s = document.createElement('span');
      s.className = 'tag';
      s.textContent = t;
      rootTags.appendChild(s);
    }
  }

  try {
    if (typeof badgeForName === 'function') {
      badgeHolder.innerHTML = badgeForName(match.nome, 96);
    } else {
      badgeHolder.innerHTML = `<div style="width:96px;height:96px;border-radius:12px;background:${'#ddd'}"></div>`;
    }
  } catch(e){ console.warn(e); }

  function codeSampleFor(name) {
    const n = (name||'').toLowerCase();
    if (n.includes('javascript')) return `// Exemplo simples em JavaScript\nconsole.log('Olá, mundo!');`;
    if (n.includes('python')) return `# Exemplo simples em Python\nprint('Olá, mundo!')`;
    if (n.includes('java')) return `// Exemplo Java\npublic class Main{ public static void main(String[] args){ System.out.println("Olá, mundo!"); } }`;
    if (n.includes('c#') || n.includes('csharp')) return `// Exemplo C#\nusing System; class Program{ static void Main(){ Console.WriteLine("Olá, mundo!"); } }`;
    if (n.includes('go')) return `// Exemplo Go\npackage main\nimport "fmt"\nfunc main(){ fmt.Println("Olá, mundo!") }`;
    if (n.includes('rust')) return `// Exemplo Rust\nfn main(){ println!("Olá, mundo!"); }`;
    if (n.includes('php')) return `<?php echo "Olá, mundo!"; ?>`;
    if (n.includes('html')) return `<!-- Exemplo HTML -->\n<!doctype html>\n<html><body><h1>Olá, mundo!</h1></body></html>`;
    return `// Exemplo genérico\nconsole.log('Olá, mundo!');`;
  }

  const moreHtml = [];
  moreHtml.push('<h3>Principais usos</h3>');
  if (Array.isArray(match.tags) && match.tags.length>0) {
    moreHtml.push(`<p>${match.tags.map(t=>`<strong>${t}</strong>`).join(', ')}</p>`);
  } else {
    moreHtml.push('<p>Informações de uso não disponíveis.</p>');
  }

  moreHtml.push('<h3>Exemplo rápido</h3>');
  moreHtml.push(`<pre class="code-sample"><code>${escapeHtml(codeSampleFor(match.nome))}</code></pre>`);

  moreHtml.push('<h3>Recursos e aprendizado</h3>');
  moreHtml.push(`<p>Documentação oficial e guias recomendados estão disponíveis no link de documentação abaixo.</p>`);

  rootMore.innerHTML = moreHtml.join('\n');

  function escapeHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

})();

