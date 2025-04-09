const userService = require('../services/userService');
const authService = require('../services/authService');
const User = require('../models/users');
require('dotenv').config();

exports.getAllUsers = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: 'Token não fornecido' });

  const authToken = authHeader.split(' ')[1];
  if (!authToken) return res.status(401).json({ error: 'Token não fornecido' });

  const decodedToken = authService.verifyToken(authToken);
  if (!decodedToken) return res.status(401).json({ error: 'Token inválido' });

  const { busca } = req.query;

  try {
    const result = await userService.getAllUsers(authHeader, busca);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: 'Token não fornecido' });

  const authToken = authHeader.split(' ')[1];
  if (!authToken) return res.status(401).json({ error: 'Token não fornecido' });

  const decodedToken = authService.verifyToken(authToken);
  if (!decodedToken) return res.status(401).json({ error: 'Token inválido' });

  try {
    const result = await userService.getUserById(authHeader, id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const upload = require('../middleware/upload');

exports.updateUser = async (req, res) => {
  upload.none()(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Erro ao processar o formulário' });
    }

    const { id } = req.params;
    const { email, password, nome, assinatura, valor_hora_aula } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: 'Token não fornecido' });

    const authToken = authHeader.split(' ')[1];
    if (!authToken)
      return res.status(401).json({ error: 'Token não fornecido' });

    const decodedToken = authService.verifyToken(authToken);
    if (!decodedToken) return res.status(401).json({ error: 'Token inválido' });

    try {
      const user = await User.findByPk(id);
      if (!user)
        return res.status(404).json({ error: 'Usuário não encontrado' });

      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10);
      if (nome) user.nome = nome;
      user.assinatura = assinatura;
      if (valor_hora_aula) user.valor_hora_aula = valor_hora_aula;

      await user.save();

      res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Rota para excluir o usuário
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: 'Token não fornecido' });

  const authToken = authHeader.split(' ')[1];
  if (!authToken) return res.status(401).json({ error: 'Token não fornecido' });

  const decodedToken = authService.verifyToken(authToken);
  if (!decodedToken) return res.status(401).json({ error: 'Token inválido' });

  try {
    const result = await userService.deleteUser(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rota para confirmar o e-mail
exports.confirmEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res
      .status(400)
      .json({ error: 'Token de confirmação não fornecido' });
  }

  try {
    const result = await userService.confirmEmailService(token);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
