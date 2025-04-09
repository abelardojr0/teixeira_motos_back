const ProdutoService = require('../services/produtosService');

exports.create = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      marca,
      categoria,
      estoque,
      preco,
      custo,
    } = req.body;

    const novoProduto = await ProdutoService.createProduto({
      nome,
      descricao,
      marca,
      categoria,
      estoque,
      preco,
      custo,
    });

    return res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao cadastrar o produto.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const produtos = await ProdutoService.getProdutos();
    return res.status(200).json(produtos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar os produtos.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await ProdutoService.getProdutoById(id);

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar o produto.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      descricao,
      marca,
      categoria,
      estoque,
      preco,
      custo,
    } = req.body;

    const produtoAtualizado = await ProdutoService.updateProduto(id, {
      nome,
      descricao,
      marca,
      categoria,
      estoque,
      preco,
      custo,
    });

    return res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error(error);
    if (error.message === 'Produto não encontrado.') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Erro ao atualizar o produto.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await ProdutoService.deleteProduto(id);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.message === 'Produto não encontrado.') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Erro ao deletar o produto.' });
  }
};
