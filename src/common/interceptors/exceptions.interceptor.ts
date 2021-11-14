import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import { IntentionalInternalServerErrorException } from '../exceptions';
import { LoggerService, LoggingLevels } from '../services';

@Injectable()
export class ExceptionsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: Error) => {
        const status = this.resolveHttpStatus(error);

        LoggerService.log(
          LoggingLevels.error,
          `Http error. Status: ${status}`,
          { stack: error.stack },
        );

        throw new HttpException(error.message, status);
      }),
    );
  }

  private resolveHttpStatus(error: Error): HttpStatus {
    if (error instanceof NotFoundException) {
      return HttpStatus.NOT_FOUND;
    } else if (error instanceof UnprocessableEntityException) {
      return HttpStatus.UNPROCESSABLE_ENTITY;
    } else if (error instanceof IntentionalInternalServerErrorException) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
