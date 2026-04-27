import { Column, Entity, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { StudyProgram } from '@/modules/admin/master-data/study-program.entity';
import { BaseModel } from '@/commons/class/base-entity-model';
import { User } from '../../auth/entities/user.entity';
import { StudyClass } from '../../admin/master-data/entities/study-class.entity';
 
export enum MahasiswaStatus {
  AKTIF = 'aktif',
  CUTI = 'cuti',
  LULUS = 'lulus',
  DROP_OUT = 'drop_out',
  MANGKIR = 'mangkir',
}
 
@Entity('student')
export class Student extends BaseModel {
  @OneToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;
 
  @Column({ name: 'user_id', nullable: true })
  userId?: number;
 
  @ManyToOne(() => StudyProgram, { nullable: false, eager: true })
  @JoinColumn({ name: 'program_studi_id' })
  studyProgram: StudyProgram;
 
  @Column({ name: 'program_studi_id' })
  studyProgramId: number;
 
  @ManyToOne(() =>StudyClass, { nullable: true, eager: true })
  @JoinColumn({ name: 'kelas_id' })
  class?: StudyClass;
 
  @Column({ name: 'kelas_id', nullable: true })
  classId?: number;
 
  @Column({ unique: true, length: 20 })
  nim: string;
 
  @Column({ length: 100 })
  name: string;
 
  @Column({ unique: true, length: 150 })
  email: string;
 
  @Column({ name: 'no_hp', nullable: true, length: 20 })
  phone?: string;
 
  @Column({ name: 'tanggal_lahir', type: 'date', nullable: true })
  birthday?: Date;
 
  @Column({ nullable: true, type: 'text' })
  address?: string;
 
  @Column({ nullable: true, length: 50 })
  religion?: string;
 
  @Column({ nullable: true, length: 10 })
  gender?: string;
 
  @Column({
    type: 'enum',
    enum: MahasiswaStatus,
    default: MahasiswaStatus.AKTIF,
  })
  status: MahasiswaStatus;
 
  @Column({ type: 'smallint' })
  angkatan: number;
 
  @Column({ name: 'foto', nullable: true, length: 255 })
  picture?: string;
}