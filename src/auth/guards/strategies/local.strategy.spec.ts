import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { User } from '@file-encoder-api/users/domain';

import { LocalStrategy } from './local.strategy';
import { AuthService } from '../../domain';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: AuthService, useValue: { validateUser: jest.fn() } },
        LocalStrategy,
      ],
    }).compile();

    strategy = module.get(LocalStrategy);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    describe('if user data is valid', () => {
      const user = new User('id', 'email');

      it('should return a user', async () => {
        jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(user);

        const result = await strategy.validate('username', 'password');

        expect(result).toEqual(user);
      });
    });

    describe('if user data is invalid', () => {
      it('should throw UnauthorizedException', async () => {
        jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

        await expect(
          async () => await strategy.validate('username', 'password'),
        ).rejects.toThrow(UnauthorizedException);
      });
    });
  });
});
