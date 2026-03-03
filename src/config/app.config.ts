import { registerAs } from '@nestjs/config';

export interface AppConfig {
  name: string;
  env: string;
  url: string;
  port: number;
  lang: string;
  isLogging: boolean;
}

export const AppConfig = registerAs(
  'AppConfig',
  (): AppConfig => ({
    name: process.env.APP_NAME || 'NestJS Application',
    env: process.env.NODE_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost',
    port: parseInt(process?.env?.PORT || '3000', 10),
    lang: process.env.APP_LANG || 'en',
    isLogging: process.env.APP_LOGGING === 'true' || false,
  }),
);
