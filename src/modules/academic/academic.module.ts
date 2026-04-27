import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Lecture } from "./entities/lecture.entity";
import { Student } from "./entities/student.entity";
import { Semester } from "./entities/semester.entity";
import { AcademicAdvisor } from "./entities/academic-advisor.entity";
import { ClassSchedule } from "./entities/class-schedule.entity";

import { StudentService } from "./services/student.service";
import { LectureService } from "./services/lecture.service";
import { LectureController } from "./controllers/lecture.controller";
import { StudentController } from "./controllers/student.controller";
import { ClassScheduleService } from "./services/class-schedule.service";
import { ClassScheduleController } from "./controllers/class-schedule.controller";

import { SemesterController } from "./controllers/semester.controller";
import { SemesterService } from "./services/semester.service";
import { AcademicAdvisorController } from "./controllers/academic-advisor.controller";
import { AcademicAdvisorService } from "./services/academic-advisor.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Lecture, Student, Semester, AcademicAdvisor, ClassSchedule]),
    ],  
    controllers:[LectureController,StudentController,SemesterController,ClassScheduleController,AcademicAdvisorController],
    exports:[StudentService,LectureService,SemesterService,ClassScheduleService,AcademicAdvisorService],
    providers:[StudentService,LectureService,SemesterService,ClassScheduleService,AcademicAdvisorService]
})
export class AcademicModule{}