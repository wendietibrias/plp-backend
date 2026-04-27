import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UseAuth } from '../../../commons/decorators/auth.decorator';
import {
  AcademicAdvisorQuery,
  CreateAcademicAdvisorDto,
  UpdateAcademicAdvisorDto,
} from '../dtos/academic-advisor.dto';
import { AcademicAdvisorService } from '../services/academic-advisor.service';

@ApiTags('Academic Advisor (Dosen Wali) - Endpoint')
@ApiBearerAuth('JWT')
@UseAuth()
@Controller({ path: 'academic-advisor', version: '1' })
export class AcademicAdvisorController {
  constructor(
    private readonly academicAdvisorService: AcademicAdvisorService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Endpoint untuk mendapatkan list data Dosen Wali',
    schema: {
      example: { status: 'success', items: [], meta: {} },
    },
  })
  async findAll(@Query() query: AcademicAdvisorQuery) {
    return await this.academicAdvisorService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Endpoint untuk mendapatkan detail data Dosen Wali',
    schema: {
      example: { message: 'Berhasil mendapatkan data', status: 'success' },
    },
  })
  async findOne(@Param('id') id: string) {
    return await this.academicAdvisorService.findOne(id);
  }

  @Post()
  @ApiOkResponse({
    description: 'Endpoint untuk membuat data Dosen Wali',
    schema: { example: { message: 'Berhasil menambahkan dosen wali' } },
  })
  async create(@Body() createAcademicAdvisorDto: CreateAcademicAdvisorDto) {
    return await this.academicAdvisorService.create(createAcademicAdvisorDto);
  }

  @Put(':id')
  @ApiOkResponse({
    schema: { example: { message: 'Berhasil mengedit dosen wali' } },
  })
  async update(
    @Param('id') id: string,
    @Body() updateAcademicAdvisorDto: UpdateAcademicAdvisorDto,
  ) {
    return await this.academicAdvisorService.update(
      id,
      updateAcademicAdvisorDto,
    );
  }

  @Delete(':id')
  @ApiOkResponse({
    schema: { example: { message: 'Berhasil menghapus dosen wali' } },
  })
  async delete(@Param('id') id: string) {
    return await this.academicAdvisorService.delete(id);
  }
}