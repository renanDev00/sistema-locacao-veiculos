const { z } = require("zod");

const veiculoSchema = z.object({
  modelo: z.string().min(2, "Modelo obrigatório"),
  marca: z.string().min(2, "Marca obrigatória"),
  placa: z.string().min(7, "Placa inválida").max(8, "Placa inválida"),
  ano: z.coerce.number().int().min(1990).max(2027),
  diaria: z.coerce.number().positive("O valor da diária deve ser positivo"),
});

module.exports = { veiculoSchema };
