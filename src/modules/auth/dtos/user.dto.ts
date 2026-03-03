import { BaseQueryParams } from '@/commons/class/base-query-params';
import { IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Validate((value, object) => {
    if (value !== object.password) {
      return false;
    }
    return true;
  })
  confirmPassword: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  roleId?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  roleId?: string;
}

export class UserQuery extends BaseQueryParams {
  @IsOptional()
  @IsString()
  roleId?: string;
}
