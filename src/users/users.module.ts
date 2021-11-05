import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './user-interface';
import { UserModels, UserSchema, UserRepository } from './infrastructure';
import { UserManagementService } from './application';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModels.User, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UserManagementService, UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}
