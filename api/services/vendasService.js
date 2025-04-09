const Venda = require("../models/venda");
const ItemVenda = require("../models/itensVenda");
const Produto = require("../models/produtos");
const Servico = require("../models/servicos");
const Cliente = require("../models/clientes");

// RELACIONAMENTO para associar Servico a ItemVenda
ItemVenda.belongsTo(Produto, { foreignKey: "produto_id" });
ItemVenda.belongsTo(Servico, { foreignKey: "produto_id" }); // mesma coluna para ambos
ItemVenda.belongsTo(Venda, { foreignKey: "venda_id" });
Venda.hasMany(ItemVenda, { foreignKey: "venda_id" });

async function criarVenda({ cliente_id, itens }) {
  let total = 0;

  const cliente = await Cliente.findByPk(cliente_id);
  if (!cliente) throw new Error("Cliente não encontrado.");

  const venda = await Venda.create({ cliente_id, total: 0 });

  for (const item of itens) {
    let preco = 0;

    if (item.type === "Produto") {
      const produto = await Produto.findByPk(item.item_id);
      if (!produto) throw new Error("Produto não encontrado.");

      preco = produto.preco;

      // Atualiza estoque
      produto.estoque -= item.quantidade;
      await produto.save();
    } else if (item.type === "Serviço") {
      const servico = await Servico.findByPk(item.item_id);
      if (!servico) throw new Error("Serviço não encontrado.");

      preco = servico.preco;
    } else {
      throw new Error(
        "Tipo de item inválido. Deve ser 'Produto' ou 'Serviço'."
      );
    }

    const subtotal = preco * item.quantidade;
    total += subtotal;

    await ItemVenda.create({
      venda_id: venda.id,
      produto_id: item.item_id, // usado para ambos
      quantidade: item.quantidade,
      preco_unitario: preco,
      tipo: item.type,
    });
  }

  venda.total = total;
  await venda.save();

  return venda;
}

async function listarVendas() {
  return await Venda.findAll({
    include: [
      {
        model: ItemVenda,
        include: [
          {
            model: Produto,
            attributes: ["id", "nome", "preco"],
            required: false,
          },
          {
            model: Servico,
            attributes: ["id", "nome", "preco"],
            required: false,
          },
        ],
      },
      {
        model: Cliente,
        as: "cliente",
        attributes: ["id", "nome", "telefone", "email"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}

async function buscarVendaPorId(id) {
  const venda = await Venda.findByPk(id, {
    include: [
      {
        model: ItemVenda,
        include: [
          {
            model: Produto,
            attributes: ["id", "nome", "preco"],
            required: false,
          },
          {
            model: Servico,
            attributes: ["id", "nome", "preco"],
            required: false,
          },
        ],
      },
      {
        model: Cliente,
        as: "cliente",
        attributes: ["id", "nome", "telefone", "email"],
      },
    ],
  });

  if (!venda) throw new Error("Venda não encontrada.");
  return venda;
}

async function excluirVenda(id) {
  const venda = await Venda.findByPk(id, {
    include: [ItemVenda],
  });

  if (!venda) throw new Error("Venda não encontrada.");

  for (const item of venda.ItemVendas) {
    // Repor estoque apenas se for produto
    const produto = await Produto.findByPk(item.produto_id);
    if (produto) {
      produto.estoque += item.quantidade;
      await produto.save();
    }

    await item.destroy();
  }

  await venda.destroy();
  return { mensagem: "Venda excluída com sucesso." };
}

module.exports = {
  criarVenda,
  listarVendas,
  buscarVendaPorId,
  excluirVenda,
};
