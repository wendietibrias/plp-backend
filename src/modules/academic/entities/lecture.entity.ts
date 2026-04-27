import { Column, Entity, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseModel } from '../../../commons/class/base-entity-model';
import { User } from '../../auth/entities/user.entity';
import { StudyProgram } from '../../admin/master-data/study-program.entity';
 
export enum JabatanFungsional {
  ASISTEN_AHLI = 'asisten_ahli',
  LEKTOR = 'lektor',
  LEKTOR_KEPALA = 'lektor_kepala',
  GURU_BESAR = 'guru_besar',
}
 
export enum PendidikanTerakhir {
  S2 = 'S2',
  S3 = 'S3',
}
 
export enum DosenStatus {
  AKTIF = 'aktif',
  NONAKTIF = 'nonaktif',
  CUTI = 'cuti',
  PENSIUN = 'pensiun',
}
 

@Entity('lecture')
export class Lecture extends BaseModel {
  @OneToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;
 
  @Column({ name: 'user_id', nullable: true })
  userId?: number;
 
  @ManyToOne(() => StudyProgram, { nullable: false, eager: true })
  @JoinColumn({ name: 'study_program_id' })
  studyProgram: StudyProgram;
 
  @Column({ name: 'study_program_id' })
  studyProgramId: number;
 
  @Column({ unique: true, length: 20 })
  nidn: string;
 
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
 
  @Column({ nullable: true, length: 10 })
  gender?: string;
 
  @Column({
    name: 'functional_position',
    type: 'enum',
    enum: JabatanFungsional,
    nullable: true,
  })
  functionalPosition?: JabatanFungsional;
 
  @Column({
    name: 'last_education',
    type: 'enum',
    enum: PendidikanTerakhir,
    nullable: true,
  })
  lastEducation?: PendidikanTerakhir;
 
  @Column({ name: 'bidang_keahlian', nullable: true, length: 150 })
  expert?: string;
 
  @Column({
    type: 'enum',
    enum: DosenStatus,
    default: DosenStatus.AKTIF,
  })
  status: DosenStatus;
 
  @Column({ nullable: true, length: 255 })
  picture?: string;
}
 
