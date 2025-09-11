
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException 
      ? exception.getResponse()
      : 'Internal server error';

    const errorResponse = {
      code: status,
      message: typeof message === 'string' ? message : (message as any).message,
      details: typeof message === 'object' ? (message as any).error : undefined,
    };

    response.status(status).json(errorResponse);
  }
}