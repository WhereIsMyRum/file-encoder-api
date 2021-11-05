import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';

import { UserModels, UserModel } from '../models';
import { UserNotFoundException } from '../exceptions';
import { User } from '../../domain';
import { RepositoryInterface } from '../../../common';

@Injectable()
export class UserRepository implements RepositoryInterface<User> {
  constructor(
    @InjectModel(UserModels.User)
    private readonly userModel: Model<UserModel>,
  ) {}

  async save(user: User): Promise<void> {
    const userModel = await this.userModel.findOne({ id: user.getId() });

    if (!userModel) {
      throw new UserNotFoundException(`id: ${user.getId()}`);
    }

    userModel.password = user.getPassword();
    userModel.rsaKeyPair = user.getRsaKeyPair();

    userModel.save();
  }

  async insert(user: User): Promise<string> {
    const newUser = await this.userModel.create(user);
    const savedUser = await newUser.save();

    return savedUser.id;
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ id }).lean();

    if (!user) {
      throw new UserNotFoundException(`id: ${id}`);
    }

    return plainToClass(User, user);
  }

  async getAll(): Promise<User[]> {
    const users = await this.userModel.find().lean();

    return plainToClass(User, users);
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean();

    if (!user) {
      throw new UserNotFoundException(`email: ${email}`);
    }

    return plainToClass(User, user);
  }
}
