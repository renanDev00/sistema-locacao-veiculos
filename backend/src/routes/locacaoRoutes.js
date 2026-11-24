const { Router } = require("express");
const locacaoController = require("../controllers/LocacaoController");
const validarSchema = require("../middlewares/validarSchema");
const authMiddleware = require("../middlewares/authMiddleware");
const { criarLocacaoSchema } = require("../schemas/locacaoSchema");

const router = Router();
router.get("/", authMiddleware, locacaoController.findMany);
router.post(
  "/",
  authMiddleware,
  validarSchema(criarLocacaoSchema),
  locacaoController.create,
);
router.patch("/:id/finalizar", authMiddleware, locacaoController.finalizar);

module.exports = router;
