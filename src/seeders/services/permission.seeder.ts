import { BaseSeeder } from '@/commons/class/base-seeder-class';
import { Permission } from '@/modules/auth/entities/permissions.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PermissionPayload from '../payload/permission.payload';

@Injectable()
export class PermissionSeederService implements BaseSeeder {
  private readonly logger = new Logger(PermissionSeederService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async seed() {
    this.logger.log('Seeding permissions...');

    try {
      await this.permissionRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.upsert(
            Permission,
            this.permissionRepository.create(PermissionPayload),
            ['code'],
          );

          this.logger.log('Permissions seeded successfully');
        },
      );
    } catch (error) {
      this.logger.error('Error seeding permissions', error);
    }
  }
}
