const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Produto = require("./produtos");
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
  },
  {
    tableName: "itens_venda",
    timestamps: false,
  }
);

// RELACIONAMENTOS
ItemVenda.belongsTo(Produto, { foreignKey: "produto_id" });
ItemVenda.belongsTo(Venda, { foreignKey: "venda_id" });
Venda.hasMany(ItemVenda, { foreignKey: "venda_id" });

module.exports = ItemVenda;
