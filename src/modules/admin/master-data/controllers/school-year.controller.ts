import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { UseAuth } from "../../../../commons/decorators/auth.decorator";
import { ApiOkResponse } from "@nestjs/swagger";
import { SchoolYearService } from "../services/school-year.service";
import { CreateSchoolYearDto, SchoolYearQuery, UpdateSchoolYearDto } from "../dtos/school-year.dto";


@UseAuth()
@Controller({ path:"school-year", version:'1' })
export class SchoolYearlyController {
       constructor(
           private readonly schoolYearService: SchoolYearService
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
       async findAll(@Query() schoolYearQuery: SchoolYearQuery) {
           return await this.schoolYearService.findAll(schoolYearQuery);
   
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
           return await this.schoolYearService.findOne(id);
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
       async create(@Body() createSchoolYearDto: CreateSchoolYearDto) {
           return await this.schoolYearService.create(createSchoolYearDto);
       }
   
       @ApiOkResponse({
            schema:{
               example:{
                   message:"Berhasil mengedit kelas"
               }
            }
       })
       @Put(':id')
       async update(@Param('id') id: string, @Body() updateSchoolYearDto: UpdateSchoolYearDto){
           return await this.schoolYearService.update(id,updateSchoolYearDto);
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
           return await this.schoolYearService.delete(id);
       }
   
}