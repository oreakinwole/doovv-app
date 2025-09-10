import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '@utils/response.manager.utils';

@Injectable()
export class HasInvestBambooAccountMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    const user = req.user; // Assuming the user object is attached by the  JWT
    // console.log(user);
    if (!user || !user?.account || user?.account.length === 0) {
      const _data = {
        message: 'You need to have an investment profile to continue',
        error: true,
        status: HttpStatus.FORBIDDEN,
      };
      return HTTPError.Forbidden(res, _data);
    }

    next();
  }
}
