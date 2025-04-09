const express = require("express");
const router = express.Router();
const VendaController = require("../controllers/vendasController");
router.post("/", VendaController.create);
router.get("/", VendaController.getAll);
router.get("/:id", VendaController.getById);
router.delete("/:id", VendaController.delete);

module.exports = router;
