export const ErrorMessageClassValidator = {
  required: (prop: string, genre: 'f' | 'm' = 'm') => {
    const art = genre === 'f' ? 'A' : 'O';
    const final = genre === 'f' ? 'a' : 'o';

    return `${art} ${prop} é obrigatóri${final}`;
  },

  string: (prop: string, genre: 'f' | 'm' = 'm') => {
    const final = genre === 'f' ? 'a' : '';

    return `O campo ${prop} deve ser um${final} string`;
  },

  array: (prop: string) => {
    return `O campo ${prop} deve ser um array`;
  },

  minLength: (prop: string, min: number) => {
    return `O campo ${prop} deve ter no mínimo ${min} caracteres`;
  },
  
  minValue: (prop: string, min: number) => {
    return `O campo ${prop} deve ser no mínimo ${min}`;
  },
  
  maxValue: (prop: string, max: number) => {
    return `O campo ${prop} deve ser no máximo ${max}`;
  },
};
