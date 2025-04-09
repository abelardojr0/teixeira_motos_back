const authService = require('../services/authService');

exports.register = async (req, res) => {
  const { email, password, nome } = req.body;
  try {
    const result = await authService.registerUser(email, password, nome);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({
      error: { type: err.message, message: 'Erro interno no servidor' },
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    if (err.type === 'email_confirmation') {
      res.status(400).json({ error: err });
    } else if (err.type === 'auth') {
      res.status(401).json({ error: err });
    } else {
      res.status(500).json({
        error: {
          type: 'InternalError',
          message: 'Erro interno no servidor',
        },
      });
    }
  }
};

exports.refreshToken = async (req, res) => {
  const { refresh_token } = req.body;

  try {
    const result = await authService.refreshToken(refresh_token);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await authService.sendPasswordResetEmail(email);
    res.json({ message: 'Email de recuperação enviado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    await authService.resetPassword(token, newPassword);
    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
