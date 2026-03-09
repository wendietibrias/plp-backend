import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { ExceptionLoggingFilter } from './commons/filters/exception-logging.filter';
import { LoggingInterceptor } from './commons/interceptors/logging.interceptor';
import { AppConfigService } from './config/services/app.config.service';

/**
 * Configuration Initialization
 */
require('util').inspect.defaultOptions.depth = null;
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const version: string = require('./../package.json').version;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const author: string = require('./../package.json').author;

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const appConfig = app.get(AppConfigService);
  const cors = appConfig.cors;
  const { url, port, name } = appConfig.app;

  app.enableCors(cors);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.use(json({ limit: '10mb' }));
  app.use(
    urlencoded({
      extended: true,
    }),
  );
  app.use(cookieParser(appConfig.app.cookieSecret));
  app.enableVersioning({
    type: VersioningType.URI,
  });

  if (appConfig.isProduction) app.use(helmet());
  if (appConfig.isLogging) {
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalFilters(new ExceptionLoggingFilter());
  }

  await app.listen(port, () => {
    logger.log(`Server is running on ${url}`);
  });

  logger.log(
    `${name} by ${author} (version: ${version}) is up and running at ${url}`,
  );
}
bootstrap();
