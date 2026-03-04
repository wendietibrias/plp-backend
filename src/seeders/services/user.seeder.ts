import { BaseSeeder } from '@/commons/class/base-seeder-class';
import { Role } from '@/modules/auth/entities/role.entity';
import { User } from '@/modules/auth/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserPayload from '../payload/user.payload';

@Injectable()
export class UserSeederService implements BaseSeeder {
  private readonly logger = new Logger(UserSeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seed() {
    const userPayload = UserPayload;

    this.logger.log('Seeding users...');

    try {
      await this.userRepository.manager.transaction(
        async (transactionalEntityManager) => {
          for (const userData of userPayload) {
            const { roleName, ...userInfo } = userData;

            // Find the role by name if roleName is provided
            let role: Role | null = null;

            this.logger.debug(
              `Processing user: ${userInfo.username} with role: ${roleName || 'N/A'}`,
            );

            if (roleName) {
              role = await this.roleRepository.findOne({
                where: { name: roleName },
              })!;

              if (!role) {
                this.logger.warn(
                  `Role with name "${roleName}" not found for user "${userInfo.username}". Skipping user creation.`,
                );
                continue;
              }
            }

            // Create the user entity
            const userEntity = this.userRepository.create({
              ...userInfo,
              roleId: role?.id,
            });

            await userEntity.hashPassword();

            // Save the user entity to the database
            await transactionalEntityManager.upsert(User, userEntity, [
              'username',
            ]);
          }
        },
      );

      this.logger.log('Users seeded successfully');
    } catch (error) {
      this.logger.error('Error seeding users', error);
    }
  }
}
