import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { BaseQueryParams } from "../../../../commons/class/base-query-params";

export class BaseStudyProgramDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;
}

export class CreateStudyProgramDto extends BaseStudyProgramDto {}

export class UpdateStudyProgramDto extends CreateStudyProgramDto {}

export class StudyProgramQuery extends BaseQueryParams {}