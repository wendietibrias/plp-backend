import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { customPaginate } from "../../../../commons/utils/paginate";
import { like } from "../../../../commons/utils/orm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateStudyClassDto, StudyClassQuery, UpdateStudyClassDto } from "../dtos/study-class.dto";
import { StudyClass } from "../entities/study-class.entity";

@Injectable()
export class StudyClassService {
     constructor(
            @InjectRepository(StudyClass) private readonly studyProgramRepository: Repository<StudyClass>
        ){}
        
        async findAll(studyClassQuery: StudyClassQuery){
            try {
              const { page,limit,search } = studyClassQuery;
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
    
        async create(createStudyClassDto: CreateStudyClassDto){
            try {
               const createStudyProgram = this.studyProgramRepository.create(createStudyClassDto);
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
    
        async update(id: string,updateStudyClassDto: UpdateStudyClassDto){
              try {
               const findDetail = await this.findOne(id);
               const createStudyProgram = this.studyProgramRepository.create({
                ...findDetail,
                ...updateStudyClassDto
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