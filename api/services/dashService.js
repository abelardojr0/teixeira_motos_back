// services/dashboardService.js
const { Op } = require("sequelize");
const {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} = require("date-fns");
const Venda = require("../models/venda");
const ItemVenda = require("../models/itensVenda");
const Produto = require("../models/produtos");
const Cliente = require("../models/clientes");

async function getResumoDashboard() {
  const agora = new Date();

  // Vendas do mês
  const vendasMes = await Venda.findAll({
    where: {
      createdAt: {
        [Op.between]: [startOfMonth(agora), endOfMonth(agora)],
      },
    },
  });
  const totalVendasMes = vendasMes.reduce(
    (acc, venda) => acc + Number(venda.total),
    0
  );

  // Produtos com estoque baixo
  const produtosBaixoEstoque = await Produto.count({
    where: {
      estoque: { [Op.lt]: 5 },
    },
  });

  // Clientes únicos do mês
  const clientes = new Set(vendasMes.map((v) => v.cliente_nome));
  const totalClientesMes = clientes.size;

  // Vendas de hoje
  const vendasHoje = await Venda.findAll({
    where: {
      createdAt: {
        [Op.between]: [startOfDay(agora), endOfDay(agora)],
      },
    },
  });
  const valorHoje = vendasHoje.reduce(
    (acc, venda) => acc + Number(venda.total),
    0
  );

  return {
    totalVendasMes,
    produtosBaixoEstoque,
    totalClientesMes,
    vendasHoje: vendasHoje.length,
    valorHoje,
  };
}

async function calcularLucroPeriodo(inicio, fim) {
  const vendas = await Venda.findAll({
    where: {
      createdAt: {
        [Op.between]: [inicio, fim],
      },
    },
    include: [
      {
        model: ItemVenda,
        include: [Produto],
      },
    ],
  });

  let totalLucro = 0;

  vendas.forEach((venda) => {
    venda.ItemVendas.forEach((item) => {
      const preco = Number(item.preco_unitario);
      const custo = Number(item.produto?.custo || 0);
      const quantidade = Number(item.quantidade);
      const lucroItem = (preco - custo) * quantidade;
      totalLucro += lucroItem;
    });
  });

  return totalLucro;
}

async function getLucros() {
  const hoje = new Date();

  const lucroDiario = await calcularLucroPeriodo(
    startOfDay(hoje),
    endOfDay(hoje)
  );
  const lucroSemanal = await calcularLucroPeriodo(
    startOfWeek(hoje),
    endOfWeek(hoje)
  );
  const lucroMensal = await calcularLucroPeriodo(
    startOfMonth(hoje),
    endOfMonth(hoje)
  );
  const lucroAnual = await calcularLucroPeriodo(
    startOfYear(hoje),
    endOfYear(hoje)
  );

  return {
    lucroDiario,
    lucroSemanal,
    lucroMensal,
    lucroAnual,
  };
}

async function getClientesInfo() {
  const agora = new Date();

  // Clientes criados neste mês
  const novosClientesMes = await Cliente.count({
    where: {
      createdAt: {
        [Op.between]: [startOfMonth(agora), endOfMonth(agora)],
      },
    },
  });

  // Clientes que fizeram mais de uma compra no mês
  const vendasMes = await Venda.findAll({
    where: {
      createdAt: {
        [Op.between]: [startOfMonth(agora), endOfMonth(agora)],
      },
    },
    attributes: ["cliente_id"],
  });

  const mapaContagem = {};
  vendasMes.forEach((v) => {
    const id = v.cliente_id;
    mapaContagem[id] = (mapaContagem[id] || 0) + 1;
  });

  const clientesRecorrentes = Object.values(mapaContagem).filter(
    (qtd) => qtd > 1
  ).length;

  // Top 3 clientes que mais gastaram no mês
  const vendasComCliente = await Venda.findAll({
    where: {
      createdAt: {
        [Op.between]: [startOfMonth(agora), endOfMonth(agora)],
      },
    },
    include: [
      {
        model: Cliente,
        as: "cliente", // 👈 aqui está o segredo
        attributes: ["id", "nome"],
      },
    ],
  });

  const totaisPorCliente = {};

  vendasComCliente.forEach((v) => {
    if (!v.cliente) return;
    const id = v.cliente.id;
    if (!totaisPorCliente[id]) {
      totaisPorCliente[id] = {
        id,
        nome: v.cliente.nome,
        total: 0,
      };
    }
    totaisPorCliente[id].total += Number(v.total);
  });

  const topClientesMes = Object.values(totaisPorCliente)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  return {
    novosClientesMes,
    clientesRecorrentes,
    topClientesMes,
  };
}

module.exports = {
  getResumoDashboard,
  getLucros,
  getClientesInfo,
};
