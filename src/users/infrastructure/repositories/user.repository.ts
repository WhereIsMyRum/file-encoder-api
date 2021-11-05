import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';

import { UserModels, UserModel } from '../models';
import { User } from '../../domain';
import { RepositoryInterface } from 'src/common';

@Injectable()
export class UserRepository implements RepositoryInterface<User> {
  constructor(
    @InjectModel(UserModels.User)
    private readonly userModel: Model<UserModel>,
  ) {}

  async insert(user: User): Promise<string> {
    const newUser = await this.userModel.create(user);
    const savedUser = await newUser.save();

    return savedUser.id;
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new NotFoundException();
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
      throw new NotFoundException();
    }

    return plainToClass(User, user);
  }
}
