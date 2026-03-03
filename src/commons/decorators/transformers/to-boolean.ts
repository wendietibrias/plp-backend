import { Transform, TransformFnParams } from 'class-transformer';

export function ToBoolean() {
  return Transform((v: TransformFnParams) => {
    const str = v.value;
    if (str == 'true' || str == '1') return true;
    return false;
  });
}
