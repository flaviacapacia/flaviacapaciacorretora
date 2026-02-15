const express = require('express');
const router = express.Router();
const { listarPosts, buscarTendencias } = require('../controllers/blogController');

router.get('/', listarPosts);
router.get('/trends', buscarTendencias);

module.exports = router;
