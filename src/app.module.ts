import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth';
import { EncryptorModule } from './encryptor';
import { UsersModule } from './users';

@Module({
  imports: [
    EncryptorModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongod = await MongoMemoryServer.create({
          instance: {
            dbPath: configService.get('DATABASE_PATH'),
            dbName: configService.get('DATABASE_NAME'),
            storageEngine: configService.get('DATABASE_STORAGE_ENGINE'),
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
