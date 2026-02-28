import { ValidateIf, ValidationOptions } from 'class-validator';

/**
 * Permite que o valor seja nulo, ignorando as outras validações caso seja null.
 * Se o valor estiver presente e não for null, as outras validações serão executadas.
 */
export function IsNullable(validationOptions?: ValidationOptions) {
  return ValidateIf((_object, value) => value !== null, validationOptions);
}
