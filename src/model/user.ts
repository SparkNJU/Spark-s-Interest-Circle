// src/app/model/user.ts

import { Provide } from '@midwayjs/core';
import * as bcrypt from 'bcryptjs';

@Provide()
export class UserModel {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
