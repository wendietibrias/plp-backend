import { Pagination } from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';

export default async function InsertItemsIntoPaginatedResultFromPassedIds<T>(
  queryBuilder: SelectQueryBuilder<T & { id: string }>,
  paginatedResult: Pagination<T & { id: string }>,
  requiredIds: string[],
) {
  const existingIdsOnPage = new Set(
    paginatedResult.items.map((item) => item.id),
  );

  const missingIdsToFetch = requiredIds.filter(
    (id) => !existingIdsOnPage.has(id),
  );
  if (missingIdsToFetch.length > 0) {
    const fetchedMissingItems = await queryBuilder
      .where(`${queryBuilder.alias}.id IN (:...ids)`, {
        ids: missingIdsToFetch,
      })
      .getMany();

    paginatedResult.items.unshift(...fetchedMissingItems);
  }
}
