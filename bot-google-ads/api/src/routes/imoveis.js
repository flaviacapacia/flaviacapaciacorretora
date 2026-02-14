const express = require('express');
const router = express.Router();
const { listarImoveis, buscarImovel } = require('../controllers/imoveisController');

router.get('/', listarImoveis);
router.get('/:id', buscarImovel);

module.exports = router;
