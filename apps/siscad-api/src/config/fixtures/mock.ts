const range = (n: number): number[] => [...new Array(n).keys()];

export const studentProfileFields = [
  {
    name: "marital_status",
    label: "Qual é o seu estado civil?",
    options: [
      {
        value: "single",
        label: "Casado(a)/União estável",
      },
      {
        value: "single",
        label: "Solteiro(a)",
      },
      {
        value: "single",
        label: "Viúvo(a)",
      },
      {
        value: "single",
        label: "Separado(a)/Desquitado(a)",
      },
      {
        value: "single",
        label: "Outro",
      },
    ],
  },
  {
    name: "skin_color",
    label: "Qual a sua cor/etnia?",
    options: [
      {
        value: "single",
        label: "Amarela",
      },
      {
        value: "single",
        label: "Branca",
      },
      {
        value: "single",
        label: "Indígena",
      },
      {
        value: "single",
        label: "Parda",
      },
      {
        value: "single",
        label: "Prata",
      },
      {
        value: "single",
        label: "Outra",
      },
    ],
  },
  {
    name: "children_number",
    label: "Você possui filhos?",
    options: [
      {
        value: "single",
        label: "Não",
      },
      {
        value: "single",
        label: "1",
      },
      {
        value: "single",
        label: "2",
      },
      {
        value: "single",
        label: "3",
      },
      {
        value: "single",
        label: "4 ou mais",
      },
    ],
  },
  {
    name: "disability",
    label:
      "Você foi diagnosticado com algum tipo de Deficiência, espectro do autismo ou Altas Habilidades?",
    options: [
      {
        value: "single",
        label: "Não",
      },
      {
        value: "single",
        label: "Auditiva",
      },
      {
        value: "single",
        label: "Visual",
      },
      {
        value: "single",
        label: "Locomotiva",
      },
      {
        value: "single",
        label: "Transtorno Espectro Autista",
      },
      {
        value: "single",
        label: "Altas Habilidades",
      },
    ],
  },
  {
    name: "city_change",
    label: "Você mudou de cidade para cursar a UFMS?",
    options: [
      {
        value: "true",
        label: "Sim",
      },
      {
        value: "false",
        label: "Não",
      },
    ],
  },
  {
    name: "state_city_change",
    label: "Se sim, de qual estado?",
    options: [
      {
        value: "single",
        label: "Nenhum",
      },
      {
        value: "single",
        label: "Mato Grosso do Sul",
      },
    ],
  },
  {
    name: "transportation",
    label: "Você vem a UFMS com qual meio de transporte?",
    options: [
      {
        value: "single",
        label: "Veículo próprio",
      },
      {
        value: "single",
        label: "Transporte público (ônibus)",
      },
      {
        value: "single",
        label: "Carona / a pé",
      },
      {
        value: "single",
        label: "Transporte privado (taxi ou apps de mobilidade urbana, etc.",
      },
      {
        value: "single",
        label: "Outro",
      },
    ],
  },
  {
    name: "residency",
    label: "Qual é a sua situação atual de moradia?",
    options: [
      {
        value: "single",
        label: "Sozinho",
      },
      {
        value: "single",
        label: "Com a família/cônjuge/companheiro(a)",
      },
      {
        value: "single",
        label: "Com amigos",
      },
      {
        value: "single",
        label: "Outra",
      },
    ],
  },
  {
    name: "work",
    label: "Você trabalha?",
    options: [
      {
        value: "true",
        label: "Sim",
      },
      {
        value: "false",
        label: "Não",
      },
    ],
  },

  {
    name: "family_financial_support",
    label: "Você recebe apoio financeiro da sua família ou amigos?",
    options: [
      {
        value: "true",
        label: "Sim",
      },
      {
        value: "false",
        label: "Não",
      },
    ],
  },
  {
    name: "family_income",
    label:
      "Qual a renda total da sua família, com a soma de todas as rendas das pessoas da sua família?",
    options: [
      {
        value: "single",
        label: "Menos de 1 salário mínimo",
      },
      {
        value: "single",
        label: "Entre 1 e 2 salários mínimos",
      },
      {
        value: "single",
        label: "Entre 2 e 4 salários mínimos",
      },
      {
        value: "single",
        label: "Mais de 4 salários mínimos",
      },
    ],
  },
  {
    name: "family_income_dependants",
    label:
      "Com você, quantas pessoas formam sua família (pais, responsáveis e irmãos) e dependem da soma de renda do item anterior?",
    options: range(15).map((i) => ({ value: `${i + 1}`, label: i + 1 })),
  },
  {
    name: "cadunico",
    label:
      "Você tem o Cadastro Único (CadÚnico) do Governo Federal? (Para concorrer aos auxílios estudantis e o benefício no Restaurante Universitário)",
    options: [
      {
        value: "true",
        label: "Sim",
      },
      {
        value: "false",
        label: "Não",
      },
    ],
  },
];
