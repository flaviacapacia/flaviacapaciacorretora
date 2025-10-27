<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
  </head>
  <body>
    <?!= HtmlService.createHtmlOutputFromFile('head').getContent(); ?>
<body>

<header class="site-header">
  <?!= HtmlService.createHtmlOutputFromFile('header').getContent(); ?>
</header>

<section id="imoveis" class="imoveis-section">
  <h2 class="section-title" style="text-align:center; color:var(--dourado); font-family:'Playfair Display', serif;">
    Imóveis Disponíveis Aqui
  </h2>
  <div class="imoveis-grid">
    <? for (var i=0; i<data.length; i++){ 
         var it = data[i]; 
         var img = (it.imagens[0] || ""); ?>
      <div class="imovel">
        <a href="<?= it.link ?>" target="_blank">
          <? if (img) { ?>
            <img src="<?= img ?>" alt="Foto <?= it.codigo ?>">
          <? } ?>
          <h3><?= it.tipo ?> - <?= it.valor ?></h3>
          <p><?= it.endereco ?></p>
        </a>
      </div>
    <? } ?>
  </div>
</section>

<footer class="site-footer" id="contato">
  <?!= HtmlService.createHtmlOutputFromFile('footer').getContent(); ?>
</footer>

</body>

  </body>
</html>
