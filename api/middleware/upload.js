const multer = require('multer');
const storage = multer.memoryStorage(); // ou outra estratégia de armazenamento
const upload = multer({ storage });
module.exports = upload;
