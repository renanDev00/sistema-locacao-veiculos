const { Router } = require("express");
const veiculoController = require("../controllers/VeiculoController");
const validarSchema = require("../middlewares/validarSchema");
const authMiddleware = require("../middlewares/authMiddleware");
const { veiculoSchema } = require("../schemas/veiculoSchema");

const router = Router();

router.get("/", authMiddleware, veiculoController.findMany);
router.post(
  "/",
  authMiddleware,
  validarSchema(veiculoSchema),
  veiculoController.create,
);

module.exports = router;
