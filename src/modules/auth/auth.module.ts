import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { PermissionController } from './controllers/permission.controller';
import { RoleController } from './controllers/role.controller';
import { UserController } from './controllers/user.controller';
import { Permission } from './entities/permissions.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { UserService } from './services/user.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

const providers = [PermissionService, RoleService, UserService, AuthService];
const strategies = [JwtStrategy, JwtRefreshStrategy];

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, User])],
  controllers: [
    UserController,
    RoleController,
    PermissionController,
    AuthController,
  ],
  providers: [...providers, ...strategies],
  exports: [TypeOrmModule, ...providers, ...strategies],
})
export class AuthModule {}
