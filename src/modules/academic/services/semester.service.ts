import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { customPaginate } from '../../../commons/utils/paginate';
import {
  CreateSemesterDto,
  SemesterQuery,
  UpdateSemesterDto,
} from '../dtos/semester.dto';
import { Semester } from '../entities/semester.entity';

@Injectable()
export class SemesterService {
  private readonly logger = new Logger(SemesterService.name);

  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
  ) {}

  async findAll(semesterQuery: SemesterQuery) {
    try {
      const { page, limit, search } = semesterQuery;
      const queryBuilder = this.semesterRepository
        .createQueryBuilder('semester')
        .leftJoinAndSelect('semester.schoolYear', 'schoolYear');

      if (search) {
        queryBuilder.andWhere('semester.jenis LIKE :search', {
          search: `%${search}%`,
        });
      }

      return await customPaginate(queryBuilder, { page, limit });
    } catch (err) {
      this.handleError(err);
    }
  }

  async findOne(id: string) {
    try {
      const findDetail = await this.semesterRepository.findOne({
        where: { id },
        relations: { schoolYear: true },
      });

      if (!findDetail) {
        throw new NotFoundException('Semester tidak ditemukan');
      }
      return findDetail;
    } catch (err) {
      this.handleError(err);
    }
  }

  async create(createSemesterDto: CreateSemesterDto) {
    try {
      const semester = this.semesterRepository.create(createSemesterDto);
      await this.semesterRepository.save(semester);

      return {
        message: 'Berhasil menambahkan semester',
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  async update(id: string, updateSemesterDto: UpdateSemesterDto) {
    try {
      const findDetail = await this.findOne(id);
      const updated = this.semesterRepository.create({
        ...findDetail,
        ...updateSemesterDto,
      });

      await this.semesterRepository.save(updated);

      return {
        message: 'Berhasil mengedit semester',
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  async delete(id: string) {
    try {
      await this.findOne(id);
      await this.semesterRepository.softDelete(id);

      return {
        message: 'Berhasil menghapus semester',
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: any): never {
    if (err instanceof HttpException) throw err;

    this.logger.error('Error in SemesterService', err?.stack || err);
    throw new InternalServerErrorException('Internal Server Error');
  }
}