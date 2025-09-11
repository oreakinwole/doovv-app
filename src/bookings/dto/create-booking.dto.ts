import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsDateString, IsOptional, IsDecimal } from 'class-validator';
import { ServiceType } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty({ enum: ServiceType })
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @ApiProperty({ example: '2024 Honda Civic - Blue' })
  @IsString()
  vehicleInfo: string;

  @ApiProperty({ example: '123 Main St, City' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '2024-12-25T10:00:00Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ example: 'Please be gentle with the paint' })
  @IsOptional()
  @IsString()
  notes?: string;
}