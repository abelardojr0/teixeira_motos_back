const ServicoService = require("../services/servicosService");

exports.create = async (req, res) => {
  try {
    const servico = await ServicoService.createServico(req.body);
    return res.status(201).json(servico);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao cadastrar o serviço." });
  }
};

exports.getAll = async (req, res) => {
  try {
    const servicos = await ServicoService.getServicos();
    return res.status(200).json(servicos);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar os serviços." });
  }
};

exports.getById = async (req, res) => {
  try {
    const servico = await ServicoService.getServicoById(req.params.id);
    if (!servico)
      return res.status(404).json({ error: "Serviço não encontrado." });
    return res.status(200).json(servico);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar o serviço." });
  }
};

exports.update = async (req, res) => {
  try {
    const servicoAtualizado = await ServicoService.updateServico(
      req.params.id,
      req.body
    );
    return res.status(200).json(servicoAtualizado);
  } catch (error) {
    const status = error.message === "Serviço não encontrado." ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await ServicoService.deleteServico(req.params.id);
    return res.status(204).send();
  } catch (error) {
    const status = error.message === "Serviço não encontrado." ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};
