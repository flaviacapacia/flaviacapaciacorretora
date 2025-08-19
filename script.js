:root {
  --fundo-branco: #ffffff;
  --texto-bronze: #4B3A2F;

  --bronze-claro: #7A5C45;
  --fonte-padrao: 'Playfair Display', serif;
  --dourado: #b08d57;
  color: var(--dourado);
}




/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Tema claro */
body {
  background-color: var(--fundo-branco);
  color: var(--texto-bronze);
  font-family: var(--fonte-padrao);
  line-height: 1.6;
}

/* Cabeçalho */
.site-header {
  background-color: var(--fundo-branco);
  padding: 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-area img {
  max-width: 170px;
  height: auto;
}
.logo-contato {
  max-width: 200px;
  margin-bottom: 20px;
  display: block;
}
.contato-logo {
  text-align: center;
}


/* Navegação */
.main-nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.main-nav a {
  text-decoration: none;
  color: var(--texto-bronze);
  font-weight: bold;
}

/* Ícones sociais */
.social-icons {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-left: 0;
  margin-top: 10px;
}

.social-icons .icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.social-icons .icon:hover {
  transform: scale(1.1);
}

/* Hero 
.hero img {
  width: 100%;
  height: auto;
  display: block;
}*/
.hero img {
  width: 100%;
  height: auto;
  max-height: 600px; /* altura máxima no desktop */
  object-fit: cover;
}

/* Ajuste específico para telas maiores */
@media screen and (min-width: 768px) {
  .hero img {
    max-height: 400px; /* reduz um pouco no desktop */
  }
}


/* Imóveis */
.imoveis-section {
  padding: 40px 20px;
}
.destaques-section {
  text-align: center;
  padding: 40px 20px;
}

.slider-container {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.slider {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  box-sizing: border-box;
}

.slide img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
}










.prev, .next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #b08d57;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 24px;
  border-radius: 50%;
}

.prev { left: 10px; }
.next { right: 10px; }

.imoveis-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.imovel {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: box-shadow 0.3s ease;
  text-align: center;
}

.imovel:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.imovel img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}

.imovel h3 {
  color: var(--dourado);
  margin-bottom: 5px;
}

.imovel p {
  color: var(--texto-bronze);
}
#lista-imoveis-tecimob {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

.imovel-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}

.imovel-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}
#filtros {
  display: flex;
  gap: 10px;
  margin: 20px;
  flex-wrap: wrap;
}

#imoveis-lista {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

.imovel-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}

.imovel-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.imovel-card a {
  display: inline-block;
  margin-top: 10px;
  background: #25D366;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
}


/* Responsivo */
@media (max-width: 768px) {
  .imoveis-grid {
    grid-template-columns: 1fr;
  }

  .main-nav ul {
    flex-direction: column;
    align-items: center;
  }
}

/* Sobre */
.sobre-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 40px 20px;
  align-items: center;
}

.titulo-dourado {
  color: #b08d57;
  text-align: center;
}

.sobre-foto img {
  max-width: 300px;
  border-radius: 8px;
}

.texto-sobre {
  flex: 1;
}
.menu-principal {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 20px 0;
}

.menu-principal a {
  color: #b08d57; /* dourado bronze */
  font-weight: bold;
  text-decoration: none;
  font-size: 18px;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background 0.3s;
}

.menu-principal a:hover {
  background-color: #f5f0e6;
}


/* Negocie */
.negocie-section {
  padding: 40px 20px;
}

/* Financie */
.financie-section {
  padding: 40px 20px;
}

.bancos-financiamento {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}
.bancos img {
  width: 150px;     /* largura comprida */
  height: 60px;     /* altura mais baixa para formato retangular */
  object-fit: contain;
  margin: 10px;
  border-radius: 8px; /* cantos levemente arredondados */
  box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* sombra suave */
}
.bancos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.simule-texto {
  text-align: center;
  margin-top: 20px;
}
.section-title,
.contato-section h2 {
  color: #b08d57; /* dourado bronze */
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}
.financie-section,
.contato-section {
  text-align: center;
}

.bancos-financiamento {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}




/* Contato */
.contato-section   
..padding: 40px 20px;
.form-section {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  margin: 40px auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  font-family: 'Playfair Display', serif;
}

.form-section h2 {
  text-align: center;
  color: #b08d57;
  margin-bottom: 20px;
}

form label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
  color: #333;
}

form input,
form textarea {
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

form button {
  margin-top: 1.5rem;
  padding: 1rem 2rem;
  background-color: #b08d57;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

form button:hover {
  background-color: #a0763d;
}



/* CTA */
.cta-banner {
  background-color: var(--bronze-claro);
  color: white;
  text-align: center;
  padding: 30px 20px;
}

/* Rodapé */
.site-footer {
  background-color: var(--fundo-branco);
  color: var(--texto-bronze);
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
}

.footer-logo img {
  max-width: 170px;
  height: auto;
}

.footer-contact a {
  color: var(--texto-bronze);
  text-decoration: none;
}

.social-list ul {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 0;
  margin-top: 10px;
}

