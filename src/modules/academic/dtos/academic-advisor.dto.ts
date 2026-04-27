import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BaseQueryParams } from '../../../commons/class/base-query-params';

export class BaseAcademicAdvisorDto {
  @ApiProperty({ description: 'UUID dari Dosen' })
  @IsNotEmpty()
  @IsUUID()
  lectureId: string;

  @ApiProperty({ description: 'UUID dari Mahasiswa' })
  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @ApiProperty({ description: 'UUID dari Tahun Ajaran' })
  @IsNotEmpty()
  @IsUUID()
  schoolYearId: string;
}

export class CreateAcademicAdvisorDto extends BaseAcademicAdvisorDto {}

export class UpdateAcademicAdvisorDto extends CreateAcademicAdvisorDto {}

export class AcademicAdvisorQuery extends BaseQueryParams {}