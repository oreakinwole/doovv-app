import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { LegacyService } from '../legacy/legacy.service';

describe('BookingsService', () => {
  let service: BookingsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: { booking: { create: jest.fn(), findMany: jest.fn() } } },
        { provide: RealtimeGateway, useValue: { sendToWashers: jest.fn() } },
        { provide: NotificationsService, useValue: { sendBookingConfirmation: jest.fn() } },
        { provide: LegacyService, useValue: { getBookingHistory: jest.fn() } },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a booking', async () => {
    const createBookingDto = {
      serviceType: 'DROP_OFF' as any,
      vehicleInfo: 'Test Car',
      scheduledAt: '2024-12-25T10:00:00Z',
    };
    
    const mockBooking = { id: '1', ...createBookingDto, customerId: 'user1' };
    jest.spyOn(prismaService.booking, 'create').mockResolvedValue(mockBooking as any);

    const result = await service.create(createBookingDto, 'user1');
    expect(result).toEqual(mockBooking);
  });
});