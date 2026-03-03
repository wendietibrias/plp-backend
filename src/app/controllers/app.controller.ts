import { Controller, Get } from '@nestjs/common';
import type { MessageResponse } from 'src/commons/interfaces/response.interface';

@Controller()
export class AppController {
  @Get()
  serverCheck(): MessageResponse {
    return {
      message: 'Server is running',
    };
  }
}
