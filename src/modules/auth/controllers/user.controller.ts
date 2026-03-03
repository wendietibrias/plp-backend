import { UsePermission } from '@/commons/decorators/permissions.decorator';
import { ProtectedController } from '@/commons/decorators/protected-controller.decorator';
import { UuidParam } from '@/commons/decorators/validation/uuid-param';
import { Body, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserQuery } from '../dtos/user.dto';
import { PermissionCodeEnum } from '../enums/permission.enum';
import { UserService } from '../services/user.service';

@ProtectedController({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UsePermission(PermissionCodeEnum.READ_USER)
  async findAll(@Query() query: UserQuery) {
    return await this.userService.findAll(query);
  }

  @Get(':id')
  @UsePermission(PermissionCodeEnum.READ_USER)
  async findOne(@UuidParam('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Post()
  @UsePermission(PermissionCodeEnum.CREATE_USER)
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Put(':id')
  @UsePermission(PermissionCodeEnum.UPDATE_USER)
  async update(@UuidParam('id') id: string, @Body() body: UpdateUserDto) {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  @UsePermission(PermissionCodeEnum.DELETE_USER)
  async delete(@UuidParam('id') id: string) {
    return await this.userService.delete(id);
  }
}
