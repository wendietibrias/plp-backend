export interface ServerResponse<T> {
  data: object | T;
  message?: string;
}

export interface AuthResponse<T> {
  data: T;
  accessToken: string;
  refreshToken?: string;
}

export interface MessageResponse {
  message: string;
}
