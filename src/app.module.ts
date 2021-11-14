import { ConfigModule } from '@nestjs/config';
import { Module, OnApplicationShutdown } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { AuthModule } from '@file-encoder-api/auth';
import { EncryptorModule } from '@file-encoder-api/encryptor';
import { UsersModule } from '@file-encoder-api/users';
import { CommonModule } from '@file-encoder-api/common';

let mongod: MongoMemoryServer;

@Module({
  imports: [
    AuthModule,
    CommonModule,
    EncryptorModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        const uri = await mongod.getUri();
        return { uri: uri };
      },
    }),
  ],
})
export class AppModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    if (mongod) await mongod.stop();
  }
}
