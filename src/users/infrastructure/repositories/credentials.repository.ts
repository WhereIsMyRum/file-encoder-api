import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RepositoryInterface } from '@file-encoder-api/common';

import { CredentialsModel, UserModels } from '../models';

@Injectable()
export class CredentialsRepository
  implements RepositoryInterface<CredentialsModel>
{
  constructor(
    @InjectModel(UserModels.Credentials)
    private readonly credentialsModel: Model<CredentialsModel>,
  ) {}

  async save(credentials: CredentialsModel): Promise<CredentialsModel | null> {
    return this.credentialsModel
      .findOneAndUpdate(
        {
          id: credentials.id,
        },
        { ...credentials },
        { new: true, projection: '-_id -__v' },
      )
      .lean();
  }

  async insert(credentials: CredentialsModel): Promise<string> {
    const newCredentials = await this.credentialsModel.create(credentials);

    const savedCredentials = await newCredentials.save();

    return savedCredentials.id;
  }

  async getById(id: string): Promise<CredentialsModel | null> {
    return this.credentialsModel.findOne({ id }, '-_id -__v').lean();
  }

  async delete(id: string): Promise<void> {
    await this.credentialsModel.deleteOne({ id });
  }
}
