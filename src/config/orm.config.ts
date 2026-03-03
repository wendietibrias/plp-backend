import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const OrmConfig = registerAs(
  'OrmConfig',
  (): TypeOrmModuleOptions => ({
    type: (process.env.DB_TYPE as any) || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process?.env?.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'myapp',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    logging: process.env.DB_LOG === 'true' ? ['error'] : false,
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      decimalNumbers: true,
    },
    bigNumberStrings: false,
  }),
);
