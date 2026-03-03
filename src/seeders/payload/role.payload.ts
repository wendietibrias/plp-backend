import { Role } from '@/modules/auth/entities/role.entity';
import { PermissionCodeEnum } from '@/modules/auth/enums/permission.enum';
import { DeepPartial } from 'typeorm';

/**
 * Roles Seeder Payload
 * This file contains the payload data for seeding roles into the database.
 * Each role includes a name and description.
 *
 * IMPORTANT NOTE!
 * When adding new roles ensure to:
 * 1. Ensure name is unique
 */
const RolePayload: DeepPartial<Role[]> = [
  {
    name: 'Admin',
    description:
      'Peran dengan akses penuh ke semua fitur dan data dalam sistem.',
    permissions: Object.values(PermissionCodeEnum).map((code) => ({ code })),
  },
];

export default RolePayload;
