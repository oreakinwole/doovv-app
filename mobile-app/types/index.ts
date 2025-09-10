export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'WASHER' | 'ADMIN';
}

export interface Booking {
  id: string;
  customerId: string;
  customer: User;
  serviceType: 'DROP_OFF' | 'MOBILE' | 'PICKUP_RETURN';
  vehicleInfo: string;
  address?: string;
  scheduledAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  washerId?: string;
  notes?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  serviceType: 'DROP_OFF' | 'MOBILE' | 'PICKUP_RETURN';
  vehicleInfo: string;
  address?: string;
  scheduledAt: string;
}

export interface UpdateBookingStatusDto {
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}