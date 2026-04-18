import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { ExceptionLoggingFilter } from './commons/filters/exception-logging.filter';
import { LoggingInterceptor } from './commons/interceptors/logging.interceptor';
import { AppConfigService } from './config/services/app.config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Endpoint Documentation')
    .setDescription('Ini adalah dokumentasi api untuk backend aplikasi absensi kampus')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name must match the one used in @ApiBearerAuth()
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

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
