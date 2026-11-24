const ApiError = require("../errors/ApiError");

function validarSchema(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      const listaErros = resultado.error.issues || resultado.error.errors || [];
      const mensagem = listaErros.map((e) => e.message).join(", ");
      return next(new ApiError(mensagem || "Dados inválidos.", 400));
    }
    req.body = resultado.data;
    return next();
  };
}

module.exports = validarSchema;
