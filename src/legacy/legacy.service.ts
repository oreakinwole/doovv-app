import { Injectable } from '@nestjs/common';

@Injectable()
export class LegacyService {
  async getBookingHistory(userId: string, role: string) {
    return [
      {
        id: 'legacy-1',
        serviceType: 'DROP_OFF',
        status: 'COMPLETED',
        scheduledAt: '2024-01-15T10:00:00Z',
        vehicleInfo: '2022 Toyota Camry',
        price: 25,
        source: 'legacy'
      }
    ];
  }
}
