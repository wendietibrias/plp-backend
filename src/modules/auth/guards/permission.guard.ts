import { PERMISSIONS_KEY } from '@/commons/decorators/permissions.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { PermissionCodeEnum } from '../enums/permission.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissionCodes = this.reflector.getAllAndMerge<PermissionCodeEnum[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permissionCodes || permissionCodes.length === 0) return true;
    const request = context.switchToHttp().getRequest();
    const user = request?.user as User;

    if (!user) return false;

    const isAuthorized = permissionCodes.every((code) =>
      user.role?.hasPermission(code),
    );

    if (!isAuthorized)
      request.permissionDeniedInfo = {
        requiredPermissions: permissionCodes,
        isDenied: true,
      };

    return isAuthorized;
  }
}
