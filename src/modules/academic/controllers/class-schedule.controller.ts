import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  FilterScheduleDto,
} from '../dtos/class-schedule.dto';
import { ClassScheduleService } from '../services/class-schedule.service';

@ApiTags('Schedule')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('schedules')
export class ClassScheduleController {
  constructor(private readonly scheduleService: ClassScheduleService) {}

  // ─── POST /schedules ──────────────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new class schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  @ApiResponse({ status: 409, description: 'Time conflict detected (room / lecturer / class)' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto);
  }

  // ─── GET /schedules ───────────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Get all schedules with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Schedules retrieved successfully' })
  findAll(@Query() filter: FilterScheduleDto) {
    return this.scheduleService.findAll(filter);
  }

  // ─── GET /schedules/:id ───────────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Get schedule detail by ID' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({ status: 200, description: 'Schedule retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  // ─── GET /schedules/lecturer/:lecturerId ──────────────────────────────────
  @Get('lecturer/:lecturerId')
  @ApiOperation({ summary: 'Get all schedules by lecturer' })
  @ApiParam({ name: 'lecturerId', description: 'Lecturer (Dosen) ID' })
  @ApiQuery({ name: 'semesterId', required: false, description: 'Filter by semester' })
  @ApiResponse({ status: 200, description: 'Lecturer schedules retrieved successfully' })
  findByLecturer(
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
    @Query('semesterId') semesterId?: number,
  ) {
    return this.scheduleService.findByLecturer(lecturerId, semesterId);
  }

  // ─── GET /schedules/class/:classId ────────────────────────────────────────
  @Get('class/:classId')
  @ApiOperation({ summary: 'Get all schedules by class' })
  @ApiParam({ name: 'classId', description: 'Class (Kelas) ID' })
  @ApiQuery({ name: 'semesterId', required: false, description: 'Filter by semester' })
  @ApiResponse({ status: 200, description: 'Class schedules retrieved successfully' })
  findByClass(
    @Param('classId', ParseIntPipe) classId: number,
    @Query('semesterId') semesterId?: number,
  ) {
    return this.scheduleService.findByClass(classId, semesterId);
  }

  // ─── PATCH /schedules/:id ─────────────────────────────────────────────────
  @Patch(':id')
  @ApiOperation({ summary: 'Update schedule data' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  @ApiResponse({ status: 409, description: 'Time conflict detected' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(id, dto);
  }

  // ─── PATCH /schedules/:id/cancel ──────────────────────────────────────────
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({ status: 200, description: 'Schedule cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Schedule already cancelled or completed' })
  cancel(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.scheduleService.cancel(id, reason);
  }

  // ─── DELETE /schedules/:id ────────────────────────────────────────────────
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }

  // ─── PATCH /schedules/:id/restore ────────────────────────────────────────
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a deleted schedule' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({ status: 200, description: 'Schedule restored successfully' })
  restore(@Param('id') id: string) {
    return this.scheduleService.restore(id);
  }
}