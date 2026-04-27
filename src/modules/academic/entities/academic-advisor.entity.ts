import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../commons/class/base-entity-model';
import { SchoolYear } from '../../admin/master-data/entities/school-year.entity';
import { Lecture } from './lecture.entity';
import { Student } from './student.entity';

@Entity({ name: 'academic_advisors' })
export class AcademicAdvisor extends BaseModel {
  @Column()
  lectureId: string;

  @ManyToOne(() => Lecture, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  lecture: Lecture;

  @Column()
  studentId: string;

  @ManyToOne(() => Student, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student: Student;

  @Column()
  schoolYearId: string;

  @ManyToOne(() => SchoolYear, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  schoolYear: SchoolYear;
}