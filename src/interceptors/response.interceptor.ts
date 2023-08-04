import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const url = request.originalUrl;
    const statusCode = response.statusCode;
    return next.handle().pipe(
      map(({ isError, message, data }) => ({
        url,
        timestamp: new Date().toISOString(),
        statusCode,
        isError: false,
        message,
        data,
      })),
    );
  }
}
