import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { UseAuth } from "../../../../commons/decorators/auth.decorator";
import { StudyProgramService } from "../services/study-program.service";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateStudyProgramDto, StudyProgramQuery, UpdateStudyProgramDto } from "../dtos/study-program.dto";

@ApiTags("Study Program - Endpoint")
@ApiBearerAuth('JWT')
@UseAuth()
@Controller({ path: 'study-program', version: '1' })
export class StudyProgramController {
    constructor(
        private readonly studyProgramService: StudyProgramService
    ) { }


    @Get()
    @ApiOkResponse({
        description: "Endpoint untuk manipulasi data program studi",
        schema: {
            example: {
                status: 'success',
                items: [],
                meta: {}
            }
        }
    })
    async findAll(@Query() studyProgramQuery: StudyProgramQuery) {
        return await this.studyProgramService.findAll(studyProgramQuery);

    }

    @ApiOkResponse({
        description: "Endpoint untuk manipulasi data program studi",
        schema: {
            example: {}
        }
    })

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.studyProgramService.findOne(id);
    }

    @Post()
    @ApiOkResponse({
        description: "Endpoint untuk manipulasi data program studi",
        schema: {
            example: {
                message:""
            }
        }
    })
    async create(@Body() createStudyProgramDto: CreateStudyProgramDto) {
        return await this.studyProgramService.create(createStudyProgramDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateStudyProgramDto: UpdateStudyProgramDto){
        return await this.studyProgramService.update(id,updateStudyProgramDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string){
        return await this.studyProgramService.delete(id);
    }

}