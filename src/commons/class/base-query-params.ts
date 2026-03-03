import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ToBoolean } from '../decorators/transformers/to-boolean';
import { ToNumber } from '../decorators/transformers/to-number';
import { ToUpperCase } from '../decorators/transformers/to-upper-case';
import { SortBy } from '../enums/sort-by.enum';

export class BaseQueryParams {
  @IsOptional()
  @IsNumber()
  @ToNumber()
  page = 1;

  @IsOptional()
  @IsNumber()
  @ToNumber()
  limit = 10;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  orderBy: string;

  @IsOptional()
  @IsEnum(SortBy)
  @ToUpperCase()
  sortBy: SortBy;

  @IsOptional()
  @ToBoolean()
  isPaginated: boolean = true;

  @IsOptional()
  @IsArray()
  @Type(() => Array<String>)
  @Transform(({ value }) => value.map((id) => String(id)))
  includedIds: string[];
}
