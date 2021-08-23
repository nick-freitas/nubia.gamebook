import { Gamebook } from '@indigobit/nubia.common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('gamebooks')
  gamebooks(@Payload() message: Gamebook): any {
    return this.appService.getTest(message);
  }
}
