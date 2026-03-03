import { PermissionCodeEnum } from '@/modules/auth/enums/permission.enum';
import { PermissionGuard } from '@/modules/auth/guards/permission.guard';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const UsePermission = (...permissions: PermissionCodeEnum[]) =>
  applyDecorators(
    SetMetadata(PERMISSIONS_KEY, permissions),
    UseGuards(PermissionGuard),
  );
