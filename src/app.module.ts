import { Module, OnApplicationShutdown } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth';
import { EncryptorModule } from './encryptor';
import { UsersModule } from './users';
import { CommonModule } from './common';

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
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    if (mongod) await mongod.stop();
  }
}
