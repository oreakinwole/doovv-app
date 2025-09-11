import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      console.log('Token received:', token?.substring(0, 20) + '...');

      // Verify token with explicit secret
      const secret = 'doovo-secret-key';
      const payload = this.jwtService.verify(token, { secret });
      console.log('Token payload:', payload);

      const user = await this.authService.validateUser(payload);
      console.log(
        'User found:',
        user ? { id: user.id, email: user.email } : 'null',
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;
      return true;
    } catch (error) {
      console.error('JWT Auth Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Handle specific JWT errors
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token format');
      }
      if (error.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token not active yet');
      }

      // If it's already an UnauthorizedException, re-throw it
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // For any other error, throw a generic unauthorized
      throw new UnauthorizedException(
        `Authentication failed: ${error.message}`,
      );
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
