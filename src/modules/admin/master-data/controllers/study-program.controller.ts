import { Controller, Get, Query } from "@nestjs/common";
import { UseAuth } from "../../../../commons/decorators/auth.decorator";
import { StudyProgramService } from "../services/study-program.service";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Study Program - Endpoint")
@ApiBearerAuth('JWT')
@UseAuth()
@Controller({ path:'study-program', version:'1' })
export class StudyProgramController {
    constructor(
        private readonly studyProgramService: StudyProgramService
    ){}


    @Get()
    @ApiOkResponse({
         description:"Endpoint untuk manipulasi data program studi",
         schema: {
            example: {
                 status: 'success',
                 items: [],
                 meta: {}
            }
         }
    })
    async findAll(@Query()){}
}