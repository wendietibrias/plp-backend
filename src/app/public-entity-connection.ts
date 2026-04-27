import { SchoolYear } from "@/modules/admin/master-data/entities/school-year.entity";
import { StudyProgram } from "../modules/admin/master-data/study-program.entity";
import { StudyClass } from "@/modules/admin/master-data/entities/study-class.entity";
import { Student } from "@/modules/academic/entities/student.entity";

export const publicEntity = [
    StudyProgram,
    SchoolYear,
    StudyClass,
    Student,
];