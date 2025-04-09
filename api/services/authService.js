const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { sendPasswordResetEmailMailer } = require("../mailer");
const JWT_SECRET = process.env.JWT_SECRET;

const generateResetToken = (email) => {
  const payload = { email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  return token;
};

const createToken = (user) => {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "90d",
  });

  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "180d",
  });

  return { accessToken, refreshToken };
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw { type: "auth", message: "Email ou senha incorretos" };
  }

  if (!user.email_confirmed) {
    throw {
      type: "email_confirmation",
      message: "Confirme seu e-mail antes de fazer login.",
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { type: "auth", message: "Email ou senha incorretos" };
  }

  const { accessToken, refreshToken } = createToken(user);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    data: {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    },
  };
};

exports.refreshToken = async (refresh_token) => {
  if (!refresh_token) {
    throw new Error("Refresh token é obrigatório");
  }

  try {
    const payload = jwt.verify(refresh_token, JWT_SECRET);

    const accessToken = jwt.sign({ id: payload.id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign({ id: payload.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return { access_token: accessToken, refresh_token: newRefreshToken };
  } catch (err) {
    throw new Error("Refresh token inválido ou expirado");
  }
};

exports.registerUser = async (email, password, nome) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw { type: "email", message: "Email já cadastrado" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    nome,
    email_confirmed: false,
  });

  return {
    id: user.id,
    message:
      "Usuário cadastrado com sucesso. Por favor, resete a senha para confirmar seu e-mail.",
  };
};

exports.sendPasswordResetEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Email não encontrado");

  if (!user.email_confirmed) {
    await User.update(
      { email_confirmed: true },
      { where: { email: user.email } }
    );
  }

  const resetToken = generateResetToken(email);
  await sendPasswordResetEmailMailer(user.email, resetToken);
};

exports.resetPassword = async (token, password) => {
  const payload = jwt.verify(token, JWT_SECRET);
  if (!payload) {
    throw new Error("Token inválido ou expirado");
  }

  const user = await User.findOne({ where: { email: payload.email } });
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.update(
    { password: hashedPassword },
    { where: { email: user.email } }
  );
};

exports.verifyToken = verifyToken;
