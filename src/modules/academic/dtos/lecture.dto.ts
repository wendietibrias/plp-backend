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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  JabatanFungsional,
  PendidikanTerakhir,
  DosenStatus,
} from '../entities/lecture.entity';
import { BaseQueryParams } from '../../../commons/class/base-query-params';
import { Type } from 'class-transformer';

 
export class FilterDosenDto extends BaseQueryParams {
  @ApiPropertyOptional({ description: 'Filter by status', enum: DosenStatus })
  @IsOptional()
  @IsEnum(DosenStatus)
  status?: DosenStatus;
 
  @ApiPropertyOptional({ description: 'Filter by jabatan fungsional', enum: JabatanFungsional })
  @IsOptional()
  @IsEnum(JabatanFungsional)
  jabatanFungsional?: JabatanFungsional;
 
  @ApiPropertyOptional({ description: 'Filter by program studi ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  programStudiId?: number;
}
 


export class CreateLectureDto{
  @ApiProperty({ description: 'ID Program Studi', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  studyProgramId: number;

  @ApiPropertyOptional({ description: 'ID User (opsional)', example: 1 })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ description: 'Nomor Induk Dosen Nasional', example: '0012345601' })
  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  nidn: string;

  @ApiProperty({ description: 'Nama lengkap dosen', example: 'Dr. Ahmad Fauzi, M.Kom' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({ description: 'Email dosen', example: 'ahmad.fauzi@univ.ac.id' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Nomor HP', example: '081234567890' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]{8,20}$/, { message: 'Format nomor HP tidak valid' })
  phone: string;

  @ApiPropertyOptional({ description: 'Tanggal lahir', example: '1980-05-20' })
  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal tidak valid (YYYY-MM-DD)' })
  birthday?: string;

  @ApiPropertyOptional({ description: 'Alamat lengkap' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Jenis kelamin', example: 'Laki-laki' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({
    description: 'Jabatan fungsional dosen',
    enum: JabatanFungsional,
  })
  @IsOptional()
  @IsEnum(JabatanFungsional, { message: 'Jabatan fungsional tidak valid' })
  functionalPosition?: JabatanFungsional;

  @ApiPropertyOptional({
    description: 'Pendidikan terakhir',
    enum: PendidikanTerakhir,
  })
  @IsOptional()
  @IsEnum(PendidikanTerakhir, { message: 'Pendidikan terakhir tidak valid' })
  lastEducation?: PendidikanTerakhir;

  @ApiPropertyOptional({
    description: 'Bidang keahlian',
    example: 'Kecerdasan Buatan, Machine Learning',
  })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  expert?: string;

  @ApiPropertyOptional({
    description: 'Status dosen',
    enum: DosenStatus,
    default: DosenStatus.AKTIF,
  })
  @IsOptional()
  @IsEnum(DosenStatus, { message: 'Status tidak valid' })
  status?: DosenStatus;
}

export class UpdateDosenDto extends PartialType(CreateLectureDto) {}
