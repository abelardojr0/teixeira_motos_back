const Produto = require('../models/produtos');

// Cria um novo produto
async function createProduto(data) {
  const produto = await Produto.create(data);
  return produto;
}

// Retorna todos os produtos
async function getProdutos() {
  const produtos = await Produto.findAll();
  return produtos;
}

// Retorna um produto por ID
async function getProdutoById(id) {
  const produto = await Produto.findByPk(id);
  return produto;
}

// Atualiza o produto com base no ID
async function updateProduto(id, data) {
  const produto = await Produto.findByPk(id);
  if (!produto) {
    throw new Error('Produto não encontrado.');
  }
  const produtoAtualizado = await produto.update(data);
  return produtoAtualizado;
}

// Exclui o produto com base no ID
async function deleteProduto(id) {
  const produto = await Produto.findByPk(id);
  if (!produto) {
    throw new Error('Produto não encontrado.');
  }
  await produto.destroy();
  return true;
}

module.exports = {
  createProduto,
  getProdutos,
  getProdutoById,
  updateProduto,
  deleteProduto,
};
