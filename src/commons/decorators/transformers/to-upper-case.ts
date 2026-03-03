// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';

export function ToUpperCase() {
  return Transform((v: TransformFnParams) => {
    if (!v.value) return null;
    return v.value.toUpperCase();
  });
}
