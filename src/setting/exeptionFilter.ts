import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errorsResponse = {
        errorsMessages: [],
      };

      const responseBody: any = exception.getResponse();

      responseBody.message.forEach((e) => {
        errorsResponse.errorsMessages.push(e);
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      response.status(status).send(errorsResponse);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      response.status(status).json({
        statusCode: status,
        path: request.url,
      });
    }
  }
}
export const GlobalHttpExceptionFilter = new HttpExceptionFilter();
