import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DefaultAPIResponseResponse } from '../interceptors/api-response.interceptor';

interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error: string | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const exceptionData = exceptionResponse as HttpExceptionResponse;

        message =
          exceptionData.message ?? exception.message ?? 'Internal server error';

        error = exceptionData.error ?? null;
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);

      message = exception.message || 'Internal server error';

      error = exception.constructor.name;
    } else {
      this.logger.error(exception);
    }

    const body: DefaultAPIResponseResponse<null> = {
      success: false,
      message,
      data: null,
      error,
    };

    response.status(status).json(body);
  }
}
