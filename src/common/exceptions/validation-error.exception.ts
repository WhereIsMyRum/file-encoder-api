import { UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationErrorException extends UnprocessableEntityException {
  constructor(errors: ValidationError[], fullMessage?: string) {
    let message = 'Validation Error: ';

    const stringifyError = (error: ValidationError): string => {
      return `Value ${error.value} for property ${
        error.property
      } is invalid. Reason(s): ${
        error.constraints
          ? Object.values(error.constraints)
              .map((value) => value)
              .join(', ')
          : 'unknown'
      }`;
    };

    message += errors.map((error) => stringifyError(error)).join(' | ');

    message = fullMessage ? fullMessage : message;

    super(message);
  }
}
