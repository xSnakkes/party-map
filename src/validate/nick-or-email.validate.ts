import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsEmailOrNicknameConstraint implements ValidatorConstraintInterface {
  validate(identifier: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nicknameRegex = /^[^\s@]+$/;
    return emailRegex.test(identifier) || nicknameRegex.test(identifier);
  }

  defaultMessage(): string {
    return 'Identifier must be a valid email or a string';
  }
}

export function IsEmailOrNickname(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailOrNicknameConstraint,
    });
  };
}