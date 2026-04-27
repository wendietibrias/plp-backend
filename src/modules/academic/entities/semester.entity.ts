import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../commons/class/base-entity-model';
import { SemesterYearlyTypeEnum } from '../../admin/master-data/enums/semester-yearly-type.enum';
import { SchoolYear } from '../../admin/master-data/entities/school-year.entity';

@Entity({ name: 'semesters' })
export class Semester extends BaseModel {
  @Column({ type: 'enum', enum: SemesterYearlyTypeEnum })
  jenis: SemesterYearlyTypeEnum;

  @Column({ type: 'date' })
  tanggalMulai: Date;

  @Column({ type: 'date' })
  tanggalSelesai: Date;

  @Column({ nullable: true })
  schoolYearId: string;

  @ManyToOne(() => SchoolYear, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  schoolYear: SchoolYear;
}