import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { UseAuth } from "../../../../commons/decorators/auth.decorator";
import { CreateStudyClassDto, StudyClassQuery, UpdateStudyClassDto } from "../dtos/study-class.dto";
import { StudyClassService } from "../services/study-class.service";
import { ApiOkResponse } from "@nestjs/swagger";

@UseAuth()
@Controller({ path:'study-class', version:'1'})
export class StudyClassController {
    constructor(
        private readonly studyClassService: StudyClassService
    ) { }


    @Get()
    @ApiOkResponse({
        description: "Endpoint untuk manipulasi data Kelas",
        schema: {
            example: {
                status: 'success',
                items: [],
                meta: {}
            }
        }
    })
    async findAll(@Query() studyClassQuery: StudyClassQuery) {
        return await this.studyClassService.findAll(studyClassQuery);

    }

    @ApiOkResponse({
        description: "Endpoint untuk manipulasi data Kelas",
        schema: {
            example: {
                message:"Berhasil mendapatkan data",
                status:'success'
            }
        }
    })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.studyClassService.findOne(id);
    }

    @Post()
    @ApiOkResponse({
        description: "Endpoint untuk manipulasi data Kelas",
        schema: {
            example: {
                message:"Berhasil membuat data kelas",
            }
        }
    })
    async create(@Body() createStudyClassDto: CreateStudyClassDto) {
        return await this.studyClassService.create(createStudyClassDto);
    }

    @ApiOkResponse({
         schema:{
            example:{
                message:"Berhasil mengedit kelas"
            }
         }
    })
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateStudyClassDto: UpdateStudyClassDto){
        return await this.studyClassService.update(id,updateStudyClassDto);
    }

    @ApiOkResponse({
         schema:{
             example:{
                 message:"Berhasil menghapus kelas",
             }
         }
    })
    @Delete(':id')
    async delete(@Param('id') id: string){
        return await this.studyClassService.delete(id);
    }

}