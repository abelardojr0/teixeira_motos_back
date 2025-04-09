const express = require("express");
const router = express.Router();
const ServicoController = require("../controllers/servicosController");

router.post("/", ServicoController.create);
router.get("/", ServicoController.getAll);
router.get("/:id", ServicoController.getById);
router.put("/:id", ServicoController.update);
router.delete("/:id", ServicoController.delete);

module.exports = router;
