import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from '../../../commons/class/base-entity-model';
import { Course } from './course.entity';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export enum ScheduleStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('class-schedule')
export class ClassSchedule extends BaseModel {
  // ─── Relations ─────────────────────────────────────────────────────────────

  @ManyToOne(() => Course, { nullable: false, eager: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'course_id' })
  courseId: number;

  @ManyToOne(() => Semester, { nullable: false, eager: true })
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;

  @Column({ name: 'semester_id' })
  semesterId: number;

  // lecturer (dosen) — FK only, entity imported from existing dosen module
  @Column({ name: 'lecturer_id' })
  lecturerId: number;

  // class (kelas) — FK only, entity imported from existing kelas module
  @Column({ name: 'class_id' })
  classId: number;

  // ─── Schedule Info ─────────────────────────────────────────────────────────

  @Column({ type: 'enum', enum: DayOfWeek })
  day: DayOfWeek;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ length: 50 })
  room: string;

  @Column({ name: 'total_meetings', type: 'tinyint', default: 16 })
  totalMeetings: number;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.ACTIVE,
  })
  status: ScheduleStatus;

  @Column({ nullable: true, type: 'text' })
  notes?: string;
}