import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, UserService } from '@user/index';
import { LogInDto } from './dto/logIn-in.dto';
import { TokenPayload } from './token-payload.interface';
import { HashingService } from './hashing.service';
import { IConfiguration } from 'src/config/configuration';
import { ErrorMessages } from '@common/error-messages.enum';

@Injectable()
export class AuthService {
  private jwtExpirationTime: number;
  private jwtRefreshExpirationTime: string;
  private isProduction: boolean;
  private jwtSecret: string;

  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService<IConfiguration>,
    private readonly jwtService: JwtService,
  ) {
    this.jwtExpirationTime = this.configService.get('jwt.expirationTime', {
      infer: true,
    });

    this.jwtRefreshExpirationTime = this.configService.get(
      'jwt.refreshExpirationTime',
      {
        infer: true,
      },
    );

    this.jwtSecret = this.configService.get('jwt.secret', { infer: true });
    this.isProduction =
      this.configService.get('basic.nodeEnv', { infer: true }) === 'production';
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (
      user &&
      (await this.hashingService.verifyPassword(user.password, password))
    ) {
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
    user.password = await this.hashingService.hashPassword(user.password);
    return this.userService.create(user);
  }

  async getRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: this.jwtRefreshExpirationTime,
    });
    await this.userService.setRefreshToken(refreshToken, userId);
    return refreshToken;
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException(ErrorMessages.INVALID_REFRESH_TOKEN);
    }
    return this.getCookieWithJwtToken(userId);
  }
}
