import { z } from "zod";

const AvailableColors = [
  "PRETO", 
  "BRANCO", 
  "PRATA", 
  "CINZA", 
  "AZUL", 
  "VERMELHO", 
  "VERDE", 
  "BEGE", 
  "GRAFITE", 
];

const currentYear = new Date().getFullYear();
const minSellingDate = new Date("2000-01-01");
const maxSellingDate = new Date(); // Data atual

const Car = z.object({
  // Marca do carro: string, 1-25 caracteres.
  brand: z
    .string()
    .trim()
    .min(1, { message: "A marca deve ter pelo menos 1 caractere." })
    .max(25, { message: "A marca pode ter no máximo 25 caracteres." }),

  // Modelo do carro: string, 1-25 caracteres.
  model: z
    .string()
    .trim()
    .min(1, { message: "O modelo deve ter pelo menos 1 caractere." })
    .max(25, { message: "O modelo pode ter no máximo 25 caracteres." }),

  // Cor do carro
  color: z.enum(AvailableColors, {
    errorMap: (issue, ctx) => ({
      message: "Cor inválida.",
    }),
  }),

  // Ano de fabricação: número inteiro entre 1960 e o ano atual.
  year_manufacture: z
    .number({
      invalid_type_error: "O ano de fabricação deve ser um número.",
    })
    .int({ message: "O ano de fabricação deve ser um número inteiro." })
    .min(1960, { message: "O ano de fabricação não pode ser anterior a 1960." })
    .max(currentYear, {
      message: `O ano de fabricação não pode ser posterior a ${currentYear}.`,
    }),

  // Importado: booleano (true/false).
  imported: z.boolean({
    required_error: 'O campo "importado" é obrigatório.',
    invalid_type_error: 'O campo "importado" deve ser verdadeiro ou falso.',
  }),

  // Placa do carro: string, exatamente 8 caracteres.
  plates: z
    .string()
    .trim() // Adicionado trim para remover espaços extras
    .length(8, { message: "A placa deve ter exatamente 8 caracteres." }),

  // Data da venda: opcional, tipo Date, entre 01/01/2000 e a data atual.
  selling_date: z.coerce
    .date({
      // coerce para converter string ou número para Date
      invalid_type_error: "Data de venda inválida.",
    })
    .min(minSellingDate, {
      message:
        "Data de venda não pode ser anterior a 01/01/2000.",
    })
    .max(maxSellingDate, {
      message: "Data de venda não pode ser uma data futura.",
    })
    .optional(),

  // Preço de venda
  selling_price: z.coerce
    .number({
      // coerce para converter string para número
      invalid_type_error: "Preço de venda inválido.",
    })
    .min(1000, { message: "Preço de venda mínimo: R$ 1.000,00." })
    .max(5000000, { message: "Preço de venda máximo: R$ 5.000.000,00." })
    .optional(),
});

export default Car;
