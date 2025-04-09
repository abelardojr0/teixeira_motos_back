const VendaService = require("../services/vendasService");

exports.create = async (req, res) => {
  try {
    const venda = await VendaService.criarVenda(req.body);
    return res.status(201).json(venda);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao realizar a venda." });
  }
};

exports.getAll = async (req, res) => {
  try {
    const vendas = await VendaService.listarVendas();
    return res.status(200).json(vendas);
  } catch (err) {
    console.error("Erro ao buscar vendas:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const venda = await VendaService.buscarVendaPorId(id);
    return res.status(200).json(venda);
  } catch (err) {
    console.error("Erro ao buscar venda:", err);
    return res.status(404).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await VendaService.excluirVenda(id);
    return res.status(200).json({ message: "Venda excluída com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir venda:", err);
    return res.status(500).json({ error: err.message });
  }
};
