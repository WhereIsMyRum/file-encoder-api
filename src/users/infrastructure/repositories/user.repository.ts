import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';

import { RepositoryInterface } from '@file-encoder-api/common';

import { User } from '../../domain';
import { UserModels, UserModel } from '../models';

@Injectable()
export class UserRepository implements RepositoryInterface<User> {
  constructor(
    @InjectModel(UserModels.User)
    private readonly userModel: Model<UserModel>,
  ) {}

  async insert(user: User): Promise<string> {
    const newUser = await this.userModel.create(user.parameters());

    const savedUser = await newUser.save();

    return savedUser.id;
  }

  async save(user: User): Promise<User | null> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ id: user.getId() }, user.parameters(), {
        new: true,
        projection: '-_id -__v',
      })
      .lean();

    return plainToClass(User, updatedUser);
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.userModel.findOne({ id }, '-_id -__v').lean();

    return plainToClass(User, user);
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }, '-_id -__v').lean();

    return plainToClass(User, user);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.deleteOne({ id });
  }
}
