// Importando o Nodemailer e dotenv
const nodemailer = require('nodemailer');
require('dotenv').config();
const URL_FRONT = process.env.URL_FRONT;

// exports.sendConfirmationEmail = async (userEmail, confirmationToken) => {
//   const emailConfig = {
//     service: 'gmail',
//     auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_PASS,
//     },
//   };

//   const transporter = nodemailer.createTransport(emailConfig);

//   const confirmationLink = `${URL_FRONT}/confirmar-email/${confirmationToken}`;

//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to: userEmail,
//     subject: 'Confirmação de Cadastro',
//     text: `Clique no link para confirmar seu cadastro: ${confirmationLink}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error('Erro ao enviar o e-mail:', error);
//   }
// };

exports.sendPasswordResetEmailMailer = async (userEmail, resetToken) => {
  const emailConfig = {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  };

  const transporter = nodemailer.createTransport(emailConfig);
  const resetLink = `${URL_FRONT}resetar-senha/${resetToken}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: 'Recuperação de Senha',
    text: `Clique no link para redefinir sua senha: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
  }
};
