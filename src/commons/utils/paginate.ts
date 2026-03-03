import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
  Pagination,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/**
 * customPagination Fuction for oneToMany Relations due to library limitation
 */
export async function customPaginate<
  T extends ObjectLiteral,
  CustomMetaType = IPaginationMeta,
>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>,
  skipCount = false,
): Promise<Pagination<T>> {
  if (skipCount) {
    return paginateNoCount<T>(queryBuilder, options as IPaginationOptions);
  }
  const totalItems = await queryBuilder.getCount();
  const pagination = await paginate<T>(queryBuilder, {
    page: options.page,
    limit: options.limit,
    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
    countQueries: false,
    metaTransformer: (meta) => {
      return {
        currentPage: meta.currentPage,
        itemCount: meta.itemCount,
        itemsPerPage: meta.itemsPerPage,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / +options.limit),
      };
    },
  });

  return {
    items: pagination.items,
    meta: pagination.meta,
  };
}

export async function paginateNoCount<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>> {
  const pagination = await paginate<T>(queryBuilder, {
    page: options.page,
    limit: options.limit,
    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
    countQueries: false,
  });

  return {
    items: pagination.items,
    meta: pagination.meta,
  };
}
