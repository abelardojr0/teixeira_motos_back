const Cliente = require("../models/clientes");

// Cria um novo cliente
async function createCliente(data) {
  const cliente = await Cliente.create(data);
  return cliente;
}

// Retorna todos os clientes
async function getClientes() {
  const clientes = await Cliente.findAll();
  return clientes;
}

// Retorna um cliente por ID
async function getClienteById(id) {
  const cliente = await Cliente.findByPk(id);
  return cliente;
}

// Atualiza cliente por ID
async function updateCliente(id, data) {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) {
    throw new Error("Cliente não encontrado.");
  }
  const clienteAtualizado = await cliente.update(data);
  return clienteAtualizado;
}

// Deleta cliente por ID
async function deleteCliente(id) {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) {
    throw new Error("Cliente não encontrado.");
  }
  await cliente.destroy();
  return true;
}

module.exports = {
  createCliente,
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
};
