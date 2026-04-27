import { Module } from "@nestjs/common";
import { StudentService } from "./services/student.service";
import { LectureService } from "./services/lecture.service";
import { LectureController } from "./controllers/lecture.controller";
import { StudentController } from "./controllers/student.controller";
import { ClassScheduleService } from "./services/class-schedule.service";
import { ClassScheduleController } from "./controllers/class-schedule.controller";

@Module({
    imports:[],
    controllers:[LectureController,StudentController,ClassScheduleController],
    exports:[StudentService,LectureService,ClassScheduleService],
    providers:[StudentService,LectureService,ClassScheduleService]
})
export class AcademicModule{}