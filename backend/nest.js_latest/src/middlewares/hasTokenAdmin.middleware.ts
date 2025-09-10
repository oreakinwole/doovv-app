import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtPayload } from 'jsonwebtoken'; // Import the JwtPayload type
import { Admin } from 'src/schemas/admin.schema';

@Injectable()
export class HasTokenAdminMiddleware implements NestMiddleware {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token

    if (!token) {
      throw new HttpException(
        { message: 'Token not provided', status: HttpStatus.UNAUTHORIZED },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const decoded = jwt.verify(token, 'myundeuneduedneunedd'); // Replace with your secret

      // Type assertion to ensure decoded is treated as a JwtPayload and not a string
      const payload = decoded as JwtPayload;

      if (payload && payload._id) {
        const user = await this.adminModel.findById(payload._id);
        if (!user) {
          throw new HttpException(
            { message: 'User not found', status: HttpStatus.UNAUTHORIZED },
            HttpStatus.UNAUTHORIZED,
          );
        }

        req['user'] = user; // Attach user to request
        next(); // Proceed to next middleware
      } else {
        throw new HttpException(
          { message: 'Invalid token payload', status: HttpStatus.UNAUTHORIZED },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          message: 'Invalid or expired token',
          status: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
