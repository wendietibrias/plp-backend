import { Column, Entity } from "typeorm";
import { BaseModel } from "../../../../commons/class/base-entity-model";
import { SemesterYearlyTypeEnum } from "../enums/semester-yearly-type.enum";

@Entity()
export class SchoolYear extends BaseModel {
    @Column()
    year: number;

    @Column({ type:'enum', enum:SemesterYearlyTypeEnum,default: SemesterYearlyTypeEnum.GANJIL })
    semesterType: SemesterYearlyTypeEnum;
}