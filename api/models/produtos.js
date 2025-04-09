const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // ajuste o caminho conforme seu projeto

const Produto = sequelize.define(
  'Produto',
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
    },
    marca: {
      type: DataTypes.STRING,
    },
    categoria: {
      type: DataTypes.STRING,
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    custo: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    tableName: 'produtos',
    timestamps: true, // Sequelize cria e gerencia createdAt e updatedAt
  },
);

module.exports = Produto;
