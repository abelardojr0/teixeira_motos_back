// controllers/dashboardController.js
const DashboardService = require("../services/dashService");

exports.getResumo = async (req, res) => {
  try {
    const resumo = await DashboardService.getResumoDashboard();
    res.json(resumo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar resumo do dashboard" });
  }
};

exports.getLucros = async (req, res) => {
  try {
    const lucros = await DashboardService.getLucros();
    res.json(lucros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao calcular lucros" });
  }
};

exports.getClientesInfo = async (req, res) => {
  try {
    const dados = await DashboardService.getClientesInfo();
    res.json(dados);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Erro ao buscar dados dos clientes",
      text: err.message,
    });
  }
};
