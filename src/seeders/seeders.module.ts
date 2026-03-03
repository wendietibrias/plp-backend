import { DatabaseModule } from '@/app/database.module';
import { OrmConfig } from '@/config/orm.config';
import { AppConfigService } from '@/config/services/app.config.service';
import { Permission } from '@/modules/auth/entities/permissions.entity';
import { Role } from '@/modules/auth/entities/role.entity';
import { User } from '@/modules/auth/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionSeederService } from './services/permission.seeder';
import { RoleSeederService } from './services/role.seeder';
import { UserSeederService } from './services/user.seeder';

const SeederServices = [
  PermissionSeederService,
  UserSeederService,
  RoleSeederService,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [OrmConfig],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Permission, User, Role]),
  ],
  providers: [...SeederServices, AppConfigService],
  exports: [...SeederServices, AppConfigService],
})
export class SeedersModule {}
