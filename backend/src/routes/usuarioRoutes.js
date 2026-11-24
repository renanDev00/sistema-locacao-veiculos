const { Router } = require("express");
const usuarioController = require("../controllers/UsuarioController");
const validarSchema = require("../middlewares/validarSchema");
const authMiddleware = require("../middlewares/authMiddleware");
const { criarUsuarioSchema } = require("../schemas/usuarioSchema");

const router = Router();
router.post("/", validarSchema(criarUsuarioSchema), usuarioController.create);
router.get("/", authMiddleware, usuarioController.findMany);

module.exports = router;
