const Servico = require("../models/servicos");

async function createServico(data) {
  return await Servico.create(data);
}

async function getServicos() {
  return await Servico.findAll();
}

async function getServicoById(id) {
  return await Servico.findByPk(id);
}

async function updateServico(id, data) {
  const servico = await Servico.findByPk(id);
  if (!servico) throw new Error("Serviço não encontrado.");
  return await servico.update(data);
}

async function deleteServico(id) {
  const servico = await Servico.findByPk(id);
  if (!servico) throw new Error("Serviço não encontrado.");
  await servico.destroy();
  return true;
}

module.exports = {
  createServico,
  getServicos,
  getServicoById,
  updateServico,
  deleteServico,
};
