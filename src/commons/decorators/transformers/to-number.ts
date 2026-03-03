import { Transform, TransformFnParams } from 'class-transformer';

export function ToNumber() {
  return Transform((v: TransformFnParams) => {
    if (v.value === null) return v.value; // If the value is null, return it as is.
    const number = Number(v.value);
    if (isNaN(number)) return v.value;
    return number;
  });
}
