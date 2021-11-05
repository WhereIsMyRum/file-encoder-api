import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { AuthModule } from './auth';
import { EncryptorModule } from './encryptor';
import { UsersModule } from './users';

@Module({
  imports: [
    EncryptorModule,
    UsersModule,
    AuthModule,
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const mongod = await MongoMemoryServer.create({
          instance: {
            dbPath: '.database/file-encryptor-data',
            dbName: 'file-encryptor-api',
            storageEngine: 'wiredTiger',
          },
        });
        const uri = await mongod.getUri();
        return { uri: uri };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
