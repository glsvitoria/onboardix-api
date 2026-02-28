import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Lógica interna para validação de correspondência de valores.
 * Compara o valor do campo atual com o valor de outra propriedade do objeto.
 */
@ValidatorConstraint({ async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(passwordConfirmation: any, args?: ValidationArguments) {
    const [relatedPropertyName] = args?.constraints ?? [];
    const password = args?.object[relatedPropertyName];

    return passwordConfirmation === password;
  }
}


/**
 * Decorator que valida se o valor do campo coincide com outra propriedade informada.
 * Geralmente utilizado para confirmar se 'password' e 'passwordConfirmation' são iguais.
 * * @param property O nome da propriedade com a qual este campo será comparado.
 * @param validationOptions Opções de validação (ex: message, groups).
 */
export function PasswordMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: PasswordMatchConstraint,
    });
  };
}
