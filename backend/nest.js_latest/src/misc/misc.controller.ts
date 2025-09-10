import {
  Controller,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
  Post,
  Get,
  Param,
  Headers,
  Query,
  Body,
  Res,
  Req,
  Next,
} from '@nestjs/common';
import { HTTPError, Responses } from '@utils/response.manager.utils';
import { NextFunction, Response, Request, query } from 'express';
import { AuthGuard } from 'src/guards/main.guards';
import { MiscService } from './misc.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleCloudService } from './google-cloud.service';
import { Types, ObjectId } from 'mongoose';

interface NextWithError extends NextFunction {
  (err: Error): void;
}
//extend Request object to hold user
declare module 'express' {
  interface Request {
    user?: any;
  }
}

@Controller('misc')
// @UseGuards(AuthGuard)
export class MiscController {
  constructor(
    private miscService: MiscService,
    private readonly googleCloudService: GoogleCloudService,
  ) {}

  @Post('upload/public')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Res() res: Response,
    @Next() next: NextWithError,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        const _data = { error: true, message: 'No file provided' };
        HTTPError.BadRequest(res, _data);
      }

      // Upload the file to Google Cloud Storage and get the public URL
      const publicUrl = await this.googleCloudService.uploadFile(file);

      const _data = {
        message: 'File uploaded Successfully',
        error: false,
        url: publicUrl,
      };

      Responses.Success(res, _data);
    } catch (err) {
      next(err);
    }
  }

  @Get('/migrate/avatar')
  async tes(
    @Res() res: Response,
    @Next() next: NextWithError,
    @Req() req: Request,
  ) {
    try {
      const _data = {}; //await this.miscService.migrateAvater();
      Responses.Success(res, _data);
    } catch (error) {
      next(error);
    }
  }
  @Post('/marketing/register/webhook')
  async marketingWebhook(
    @Res() res: Response,
    @Next() next: NextWithError,
    @Req() req: Request,
    @Body() body: any,
  ) {
    try {
      Responses.Success(res, { message: 'success!', error: false });
      const _data = await this.miscService.marketingRegisterWebhook(body);
    } catch (error) {
      next(error);
    }
  }
  @Get('/marketing/users/list')
  async marketingListUsers(
    @Res() res: Response,
    @Next() next: NextWithError,
    @Req() req: Request,
  ) {
    try {
      const _data = await this.miscService.marketingListUsers();
      Responses.Success(res, _data);
    } catch (error) {
      next(error);
    }
  }
  @Get('/script')
  async script(
    @Res() res: Response,
    @Next() next: NextWithError,
    @Req() req: Request,
  ) {
    try {
      const _data = await this.miscService.sendTestEmail();
      Responses.Success(res, _data);
    } catch (error) {
      next(error);
    }
  }
  @Get('/test')
  async test(
    @Res() res: Response,
    @Next() next: NextWithError,
    @Req() req: Request,
  ) {
    try {
      const _data = await this.miscService.validateNamesWithnin();
      Responses.Success(res, _data);
    } catch (error) {
      next(error);
    }
  }
}
