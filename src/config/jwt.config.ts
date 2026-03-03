import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { StringValue } from 'ms';

export const JwtConfig = registerAs(
  'JwtConfig',
  (): JwtSignOptions => ({
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as StringValue,
  }),
);
