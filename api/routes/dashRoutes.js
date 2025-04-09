const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashController");
router.get("/resumo", dashboardController.getResumo);
router.get("/lucros", dashboardController.getLucros);
router.get("/clientes", dashboardController.getClientesInfo);

module.exports = router;
