import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SemesterYearlyTypeEnum } from "../enums/semester-yearly-type.enum";
import { BaseQueryParams } from "../../../../commons/class/base-query-params";

export class BaseSchoolYearDto {
    @IsNotEmpty()
    @IsString()
    year: number;

    @IsNotEmpty()
    @IsEnum(SemesterYearlyTypeEnum)
    semester:SemesterYearlyTypeEnum;
}

export class CreateSchoolYearDto extends BaseSchoolYearDto {}

export class UpdateSchoolYearDto extends CreateSchoolYearDto{}

export class SchoolYearQuery extends BaseQueryParams{}