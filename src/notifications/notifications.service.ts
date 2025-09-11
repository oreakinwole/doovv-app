import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendBookingConfirmation(booking: any) {
    console.log(`📧 Booking confirmation sent to ${booking.customer.email}`);
  }

  async sendStatusUpdate(booking: any) {
    console.log(`🔔 Status update sent: ${booking.status} for booking ${booking.id}`);
  }
}