const range = (n: number): number[] => [...new Array(n).keys()];

export const studentProfileFields = [
  {
    name: "marital_status",
    label: "Qual é o seu estado civil?",
    options: [
      {
        value: "1",
        label: "Casado(a)/União estável",
      },
      {
        value: "2",
        label: "Solteiro(a)",
      },
      {
        value: "3",
        label: "Viúvo(a)",
      },
      {
        value: "4",
        label: "Separado(a)/Desquitado(a)",
      },
      {
        value: "5",
        label: "Outro",
      },
    ],
  },
  {
    name: "skin_color",
    label: "Qual a sua cor/etnia?",
    options: [
      {
        value: "yellow",
        label: "Amarela",
      },
      {
        value: "white",
        label: "Branca",
      },
      {
        value: "indigenous",
        label: "Indígena",
      },
      {
        value: "brown",
        label: "Parda",
      },
      {
        value: "black",
        label: "Preta",
      },
      {
        value: "other",
        label: "Outra",
      },
    ],
  },
  {
    name: "children_number",
    label: "Você possui filhos?",
    options: [
      {
        value: "no",
        label: "Não",
      },
      {
        value: "1",
        label: "1",
      },
      {
        value: "2",
        label: "2",
      },
      {
        value: "3",
        label: "3",
      },
      {
        value: "4 or more",
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
        value: "no",
        label: "Não",
      },
      {
        value: "1",
        label: "Auditiva",
      },
      {
        value: "2",
        label: "Visual",
      },
      {
        value: "3",
        label: "Locomotiva",
      },
      {
        value: "4",
        label: "Transtorno Espectro Autista",
      },
      {
        value: "5",
        label: "Altas Habilidades",
      },
    ],
  },
  {
    name: "city_change",
    label: "Você mudou de cidade para cursar a UFMS?",
    options: [
      {
        value: "yes",
        label: "Sim",
      },
      {
        value: "no",
        label: "Não",
      },
    ],
  },
  {
    name: "state_city_change",
    label: "Se sim, de qual estado?",
    options: [
      {
        value: "none",
        label: "Nenhum",
      },
      {
        value: "ms",
        label: "Mato Grosso do Sul",
      },
    ],
  },
  {
    name: "transportation",
    label: "Você vem a UFMS com qual meio de transporte?",
    options: [
      {
        value: "1",
        label: "Veículo próprio",
      },
      {
        value: "2",
        label: "Transporte público (ônibus)",
      },
      {
        value: "3",
        label: "Carona / a pé",
      },
      {
        value: "4",
        label: "Transporte privado (taxi ou apps de mobilidade urbana, etc.",
      },
      {
        value: "5",
        label: "Outro",
      },
    ],
  },
  {
    name: "residency",
    label: "Qual é a sua situação atual de moradia?",
    options: [
      {
        value: "1",
        label: "Sozinho",
      },
      {
        value: "2",
        label: "Com a família/cônjuge/companheiro(a)",
      },
      {
        value: "3",
        label: "Com amigos",
      },
      {
        value: "4",
        label: "Outra",
      },
    ],
  },
  {
    name: "work",
    label: "Você trabalha?",
    options: [
      {
        value: "yes",
        label: "Sim",
      },
      {
        value: "no",
        label: "Não",
      },
    ],
  },

  {
    name: "family_financial_support",
    label: "Você recebe apoio financeiro da sua família ou amigos?",
    options: [
      {
        value: "yes",
        label: "Sim",
      },
      {
        value: "no",
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
        value: "1",
        label: "Menos de 1 salário mínimo",
      },
      {
        value: "1-2",
        label: "Entre 1 e 2 salários mínimos",
      },
      {
        value: "2-4",
        label: "Entre 2 e 4 salários mínimos",
      },
      {
        value: "4 or more",
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
        value: "yes",
        label: "Sim",
      },
      {
        value: "no",
        label: "Não",
      },
    ],
  },
];
