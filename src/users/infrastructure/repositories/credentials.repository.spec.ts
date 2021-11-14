import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  closeDatasbaseConnection,
  rootMongooseTestModule,
} from '@file-encoder-api/tests/utils';

import { UserModels, CredentialsModel } from '../models';
import { CredentialsRepository } from './credentials.repository';
import { CredentialsSchema } from '../schemas';

describe('CredentialsRepository', () => {
  let credentialsRepository: CredentialsRepository;
  let credentialsModel: Model<CredentialsModel>;

  const userId = 'user-id';
  const credentials: CredentialsModel = {
    id: userId,
    email: 'user@email.com',
    password: {
      hashedPassword: 'hash',
      salt: 'salt',
    },
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: UserModels.Credentials, schema: CredentialsSchema },
        ]),
      ],
      providers: [CredentialsRepository],
    }).compile();

    credentialsRepository = module.get(CredentialsRepository);
    credentialsModel = module.get('CredentialsModel');
  });

  afterAll(async () => {
    await closeDatasbaseConnection();
  });

  beforeEach(async () => {
    await credentialsModel.create(credentials);
  });

  afterEach(async () => {
    await credentialsModel.deleteMany();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(credentialsRepository).toBeDefined();
  });

  describe('insert', () => {
    it('should create new credentials and return his id', async () => {
      const newUserId = 'new-user-id';
      const newCredentials: CredentialsModel = {
        id: newUserId,
        email: 'new-user@email.com',
        password: {
          hashedPassword: 'hash',
          salt: 'salt',
        },
      };

      const id = await credentialsRepository.insert(newCredentials);
      const insertedCredentials = await credentialsModel
        .findOne({ id: newUserId }, '-_id -__v')
        .lean();

      expect(id).toEqual(newUserId);
      expect(insertedCredentials).toEqual(newCredentials);
    });
  });

  describe('save', () => {
    it('should update the credentials and return the updated version if they exist', async () => {
      const updatedCredentials: CredentialsModel = {
        ...credentials,
        email: 'updated-email@email.com',
        password: {
          hashedPassword: 'updated-hash-password',
          salt: 'updated-salt',
        },
      };

      const resultCredentials = await credentialsRepository.save(
        updatedCredentials,
      );

      expect(resultCredentials).toEqual(updatedCredentials);
    });

    it('should return null if credentials do not exist', async () => {
      const nonExistingCredentials: CredentialsModel = {
        ...credentials,
        id: 'i-do-not-exist',
      };

      const resultCredentials = await credentialsRepository.save(
        nonExistingCredentials,
      );

      expect(resultCredentials).toEqual(null);
    });
  });

  describe('getById', () => {
    it('should return credentials if they exists', async () => {
      const retrievedCredentials = await credentialsRepository.getById(userId);

      expect(retrievedCredentials).toEqual(credentials);
    });

    it('should return null if it does not exist', async () => {
      const retrievedCredentials = await credentialsRepository.getById(
        'i-do-not-exist',
      );

      expect(retrievedCredentials).toEqual(null);
    });
  });

  describe('delete', () => {
    it('should delete credentials by id if they exists', async () => {
      await credentialsRepository.delete(userId);

      const deletedCredentials = await credentialsModel.findOne({ id: userId });

      expect(deletedCredentials).toEqual(null);
    });

    it('should not fail if a user does not exist', async () => {
      await expect(async () => {
        await credentialsRepository.delete('non-existing-user-id');
      }).not.toThrow();
    });
  });
});
