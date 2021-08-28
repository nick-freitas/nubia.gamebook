import {
  CreateGamebookEvent,
  isCreateGamebookEvent,
  isUpdateGamebookEvent,
  isUserCreatedEvent,
  isUserUpdatedEvent,
  Topics,
  UpdateGamebookEvent,
  UserCreatedEvent,
  UserUpdatedEvent,
} from '@indigobit/nubia.common';
import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(Topics.USERS)
  users(
    @Payload() { value }: { value: UserCreatedEvent | UserUpdatedEvent },
  ): any {
    const { type, data, auth } = value;
    if (!type) {
      throw new BadRequestException('Missing "type" in UserEvent');
    }

    console.log(type);

    if (isUserCreatedEvent(value)) {
      return this.appService.userCreatedHandler(
        data as UserCreatedEvent['data'],
      );
    }
    if (isUserUpdatedEvent(value)) {
      return this.appService.userUpdatedHandler(
        data as UserUpdatedEvent['data'],
      );
    }

    console.log(`Ignoring ${type}`);
  }

  @MessagePattern(Topics.GAMEBOOKS)
  gamebooks(
    @Payload() { value }: { value: CreateGamebookEvent | UpdateGamebookEvent },
  ): any {
    const { type, data, auth } = value;
    if (!type) {
      throw new BadRequestException('Missing "type" in UserEvent');
    }

    console.log(type);

    if (isCreateGamebookEvent(value)) {
      return this.appService.createGamebook(
        data as CreateGamebookEvent['data'],
      );
    }
    if (isUpdateGamebookEvent(value)) {
      return this.appService.updateGamebook(
        data as UpdateGamebookEvent['data'],
      );
    }

    console.log(`Ignoring ${type}`);
  }
}
