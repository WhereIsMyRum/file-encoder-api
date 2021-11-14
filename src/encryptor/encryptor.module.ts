import { Module } from '@nestjs/common';

import { CommonModule } from '@file-encoder-api/common';
import { UsersModule } from '@file-encoder-api/users';

import { EncryptorController } from './user-interface';
import { EncryptorService } from './domain';
import { CryptoFunctionsProvider } from './utils';

@Module({
  imports: [UsersModule, CommonModule],
  controllers: [EncryptorController],
  providers: [EncryptorService, CryptoFunctionsProvider],
})
export class EncryptorModule {}
