import { ProtectedController } from '@/commons/decorators/protected-controller.decorator';
import { Get } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';

@ProtectedController({ path: 'permissions', version: '1' })
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async findAll() {
    return await this.permissionService.findAll();
  }
}
