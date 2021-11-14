import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { ValidateDto } from '../dtos/validate-dto';
import { ValidationErrorException } from '../exceptions';

@Injectable()
export class DtoValidationGuard<T extends ValidateDto> implements CanActivate {
  constructor(private readonly constructorFn: new (data: unknown) => T) {}

  async canActivate(context: ExecutionContext) {
    const body = context.switchToHttp().getRequest().body;

    const dto = plainToClass(this.constructorFn, body);

    if (!dto) {
      throw new ValidationErrorException([], 'No request body was provided!');
    }

    const errors = await validate(dto);

    if (errors.length != 0) {
      throw new ValidationErrorException(errors);
    }

    return true;
  }
}
