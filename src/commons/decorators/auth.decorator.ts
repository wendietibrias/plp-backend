import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function UseAuth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
