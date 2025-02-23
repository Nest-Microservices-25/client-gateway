import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
// implements RpcExceptionFilter<RpcException>
export class RcpCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    // : Observable<any> {
    // return throwError(() => exception.getError());

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();
    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
      return response.status(status).json(rpcError);
    }
    response.status(400).json({
      statusCode: 400,
      message: rpcError,
    });
  }
}
