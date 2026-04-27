
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { MahasiswaStatus } from '../entities/student.entity'
import { BaseQueryParams } from '../../../commons/class/base-query-params';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @ApiProperty({ description: 'ID Program Studi', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  studyProgramId: number;

  @ApiPropertyOptional({ description: 'ID Kelas', example: 1 })
  @IsOptional()
  @IsNumber()
  classId?: number;

  @ApiPropertyOptional({ description: 'ID User (opsional)', example: 1 })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ description: 'Nomor Induk Student', example: '2021001001' })
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  nim: string;

  @ApiProperty({ description: 'Nama lengkap Student', example: 'Budi Santoso' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({ description: 'Email Student', example: 'budi@email.com' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Nomor HP', example: '081234567890' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]{8,20}$/, { message: 'Format nomor HP tidak valid' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Tanggal lahir', example: '2000-01-15' })
  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal tidak valid (YYYY-MM-DD)' })
  birthday?: string;

  @ApiPropertyOptional({ description: 'Alamat lengkap' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Agama', example: 'Islam' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  religion?: string;

  @ApiPropertyOptional({ description: 'Jenis kelamin', example: 'Laki-laki', enum: ['Laki-laki', 'Perempuan'] })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Status Student', enum: MahasiswaStatus, default: MahasiswaStatus.AKTIF })
  @IsOptional()
  @IsEnum(MahasiswaStatus, { message: 'Status tidak valid' })
  status?: MahasiswaStatus;

  @ApiProperty({ description: 'Tahun angkatan', example: 2021 })
  @IsNumber()
  @Min(2000)
  @Max(2100)
  angkatan: number;
}


export class FilterStudentDto extends BaseQueryParams {
  @ApiPropertyOptional({ description: 'Filter by status', enum: MahasiswaStatus })
  @IsOptional()
  @IsEnum(MahasiswaStatus)
  status?: MahasiswaStatus;

  @ApiPropertyOptional({ description: 'Filter by program studi ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  programStudiId?: number;

  @ApiPropertyOptional({ description: 'Filter by kelas ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  kelasId?: number;

  @ApiPropertyOptional({ description: 'Filter by angkatan', example: 2021 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  angkatan?: number;
}

export class UpdateMStudentDto extends PartialType(CreateStudentDto) {}
