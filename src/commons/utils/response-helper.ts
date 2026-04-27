export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function successResponse<T>(
  data: T,
  message = 'Berhasil',
  meta?: PaginationMeta,
): ApiResponse<T> {
  return { success: true, message, data, ...(meta && { meta }) };
}

export function errorResponse(message: string): ApiResponse<null> {
  return { success: false, message };
}