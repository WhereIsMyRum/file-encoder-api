import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { ValidateDto } from '../dtos/validate-dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DtoValidationGuard<T extends ValidateDto> implements CanActivate {
  constructor(private readonly constructorFn: new (data: unknown) => T) {}

  async canActivate(context: ExecutionContext) {
    const body = context.switchToHttp().getRequest().body;

    const dto = plainToClass(this.constructorFn, body);

    if (!dto) {
    }

    const errors = await validate(dto);

    if (errors.length != 0) {
      throw new Error('INvalid');
    }

    return true;
  }
}
