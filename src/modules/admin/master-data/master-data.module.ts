import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudyProgram } from './entities/study-program.entity';
import { StudyProgramService } from "./services/study-program.service";
import { StudyProgramController } from "./controllers/study-program.controller";

@Module({ 
    imports: [
        TypeOrmModule.forFeature([
            StudyProgram
        ]),
    ],
    providers: [StudyProgramService],
    controllers: [StudyProgramController],
    exports: [StudyProgramService]
})
export class MasterDataModule {}