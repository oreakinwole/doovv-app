import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Headers } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiHeader({ name: 'Idempotency-Key', required: false })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.bookingsService.create(createBookingDto, req.user.id, idempotencyKey);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('WASHER', 'ADMIN')
  @ApiResponse({ status: 200, description: 'Booking status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookingStatusDto,
    @Request() req,
  ) {
    return this.bookingsService.updateStatus(id, updateDto, req.user.id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of bookings' })
  async findAll(@Request() req) {
    return this.bookingsService.findAll(req.user.id, req.user.role);
  }

  @Get('history')
  @ApiResponse({ status: 200, description: 'Booking history with legacy data' })
  async findHistory(@Request() req) {
    return this.bookingsService.findHistory(req.user.id, req.user.role);
  }
}