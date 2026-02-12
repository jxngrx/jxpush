import { Controller, Post, Body } from '@nestjs/common';
import { PushService } from './push.service';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('send')
  async send(@Body() body: { token: string; title: string; body: string }) {
    return this.pushService.send(body.token, body.title, body.body);
  }
}
