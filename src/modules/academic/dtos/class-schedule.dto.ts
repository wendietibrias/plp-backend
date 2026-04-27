import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  Max,
  IsPositive,
} from 'class-validator';
import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DayOfWeek, ScheduleStatus } from '../entities/class-schedule.entity';
import { BaseQueryParams } from '../../../commons/class/base-query-params';

// ─────────────────────────────────────────────────────────────────────────────
// CREATE DTO
// ─────────────────────────────────────────────────────────────────────────────

export class CreateScheduleDto {
  @ApiProperty({ description: 'Course ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ description: 'Semester ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  semesterId: number;

  @ApiProperty({ description: 'Lecturer (Dosen) ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  lecturerId: number;

  @ApiProperty({ description: 'Class (Kelas) ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  classId: number;

  @ApiProperty({ description: 'Day of week', enum: DayOfWeek, example: DayOfWeek.MONDAY })
  @IsEnum(DayOfWeek, { message: 'Day must be a valid day of week' })
  @IsNotEmpty()
  day: DayOfWeek;

  @ApiProperty({ description: 'Start time (HH:mm)', example: '08:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Start time must be in HH:mm format',
  })
  startTime: string;

  @ApiProperty({ description: 'End time (HH:mm)', example: '09:40' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'End time must be in HH:mm format',
  })
  endTime: string;

  @ApiProperty({ description: 'Room / ruangan', example: 'Lab A-301' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  room: string;

  @ApiPropertyOptional({ description: 'Total scheduled meetings', example: 16, default: 16 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  totalMeetings?: number;

  @ApiPropertyOptional({ description: 'Additional notes', example: 'Hybrid class' })
  @IsOptional()
  @IsString()
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE DTO
// ─────────────────────────────────────────────────────────────────────────────

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  @ApiPropertyOptional({ description: 'Schedule status', enum: ScheduleStatus })
  @IsOptional()
  @IsEnum(ScheduleStatus, { message: 'Invalid schedule status' })
  status?: ScheduleStatus;
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER / QUERY DTO
// ─────────────────────────────────────────────────────────────────────────────

export class FilterScheduleDto extends BaseQueryParams {
  @ApiPropertyOptional({ description: 'Filter by semester ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  semesterId?: number;

  @ApiPropertyOptional({ description: 'Filter by lecturer ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lecturerId?: number;

  @ApiPropertyOptional({ description: 'Filter by class ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  classId?: number;

  @ApiPropertyOptional({ description: 'Filter by course ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  courseId?: number;

  @ApiPropertyOptional({ description: 'Filter by day of week', enum: DayOfWeek })
  @IsOptional()
  @IsEnum(DayOfWeek)
  day?: DayOfWeek;

  @ApiPropertyOptional({ description: 'Filter by status', enum: ScheduleStatus })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;
}