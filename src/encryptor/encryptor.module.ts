import { Module } from '@nestjs/common';
import { UsersModule } from '../users';
import { EncryptorController } from './user-interface';
import { EncryptorService } from './encryptor.service';

@Module({
  imports: [UsersModule],
  controllers: [EncryptorController],
  providers: [EncryptorService],
})
export class EncryptorModule {}
