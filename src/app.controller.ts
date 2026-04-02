import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // Health check — excluded from TenantMiddleware
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}