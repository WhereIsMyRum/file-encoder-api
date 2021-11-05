import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { UserRepository } from 'src/users/infrastructure/repositories/user.repository';
import { User } from '../../domain';
import { CreateUserDto, UserDto } from '../dtos';

@Injectable()
export class UserManagementService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    const { email, password } = dto;
    const newUser = new User(email, password);

    return this.repository.insert(newUser);
  }

  async getUser(id: string): Promise<UserDto> {
    const user = this.repository.getById(id);

    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.repository.getAll();

    return plainToClass(UserDto, users, { excludeExtraneousValues: true });
  }
}
