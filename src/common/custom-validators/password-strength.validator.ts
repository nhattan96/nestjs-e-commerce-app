import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (typeof password !== 'string') {
      return false;
    }

    const errors: string[] = [];

    if (password.length < 8 || password.length > 20) {
      errors.push('Password must be between 8 and 20 characters');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least 1 lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least 1 uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least 1 number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least 1 special symbol');
    }

    if (errors.length > 0) {
      args.object['passwordErrors'] = errors;
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const errors = args.object['passwordErrors'] || [];
    return errors.length > 0
      ? errors.join('; ')
      : 'Password does not meet requirements';
  }
}

export function IsStrongPasswordCustom(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}
