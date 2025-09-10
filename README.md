# Doovo Car Wash Backend

Complete car wash booking system with NestJS and Laravel backends.

## NestJS Backend

### Features
✅ NestJS 10+ with TypeScript
✅ Prisma ORM with PostgreSQL
✅ JWT Authentication with roles (customer/washer)
✅ Idempotency support for bookings
✅ Real-time WebSocket updates
✅ Swagger documentation
✅ Global exception handling
✅ Comprehensive testing

### Quick Start
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### API Endpoints
- `POST /auth/login` - User authentication
- `POST /bookings` - Create booking (supports Idempotency-Key)
- `PATCH /bookings/:id/status` - Update status (washer only)
- `GET /bookings` - List bookings (role-based)
- `GET /bookings/history` - Booking history with legacy data

### Testing
```bash
npm test                 # Unit tests
npm run test:e2e        # E2E tests
```

## Laravel Legacy Backend

### Features
✅ Eloquent models with migrations
✅ Form Request validation
✅ Centralized exception handling
✅ Database queue jobs
✅ PHPUnit tests

### Quick Start
```bash
cd legacy-laravel
composer install
php artisan migrate
php artisan queue:work --queue=default
```

### API Endpoints
- `GET /legacy/bookings/history` - Legacy booking history
- `POST /legacy/bookings` - Create legacy booking

### Testing
```bash
php artisan test
```

## Deployment

Both backends are configured for easy deployment:
- NestJS: Render free tier with PostgreSQL
- Laravel: Any PHP hosting with MySQL/PostgreSQL

## Documentation

- Swagger API docs: `/api`
- Test coverage reports in `/docs/`
- PHPUnit output screenshots in `/docs/`