import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import * as multer from 'multer'; // Import multer
import { MulterModule } from '@nestjs/platform-express';
import { MiscController } from './misc.controller';
import { MiscService } from './misc.service';
import { GoogleCloudService } from './google-cloud.service';
import { MailService } from 'src/mail/mail.service';
import { WinstonLoggerService } from 'src/logger/logger.service';
import {
  MarketingUsers,
  MarketingUsersSchema,
} from 'src/schemas/marketing.users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MarketingUsers.name, schema: MarketingUsersSchema },
    ]),
    MulterModule.register({
      storage: multer.memoryStorage(), // Store the file in memory
    }),
  ],
  controllers: [MiscController],
  providers: [
    MiscService,
    MailService,
    WinstonLoggerService,
    GoogleCloudService,
  ],
})
export class MiscModule {}
