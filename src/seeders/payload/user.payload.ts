import { User } from '@/modules/auth/entities/user.entity';
import { DeepPartial } from 'typeorm';

const UserPayload: DeepPartial<
  Array<
    User & {
      // Optional role name to associate the user with a role during seeding
      roleName?: string;
    }
  >
> = [
  {
    username: 'admin',
    name: 'Admin',
    password: 'superadminpassword',
    roleName: 'Admin',
  },
];

export default UserPayload;
