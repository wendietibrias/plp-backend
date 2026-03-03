import { Permission } from '@/modules/auth/entities/permissions.entity';
import {
  PermissionCodeEnum,
  PermissionGroupEnum,
} from '@/modules/auth/enums/permission.enum';
import { DeepPartial } from 'typeorm';

/**
 * Permissions Seeder Payload
 * This file contains the payload data for seeding permissions into the database.
 * Each permission includes a name, description, and associated roles.
 *
 * IMPORTANT NOTE!
 * When adding new permissions ensure to:
 * 1. Ensure code is unique
 *
 * Optional Note:
 * 1. Add permission separator between permission batches for better readability and navigation.
 */

const PermissionPayload: DeepPartial<Permission[]> = [
  /**
   * User Permissions
   */
  {
    code: PermissionCodeEnum.CREATE_USER,
    group: PermissionGroupEnum.AUTH,
    description: 'Mengizinkan pengguna untuk membuat akun baru.',
  },
  {
    code: PermissionCodeEnum.READ_USER,
    group: PermissionGroupEnum.AUTH,
    description: 'Mengizinkan pengguna untuk melihat informasi akun.',
  },
  {
    code: PermissionCodeEnum.UPDATE_USER,
    group: PermissionGroupEnum.AUTH,
    description: 'Mengizinkan pengguna untuk memperbarui informasi akun.',
  },
  {
    code: PermissionCodeEnum.DELETE_USER,
    group: PermissionGroupEnum.AUTH,
    description: 'Mengizinkan pengguna untuk menghapus akun.',
  },

  /**
   * Role Permissions
   */
  {
    code: PermissionCodeEnum.CREATE_ROLE,
    group: PermissionGroupEnum.AUTH,
    description: 'Mengizinkan pengguna untuk membuat peran baru.',
  },
  {
    code: PermissionCodeEnum.READ_ROLE,
    group: PermissionGroupEnum.AUTH,
    description: 'Mengizinkan pengguna untuk melihat informasi peran.',
  },
  {
    code: PermissionCodeEnum.UPDATE_ROLE,
    group: PermissionGroupEnum.AUTH,
    description: 'Mengizinkan pengguna untuk memperbarui informasi peran.',
  },
  {
    code: PermissionCodeEnum.DELETE_ROLE,
    group: PermissionGroupEnum.AUTH,
    description: 'Mengizinkan pengguna untuk menghapus peran.',
  },
];

export default PermissionPayload;
