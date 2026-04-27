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
import { FilterStudentDto,CreateStudentDto,UpdateMStudentDto } from '../dtos/student.dto';
import { StudentService } from '../services/student.service';

@ApiTags('Student - Endpoint')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('students')
export class StudentController {
  constructor(private readonly mahasiswaService: StudentService) {}

  // ─── POST /mahasiswa ──────────────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tambah mahasiswa baru' })
  @ApiResponse({ status: 201, description: 'Mahasiswa berhasil ditambahkan' })
  @ApiResponse({ status: 409, description: 'NIM atau email sudah digunakan' })
  @ApiResponse({ status: 400, description: 'Data tidak valid' })
  create(@Body() dto: CreateStudentDto) {
    return this.mahasiswaService.create(dto);
  }

  // ─── GET /mahasiswa ────────────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Ambil semua data mahasiswa dengan filter & paginasi' })
  @ApiResponse({ status: 200, description: 'Data mahasiswa berhasil diambil' })
  findAll(@Query() filter: FilterStudentDto) {
    return this.mahasiswaService.findAll(filter);
  }

  // ─── GET /mahasiswa/:id ────────────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail mahasiswa berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID Mahasiswa' })
  @ApiResponse({ status: 200, description: 'Data mahasiswa berhasil diambil' })
  @ApiResponse({ status: 404, description: 'Mahasiswa tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.mahasiswaService.findOne(id);
  }

  // ─── GET /mahasiswa/nim/:nim ───────────────────────────────────────────────
  @Get('nim/:nim')
  @ApiOperation({ summary: 'Cari mahasiswa berdasarkan NIM' })
  @ApiParam({ name: 'nim', description: 'NIM Mahasiswa' })
  @ApiResponse({ status: 200, description: 'Data mahasiswa berhasil diambil' })
  @ApiResponse({ status: 404, description: 'Mahasiswa tidak ditemukan' })
  findByNim(@Param('nim') nim: string) {
    return this.mahasiswaService.findByNim(nim);
  }

  // ─── PATCH /mahasiswa/:id ──────────────────────────────────────────────────
  @Patch(':id')
  @ApiOperation({ summary: 'Update data mahasiswa' })
  @ApiParam({ name: 'id', description: 'ID Mahasiswa' })
  @ApiResponse({ status: 200, description: 'Data mahasiswa berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Mahasiswa tidak ditemukan' })
  @ApiResponse({ status: 409, description: 'NIM atau email sudah digunakan' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMStudentDto,
  ) {
    return this.mahasiswaService.update(id, dto);
  }

  // ─── DELETE /mahasiswa/:id ─────────────────────────────────────────────────
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus mahasiswa (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID Mahasiswa' })
  @ApiResponse({ status: 200, description: 'Mahasiswa berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Mahasiswa tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.mahasiswaService.remove(id);
  }

  // ─── PATCH /mahasiswa/:id/restore ─────────────────────────────────────────
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Pulihkan mahasiswa yang dihapus' })
  @ApiParam({ name: 'id', description: 'ID Mahasiswa' })
  @ApiResponse({ status: 200, description: 'Mahasiswa berhasil dipulihkan' })
  restore(@Param('id') id: string) {
    return this.mahasiswaService.restore(id);
  }
}