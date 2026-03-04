import InsertItemsIntoPaginatedResultFromPassedIds from '@/commons/utils/insert-items-into-paginated-result-from-passed-ids';
import { equal, like } from '@/commons/utils/orm';
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
import { CreateUserDto, UpdateUserDto, UserQuery } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: UserQuery) {
    const {
      roleId,
      includedIds,
      isPaginated,
      limit,
      orderBy,
      page,
      search,
      sortBy,
    } = query;

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.role', 'role');

    if (roleId) queryBuilder.andWhere(equal('user.roleId', roleId));

    if (search)
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(like('user.username', search))
            .orWhere(like('user.name', search))
            .orWhere(like('role.name', search));
        }),
      );

    if (orderBy && sortBy) queryBuilder.orderBy(`user.${orderBy}`, sortBy);

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
    const foundUser = await this.userRepository.findOne({
      where: { id },
      relations: {
        role: {
          permissions: true,
        },
      },
    });

    if (!foundUser) throw new NotFoundException('Pengguna tidak ditemukan');
    return { data: foundUser };
  }

  async findByUsername(username: string) {
    const foundUser = await this.userRepository.findOne({
      where: { username },
      relations: {
        role: {
          permissions: true,
        },
      },
      select: {
        id: true,
        password: true,
      },
    });

    return foundUser;
  }

  async create(userData: CreateUserDto) {
    const newUser = this.userRepository.create(userData);

    await newUser.hashPassword();

    return await this.userRepository.manager
      .transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(newUser);
        return {
          message: 'Pengguna berhasil dibuat',
        };
      })
      .catch((error) => {
        this.handleDatabaseError(error);
        throw new Error('Failed to create user');
      });
  }

  async update(id: string, userData: UpdateUserDto) {
    const user = (await this.findOne(id)).data;

    const updatedUser = this.userRepository.merge(user, userData);

    return await this.userRepository.manager
      .transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(updatedUser);
        return {
          message: 'Pengguna berhasil diperbarui',
        };
      })
      .catch((error) => {
        this.handleDatabaseError(error);
        throw new Error('Failed to update user');
      });
  }

  async delete(id: string) {
    const user = (await this.findOne(id)).data;

    return await this.userRepository.manager
      .transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.remove(user);
        return {
          message: 'Pengguna berhasil dihapus',
        };
      })
      .catch((error) => {
        this.handleDatabaseError(error);
        throw new Error('Failed to delete user');
      });
  }

  private async handleDatabaseError(error: any) {
    if (error instanceof HttpException) throw error;

    this.logger.error('Error', error?.stack || error?.message || error);

    if (error?.code)
      switch (error.code) {
        case '23505':
          throw new ConflictException('Username sudah terdaftar');
      }

    throw new InternalServerErrorException('An unexpected error occurred');
  }
}
