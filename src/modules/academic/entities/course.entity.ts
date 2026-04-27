import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../../commons/class/base-entity-model';

export enum CourseType {
  MANDATORY = 'mandatory',   // Wajib
  ELECTIVE = 'elective',     // Pilihan
  PRACTICUM = 'practicum',   // Praktikum
}

@Entity('courses')
export class Course extends BaseModel {
  @Column({ name: 'program_studi_id' })
  programStudiId: number;

  @Column({ unique: true, length: 20 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'tinyint' })
  credits: number; // SKS

  @Column({ name: 'semester_to', type: 'tinyint' })
  semesterTo: number; // Semester ke-

  @Column({ type: 'enum', enum: CourseType, default: CourseType.MANDATORY })
  type: CourseType;

  @Column({ nullable: true, type: 'text' })
  description?: string;
}