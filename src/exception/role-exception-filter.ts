import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class RoleExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();

    if (status === HttpStatus.FORBIDDEN) {
      response.status(status).json({
        statusCode: status,
        error: 'Forbidden',
        message: 'You do not have the required role to access this resource',
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: 'Internal Server Error',
      });
    }
  }
}
