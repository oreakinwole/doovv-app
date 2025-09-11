import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { LegacyService } from '../legacy/legacy.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private realtimeGateway: RealtimeGateway,
    private notificationsService: NotificationsService,
    private legacyService: LegacyService,
  ) {}

  async create(createBookingDto: CreateBookingDto, customerId: string, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = await this.prisma.booking.findFirst({
        where: { 
          customerId,
          vehicleInfo: createBookingDto.vehicleInfo,
          scheduledAt: new Date(createBookingDto.scheduledAt)
        }
      });
      if (existing) return existing;
    }

    const booking = await this.prisma.booking.create({
      data: {
        ...createBookingDto,
        customerId,
        scheduledAt: new Date(createBookingDto.scheduledAt),
        price: this.calculatePrice(createBookingDto.serviceType),
      },
      include: { customer: true },
    });

    this.realtimeGateway.sendToWashers('new-booking', booking);
    await this.notificationsService.sendBookingConfirmation(booking);

    return booking;
  }

  async updateStatus(id: string, updateDto: UpdateBookingStatusDto, washerId: string) {
    const booking = await this.prisma.booking.findUnique({ 
      where: { id },
      include: { customer: true }
    });
    
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { 
        status: updateDto.status, 
        washerId,
        ...(updateDto.notes && { notes: updateDto.notes })
      },
      include: { customer: true },
    });

    await this.prisma.bookingHistory.create({
      data: {
        bookingId: id,
        status: updateDto.status,
        notes: updateDto.notes,
      },
    });

    this.realtimeGateway.sendToCustomer(booking.customerId, 'booking-updated', updated);
    await this.notificationsService.sendStatusUpdate(updated);

    return updated;
  }

  async findAll(userId: string, role: string) {
    const where = role === 'CUSTOMER' ? { customerId: userId } : {};
    return this.prisma.booking.findMany({
      where,
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findHistory(userId: string, role: string) {
    const currentBookings = await this.findAll(userId, role);
    const legacyBookings = await this.legacyService.getBookingHistory(userId, role);
    
    return {
      current: currentBookings,
      legacy: legacyBookings,
      total: currentBookings.length + legacyBookings.length
    };
  }

  private calculatePrice(serviceType: string): number {
    const prices = { DROP_OFF: 25, MOBILE: 35, PICKUP_RETURN: 45 };
    return prices[serviceType] || 25;
  }
}
