import { BaseSeeder } from '@/commons/class/base-seeder-class';
import { Permission } from '@/modules/auth/entities/permissions.entity';
import { Role } from '@/modules/auth/entities/role.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import RolePayload from '../payload/role.payload';

@Injectable()
export class RoleSeederService implements BaseSeeder {
  private readonly logger = new Logger(RoleSeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async seed() {
    this.logger.log('Seeding roles...');

    const existingPermissions = await this.permissionRepository.find();

    // 2. Map the payload to include real entities/IDs
    // Filter the existing permissions to match the codes in your payload

    const rolePayload = RolePayload;

    try {
      await this.roleRepository.manager.transaction(
        async (transactionalEntityManager) => {
          for (const roleData of rolePayload) {
            let role =
              (await this.roleRepository.findOne({
                where: { name: roleData.name },
              })) || this.roleRepository.create(roleData);

            this.logger.debug(`Processing role: ${roleData.name}`);

            role.permissions = existingPermissions
              .filter((p) =>
                roleData?.permissions?.some((rp) => rp.code === p.code),
              )
              ?.map((p) =>
                this.permissionRepository.create({
                  id: p.id,
                }),
              );

            await transactionalEntityManager.save(
              this.roleRepository.create(role),
            );
          }

          this.logger.log('Roles seeded successfully');
        },
      );
    } catch (error) {
      this.logger.error('Error seeding roles', error);
    }
  }
}
