import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeModule } from '../realtime/realtime.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { LegacyModule } from '../legacy/legacy.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RealtimeModule, NotificationsModule, LegacyModule, AuthModule],
  controllers: [BookingsController],
  providers: [BookingsService, PrismaService],
})
export class BookingsModule {}
