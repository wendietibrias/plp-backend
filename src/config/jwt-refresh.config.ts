import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { StringValue } from 'ms';

export const JwtRefreshConfig = registerAs(
  'JwtRefreshConfig',
  (): JwtSignOptions => ({
    secret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as StringValue,
  }),
);
