import { applyDecorators, Controller } from '@nestjs/common';
import { UseAuth } from './auth.decorator';

export function ProtectedController(options: {
  path: string;
  version: string;
}) {
  return applyDecorators(Controller(options), UseAuth());
}
