const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Produto = require("./produtos");
const Servico = require("./servicos"); // <- importar
const Venda = require("./venda");

const ItemVenda = sequelize.define(
  "ItemVenda",
  {
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Produto,
        key: "id",
      },
    },
    servico_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Servico,
        key: "id",
      },
    },
    venda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Venda,
        key: "id",
      },
    },
  },
  {
    tableName: "itens_venda",
    timestamps: false,
  }
);

ItemVenda.belongsTo(Produto, { foreignKey: "produto_id" });
ItemVenda.belongsTo(Servico, { foreignKey: "servico_id" });
ItemVenda.belongsTo(Venda, { foreignKey: "venda_id" });

Venda.hasMany(ItemVenda, { foreignKey: "venda_id" });

module.exports = ItemVenda;
