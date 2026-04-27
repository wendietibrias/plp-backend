import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { BaseQueryParams } from '../../../commons/class/base-query-params';
import { SemesterYearlyTypeEnum } from '../../admin/master-data/enums/semester-yearly-type.enum';

export class BaseSemesterDto {
  @ApiProperty({ enum: SemesterYearlyTypeEnum })
  @IsNotEmpty()
  @IsEnum(SemesterYearlyTypeEnum)
  jenis: SemesterYearlyTypeEnum;

  @ApiProperty({ example: '2025-09-01' })
  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  tanggalMulai: Date;

  @ApiProperty({ example: '2026-01-31' })
  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  tanggalSelesai: Date;

  @ApiPropertyOptional({ description: 'UUID dari Tahun Ajaran' })
  @IsOptional()
  @IsUUID()
  schoolYearId?: string;
}

export class CreateSemesterDto extends BaseSemesterDto {}

export class UpdateSemesterDto extends CreateSemesterDto {}

export class SemesterQuery extends BaseQueryParams {}   