const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/produtosController');

router.post('/', ProdutoController.create);
router.get('/', ProdutoController.getAll);
router.get('/:id', ProdutoController.getById);
router.put('/:id', ProdutoController.update);
router.delete('/:id', ProdutoController.delete);

module.exports = router;
