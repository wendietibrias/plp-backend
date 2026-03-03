import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BaseSeeder } from './commons/class/base-seeder-class';
import { SeedersModule } from './seeders/seeders.module';
import { PermissionSeederService } from './seeders/services/permission.seeder';
import { RoleSeederService } from './seeders/services/role.seeder';
import { UserSeederService } from './seeders/services/user.seeder';

async function bootstrap() {
  const logger = new Logger('Seeder');
  const app = await NestFactory.createApplicationContext(SeedersModule);

  const command = process.argv[2];

  const SeederService: Record<string, BaseSeeder> = {
    permissions: app.get(PermissionSeederService),
    roles: app.get(RoleSeederService),
    users: app.get(UserSeederService),
  };

  try {
    if (!command) {
      logger.log(`Starting seeding process for command: all`);

      for (const [key, service] of Object.entries(SeederService)) {
        logger.log(`Seeding data for command: ${key}`);
        await service.seed();
      }

      logger.log('Seeding process completed for all commands');
      return;
    }

    const service = SeederService[command];

    if (!service) {
      logger.error(
        `Seeder service for command "${command}" not found. Available commands:`,
      );

      Object.keys(SeederService).forEach((key) => logger.warn(`- ${key}`));

      return;
    }

    logger.log(`Seeding data for command: ${command}`);

    await service.seed();
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    app.close();
  }
}

bootstrap();
