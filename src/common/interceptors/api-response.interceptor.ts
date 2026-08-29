import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class DefaultData {
  [key: string]: any;
}

export interface DefaultAPIResponseResponse<T> {
  success?: boolean;
  data?: T;
  error?: any;
  message?: string | string[];
  timestamp?: string;
}

@Injectable()
export class APIResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return handler.handle().pipe(
      map((data): DefaultAPIResponseResponse<any> => {
        const message =
          data && data.message ? data.message : 'Request successful';
        if (data?.message) delete data.message;
        const data_ =
          data instanceof Error ? null : data?.data ? data.data : data;
        const success = !(data instanceof Error) && data_ !== null;
        return {
          success,

          data: data_,
          error: data instanceof Error ? data : null,
          message,
        };
      }),
    );
  }
}
