/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * Decorator that checks if a property is not equal to another property.
 */
export function NotEqualsTo(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'NotEqualsTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value !== relatedValue;
        },
      },
    });
  };
}
