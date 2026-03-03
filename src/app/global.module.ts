import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfig } from 'src/config/app.config';
import { JwtRefreshConfig } from 'src/config/jwt-refresh.config';
import { JwtConfig } from 'src/config/jwt.config';
import { OrmConfig } from 'src/config/orm.config';
import { AppConfigService } from 'src/config/services/app.config.service';
import { DatabaseModule } from './database.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [AppConfig, JwtRefreshConfig, JwtConfig, OrmConfig],
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.registerAsync({
      useFactory: (configService: AppConfigService) => configService.jwt,
      inject: [AppConfigService],
    }),
    DatabaseModule,
  ],
  providers: [AppConfigService],
  exports: [AppConfigService, ConfigModule, PassportModule, JwtModule],
})
export class GlobalModule {}
