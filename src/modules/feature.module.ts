import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AcademicModule } from './academic/academic.module';
import { MasterDataModule } from './admin/master-data/master-data.module';

@Module({
  imports: [AuthModule,AcademicModule,MasterDataModule],
})
export class FeatureModule {}
