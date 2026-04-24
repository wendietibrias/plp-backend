import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SchoolYear } from "../entities/school-year.entity";
import { Repository } from "typeorm";
import { CreateSchoolYearDto, SchoolYearQuery, UpdateSchoolYearDto } from "../dtos/school-year.dto";
import { like } from "../../../../commons/utils/orm";
import { customPaginate } from "../../../../commons/utils/paginate";

@Injectable()
export class SchoolYearService {
    constructor(
                @InjectRepository(SchoolYear) private readonly schoolYearRepository: Repository<SchoolYear>
            ){}
            
            async findAll(studyClassQuery: SchoolYearQuery){
                try {
                  const { page,limit,search } = studyClassQuery;
                  const queryBuilder = this.schoolYearRepository.createQueryBuilder('schoolYear');
        
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
                  const findDetail = await this.schoolYearRepository.findOne({
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
        
            async create(createSchoolYearDto: CreateSchoolYearDto){
                try {
                   const createStudyProgram = this.schoolYearRepository.create(createSchoolYearDto);
                   const saveStudyProgram = await this.schoolYearRepository.save(createStudyProgram);
                   if(saveStudyProgram){
                    return{
                        message:"Berhasil menambahkan program studi"
                    }
                   }
        
                } catch(err) {
                    throw new InternalServerErrorException("Internal Server Error");
                }
            }
        
            async update(id: string,updateSchoolYearDto: UpdateSchoolYearDto){
                  try {
                   const findDetail = await this.findOne(id);
                   const createStudyProgram = this.schoolYearRepository.create({
                    ...findDetail,
                    ...updateSchoolYearDto
                   });
        
                   const saveStudyProgram = await this.schoolYearRepository.save(createStudyProgram);
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
                  const deleteStudyProgram = await this.schoolYearRepository.delete(id);
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