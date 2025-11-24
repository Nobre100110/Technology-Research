let cardContainer = document.querySelector(".card-container");
let campoBusca = document.getElementById("searchInput");
let dados = [];

// Elementos do login (serão encontrados se existirem)
const loginLogoEl = () => document.getElementById("loginLogo");
const toggleSenhaBtn = () => document.getElementById("toggleSenha");
const loginPassInput = () => document.getElementById("loginPass");
const loginUserInput = () => document.getElementById("loginUser");
const loginBtn = () => document.getElementById("loginBtn");
const loginPanel = () => document.querySelector(".login-panel");
const searchContainer = () => document.getElementById("searchContainer");

// Badges SVG mais polidos para as linguagens — designs genéricos e estilizados
const logos = [
    // JavaScript (badge amarelo com JS)
    `<svg viewBox="0 0 100 100" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="g-js" x1="0" x2="1">
                <stop offset="0" stop-color="#f7df1e" />
                <stop offset="1" stop-color="#ffd84a" />
            </linearGradient>
        </defs>
        <rect rx="18" width="100" height="100" fill="url(#g-js)" />
        <text x="50%" y="60%" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="800" font-size="36" fill="#222">JS</text>
    </svg>`,

    // Python (badge azul com forma estilizada lembrando uma serpente)
    `<svg viewBox="0 0 100 100" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
        <rect rx="18" width="100" height="100" fill="#2d6fb6" />
        <path d="M28 32c6-8 22-10 36-6 6 2 10 6 9 11-1 6-7 9-12 7-6-2-5-8 1-7" fill="#ffd43b" opacity="0.98" />
        <circle cx="30" cy="36" r="3.2" fill="#fff" />
        <text x="50%" y="86%" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="13" fill="#fff">Python</text>
    </svg>`,

    // TypeScript (badge roxo-azulado)
    `<svg viewBox="0 0 100 100" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
        <rect rx="18" width="100" height="100" fill="#3178c6" />
        <text x="50%" y="60%" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="800" font-size="34" fill="#fff">TS</text>
    </svg>`,

    // Java (badge vermelho quente com ícone de xícara estilizada)
    `<svg viewBox="0 0 100 100" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
        <rect rx="18" width="100" height="100" fill="#c7512b" />
        <path d="M30 40c6-6 34-6 34 6s-6 14-18 14S30 52 30 40z" fill="#fff" opacity="0.92" />
        <text x="50%" y="86%" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="13" fill="#fff">Java</text>
    </svg>`,

    // HTML/CSS combined (<> com cores)
    `<svg viewBox="0 0 100 100" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
        <rect rx="18" width="100" height="100" fill="#0b74de" />
        <g fill="#fff" font-family="Quicksand, sans-serif" font-weight="700">
            <text x="50%" y="44%" text-anchor="middle" font-size="28">&lt; / &gt;</text>
            <text x="50%" y="82%" text-anchor="middle" font-size="13">HTML/CSS</text>
        </g>
    </svg>`,

    // C# (badge escuro com C#)
    `<svg viewBox="0 0 100 100" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
        <rect rx="18" width="100" height="100" fill="#0078d7" />
        <text x="50%" y="60%" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="800" font-size="30" fill="#fff">C#</text>
    </svg>`,

    // Go (badge turquesa)
    `<svg viewBox="0 0 100 100" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
        <rect rx="18" width="100" height="100" fill="#00a5b5" />
        <text x="50%" y="60%" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="800" font-size="24" fill="#fff">Go</text>
    </svg>`,

    // Rust (badge escuro com engrenagem estilizada)
    `<svg viewBox="0 0 100 100" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
        <rect rx="18" width="100" height="100" fill="#dea584" />
        <circle cx="50" cy="50" r="16" fill="#523f37" />
        <text x="50%" y="86%" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="12" fill="#523f37">Rust</text>
    </svg>`,

    // PHP (badge roxo suave)
    `<svg viewBox="0 0 100 100" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
        <rect rx="18" width="100" height="100" fill="#8892bf" />
        <text x="50%" y="60%" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="800" font-size="20" fill="#fff">PHP</text>
    </svg>`
];

// Gera uma cor HSL determinística a partir do nome (para badges consistentes)
function colorFromName(name, sat = 70, light = 55) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue} ${sat}% ${light}%)`;
}

function initialsFor(name) {
    if (!name) return '';
    const parts = name.split(/\s|\.|-|\/|\+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 10);
    const initials = parts.map(p => p[0].toUpperCase()).slice(0, 3).join('');
    return initials;
}

// Gera um badge SVG simples e elegante para qualquer nome (usado para frameworks/tecnos)
function badgeForName(name, size = 96) {
    const color = colorFromName(name, 68, 55);
    const short = name.length <= 12 ? name : initialsFor(name);
    // escape caracteres especiais para inclusão segura em template
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `
    <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect rx="18" width="100" height="100" fill="${color}" />
        <text x="50%" y="56%" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="700" font-size="14" fill="#fff">${esc(short)}</text>
        <text x="50%" y="84%" text-anchor="middle" font-family="Quicksand, sans-serif" font-weight="600" font-size="9" fill="#ffffff99">${esc(name)}</text>
    </svg>`;
}

// Constrói um pool de logos combinando as badges estáticas e as geradas a partir de `data.json`.
// Isso permite incluir automaticamente muitas linguagens/frameworks/tecnologias presentes em data.json.
async function buildLogosPool() {
    const pool = [];
    // inclui badges estáticas já definidas
    for (const s of logos) pool.push(s);

    // garante que `dados` esteja carregado; se não, busca o JSON
    if (!dados || dados.length === 0) {
        try {
            const resp = await fetch('data.json');
            dados = await resp.json();
        } catch (err) {
            console.warn('Não foi possível carregar data.json para gerar badges dinâmicos:', err);
        }
    }


    // Lista das linguagens/frameworks mais conhecidas que queremos mostrar
    const popular = new Set([
        'javascript','python','java','typescript','c#','c','c++','php','ruby','go','rust','kotlin','swift','sql','html','css','react','vue.js','angular','scala','perl','dart','r','matlab'
    ].map(s => s.toLowerCase()));

    if (dados && dados.length > 0) {
        const seen = new Set();
        for (const item of dados) {
            const name = (item.nome || '').trim();
            if (!name) continue;
            const key = name.toLowerCase();
            if (seen.has(key)) continue;
            // adiciona apenas se estiver na lista de populares
            if (popular.has(key) || popular.has(key.replace(/\s+/g, ''))) {
                seen.add(key);
                pool.push(badgeForName(name));
            }
        }
    }

    return pool;
}

function initLoginWidget() {
    // se elemento existe, escolhe um logo aleatório a cada carregamento
    const logoEl = loginLogoEl();
    if (logoEl) {
        // build pool async e escolhe um item aleatório
        buildLogosPool().then(pool => {
            if (!pool || pool.length === 0) return;
            const idx = Math.floor(Math.random() * pool.length);
            logoEl.innerHTML = pool[idx];
        }).catch(err => {
            console.error('Erro ao construir pool de logos:', err);
        });
    }

    // randomiza variante do olho para pequena variação visual a cada carga
    const eyeVariant = Math.floor(Math.random() * 2);

    // configura comportamento de mostrar/ocultar senha
    const toggleBtn = toggleSenhaBtn();
    const passInput = loginPassInput();
    if (toggleBtn && passInput) {
        let shown = false;
        function renderEye() {
            toggleBtn.innerHTML = shown ? eyeOpenSVG(eyeVariant) : eyeClosedSVG(eyeVariant);
        }
        toggleBtn.addEventListener("click", () => {
            shown = !shown;
            passInput.type = shown ? "text" : "password";
            toggleBtn.classList.add("active");
            setTimeout(() => toggleBtn.classList.remove("active"), 160);
            renderEye();
        });
        renderEye();
    }

    // comportamento do botão de login: validar campos e revelar busca
    const btn = loginBtn();
    if (btn) {
        btn.addEventListener('click', () => {
            const user = loginUserInput() ? loginUserInput().value.trim() : '';
            const pass = loginPassInput() ? loginPassInput().value.trim() : '';
            if (user === '' || pass === '') {
                // simples feedback visual
                btn.textContent = 'Preencha os campos';
                setTimeout(() => btn.textContent = 'Entrar', 1200);
                return;
            }
            // esconder painel de login e revelar a busca
            const panel = loginPanel();
            const search = searchContainer();
            if (panel) panel.style.display = 'none';
            if (search) {
                // mostra com animação e foca após a transição
                search.classList.remove('search-hidden');
                search.classList.add('search-visible');
                // atualiza referência do campo de busca
                campoBusca = document.getElementById('searchInput');
                // foca após a animação terminar
                setTimeout(() => {
                    if (campoBusca) campoBusca.focus();
                }, 380);
            }
            // NÃO iniciar busca automaticamente — somente quando o usuário pesquisar
        });
    }
}

function eyeOpenSVG(variant = 0) {
        if (variant === 1) {
                return `
                <svg class="eye" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="12" cy="12" rx="9" ry="5.2" stroke="currentColor" stroke-width="1"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                </svg>`;
        }
        return `
        <svg class="eye" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
}

function eyeClosedSVG(variant = 0) {
        if (variant === 1) {
                return `
                <svg class="eye" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12c2-4 8-8 10-8 4 0 10 4 12 8-2 4-8 8-12 8-2 0-8-4-10-8z" stroke="currentColor" stroke-width="1"/>
                    <path d="M4 4l16 16" stroke="currentColor" stroke-width="1"/>
                </svg>`;
        }
        return `
        <svg class="eye" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7 .87-1.96 2.26-3.72 4.06-5.09" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1 1l22 22" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
}

// inicializa widget de login após o carregamento do DOM
document.addEventListener("DOMContentLoaded", initLoginWidget);

// atalho Enter: quando estiver no campo de busca, Enter executa iniciarBusca
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active && active.id === 'searchInput') {
            e.preventDefault();
            iniciarBusca();
        }
        if (active && (active.id === 'loginPass' || active.id === 'loginUser')) {
            // simula clique no botão Entrar
            const btn = loginBtn();
            if (btn) btn.click();
        }
    }
});

async function iniciarBusca() {
    // Se os dados ainda não foram carregados, busca do JSON.
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            return; // Interrompe a execução se houver erro
        }
    }

    const termoBusca = (campoBusca.value || "").trim().toLowerCase();
    const dadosFiltrados = dados.filter(dado => {
        const nome = (dado.nome || "").toLowerCase();
        const descricao = (dado.descricao || "").toLowerCase();
        // Se o campo de busca estiver vazio, retorna todos os itens
        if (termoBusca === "") return true;
        return nome.includes(termoBusca) || descricao.includes(termoBusca);
    });

    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos
    if (!dados || dados.length === 0) {
        // mostra mensagem amigável quando não há resultados
        const no = document.createElement('div');
        no.className = 'no-results';
        no.innerHTML = `
            <div class="no-results-inner">
                <h3>Nenhum resultado encontrado</h3>
                <p>Não encontramos nada relacionado à sua busca. Tente termos diferentes ou verifique a grafia.</p>
            </div>
        `;
        cardContainer.appendChild(no);
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        const nome = dado.nome || "Sem nome";
        const dataCriacao = dado.data_criacao || "";
        const descricao = dado.descricao || "";
        // usa `link_oficial` quando disponível, senão tenta `link`, senão '#'
        const link = dado.link_oficial || dado.link || "#";

        article.innerHTML = `
        <h2>${nome}</h2>
        <p>${dataCriacao}</p>
        <p>${descricao}</p>
        <a href="${link}" target="_blank">Saiba mais</a>
        `;
        cardContainer.appendChild(article);
    }
}