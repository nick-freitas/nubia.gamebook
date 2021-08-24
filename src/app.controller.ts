import {
  GamebookEvent,
  GamebookEventType,
  isCreateGamebookEvent,
  isUpdateGamebookEvent,
  isUserCreatedEvent,
  isUserUpdatedEvent,
  Topics,
  UserEvent,
} from '@indigobit/nubia.common';
import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(Topics.USERS)
  users(@Payload() { value }: { value: UserEvent }): any {
    const { type, data } = value;
    if (!type) {
      throw new BadRequestException('Missing "type" in UserEvent');
    }

    console.log(type);

    if (isUserCreatedEvent(value)) {
      return this.appService.userCreatedHandler(data);
    }
    if (isUserUpdatedEvent(value)) {
      return this.appService.userUpdatedHandler(type, data);
    }

    console.log(`Ignoring ${type}`);
  }

  @MessagePattern(Topics.GAMEBOOKS)
  gamebooks(@Payload() { value }: { value: GamebookEvent }): any {
    const { type, data } = value;
    if (!type) {
      throw new BadRequestException('Missing "type" in UserEvent');
    }

    console.log(type);

    if (isCreateGamebookEvent(value)) {
      return this.appService.createGamebook(data);
    }
    if (isUpdateGamebookEvent(value)) {
      return this.appService.updateGamebook(data);
    }

    console.log(`Ignoring ${type}`);
  }
}
