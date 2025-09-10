import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

export function formatBookingDate(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }

  if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, 'h:mm a')}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }

  return format(date, "MMM dd, yyyy 'at' h:mm a");
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function getStatusColor(status: string): string {
  const colors = {
    PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    CONFIRMED: 'text-blue-600 bg-blue-50 border-blue-200',
    IN_PROGRESS: 'text-purple-600 bg-purple-50 border-purple-200',
    COMPLETED: 'text-green-600 bg-green-50 border-green-200',
    CANCELLED: 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
}
