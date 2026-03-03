import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from '../app.config';

@Injectable()
export class AppConfigService extends ConfigService {
  get isProduction(): boolean {
    return this.app.env == 'production';
  }

  get isDevelopment(): boolean {
    return this.app.env == 'development';
  }

  get isLogging(): boolean {
    return this.app.isLogging;
  }

  get app(): AppConfig {
    return this.get('AppConfig')!;
  }

  get jwt(): JwtSignOptions {
    return this.get('JwtConfig')!;
  }

  get orm(): TypeOrmModuleOptions {
    return this.get('OrmConfig')!;
  }

  get jwtRefresh(): JwtSignOptions {
    return this.get('JwtRefreshConfig')!;
  }

  get cors(): CorsOptions {
    return this.get('CorsConfig')!;
  }
}
