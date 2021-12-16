import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('healthEndpoint')
  getHello(): string {
    return 'OK';
  }
}
