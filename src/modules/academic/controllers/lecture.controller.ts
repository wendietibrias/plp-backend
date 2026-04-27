import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LectureService } from '../services/lecture.service';
import { CreateLectureDto,UpdateDosenDto,FilterDosenDto, } from '../dtos/lecture.dto';

@ApiTags('Lecture - Endpoint')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('lectures')
export class LectureController {
  constructor(private readonly dosenService: LectureService) {}

  // ─── POST /dosen ──────────────────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tambah dosen baru' })
  @ApiResponse({ status: 201, description: 'Dosen berhasil ditambahkan' })
  @ApiResponse({ status: 409, description: 'NIDN atau email sudah digunakan' })
  @ApiResponse({ status: 400, description: 'Data tidak valid' })
  create(@Body() dto: CreateLectureDto) {
    return this.dosenService.create(dto);
  }

  // ─── GET /dosen ────────────────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Ambil semua data dosen dengan filter & paginasi' })
  @ApiResponse({ status: 200, description: 'Data dosen berhasil diambil' })
  findAll(@Query() filter: FilterDosenDto) {
    return this.dosenService.findAll(filter);
  }

  // ─── GET /dosen/:id ────────────────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail dosen berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID Dosen' })
  @ApiResponse({ status: 200, description: 'Data dosen berhasil diambil' })
  @ApiResponse({ status: 404, description: 'Dosen tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.dosenService.findOne(id);
  }

  // ─── GET /dosen/nidn/:nidn ─────────────────────────────────────────────────
  @Get('nidn/:nidn')
  @ApiOperation({ summary: 'Cari dosen berdasarkan NIDN' })
  @ApiParam({ name: 'nidn', description: 'NIDN Dosen' })
  @ApiResponse({ status: 200, description: 'Data dosen berhasil diambil' })
  @ApiResponse({ status: 404, description: 'Dosen tidak ditemukan' })
  findByNidn(@Param('nidn') nidn: string) {
    return this.dosenService.findByNidn(nidn);
  }

  // ─── PATCH /dosen/:id ─────────────────────────────────────────────────────
  @Patch(':id')
  @ApiOperation({ summary: 'Update data dosen' })
  @ApiParam({ name: 'id', description: 'ID Dosen' })
  @ApiResponse({ status: 200, description: 'Data dosen berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Dosen tidak ditemukan' })
  @ApiResponse({ status: 409, description: 'NIDN atau email sudah digunakan' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDosenDto,
  ) {
    return this.dosenService.update(id, dto);
  }

  // ─── DELETE /dosen/:id ────────────────────────────────────────────────────
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus dosen (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID Dosen' })
  @ApiResponse({ status: 200, description: 'Dosen berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Dosen tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.dosenService.remove(id);
  }

  // ─── PATCH /dosen/:id/restore ──────────────────────────────────────────────
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Pulihkan dosen yang dihapus' })
  @ApiParam({ name: 'id', description: 'ID Dosen' })
  @ApiResponse({ status: 200, description: 'Dosen berhasil dipulihkan' })
  restore(@Param('id') id: string) {
    return this.dosenService.restore(id);
  }
}