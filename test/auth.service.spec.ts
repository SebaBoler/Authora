import { AuthService } from '@auth/auth.service';
import { HashingService } from '@auth/hashing.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@user/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        HashingService,
        ConfigService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'testSecret';
                case 'JWT_EXPIRATION_TIME':
                  return 3600;
                case 'JWT_REFRESH_EXPIRATION_TIME':
                  return '7d';
                case 'NODE_ENV':
                  return 'development';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    hashingService = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should hash password correctly', async () => {
    const password = 'password123';
    const hashedPassword = await hashingService.hashPassword(password);
    expect(hashedPassword).not.toEqual(password);
  });

  it('should validate user correctly', async () => {
    const password = 'password123';
    const hashedPassword = await hashingService.hashPassword(password);
    const isValid = await authService.validateUser(password, hashedPassword);
    expect(isValid).toBeTruthy();
  });
});
