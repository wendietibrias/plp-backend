import InsertItemsIntoPaginatedResultFromPassedIds from '@/commons/utils/insert-items-into-paginated-result-from-passed-ids';
import { like } from '@/commons/utils/orm';
import { customPaginate } from '@/commons/utils/paginate';
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateRoleDto, RoleQuery, UpdateRoleDto } from '../dtos/role.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(query: RoleQuery) {
    const { includedIds, limit, orderBy, page, search, sortBy } = query;

    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (search)
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(like('role.name', search)).orWhere(
            like('role.description', search),
          );
        }),
      );

    if (orderBy && sortBy) queryBuilder.orderBy(`role.${orderBy}`, sortBy);

    const paginated = await customPaginate(queryBuilder, {
      page,
      limit,
    });

    if (includedIds?.length)
      await InsertItemsIntoPaginatedResultFromPassedIds(
        queryBuilder,
        paginated,
        includedIds,
      );

    return paginated;
  }

  async findOne(id: string) {
    const foundRole = await this.roleRepository.findOne({
      where: { id },
      relations: {
        permissions: true,
      },
    });

    if (!foundRole) throw new NotFoundException('Peran tidak ditemukan');

    return { data: foundRole };
  }

  async create(createRole: CreateRoleDto) {
    const newRole = this.roleRepository.create({
      ...createRole,
      permissions: createRole.permissionIds?.map((permissionId) => ({
        id: permissionId,
      })),
    });

    return await this.roleRepository.manager
      .transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(newRole);
        return {
          message: ' Peran berhasil dibuat',
        };
      })
      .catch((error) => this.handleDatabaseError(error));
  }

  async update(id: string, updateRole: UpdateRoleDto) {
    const foundRole = (await this.findOne(id)).data;

    const updatedRole = this.roleRepository.create({
      ...foundRole,
      ...updateRole,
      permissions: updateRole.permissionIds?.map((permissionId) => ({
        id: permissionId,
      })),
    });

    return await this.roleRepository.manager
      .transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(updatedRole);
        return {
          message: 'Peran berhasil diperbarui',
        };
      })
      .catch((error) => this.handleDatabaseError(error));
  }

  async delete(id: string) {
    const foundRole = (await this.findOne(id)).data;

    return await this.roleRepository.manager
      .transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.remove(foundRole);
        return {
          message: 'Peran berhasil dihapus',
        };
      })
      .catch((error) => this.handleDatabaseError(error));
  }

  private async handleDatabaseError(error: any) {
    if (error instanceof HttpException) throw error;

    this.logger.error('Error', error?.stack || error?.message || error);

    if (error?.code)
      switch (error.code) {
        case '23505':
          throw new ConflictException('Peran sudah terdaftar');
      }

    throw new InternalServerErrorException('An unexpected error occurred');
  }
}
