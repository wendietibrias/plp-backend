import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

@Catch()
export class ExceptionLoggingFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<
      Request & {
        permissionDeniedInfo?: {
          requiredPermissions: string[];
          isDenied: boolean;
        };
        classTarget: string;
      }
    >();

    if (!exception) return;

    const status = exception?.getStatus?.();
    const errorResponse = exception?.getResponse?.();

    if (status === 401 && !request.permissionDeniedInfo) {
      return response.status(status).json({
        statusCode: status,
        message: 'Unauthorized',
      });
    }

    let message: string;

    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (
      errorResponse &&
      typeof errorResponse === 'object' &&
      (errorResponse as any).message
    ) {
      message = (errorResponse as any).message;
    } else {
      message = exception.message;
    }

    // Ambil reqId yang kita buat di interceptor
    // @ts-ignore

    // --- Cetak ERROR RESPONSE (menggunakan format cantik Anda) ---
    const log = (msg: string) => process.stdout.write(msg + '\n');
    log(
      `\n❌ ${chalk.bold.bgRed(' RESPONSE (FAIL) ')} [${chalk.white(
        request?.classTarget || 'Unknown',
      )}] \n`,
    );

    log(`${chalk.bold('Method:')}\t ${request.method}`);
    log(`${chalk.bold('Path:')}\t ${request.originalUrl}`);
    log(`${chalk.bold('IP:')}\t ${request.ip}`);
    log(`${chalk.bold('Time:')}\t ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
    // if (request.user) {
    //   const { id, name, roles } = request.user as User;
    //   log(
    //     `${chalk.bold('User:')}\t ${name} #${id} [${(roles || [])
    //       .map((r) => r.name)
    //       .join(', ')}]`,
    //   );
    // } else {
    log(`${chalk.bold('User:')}\t ${chalk.italic.gray('Guest')}`);
    // }

    if (request?.permissionDeniedInfo) {
      log(
        `${chalk.red(
          '🚫 Permission Missing:',
        )}\nRequired Permissions: ${chalk.bold.yellow(
          request?.permissionDeniedInfo?.requiredPermissions?.join(', '),
        )}`,
      );
    }
    log(`Status:\t ${chalk.red(`❌ ${status} (${message})`)}\n`);

    response.status(status || 500).json({
      statusCode: status,
      path: request.url,
      message: status ? message : 'Internal Server Error',
    });

    if (!status) {
      console.error(exception);
    }
  }
}
