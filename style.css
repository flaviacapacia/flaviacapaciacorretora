/*-------------------------------------------
 Variables
--------------------------------------------*/
:root {
  --bg-dark: #111;
  --card-bg: #222;
  --text-light: #f5f5f5;
  --text-muted: #ccc;
  --accent: #bfa76f;
  --hover-accent: #a68e57;
}

/*-------------------------------------------
 Reset
--------------------------------------------*/
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/*-------------------------------------------
 Base
--------------------------------------------*/
body {
  font-family: 'Playfair Display', serif;
  background: var(--bg-dark);
  color: var(--text-light);
  line-height: 1.5;
  scroll-behavior: smooth;
}

a {
  color: var(--accent);
  transition: color 0.3s;
}

a:hover {
  color: var(--hover-accent);
}

/*-------------------------------------------
 Header & Menu
--------------------------------------------*/
.site-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  background: var(--bg-dark);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  width: 180px; /* Logo maior */
}

.main-nav ul {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.main-nav a {
  font-weight: 700;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  .main-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-dark);
    text-align: center;
    padding: 1rem 0;
  }
  .main-nav.active {
    display: block;
  }
  .main-nav ul {
    flex-direction: column;
    gap: 1rem;
  }
}


/*-------------------------------------------
 Hero
--------------------------------------------*/
.hero {
  text-align: center;
}
.hero .capa {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

/*-------------------------------------------
 Imóveis
--------------------------------------------*/
#lista-imoveis {
  padding: 2rem 1rem;
  background: var(--bg-dark);
}

.section-title {
  text-align: center;
  margin-bottom: 1rem;
  color: var(--accent);
}

.imoveis-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.imovel {
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.imovel img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.imovel p {
  padding: 0.75rem;
  text-align: center;
}

.imovel:hover {
  transform: translateY(-5px);
}

@media (max-width: 1024px) {
  .imoveis-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .imoveis-grid {
    grid-template-columns: 1fr;
  }
}

/*-------------------------------------------
 Sobre (fundo branco)
--------------------------------------------*/
.sobre-section {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  color: #333;
  padding: 3rem 2rem;
  gap: 2rem;
}
.section-title,
.sobre-section h2 {
  text-align: center;
  color: #b08d57; /* dourado bronze */
  font-size: 28px;
  margin-bottom: 20px;
  font-weight: b


.sobre-texto {
  flex: 1 1 300px;
}

.sobre-texto h2 {
  color: var(--accent);
  margin-bottom: 1rem;
}

.sobre-texto p {
  margin-bottom: 1rem;
}

.sobre-foto {
  flex: 1 1 300px;
}
.sobre-foto img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

/*-------------------------------------------
 Negocie
--------------------------------------------*/
.negocie-section {
  background: var(--bg-dark);
  padding: 2rem;
  text-align: center;
}

.negocie-section h2 {
  color: var(--accent);
  margin-bottom: 1rem;
}

.negocie-section ul {
  list-style: disc inside;
  max-width: 600px;
  margin: 0 auto;
  color: var(--text-light);
  text-align: left;
}
.negocie-section li {
  margin: 0.5rem 0;
}

/*-------------------------------------------
 Financie
--------------------------------------------*/
.financie-section {
  background: var(--card-bg);
  padding: 2rem;
  text-align: center;
}

.financie-section h2 {
  color: var(--accent);
  margin-bottom: 1rem;
}

/*-------------------------------------------
 Contracapa (CTA)
--------------------------------------------*/
.cta-banner {
  background: url('capa-final.jpg') center/cover no-repeat;
  text-align: center;
  padding: 4rem 1rem;
}

.cta-banner h2 {
  font-size: 2rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
}

/*-------------------------------------------
 Rodapé
--------------------------------------------*/
.site-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: var(--bg-dark);
  color: var(--text-muted);
  flex-wrap: wrap;
}

.footer-logo img {
  width: 100px;
}

.footer-contact h3 {
  color: var(--accent);
  margin-bottom: 0.5rem;
}
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

document.querySelector('.next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
});

document.querySelector('.prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlider();
});

function updateSlider() {
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

function updateSlider() {
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Troca automática a cada 5 segundos
setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
}, 5000);
fetch('https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/integrations/5b33fb35-31ad-48a1-9ad7-78e3918ca78f/casa-mineira.xml')
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    const imoveis = data.querySelectorAll("imovel");
    const container = document.getElementById("lista-imoveis-tecimob");

    imoveis.forEach(imovel => {
      const titulo = imovel.querySelector("titulo")?.textContent || "Imóvel sem título";
      const descricao = imovel.querySelector("descricao")?.textContent || "";
      const preco = imovel.querySelector("valor")?.textContent || "Sob consulta";
      const imagem = imovel.querySelector("fotos foto")?.textContent || "img/imovel-default.jpg";

      const card = document.createElement("div");
      card.className = "imovel-card";
      card.innerHTML = `
        <img src="${imagem}" alt="${titulo}">
        <h3>${titulo}</h3>
        <p>${descricao}</p>
        <strong>Valor: R$ ${preco}</strong>
      `;
      container.appendChild(card);
    });
  })
  .catch(error => console.error("Erro ao carregar imóveis:", error));
const urlXML = 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/grq6lwb4htd1/b/tecimob-production/o/integrations/5b33fb35-31ad-48a1-9ad7-78e3918ca78f/casa-mineira.xml';

fetch(urlXML)
  .then(res => res.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(xml => {
    const imoveis = Array.from(xml.querySelectorAll("imovel"));
    const lista = document.getElementById("imoveis-lista");
    const bairros = new Set();
    const tipos = new Set();

    function render(imoveisFiltrados) {
      lista.innerHTML = "";
      imoveisFiltrados.forEach(imovel => {
        const titulo = imovel.querySelector("titulo")?.textContent || "Sem título";
        const descricao = imovel.querySelector("descricao")?.textContent || "";
        const preco = imovel.querySelector("valor")?.textContent || "Sob consulta";
        const imagem = imovel.querySelector("fotos foto")?.textContent || "img/imovel-default.jpg";
        const bairro = imovel.querySelector("bairro")?.textContent || "";
        const tipo = imovel.querySelector("tipo")?.textContent || "";
        const whatsapp = "55SEUNUMEROAQUI"; // Substitua com seu número

        bairros.add(bairro);
        tipos.add(tipo);

        const card = document.createElement("div");
        card.className = "imovel-card";
        card.innerHTML = `
          <img src="${imagem}" alt="${titulo}">
          <h3>${titulo}</h3>
          <p>${descricao}</p>
          <strong>Valor: R$ ${preco}</strong><br>
          <em>${bairro} - ${tipo}</em><br>
          <a href="https://wa.me/${whatsapp}?text=Olá! Tenho interesse no imóvel: ${titulo}" target="_blank">📱 Falar no WhatsApp</a>
        `;
        lista.appendChild(card);
      });
    }

    function aplicarFiltros() {
      const bairro = document.getElementById("filtro-bairro").value;
      const tipo = document.getElementById("filtro-tipo").value;
      const precoMax = parseFloat(document.getElementById("filtro-preco").value);

      const filtrados = imoveis.filter(imovel => {
        const preco = parseFloat(imovel.querySelector("valor")?.textContent || 0);
        const bairroAtual = imovel.querySelector("bairro")?.textContent || "";
        const tipoAtual = imovel.querySelector("tipo")?.textContent || "";

        return (!bairro || bairroAtual === bairro) &&
               (!tipo || tipoAtual === tipo) &&
               (!precoMax || preco <= precoMax);
      });

      render(filtrados);
    }

    // Preenche os filtros
    bairros.forEach(b => {
      const opt = document.createElement("option");
      opt.value = opt.textContent = b;
      document.getElementById("filtro-bairro").appendChild(opt);
    });

    tipos.forEach(t => {
      const opt = document.createElement("option");
      opt.value = opt.textContent = t;
      document.getElementById("filtro-tipo").appendChild(opt);
    });

    document.querySelectorAll("#filtros select, #filtros input").forEach(el => {
      el.addEventListener("change", aplicarFiltros);
    });

    render(imoveis);
  });

