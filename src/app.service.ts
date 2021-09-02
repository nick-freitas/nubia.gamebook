import {
  CreateGamebookEvent,
  Gamebook,
  OutOfOrderEventException,
  UpdateGamebookEvent,
  User,
  UserCreatedEvent,
  UserEventType,
  UserUpdatedEvent,
} from '@indigobit/nubia.common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DBService } from './db.service';

@Injectable()
export class AppService {
  constructor(private readonly dBService: DBService) {}

  async createGamebook(data: CreateGamebookEvent['data']): Promise<Gamebook> {
    if (!data.id) {
      throw new Error('Missing Id');
    }

    const gamebook: Gamebook = { ...data, version: 1 };

    this.dBService.gamebooks.push({ ...gamebook });

    return gamebook;
  }

  async updateGamebook(data: UpdateGamebookEvent['data']): Promise<Gamebook> {
    if (!data.id) {
      throw new Error('Missing Id');
    }

    const index = this.dBService.gamebooks.findIndex(
      (gamebook) => gamebook.id === data.id,
    );
    if (index === -1)
      throw new BadRequestException('Bad Id in Gamebook Update Request');

    const gb = { ...this.dBService.gamebooks[index], ...data };
    gb.version += 1;
    this.dBService.gamebooks[index] = gb;

    return gb;
  }

  async userCreatedHandler(data: UserCreatedEvent['data']): Promise<User> {
    const { fullName, id, email, version, roles } = data;

    if (!email) {
      throw new Error('Missing Email');
    }
    if (!fullName) {
      throw new Error('Missing Full Name');
    }
    if (!id) {
      throw new Error('Missing Id');
    }

    const user: User = {
      id: id,
      email: email,
      fullName: fullName,
      version: version,
      roles: roles,
    };

    this.dBService.users.push({ ...user });

    return user;
  }

  async userUpdatedHandler(data: UserUpdatedEvent['data']): Promise<User> {
    const { fullName, id, version } = data;

    if (!id) {
      throw new Error('Missing Id');
    }

    const index = this.dBService.users.findIndex(
      (user) => user.id === id && user.active === true,
    );
    if (index === -1)
      throw new BadRequestException('Bad Id in User Update Request');

    const user = { ...this.dBService.users[index] };
    if (user.version !== version - 1)
      throw new OutOfOrderEventException(
        UserEventType.USER_UPDATED,
        user.version - 1,
        version,
      );

    user.fullName = fullName;
    user.version = version;
    this.dBService.users[index] = { ...user };

    return user;
  }
}
