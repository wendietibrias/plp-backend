import { BaseModel } from 'src/commons/class/base-entity-model';
import { Column, Entity } from 'typeorm';
import {
  PermissionCodeEnum,
  PermissionGroupEnum,
} from '../enums/permission.enum';

@Entity({ name: 'permissions' })
export class Permission extends BaseModel {
  @Column({ type: 'enum', enum: PermissionCodeEnum, unique: true })
  code: PermissionCodeEnum;

  @Column({ type: 'enum', enum: PermissionGroupEnum })
  group: PermissionGroupEnum;

  @Column()
  description: string;
}
