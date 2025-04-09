const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Cliente = require("./clientes");

const Venda = sequelize.define(
  "Venda",
  {
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "vendas",
    timestamps: true,
  }
);

// Associação com Cliente
Venda.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente",
});

module.exports = Venda;
