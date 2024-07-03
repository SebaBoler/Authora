import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, UserService } from '@user/index';
import * as argon2 from 'argon2';
import { LogInDto } from './dto/logIn-in.dto';
import { TokenPayload } from './token-payload.interface';

@Injectable()
export class AuthService {
  private jwtExpirationTime: number;
  private isProduction: boolean;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTime = this.configService.get<number>(
      'JWT_EXPIRATION_TIME',
    );
    this.isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  async login(loginData: LogInDto) {
    const user = await this.validateUser(loginData.email, loginData.password);
    if (!user) {
      return null;
    }
    return user;
  }

  getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);

    let cookieAttributes = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.jwtExpirationTime}`;

    if (this.isProduction) {
      cookieAttributes += '; Secure; SameSite=Lax';
    }

    return cookieAttributes;
  }

  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  async register(user: CreateUserDto) {
    user.password = await argon2.hash(user.password);
    return this.userService.create(user);
  }
}
