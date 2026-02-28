import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Valida se uma string está no formato estrito 'YYYY-MM-DD' e se é uma data real.
 * * - Verifica o formato via Regex (Ex: 2026-02-28).
 * - Verifica a existência lógica da data (Ex: impede 31 de abril).
 * - Ignora valores nulos, indefinidos ou strings vazias (use @IsNotEmpty se necessário).
 * * @param validationOptions Opções de validação do class-validator.
 */
export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _: ValidationArguments) {
          if (value === undefined || value === null || value === '') {
            return true;
          }

          if (typeof value !== 'string') {
            return false;
          }

          const dateFormatRegex =
            /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

          if (!dateFormatRegex.test(value)) {
            return false;
          }

          const [year, month, day] = value.split('-').map(Number);
          const date = new Date(year, month - 1, day);

          if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
          ) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const value = args.value;

          if (typeof value !== 'string') {
            return `O ${args.property} deve ser uma string`;
          }

          const dateFormatRegex =
            /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
          if (!dateFormatRegex.test(value)) {
            return `O ${args.property} deve estar no formato yyyy-mm-dd`;
          }

          return `O ${args.property} contém uma data inválida (${value})`;
        },
      },
    });
  };
}
