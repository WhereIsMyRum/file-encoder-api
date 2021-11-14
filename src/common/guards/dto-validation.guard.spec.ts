import { ExecutionContext } from '@nestjs/common';
import { IsEnum, IsNumber, IsString } from 'class-validator';

import { ValidationErrorException } from '../exceptions';
import { ValidateDto } from '../dtos';
import { DtoValidationGuard } from './dto-validation.guard';

enum ExampleEnum {
  firstValue,
  secondValue,
}

class ExampleDto extends ValidateDto {
  @IsNumber()
  numberProp!: number;

  @IsString()
  stringProp!: string;

  @IsEnum(ExampleEnum)
  enumProp!: ExampleEnum;
}

describe('DtoValidationGuard', () => {
  let dtoValidationGuard: DtoValidationGuard<ExampleDto>;

  beforeAll(() => {
    dtoValidationGuard = new DtoValidationGuard<ExampleDto>(ExampleDto);
  });

  it('should be defined', () => {
    expect(dtoValidationGuard).toBeDefined();
  });

  describe('canActivate', () => {
    describe('if passed dto is valid', () => {
      const dto: ExampleDto = {
        numberProp: 10,
        stringProp: 'string',
        enumProp: ExampleEnum.firstValue,
      };

      it('should return true', async () => {
        const context = {
          switchToHttp: () => ({ getRequest: () => ({ body: dto }) }),
        };

        const result = await dtoValidationGuard.canActivate(
          context as ExecutionContext,
        );

        expect(result).toEqual(true);
      });
    });

    describe('if no dto is passed', () => {
      it('should throw a ValidationErrorException', async () => {
        const noBodyContext = {
          switchToHttp: () => ({ getRequest: () => ({}) }),
        };

        await expect(
          async () =>
            await dtoValidationGuard.canActivate(
              noBodyContext as ExecutionContext,
            ),
        ).rejects.toThrow(ValidationErrorException);
      });
    });

    describe('if any of the dto values is invalid', () => {
      const dto: ExampleDto = {
        numberProp: 10,
        stringProp: 'string',
        enumProp: 'thirdValue',
      } as unknown as ExampleDto;

      it('should throw a ValidationErrorException', async () => {
        const invalidDtoContext = {
          switchToHttp: () => ({ getRequest: () => ({ body: dto }) }),
        };

        await expect(
          async () =>
            await dtoValidationGuard.canActivate(
              invalidDtoContext as ExecutionContext,
            ),
        ).rejects.toThrow(ValidationErrorException);
      });
    });
  });
});
