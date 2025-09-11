import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from '../auth.service';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: JwtService, useValue: { verify: jest.fn() } },
        { provide: AuthService, useValue: { validateUser: jest.fn() } },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should allow access with valid token', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'CUSTOMER' as any,
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer valid-token' },
        }),
      }),
    } as any;

    jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: '1' });
    jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
  });
});
