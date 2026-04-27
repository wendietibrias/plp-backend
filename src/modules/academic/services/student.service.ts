import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, ILike, FindOptionsWhere } from 'typeorm';

import { successResponse } from '../../../commons/utils/response-helper';
import { Student } from '../entities/student.entity';
import { CreateStudentDto, FilterStudentDto, UpdateMStudentDto } from '../dtos/student.dto';
import { customPaginate } from '../../../commons/utils/paginate';
import { equal, like } from '../../../commons/utils/orm';


@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  async create(dto: CreateStudentDto) {
    await this.ensureNimUnique(dto.nim);
    await this.ensureEmailUnique(dto.email);

    const Student = this.studentRepository.create({
      ...dto,
      birthday: dto.birthday ? new Date(dto.birthday) : undefined,
    });

    const saved = await this.studentRepository.save(Student);
    this.logger.log(`Student baru dibuat: ${saved.nim} - ${saved.name}`);

    return successResponse(
      await this.findOneOrFail(saved.id),
      'Student berhasil ditambahkan',
    );
  }

  // ─── READ ALL ────────────────────────────────────────────────────────────────

  async findAll(filter: FilterStudentDto) {
    const { page,limit,search,status } = filter;
 
    const studentQuery = this.studentRepository.createQueryBuilder('student');

    if(search){
        studentQuery.andWhere(like('name',search))
    }

    if(status){
        studentQuery.andWhere(equal('status',status))
    }
    return customPaginate(studentQuery,{page,limit});
  }

  // ─── READ ONE ────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const Student = await this.findOneOrFail(id);
    return successResponse(Student, 'Data Student berhasil diambil');
  }

  async findByNim(nim: string) {
    const Student = await this.studentRepository.findOne({
      where: { nim },
      relations: ['programStudi', 'programStudi.fakultas', 'kelas', 'user'],
    });
    if (!Student) {
      throw new NotFoundException(`Student dengan NIM ${nim} tidak ditemukan`);
    }
    return successResponse(Student, 'Data Student berhasil diambil');
  }

  // ─── UPDATE ─────────────────────────────────────────────────────────────────

  async update(id: string, updateStudentDto: UpdateMStudentDto) {
    const Student = await this.findOneOrFail(id);

    if (updateStudentDto.nim && updateStudentDto.nim !== Student.nim) {
      await this.ensureNimUnique(updateStudentDto.nim, id);
    }
    if (updateStudentDto.email && updateStudentDto.email !== Student.email) {
      await this.ensureEmailUnique(updateStudentDto.email, id);
    }

    const updated = this.studentRepository.merge(Student, {
      ...updateStudentDto,
      birthday: updateStudentDto.birthday ? new Date(updateStudentDto.birthday) : Student.birthday,
    });

    const saved = await this.studentRepository.save(updated);
    this.logger.log(`Student diperbarui: ${saved.nim} - ${saved.name}`);

    return successResponse(
      await this.findOneOrFail(saved.id),
      'Data Student berhasil diperbarui',
    );
  }

  // ─── SOFT DELETE ─────────────────────────────────────────────────────────────

  async remove(id: string) {
    const Student = await this.findOneOrFail(id);
    await this.studentRepository.softDelete(id);
    this.logger.log(`Student dihapus (soft): ${Student.nim} - ${Student.name}`);
    return successResponse(null, `Student ${Student.name} berhasil dihapus`);
  }

  // ─── RESTORE ─────────────────────────────────────────────────────────────────

  async restore(id: string) {
    const Student = await this.studentRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!Student) {
      throw new NotFoundException(`Student dengan ID ${id} tidak ditemukan`);
    }
    if (!Student.deletedAt) {
      throw new BadRequestException('Student ini tidak dalam status terhapus');
    }
    await this.studentRepository.restore(id);
    return successResponse(null, 'Student berhasil dipulihkan');
  }

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  private async findOneOrFail(id: string): Promise<Student> {
    const Student = await this.studentRepository.findOne({
      where: { id },
      relations: ['programStudi', 'programStudi.fakultas', 'kelas', 'user'],
    });
    if (!Student) {
      throw new NotFoundException(`Student dengan ID ${id} tidak ditemukan`);
    }
    return Student;
  }

  private async ensureNimUnique(nim: string, excludeId?: string) {
    const existing = await this.studentRepository.findOne({ where: { nim } });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(`NIM ${nim} sudah digunakan`);
    }
  }

  private async ensureEmailUnique(email: string, excludeId?: string) {
    const existing = await this.studentRepository.findOne({ where: { email } });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(`Email ${email} sudah digunakan`);
    }
  }
}