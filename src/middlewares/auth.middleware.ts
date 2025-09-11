// import {
//   HttpException,
//   HttpStatus,
//   Injectable,
//   NestMiddleware,
// } from '@nestjs/common';
// import { InjectConnection, InjectModel } from '@nestjs/mongoose';
// import * as bcrypt from 'bcrypt';
// import { NextFunction, Request, Response } from 'express';
// import { Connection, Model } from 'mongoose';
// import { NOW } from 'src/constants/app.constants';
// import { User } from 'src/schemas/user.schema';

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   constructor(
//     @InjectConnection() private connection: Connection,
//     @InjectModel(User.name) private userModel: Model<User>,
//   ) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     //check that request is valid
//     const { email, password } = req.body;

//     if (!(email && password)) {
//       throw new HttpException(
//         {
//           message: 'email or password is invalid',
//           statusText: 'error',
//           status: HttpStatus.BAD_REQUEST,
//         },
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     const user = await this.userModel.findOne({
//       email: email,
//     });

//     if (!user) {
//       throw new HttpException(
//         {
//           message: 'email does not exist',
//           statusText: 'error',
//           status: HttpStatus.BAD_REQUEST,
//         },
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     // validate password or deviceid
//     const passwordsMatch = await bcrypt.compare(password, user.password);
//     // throw error if passwords do not match
//     if (!passwordsMatch) {
//       throw new HttpException(
//         {
//           message: `Invalid password`,
//           statusText: 'error',
//           status: HttpStatus.BAD_REQUEST,
//         },
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     //update login date
//     user.lastLogin = NOW();
//     await user.save();

//     //attach user to request
//     req['user'] = user;
//     next();
//   }
// }
