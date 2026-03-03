import { UsePermission } from '@/commons/decorators/permissions.decorator';
import { ProtectedController } from '@/commons/decorators/protected-controller.decorator';
import { UuidParam } from '@/commons/decorators/validation/uuid-param';
import { Body, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { CreateRoleDto, RoleQuery, UpdateRoleDto } from '../dtos/role.dto';
import { PermissionCodeEnum } from '../enums/permission.enum';
import { RoleService } from '../services/role.service';

@ProtectedController({ path: 'roles', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @UsePermission(PermissionCodeEnum.READ_ROLE)
  async findAll(@Query() query: RoleQuery) {
    return await this.roleService.findAll(query);
  }

  @Get(':id')
  @UsePermission(PermissionCodeEnum.READ_ROLE)
  async findOne(@UuidParam('id') id: string) {
    return await this.roleService.findOne(id);
  }

  @Post()
  @UsePermission(PermissionCodeEnum.CREATE_ROLE)
  async create(@Body() body: CreateRoleDto) {
    return await this.roleService.create(body);
  }

  @Put(':id')
  @UsePermission(PermissionCodeEnum.UPDATE_ROLE)
  async update(@UuidParam('id') id: string, @Body() body: UpdateRoleDto) {
    return await this.roleService.update(id, body);
  }

  @Delete(':id')
  @UsePermission(PermissionCodeEnum.DELETE_ROLE)
  async delete(@UuidParam('id') id: string) {
    return await this.roleService.delete(id);
  }
}
