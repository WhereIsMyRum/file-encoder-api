import { Module } from '@nestjs/common';
import { EncryptorController } from './user-interface';

@Module({
  imports: [],
  controllers: [EncryptorController],
  providers: [],
})
export class EncryptorModule {}
