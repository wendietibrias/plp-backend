import { BaseModel } from '@/commons/class/base-entity-model';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { PermissionCodeEnum } from '../enums/permission.enum';
import { Permission } from './permissions.entity';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role extends BaseModel {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  hasPermission(permissionName: PermissionCodeEnum): boolean {
    return (this?.permissions || []).some(
      (permission) => permission.code === permissionName,
    );
  }
}
