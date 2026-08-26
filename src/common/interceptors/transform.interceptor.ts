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

export interface DefaultResponse<T> {
  statusCode?: number;
  message?: string;
  messageCode?: string;
  data?: T;
  timestamp?: string;
}

@Injectable()
export class ResponseFormatInterceptor<T> implements NestInterceptor<
  DefaultResponse<T>,
  DefaultResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<DefaultResponse<T>>,
  ): Observable<DefaultResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          statusCode:
            data?.statusCode || context.switchToHttp().getResponse().statusCode,
          message: data?.message || 'Success',
          ...(data?.data && { data: data.data }),
          ...(data?.messageCode && { messageCode: data.messageCode }),
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
