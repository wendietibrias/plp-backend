import { FeatureModule } from '@/modules/feature.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { VersionMiddleware } from 'src/commons/middleware/version.middleware';
import { AppController } from './controllers/app.controller';
import { GlobalModule } from './global.module';

@Module({
  controllers: [AppController],
  imports: [GlobalModule, FeatureModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VersionMiddleware).forRoutes('*');
  }
}
