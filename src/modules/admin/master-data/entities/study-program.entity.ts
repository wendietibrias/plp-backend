import {  Column, Entity } from "typeorm";
import { BaseModel } from "../../../../commons/class/base-entity-model";

@Entity()
export class StudyProgram extends BaseModel {
    @Column()
    name: string;

    @Column({ unique:true })
    code: string;
}