import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { customPaginate } from '../../../commons/utils/paginate';
import {
  AcademicAdvisorQuery,
  CreateAcademicAdvisorDto,
  UpdateAcademicAdvisorDto,
} from '../dtos/academic-advisor.dto';
import { AcademicAdvisor } from '../entities/academic-advisor.entity';

@Injectable()
export class AcademicAdvisorService {
  private readonly logger = new Logger(AcademicAdvisorService.name);

  constructor(
    @InjectRepository(AcademicAdvisor)
    private readonly academicAdvisorRepository: Repository<AcademicAdvisor>,
  ) {}

  async findAll(query: AcademicAdvisorQuery) {
    try {
      const { page, limit, search } = query;
      const queryBuilder = this.academicAdvisorRepository
        .createQueryBuilder('academicAdvisor')
        .leftJoinAndSelect('academicAdvisor.lecture', 'lecture')
        .leftJoinAndSelect('academicAdvisor.student', 'student')
        .leftJoinAndSelect('academicAdvisor.schoolYear', 'schoolYear');

      if (search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('lecture.name LIKE :search', {
              search: `%${search}%`,
            })
              .orWhere('lecture.nidn LIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('student.name LIKE :search', {
                search: `%${search}%`,
              })
              .orWhere('student.nim LIKE :search', {
                search: `%${search}%`,
              });
          }),
        );
      }

      return await customPaginate(queryBuilder, { page, limit });
    } catch (err) {
      this.handleError(err);
    }
  }

  async findOne(id: string) {
    try {
      const findDetail = await this.academicAdvisorRepository.findOne({
        where: { id },
        relations: { lecture: true, student: true, schoolYear: true },
      });

      if (!findDetail) {
        throw new NotFoundException('Dosen wali tidak ditemukan');
      }
      return findDetail;
    } catch (err) {
      this.handleError(err);
    }
  }

  async create(createAcademicAdvisorDto: CreateAcademicAdvisorDto) {
    try {
      const academicAdvisor = this.academicAdvisorRepository.create(
        createAcademicAdvisorDto,
      );
      await this.academicAdvisorRepository.save(academicAdvisor);

      return {
        message: 'Berhasil menambahkan dosen wali',
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  async update(id: string, updateAcademicAdvisorDto: UpdateAcademicAdvisorDto) {
    try {
      const findDetail = await this.findOne(id);
      const updated = this.academicAdvisorRepository.create({
        ...findDetail,
        ...updateAcademicAdvisorDto,
      });

      await this.academicAdvisorRepository.save(updated);

      return {
        message: 'Berhasil mengedit dosen wali',
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  async delete(id: string) {
    try {
      await this.findOne(id);
      await this.academicAdvisorRepository.softDelete(id);

      return {
        message: 'Berhasil menghapus dosen wali',
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: any): never {
    if (err instanceof HttpException) throw err;

    this.logger.error('Error in AcademicAdvisorService', err?.stack || err);
    throw new InternalServerErrorException('Internal Server Error');
  }
}