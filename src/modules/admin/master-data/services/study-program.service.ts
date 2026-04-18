import { Injectable, InternalServerErrorException, NotFoundException, Param, ParseIntPipe } from "@nestjs/common";
import { CreateStudyProgramDto, StudyProgramQuery, UpdateStudyProgramDto } from "../dtos/study-program.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { StudyProgram } from "../study-program.entity";
import { Repository } from "typeorm";
import { customPaginate } from "../../../../commons/utils/paginate";
import {  like } from "../../../../commons/utils/orm";

@Injectable()
export class StudyProgramService {
    constructor(
        @InjectRepository(StudyProgram) private readonly studyProgramRepository: Repository<StudyProgram>
    ){}
    
    async findAll(studyProgramQuery: StudyProgramQuery){
        try {
          const { page,limit,search } = studyProgramQuery;
          const queryBuilder = this.studyProgramRepository.createQueryBuilder('studyProgram');

          if(search){
            queryBuilder.andWhere(like('studyProgram.name',search));
          }

          return await customPaginate(queryBuilder, { page,limit })
        } catch(err){
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async findOne(id: string){
        try{
          const findDetail = await this.studyProgramRepository.findOne({
             where:{
                id:id,
             }
          });

          if(!findDetail){
            throw new NotFoundException("Program studi  tidak ditemukan");
          }
          return findDetail;
        } catch(err) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async create(createStudyProgramDto: CreateStudyProgramDto){
        try {
           const createStudyProgram = this.studyProgramRepository.create(createStudyProgramDto);
           const saveStudyProgram = await this.studyProgramRepository.save(createStudyProgram);
           if(saveStudyProgram){
            return{
                message:"Berhasil menambahkan program studi"
            }
           }

        } catch(err) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async update(id: string,updateStudyProgramDto: UpdateStudyProgramDto){
          try {
           const findDetail = await this.findOne(id);
           const createStudyProgram = this.studyProgramRepository.create({
            ...findDetail,
            ...updateStudyProgramDto
           });

           const saveStudyProgram = await this.studyProgramRepository.save(createStudyProgram);
           if(saveStudyProgram){
            return{
                message:"Berhasil mengedit program studi"
            }
           }

        } catch(err) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async delete(id: string){
        try {
          const deleteStudyProgram = await this.studyProgramRepository.delete(id);
          if(deleteStudyProgram){
            return {
                message:"Berhasil menghapus program studi"
            }
          }
        } catch(err) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}