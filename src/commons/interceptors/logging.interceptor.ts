import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<
      Request & {
        skipLogging?: boolean;
      }
    >();

    if (req.skipLogging) {
      return next.handle();
    }

    const log = (message: string) => process.stdout.write(message + '\n');
    const hr = () =>
      log(
        chalk.gray(
          '----------------------------------------------------------------------',
        ),
      );

    // --- Cetak INCOMING REQUEST ---
    hr();
    log(
      `🚀 ${chalk.bold.bgBlue(' INCOMING REQUEST ')} [${chalk.white(
        context.getClass().name,
      )}]`,
    );
    hr();

    log(`${chalk.bold('Method:')}\t ${req.method}`);
    log(`${chalk.bold('Path:')}\t ${req.originalUrl}`);
    log(`${chalk.bold('IP:')}\t ${req.ip}`);
    log(`${chalk.bold('Time:')}\t ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
    // if (req.user) {
    //   const { id, name, roles } = req.user as User;

    //   log(
    //     `${chalk.bold('User:')}\t ${name} #${id} [${(roles || [])
    //       ?.map((r) => r.name)
    //       .join(', ')}]`,
    //   );
    // } else {
    log(`${chalk.bold('User:')}\t ${chalk.italic.gray('Guest')}`);
    // }

    // Cetak HEADERS
    log(`\n${chalk.bold.yellow('📋 HEADERS:')}`);
    log(`   Accept:\t ${req.headers['accept'] || ''}`);

    if (Object.keys(req.query).length > 0) {
      log(`\n${chalk.bold.yellow('🔍 QUERY PARAMS:')}`);
      Object.entries(req.query).forEach(([key, value]) => {
        log(`   ${key}:\t ${value}`);
      });
    }
    if (
      req?.body &&
      Object.keys(req?.body).length > 0 &&
      process.env.NODE_ENV !== 'production'
    ) {
      log(`\n${chalk.bold.yellow('📦 REQUEST BODY:')}`);
      log(JSON.stringify(req.body, null, 2));
    }

    if (process.env.NODE_ENV === 'production') {
      log(
        `\n${chalk.dim.italic(
          'production.info: request body logging is disabled.',
        )}`,
      );
    }

    return next.handle().pipe(
      tap(() => {
        log(
          `\n✅ ${chalk.bold.bgGreen(' RESPONSE ')} [${chalk.white(
            context.getClass().name,
          )}]`,
        );

        const res = httpContext.getResponse<Response>();

        const statusColor =
          res.statusCode >= 500
            ? chalk.red
            : res.statusCode >= 400
              ? chalk.yellow
              : chalk.green;

        log(`   Status:\t ${statusColor(`✅ ${res.statusCode} (OK)`)}\n`);
      }),
    );
  }
}
