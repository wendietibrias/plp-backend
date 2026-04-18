import { Module } from "@nestjs/common";
import { StudyProgramService } from "./services/study-program.service";
import { StudyProgramController } from "./controllers/study-program.controller";

@Module({ 
    imports: [],
    providers: [StudyProgramService],
    controllers: [StudyProgramController],
    exports: [StudyProgramService]
})
export class MasterDataModule {}