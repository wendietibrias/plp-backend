import { Module } from "@nestjs/common";
import { StudentService } from "./services/student.service";
import { LectureService } from "./services/lecture.service";
import { LectureController } from "./controllers/lecture.controller";
import { StudentController } from "./controllers/student.controller";

@Module({
    imports:[],
    controllers:[LectureController,StudentController],
    exports:[StudentService,LectureService],
    providers:[StudentService,LectureService]
})
export class AcademicModule{}