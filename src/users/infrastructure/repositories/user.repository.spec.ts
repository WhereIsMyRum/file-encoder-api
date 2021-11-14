import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  closeDatasbaseConnection,
  rootMongooseTestModule,
} from '@file-encoder-api/tests/utils';

import { User } from '../../domain';
import { UserModels, UserModel } from '../models';
import { UserSchema } from '../schemas';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userModel: Model<UserModel>;

  const userId = 'user-id';
  const user = new User(userId, 'my@email.com');

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: UserModels.User, schema: UserSchema },
        ]),
      ],
      providers: [UserRepository],
    }).compile();

    userRepository = module.get(UserRepository);
    userModel = module.get('UserModel');
  });

  afterAll(async () => {
    await closeDatasbaseConnection();
  });

  beforeEach(async () => {
    await userModel.create(user);
  });

  afterEach(async () => {
    await userModel.deleteMany();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('insert', () => {
    it('should create a new user and return his id', async () => {
      const newUserId = 'new-user-id';
      const newUser = new User(newUserId, 'new-user@email.com');

      const id = await userRepository.insert(newUser);
      const insertedUser = await userModel
        .findOne({ id: newUserId }, '-_id -__v')
        .lean();

      expect(id).toEqual(newUserId);
      expect(insertedUser).toEqual(newUser.parameters());
    });
  });

  describe('save', () => {
    it('should update the user and return the updated version if it exists', async () => {
      const updatedUser = new User(userId, 'new-email@email.com');

      const resultUser = await userRepository.save(updatedUser);

      expect(resultUser).toEqual(updatedUser);
    });

    it('should return null if user does not exist', async () => {
      const nonExistingUser = new User('non-existing-id', 'email@email.com');

      const resultUser = await userRepository.save(nonExistingUser);

      expect(resultUser).toEqual(null);
    });
  });

  describe('getById', () => {
    it('should return a user if it exists', async () => {
      const retrievedUser = await userRepository.getById(userId);

      expect(retrievedUser).toEqual(user);
    });

    it('should return null if it does not exist', async () => {
      const retrievedUser = await userRepository.getById('i-do-not-exist');

      expect(retrievedUser).toEqual(null);
    });
  });

  describe('getByEmail', () => {
    it('should return a user by email if it exists', async () => {
      const retrievedUser = await userRepository.getByEmail(user.getEmail());

      expect(retrievedUser).toEqual(user);
    });

    it('should return null if it does not exist', async () => {
      const retrievedUser = await userRepository.getByEmail('i-do-not-exist');

      expect(retrievedUser).toEqual(null);
    });
  });

  describe('delete', () => {
    it('should delete a user by id if it exists', async () => {
      await userRepository.delete(userId);

      const deletedUser = await userModel.findOne({ id: userId });

      expect(deletedUser).toEqual(null);
    });

    it('should not fail if a user does not exist', async () => {
      await expect(async () => {
        await userRepository.delete('non-existing-user-id');
      }).not.toThrow();
    });
  });
});
