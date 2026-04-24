import {  Column, Entity } from "typeorm";
import { BaseModel } from "../../../../commons/class/base-entity-model";

@Entity()
export class StudyClass extends BaseModel {
    @Column()
    name: string;

    @Column({ unique:true })
    code: string;
}