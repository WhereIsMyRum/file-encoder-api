import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CredentialsRepository } from 'src/users/infrastructure';
import { v4 as uuid } from 'uuid';

import { UserRepository } from '../../../users/infrastructure/repositories/user.repository';
import { User } from '../../domain';
import { CreateUserDto, UserDto } from '../dtos';
import { PasswordService } from 'src/common/services/password.service';

@Injectable()
export class UserManagementService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly credentialsRepository: CredentialsRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    const { password, email } = dto;
    const newUser = new User(uuid(), email);

    try {
      await this.userRepository.insert(newUser);

      const salt = await this.passwordService.generateSalt();

      await this.credentialsRepository.insert({
        id: newUser.getId(),
        email,
        password: {
          salt,
          hashedPassword: await this.passwordService.hashPassword(
            password,
            salt,
          ),
        },
      });
    } catch (error) {
      await this.handleUserCreationError(newUser.getId());

      throw new Error();
    }

    return newUser.getId();
  }

  async getUser(id: string): Promise<UserDto> {
    const user = await this.userRepository.getById(id);

    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.getAll();

    return plainToClass(UserDto, users, { excludeExtraneousValues: true });
  }

  private async handleUserCreationError(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);

      await this.credentialsRepository.delete(id);
    } catch (error) {
      throw new Error();
    }
  }
}
