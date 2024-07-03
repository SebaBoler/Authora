import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { databaseSchema as dbSchema } from '@database/database-schema';
import { DrizzleService } from '@database/drizzle.service';
import { eq } from 'drizzle-orm';
import { UserDto } from './dto/user.dto';
import { ErrorMessages } from '@common/error-messages.enum';

@Injectable()
export class UserService {
  private db;

  constructor(private readonly drizzleService: DrizzleService) {
    this.db = drizzleService.db;
  }

  async findByEmail(email: string) {
    const user = await this.db.query.usersTable.findFirst({
      where: eq(dbSchema.usersTable.email, email),
    });
    return user;
  }

  async findById(userId: string): Promise<UserDto> {
    const user = await this.db
      .select(dbSchema.usersTable)
      .where('id', userId)
      .one();

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async create(user: CreateUserDto): Promise<UserDto> {
    const newUser = await this.db
      .insert(dbSchema.usersTable)
      .values(user)
      .returning('*')
      .one();
    const activationCode = this.generateActivationCode();
    await this.saveActivationCode(newUser.id, activationCode);
    return newUser.pop();
  }

  async update(userId: string, user: Partial<UserDto>) {
    return await this.db
      .update(dbSchema.usersTable)
      .set(user)
      .where('id', userId)
      .returning('*')
      .one();
  }

  async deactivate(userId: number): Promise<void> {
    await this.db
      .update(dbSchema.usersTable)
      .set({ active: false })
      .where('id', userId)
      .execute();
  }

  async storePastPassword(userId: number, password: string): Promise<void> {
    await this.db
      .insert(dbSchema.pastPasswordTable)
      .values({ userId, password })
      .execute();
  }

  async checkPastPasswords(userId: number, password: string): Promise<boolean> {
    const pastPasswords = await this.db
      .select(dbSchema.pastPasswordTable)
      .where('userId', userId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .all();
    return pastPasswords.some((pastPassword) =>
      argon2.verify(pastPassword.password, password),
    );
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.db
      .select(dbSchema.usersTable)
      .where('id', userId)
      .one();
    return user.roles.map((role) => role.name);
  }

  generateActivationCode(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  async saveActivationCode(userId: string, code: string): Promise<void> {
    await this.db
      .insert(dbSchema.activationCodeTable)
      .values({ userId, code })
      .execute();
  }

  async activateUser(code: string): Promise<void> {
    return this.db.transaction(async (tx) => {
      const activationCode = await tx
        .select(dbSchema.activationCodeTable)
        .where('code', code)
        .one();
      if (!activationCode) {
        throw new BadRequestException(ErrorMessages.INVALID_ACTIVATION_CODE);
      }

      if (activationCode) {
        await tx
          .update(dbSchema.usersTable)
          .set({ active: true })
          .where('id', activationCode.userId)
          .execute();
        await tx
          .delete(dbSchema.activationCodeTable)
          .where('id', activationCode.id)
          .execute();
      }
    });
  }

  async setRefreshToken(refreshToken: string, userId: string): Promise<void> {
    await this.db
      .update(dbSchema.usersTable)
      .set({ refreshToken })
      .where('id', userId)
      .execute();
  }
}
