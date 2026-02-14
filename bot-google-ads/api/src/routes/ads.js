const express = require('express');
const router = express.Router();
const {
  gerarAnuncios,
  previewAnuncio,
  publicarAnuncio,
  listarAnuncios,
  buscarAnuncio,
  buscarPerformance
} = require('../controllers/adsController');

router.post('/generate', gerarAnuncios);
router.post('/preview', previewAnuncio);
router.post('/publish', publicarAnuncio);
router.get('/', listarAnuncios);
router.get('/:id', buscarAnuncio);
router.get('/:id/performance', buscarPerformance);

module.exports = router;
