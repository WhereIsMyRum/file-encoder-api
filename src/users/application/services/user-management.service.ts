import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { CreateUserDto, UserDto } from '../dtos';
import { CredentialsRepository, UserRepository } from '../../infrastructure';
import { User, UserFactory, CredentialsFactory } from '../../domain';
import {
  CouldNotRegisterUserException,
  UserNotFoundException,
} from '../exceptions';
import { LoggerService, LoggingLevels } from '@file-encoder-api/common';

@Injectable()
export class UserManagementService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly credentialsRepository: CredentialsRepository,
    private readonly userFactory: UserFactory,
    private readonly credentialsFactory: CredentialsFactory,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    const newUser = this.userFactory.createUser(dto);

    await this.registerUser(newUser);
    await this.registerUserCredentials(newUser, dto.password);

    return newUser.getId();
  }

  async getUser(id: string): Promise<UserDto> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  private async registerUser(newUser: User): Promise<void> {
    try {
      await this.userRepository.insert(newUser);
    } catch (error: any) {
      this.handleError(newUser, error);
    }
  }

  private async registerUserCredentials(
    newUser: User,
    password: string,
  ): Promise<void> {
    const userCredentials = await this.credentialsFactory.createCredentials(
      newUser,
      password,
    );

    try {
      await this.credentialsRepository.insert(userCredentials);
    } catch (error: any) {
      try {
        await this.userRepository.delete(newUser.getId());
      } catch (error: any) {
        this.handleError(newUser, error);
      }
      this.handleError(newUser, error);
    }
  }

  private handleError(user: User, error: any) {
    LoggerService.log(LoggingLevels.error, 'Error registering a user', {
      stack: error.stack,
      userId: user.getId(),
    });

    throw new CouldNotRegisterUserException();
  }
}
