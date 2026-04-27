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
  CreateSemesterDto,
  SemesterQuery,
  UpdateSemesterDto,
} from '../dtos/semester.dto';
import { SemesterService } from '../services/semester.service';

@ApiTags('Semester - Endpoint')
@ApiBearerAuth('JWT')
@UseAuth()
@Controller({ path: 'semester', version: '1' })
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Get()
  @ApiOkResponse({
    description: 'Endpoint untuk mendapatkan list data Semester',
    schema: {
      example: {
        status: 'success',
        items: [],
        meta: {},
      },
    },
  })
  async findAll(@Query() semesterQuery: SemesterQuery) {
    return await this.semesterService.findAll(semesterQuery);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Endpoint untuk mendapatkan detail data Semester',
    schema: {
      example: {
        message: 'Berhasil mendapatkan data',
        status: 'success',
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return await this.semesterService.findOne(id);
  }

  @Post()
  @ApiOkResponse({
    description: 'Endpoint untuk membuat data Semester',
    schema: {
      example: { message: 'Berhasil menambahkan semester' },
    },
  })
  async create(@Body() createSemesterDto: CreateSemesterDto) {
    return await this.semesterService.create(createSemesterDto);
  }

  @Put(':id')
  @ApiOkResponse({
    schema: { example: { message: 'Berhasil mengedit semester' } },
  })
  async update(
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ) {
    return await this.semesterService.update(id, updateSemesterDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    schema: { example: { message: 'Berhasil menghapus semester' } },
  })
  async delete(@Param('id') id: string) {
    return await this.semesterService.delete(id);
  }
}