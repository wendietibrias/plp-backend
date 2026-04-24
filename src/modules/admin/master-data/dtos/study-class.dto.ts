import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { BaseQueryParams } from "../../../../commons/class/base-query-params";

export class BaseStudyClassDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;
}

export class CreateStudyClassDto extends BaseStudyClassDto {}

export class UpdateStudyClassDto extends CreateStudyClassDto {}

export class StudyClassQuery extends BaseQueryParams {}