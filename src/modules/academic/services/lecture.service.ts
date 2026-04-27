import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Lecture } from '../entities/lecture.entity';
import { CreateLectureDto } from '../dtos/lecture.dto';
import { UpdateDosenDto, FilterDosenDto } from '../dtos/lecture.dto';
import { successResponse } from '../../../commons/utils/response-helper';
import { customPaginate } from '../../../commons/utils/paginate';
import { equal, like } from '../../../commons/utils/orm';


@Injectable()
export class LectureService {
  private readonly logger = new Logger(LectureService.name);

  constructor(
    @InjectRepository(Lecture)
    private readonly dosenRepository: Repository<Lecture>,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  async create(dto: CreateLectureDto) {
    await this.ensureNidnUnique(dto.nidn);
    await this.ensureEmailUnique(dto.email);

    const dosen = this.dosenRepository.create({
      ...dto,
      birthday: dto.birthday ? new Date(dto.birthday) : undefined,
    });

    const saved = await this.dosenRepository.save(dosen);
    this.logger.log(`Dosen baru dibuat: ${saved.nidn} - ${saved.name}`);

    return successResponse(
      await this.findOneOrFail(saved.id),
      'Dosen berhasil ditambahkan',
    );
  }

  // ─── READ ALL ────────────────────────────────────────────────────────────────

  async findAll(filter: FilterDosenDto) {
    const where: FindOptionsWhere<Lecture> = {};

    const { page,limit} = filter;

    const lectureQuery = this.dosenRepository.createQueryBuilder('lecture');
    
    if(filter.status){
        lectureQuery.andWhere(equal('status',status));
    }
 
    if(filter.search){
        lectureQuery.andWhere(like('name',filter.search));
    }
   
    return customPaginate(lectureQuery, { page,limit })
  }

  // ─── READ ONE ────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const dosen = await this.findOneOrFail(id);
    return successResponse(dosen, 'Data dosen berhasil diambil');
  }

  async findByNidn(nidn: string) {
    const dosen = await this.dosenRepository.findOne({
      where: { nidn },
      relations: ['programStudi', 'programStudi.fakultas', 'user'],
    });
    if (!dosen) {
      throw new NotFoundException(`Dosen dengan NIDN ${nidn} tidak ditemukan`);
    }
    return successResponse(dosen, 'Data dosen berhasil diambil');
  }

  // ─── UPDATE ─────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateDosenDto) {
    const dosen = await this.findOneOrFail(id);

    if (dto.nidn && dto.nidn !== dosen.nidn) {
      await this.ensureNidnUnique(dto.nidn, id);
    }
    if (dto.email && dto.email !== dosen.email) {
      await this.ensureEmailUnique(dto.email, id);
    }

    const updated = this.dosenRepository.merge(dosen, {
      ...dto,
      birthday: dto.birthday ? new Date(dto.birthday) : dosen.birthday,
    });

    const saved = await this.dosenRepository.save(updated);
    this.logger.log(`Dosen diperbarui: ${saved.nidn} - ${saved.name}`);

    return successResponse(
      await this.findOneOrFail(saved.id),
      'Data dosen berhasil diperbarui',
    );
  }

  // ─── SOFT DELETE ─────────────────────────────────────────────────────────────

  async remove(id: string) {
    const dosen = await this.findOneOrFail(id);
    await this.dosenRepository.softDelete(id);
    this.logger.log(`Dosen dihapus (soft): ${dosen.nidn} - ${dosen.name}`);
    return successResponse(null, `Dosen ${dosen.name} berhasil dihapus`);
  }

  // ─── RESTORE ─────────────────────────────────────────────────────────────────

  async restore(id: string) {
    const dosen = await this.dosenRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!dosen) {
      throw new NotFoundException(`Dosen dengan ID ${id} tidak ditemukan`);
    }
    if (!dosen.deletedAt) {
      throw new BadRequestException('Dosen ini tidak dalam status terhapus');
    }
    await this.dosenRepository.restore(id);
    return successResponse(null, 'Dosen berhasil dipulihkan');
  }

  // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

  private async findOneOrFail(id: string): Promise<Lecture> {
    const dosen = await this.dosenRepository.findOne({
      where: { id },
      relations: ['programStudi', 'programStudi.fakultas', 'user'],
    });
    if (!dosen) {
      throw new NotFoundException(`Dosen dengan ID ${id} tidak ditemukan`);
    }
    return dosen;
  }

  private async ensureNidnUnique(nidn: string, excludeId?: string) {
    const existing = await this.dosenRepository.findOne({ where: { nidn } });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(`NIDN ${nidn} sudah digunakan`);
    }
  }

  private async ensureEmailUnique(email: string, excludeId?: string) {
    const existing = await this.dosenRepository.findOne({ where: { email } });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(`Email ${email} sudah digunakan`);
    }
  }
}