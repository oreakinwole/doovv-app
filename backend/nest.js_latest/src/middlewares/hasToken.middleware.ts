import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtPayload } from 'jsonwebtoken'; // Import the JwtPayload type
import { BadRequestApiException } from '@utils/response.manager.utils';

@Injectable()
export class HasTokenMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwt: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token
    const action = 'logout';

    if (!token) {
      throw new HttpException(
        {
          message: 'Token not provided',
          action,
          status: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const decoded = this.jwt.verify(token); // Replace with your secret

      // Type assertion to ensure decoded is treated as a JwtPayload and not a string
      const payload = decoded as JwtPayload;

      if (payload && payload._id) {
        const user = await this.userModel.findById(payload._id);
        if (!user) {
          throw new BadRequestApiException({
            message: 'User not found',
            action,
            status: HttpStatus.UNAUTHORIZED,
          });
        }

        req['user'] = user; // Attach user to request
        next(); // Proceed to next middleware
      } else {
        throw new BadRequestApiException({
          message: 'Invalid token payload',
          action,
          status: HttpStatus.UNAUTHORIZED,
        });
      }
    } catch (error) {
      throw new BadRequestApiException({
        action,
        message: 'Invalid or expired token',
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }
}
