const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const produtosRoutes = require("./routes/produtosRoutes");
const vendasRoutes = require("./routes/vendasRoutes");
const dashboardRoutes = require("./routes/dashRoutes");
const clientesRouter = require("./routes/clientesRoutes");
const servicosRouter = require("./routes/servicosRoutes");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/produtos", produtosRoutes);
app.use("/vendas", vendasRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/clientes", clientesRouter);
app.use("/servicos", servicosRouter);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
