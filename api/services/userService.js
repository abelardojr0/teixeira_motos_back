const User = require('../models/users');
const authService = require('./authService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET;

exports.getAllUsers = async (authHeader, busca) => {
  const authToken = authHeader?.split(' ')[1];
  if (!authToken) throw new Error('Token não fornecido');

  const decodedToken = authService.verifyToken(authToken);
  if (!decodedToken) throw new Error('Token inválido');

  const whereCondition = {};

  if (busca) {
    whereCondition[Op.or] = [
      { nome: { [Op.iLike]: `%${busca}%` } },
      { email: { [Op.iLike]: `%${busca}%` } },
      { cpf: { [Op.iLike]: `%${busca}%` } },
      { user_type: { [Op.iLike]: `%${busca}%` } },
    ];
  }

  const users = await User.findAll({ where: whereCondition });
  return users;
};

exports.getUserById = async (authHeader, id) => {
  const authToken = authHeader?.split(' ')[1];
  if (!authToken) throw new Error('Token não fornecido');

  const decodedToken = authService.verifyToken(authToken);
  if (!decodedToken) throw new Error('Token inválido');

  const user = await User.findByPk(id);
  if (!user) throw new Error('Usuário não encontrado');

  return user;
};

exports.updateUser = async (
  id,
  email,
  password,
  nome,
  assinatura,
  valor_hora_aula,
) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Usuário não encontrado.');

  if (email) user.email = email;
  if (password) user.password = await bcrypt.hash(password, 10);
  if (nome) user.nome = nome;
  if (assinatura) user.assinatura = assinatura;
  if (valor_hora_aula) user.valor_hora_aula = valor_hora_aula;

  await user.save();

  return { message: 'Usuário atualizado com sucesso' };
};

exports.deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Usuário não encontrado');

  await user.destroy();
  return { message: 'Usuário excluído com sucesso' };
};

exports.confirmEmailService = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userCPF = decoded.cpf;

    const user = await User.findOne({ where: { cpf: userCPF } });
    if (!user) throw new Error('Usuário não encontrado');

    await User.update({ email_confirmed: true }, { where: { cpf: userCPF } });

    return { message: 'E-mail confirmado com sucesso!' };
  } catch (err) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        throw new Error('O token de confirmação expirou');
      } else if (err.name === 'JsonWebTokenError') {
        throw new Error('Token inválido');
      } else {
        throw new Error(`Erro ao confirmar o e-mail: ${err.message}`);
      }
    }
  }
};
