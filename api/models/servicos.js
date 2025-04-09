const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Servico = sequelize.define(
  "Servico",
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    observacoes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "servicos",
    timestamps: true,
  }
);

module.exports = Servico;
