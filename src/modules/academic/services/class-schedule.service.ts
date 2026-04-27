
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  CreateScheduleDto,
  FilterScheduleDto,
  UpdateScheduleDto
} from '../dtos/class-schedule.dto';
import { ClassSchedule, ScheduleStatus } from '../entities/class-schedule.entity';
import { successResponse } from '../../../commons/utils/response-helper';
import { customPaginate } from '../../../commons/utils/paginate';
import { like } from '../../../commons/utils/orm';

@Injectable()
export class ClassScheduleService {
  private readonly logger = new Logger(ClassScheduleService.name);

  constructor(
    @InjectRepository(ClassSchedule)
    private readonly ClassScheduleRepository: Repository<ClassSchedule>,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  async create(dto: CreateScheduleDto) {
    await this.checkTimeConflict(dto);

    const ClassSchedule = this.ClassScheduleRepository.create(dto);
    const saved = await this.ClassScheduleRepository.save(ClassSchedule);

    this.logger.log(
      `ClassSchedule created: ID ${saved.id} | Course ${saved.courseId} | ${saved.day} ${saved.startTime}-${saved.endTime}`,
    );

    return successResponse(
      await this.findOneOrFail(saved.id),
      'ClassSchedule created successfully',
    );
  }

  // ─── READ ALL ────────────────────────────────────────────────────────────────

  async findAll(filter: FilterScheduleDto) {
    const classScheduleQueryBuilder = this.ClassScheduleRepository.createQueryBuilder('classSchedule');

    const { page,limit,search,} = filter;

    if(search){
        classScheduleQueryBuilder.andWhere(like('name',search));
    }
    

    return customPaginate(classScheduleQueryBuilder, { page,limit });

  }

  // ─── READ ONE ────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const ClassSchedule = await this.findOneOrFail(id);
    return successResponse(ClassSchedule, 'ClassSchedule retrieved successfully');
  }

  // ─── ClassSchedule BY LECTURER ─────────────────────────────────────────────────

  async findByLecturer(lecturerId: number, semesterId?: number) {
    const where: FindOptionsWhere<ClassSchedule> = { lecturerId };
    if (semesterId) where.semesterId = semesterId;

    const ClassSchedules = await this.ClassScheduleRepository.find({
      where,
      relations: ['course', 'semester'],
      order: { day: 'ASC', startTime: 'ASC' },
    });

    return successResponse(ClassSchedules, 'Lecturer ClassSchedules retrieved successfully');
  }

  // ─── ClassSchedule BY CLASS ───────────────────────────────────────────────────

  async findByClass(classId: number, semesterId?: number) {
    const where: FindOptionsWhere<ClassSchedule> = { classId };
    if (semesterId) where.semesterId = semesterId;

    const ClassSchedules = await this.ClassScheduleRepository.find({
      where,
      relations: ['course', 'semester'],
      order: { day: 'ASC', startTime: 'ASC' },
    });

    return successResponse(ClassSchedules, 'Class ClassSchedules retrieved successfully');
  }

  // ─── UPDATE ─────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateScheduleDto) {
    const ClassSchedule = await this.findOneOrFail(id);

    // Re-check time conflict if time/day/room changes
    const needsConflictCheck =
      dto.day !== undefined ||
      dto.startTime !== undefined ||
      dto.endTime !== undefined ||
      dto.room !== undefined ||
      dto.classId !== undefined ||
      dto.lecturerId !== undefined;

    if (needsConflictCheck) {
      await this.checkTimeConflict(
        {
          day: dto.day ?? ClassSchedule.day,
          startTime: dto.startTime ?? ClassSchedule.startTime,
          endTime: dto.endTime ?? ClassSchedule.endTime,
          room: dto.room ?? ClassSchedule.room,
          classId: dto.classId ?? ClassSchedule.classId,
          lecturerId: dto.lecturerId ?? ClassSchedule.lecturerId,
          semesterId: dto.semesterId ?? ClassSchedule.semesterId,
          courseId: dto.courseId ?? ClassSchedule.courseId,
        },
        id,
      );
    }

    const updated = this.ClassScheduleRepository.merge(ClassSchedule, dto);
    const saved = await this.ClassScheduleRepository.save(updated);

    this.logger.log(`ClassSchedule updated: ID ${saved.id}`);

    return successResponse(
      await this.findOneOrFail(saved.id),
      'ClassSchedule updated successfully',
    );
  }

  // ─── CANCEL ──────────────────────────────────────────────────────────────

  async cancel(id: string, reason?: string) {
    const ClassSchedule = await this.findOneOrFail(id);

    if (ClassSchedule.status === ScheduleStatus.CANCELLED) {
      throw new BadRequestException('ClassSchedule is already cancelled');
    }
    if (ClassSchedule.status === ScheduleStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed ClassSchedule');
    }

    ClassSchedule.status = ScheduleStatus.CANCELLED;
    if (reason) ClassSchedule.notes = reason;

    await this.ClassScheduleRepository.save(ClassSchedule);
    return successResponse(null, 'ClassSchedule cancelled successfully');
  }

  // ─── DELETE ──────────────────────────────────────────────────────────────

  async remove(id: string) {
    const ClassSchedule = await this.findOneOrFail(id);
    await this.ClassScheduleRepository.softDelete(id);
    this.logger.log(`ClassSchedule soft-deleted: ID ${id}`);
    return successResponse(null, `ClassSchedule ID ${id} deleted successfully`);
  }

  // ─── RESTORE ─────────────────────────────────────────────────────────────

  async restore(id: string) {
    const ClassSchedule = await this.ClassScheduleRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!ClassSchedule) throw new NotFoundException(`ClassSchedule with ID ${id} not found`);
    if (!ClassSchedule.deletedAt) throw new BadRequestException('ClassSchedule is not deleted');

    await this.ClassScheduleRepository.restore(id);
    return successResponse(null, 'ClassSchedule restored successfully');
  }

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  private async findOneOrFail(id: string): Promise<ClassSchedule> {
    const ClassSchedule = await this.ClassScheduleRepository.findOne({
      where: { id },
      relations: ['course', 'semester'],
    });
    if (!ClassSchedule) {
      throw new NotFoundException(`ClassSchedule with ID ${id} not found`);
    }
    return ClassSchedule;
  }

  /**
   * Check if there is a time conflict for:
   * 1. Same room at the same day & time in the same semester
   * 2. Same lecturer at the same day & time in the same semester
   * 3. Same class at the same day & time in the same semester
   */
  private async checkTimeConflict(
    dto: Pick<
      CreateScheduleDto,
      'day' | 'startTime' | 'endTime' | 'room' | 'classId' | 'lecturerId' | 'semesterId' | 'courseId'
    >,
    excludeId?: string,
  ) {
    const existingClassSchedules = await this.ClassScheduleRepository
      .createQueryBuilder('s')
      .where('s.semester_id = :semesterId', { semesterId: dto.semesterId })
      .andWhere('s.day = :day', { day: dto.day })
      .andWhere('s.status != :cancelled', { cancelled: ScheduleStatus.CANCELLED })
      .andWhere('s.deleted_at IS NULL')
      .andWhere(
        // Overlapping time: existing.start < new.end AND existing.end > new.start
        '(s.start_time < :endTime AND s.end_time > :startTime)',
        { startTime: dto.startTime, endTime: dto.endTime },
      )
      .getMany();

    const conflicts = existingClassSchedules.filter((s) => s.id !== excludeId);

    for (const conflict of conflicts) {
      if (conflict.room === dto.room) {
        throw new ConflictException(
          `Room "${dto.room}" is already booked on ${dto.day} from ${conflict.startTime} to ${conflict.endTime}`,
        );
      }
      if (conflict.lecturerId === dto.lecturerId) {
        throw new ConflictException(
          `Lecturer ID ${dto.lecturerId} already has a class on ${dto.day} from ${conflict.startTime} to ${conflict.endTime}`,
        );
      }
      if (conflict.classId === dto.classId) {
        throw new ConflictException(
          `Class ID ${dto.classId} already has a ClassSchedule on ${dto.day} from ${conflict.startTime} to ${conflict.endTime}`,
        );
      }
    }
  }
}