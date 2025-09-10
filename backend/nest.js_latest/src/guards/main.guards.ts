// import {
//   CanActivate,
//   ExecutionContext,
//   HttpException,
//   HttpStatus,
//   Injectable,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Reflector } from '@nestjs/core';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
// import { User } from 'src/schemas/user.schema';
// import { IS_PUBLIC_KEY } from './public.decorator';
// import { HTTPError, Responses } from '@utils/response.manager.utils';
// import { Admin } from 'src/schemas/admin.schema';

// @Injectable()
// export default class MainGuard implements CanActivate {
//   constructor(private readonly jwtService: JwtService) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();

//     if (!request.headers.authorization)
//       throw new HttpException(
//         {
//           message: 'Authorization required to access this resource',
//           statusText: 'error',
//           status: HttpStatus.BAD_REQUEST,
//         },
//         HttpStatus.BAD_REQUEST,
//       );

//     const token = request.headers.authorization.split(' ')[1];
//     if (!token)
//       throw new HttpException(
//         {
//           message: 'Invalid authorization token',
//           statusText: 'error',
//           status: HttpStatus.UNAUTHORIZED,
//         },
//         HttpStatus.UNAUTHORIZED,
//       );

//     return true;
//   }
// }

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private readonly jwtService: JwtService,
//     @InjectModel(User.name) private readonly userModel: Model<User>,
//     private reflector: Reflector,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const action = 'logout';

//     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (isPublic) {
//       return true; // Skip authentication if the route is public
//     }

//     const request = context.switchToHttp().getRequest();
//     const res = context.switchToHttp().getResponse();

//     try {
//       //check if auth header exists
//       if (!request.headers.authorization) {
//         const _data = {
//           message: 'Authorization token not found',
//           error: true,
//           status: HttpStatus.UNAUTHORIZED,
//           action,
//         };
//         HTTPError.Unauthorized(res, _data);
//         return false;
//       }


//       //get token from request, decodedToken
//       const token = request.headers.authorization.split(' ')[1];
//       if (!token) {
//         const _data = {
//           message: 'Invalid authorization token',
//           error: true,
//           status: HttpStatus.UNAUTHORIZED,
//           action,
//         };
//         HTTPError.Unauthorized(res, _data);
//         return false;
//       }

//       //decode token
//       const decodedToken = this.jwtService.verify(token);

//       //get user
//       const findUser = await this.userModel.findById(
//         decodedToken?._id || decodedToken?.id,
//       );

//       if (!findUser) {
//         //   throw new HttpException(
//         //     {
//         //       message: 'Failed to verify user or user no longer exist',
//         //       statusText: 'error',
//         //       status: HttpStatus.UNAUTHORIZED,
//         //     },
//         //     HttpStatus.UNAUTHORIZED,
//         //   );

//         const _data = {
//           message: 'Failed to verify user or user no longer exist',
//           error: true,
//           action,
//           status: HttpStatus.UNAUTHORIZED,
//         };
//         HTTPError.Unauthorized(res, _data);
//         return false;
//       }

//       //attach user to request
//       request['user'] = findUser;

//       return true;
//     } catch (error) {
//       if (error.name === 'TokenExpiredError') {
//         // error: 'Unauthorized',
//         const _data = {
//           message: 'Token has expired',
//           error: true,
//           action,
//           status: HttpStatus.UNAUTHORIZED,
//         };
//         HTTPError.Unauthorized(res, _data);
//         return false;
//       } else if (error.name === 'JsonWebTokenError') {
//         const _data = {
//           message: 'Invalid token',
//           error: true,
//           action,
//           status: HttpStatus.UNAUTHORIZED,
//         };
//         HTTPError.Unauthorized(res, _data);
//         return false;
//       } else {
//         const _data = {
//           message: 'Unauthorized',
//           error: true,
//           action,
//           status: HttpStatus.UNAUTHORIZED,
//         };
//         HTTPError.Unauthorized(res, _data);
//         return false;
//       }
//       return false; // Block access
//     }
//   }
// }

// @Injectable()
// export class AdminGuard implements CanActivate {
//   constructor(
//     private readonly jwtService: JwtService,
//     @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
//     private reflector: Reflector,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const action = 'logout';

//     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (isPublic) {
//       return true; // Skip authentication if the route is public
//     }

//     const request = context.switchToHttp().getRequest();
//     const res = context.switchToHttp().getResponse();

//     try {
//       //check if auth header exists
//       if (!request.headers.authorization) {
//         const _data = {
//           message: 'Authorization token not found',
//           error: true,
//           status: HttpStatus.UNAUTHORIZED,
//           action,
//         };
//         HTTPError.Unauthorized(res, _data);
//         return false;
//       }

//       //get token from request, decodedToken
//       const token = request.headers.authorization.split(' ')[1];
//       if (!token) {
//         const _data = {
//           message: 'Invalid authorization token',
//           error: true,
//           status: HttpStatus.UNAUTHORIZED,
//           action,
//         };
//         HTTPError.Unauthorized(res, _data);
//         return false;
//       }

//       //decode token
//       const decodedToken = this.jwtService.verify(token);

//       //get user
//       const admin = await this.adminModel.findById(
//         decodedToken?._id || decodedToken?.id,
//       );

//       if (!admin) {
//         HTTPError.Unauthorized(res, {
//           message: 'Failed to verify admin or admin no longer exist',
//           error: true,
//           action,
//           status: HttpStatus.UNAUTHORIZED,
//         });
//         return false;
//       }

//       //attach user to request
//       request['admin'] = admin;

//       return true;
//     } catch (error) {
//       if (error.name === 'TokenExpiredError') {
//         // error: 'Unauthorized',
//         const _data = {
//           message: 'Token has expired',
//           error: true,
//           action,
//           status: HttpStatus.UNAUTHORIZED,
//         };
//         HTTPError.Unauthorized(res, _data);
//         return false;
//       } else if (error.name === 'JsonWebTokenError') {
//         const _data = {
//           message: 'Invalid token',
//           error: true,
//           action,
//           status: HttpStatus.UNAUTHORIZED,
//         };
//         HTTPError.Unauthorized(res, _data);
//         return false;
//       } else {
//         const _data = {
//           message: 'Unauthorized',
//           error: true,
//           action,
//           status: HttpStatus.UNAUTHORIZED,
//         };
//         HTTPError.Unauthorized(res, _data);
//         return false;
//       }
//       return false; // Block access
//     }
//   }
// }
