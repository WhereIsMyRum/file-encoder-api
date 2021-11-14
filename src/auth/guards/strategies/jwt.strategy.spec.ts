import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { JwtStrategy } from '@file-encoder-api/auth';
import { UserRepository } from '@file-encoder-api/users/infrastructure';
import { User } from '@file-encoder-api/users/domain';
import { UserNotFoundException } from '@file-encoder-api/users/application';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: UserRepository, useValue: { getByEmail: jest.fn() } },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('secret') },
        },
        JwtStrategy,
      ],
    }).compile();

    strategy = module.get(JwtStrategy);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const jwtPayload = { email: 'user-email@gmail.com' };
    describe('if user with email specified in jwt payload exists', () => {
      const user = new User('id', 'user@email.com');

      it('should return it', async () => {
        jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(user);

        const result = await strategy.validate(jwtPayload);

        expect(result).toEqual(user);
      });
    });

    describe('if no user with email specified in jwt payload exists', () => {
      it('should throw a UserNotFoundException', async () => {
        jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(null);

        await expect(
          async () => await strategy.validate(jwtPayload),
        ).rejects.toThrow(UserNotFoundException);
      });
    });
  });
});
