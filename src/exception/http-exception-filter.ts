import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import {
  Response,
  // Request,
} from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // console.log('This is the exception', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();
    // const request = ctx.getRequest<Request>();

    response.status(status).json({
      statusCode: status,
      error: message['error'],
      message:
        status === 403
          ? "You do not have the required access to this resource'"
          : message['message'],
      // timestamp: new Date().toISOString(),
      // path: request.url,
    });
  }
}
