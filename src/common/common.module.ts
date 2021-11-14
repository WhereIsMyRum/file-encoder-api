import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PasswordService, FileFetcherService } from './services';

@Module({
  imports: [HttpModule],
  providers: [PasswordService, FileFetcherService],
  exports: [PasswordService, FileFetcherService],
})
export class CommonModule {}
