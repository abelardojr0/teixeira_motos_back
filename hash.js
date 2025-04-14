const bcrypt = require("bcrypt");

async function gerarHash() {
  const senha = "10231527";
  const hash = await bcrypt.hash(senha, 10);
  console.log("HASH:", hash);
}

gerarHash();
