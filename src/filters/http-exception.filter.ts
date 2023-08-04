import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = 500 || exception.getStatus();
    const url = request.originalUrl;
    let errors: any;
    console.log(exception);

    if (statusCode === 400) {
      errors = !exception.response.message
        ? [exception.response]
        : exception.response.message;
    } else if (exception.response.message) {
      errors = [exception.response.message];
    } else {
      errors = [exception.response];
    }
    return response.status(statusCode).json({
      url,
      timeStamps: new Date().toISOString(),
      statusCode,
      isError: true,
      errors,
    });
  }
}
