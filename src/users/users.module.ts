import { ConfigService } from '@nestjs/config';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommonModule } from '@file-encoder-api/common';

import {
  CredentialsRepository,
  CredentialsSchema,
  UserModels,
  UserRepository,
  UserSchema,
} from './infrastructure';
import { UserManagementService } from './application';
import { factories } from './domain';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      { name: UserModels.User, schema: UserSchema },
      { name: UserModels.Credentials, schema: CredentialsSchema },
    ]),
  ],
  providers: [
    UserManagementService,
    UserRepository,
    CredentialsRepository,
    ...factories,
  ],
  exports: [UserRepository, UserManagementService, CredentialsRepository],
})
export class UsersModule implements OnApplicationBootstrap {
  constructor(
    private readonly usersService: UserManagementService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const emails: string[] = this.configService.get('USER_EMAILS').split(',');
    const passwords: string[] = this.configService
      .get('USER_PASSWORDS')
      .split(',');

    await this.createUsers(emails, passwords);
  }

  private async createUsers(
    emails: string[],
    passwords: string[],
  ): Promise<string[]> {
    if (passwords.length >= emails.length) {
      return Promise.all(
        emails.map((email, it) => {
          return this.usersService.createUser({
            email,
            password: passwords[it],
          });
        }),
      );
    } else {
      return Promise.all(
        passwords.map((password, it) => {
          return this.usersService.createUser({ email: emails[it], password });
        }),
      );
    }
  }
}
