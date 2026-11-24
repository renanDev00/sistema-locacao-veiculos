const { z } = require("zod");

const criarLocacaoSchema = z.object({
  veiculoId: z.coerce.number().int().positive("ID do veículo inválido"),
  dataInicio: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Data de início inválida"),
  dataFim: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Data de fim inválida"),
});

module.exports = { criarLocacaoSchema };
