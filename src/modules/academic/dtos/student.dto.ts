
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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MahasiswaStatus } from '../entities/student.entity'

export class CreateMahasiswaDto {
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

  @ApiProperty({ description: 'Nomor Induk Mahasiswa', example: '2021001001' })
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  nim: string;

  @ApiProperty({ description: 'Nama lengkap mahasiswa', example: 'Budi Santoso' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({ description: 'Email mahasiswa', example: 'budi@email.com' })
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

  @ApiPropertyOptional({ description: 'Status mahasiswa', enum: MahasiswaStatus, default: MahasiswaStatus.AKTIF })
  @IsOptional()
  @IsEnum(MahasiswaStatus, { message: 'Status tidak valid' })
  status?: MahasiswaStatus;

  @ApiProperty({ description: 'Tahun angkatan', example: 2021 })
  @IsNumber()
  @Min(2000)
  @Max(2100)
  angkatan: number;
}