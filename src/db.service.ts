import { Gamebook, User } from '@indigobit/nubia.common';
import { Injectable } from '@nestjs/common';

// Use JSON file for storage
export type DbData = {
  users: User[];
  gamebooks: Gamebook[];
};

@Injectable()
export class DBService {
  readonly db: { data: DbData };

  get users() {
    return this.db.data.users;
  }

  get gamebooks() {
    return this.db.data.gamebooks;
  }

  constructor() {
    this.db = { data: { users: [], gamebooks: [] } };
  }
}
