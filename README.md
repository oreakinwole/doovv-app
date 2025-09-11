# 🚀 Moniger Backend v2

A robust NestJS backend application providing comprehensive server-side functionality with TypeScript support.

## 🗋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Dependencies](#-dependencies)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Available Scripts](#-available-scripts)

## 💻 Tech Stack

- **Framework**: NestJS
- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Email Services**: SendGrid, Nodemailer, Resend
- **Cloud Services**: Google Cloud Storage, Google PubSub, Google cloud services
- **Caching**: Node-Cache
- **Monitoring**: Winston Logger
- **Push Notifications**: Expo Server SDK
- **Analytics**: Mixpanel
- **Task Scheduling**: @nestjs/schedule

## ✨ Features

- RESTful API architecture
- MongoDB integration with Mongoose ORM
- JWT-based authentication
- File upload and storage (Google Cloud Storage)
- Email service integration (SendGrid, Nodemailer, Resend SMTP)
- Push notifications (Expo)
- Event handling with EventEmitter
- Scheduled tasks and cron jobs
- Form data handling and validation
- Microservices support
- Cloud messaging with Google PubSub
- Template rendering with Handlebars
- Environment configuration management
- Comprehensive logging system

## 📦 Dependencies

### Core Dependencies

- `@nestjs/common`, `@nestjs/core`: NestJS framework
- `@nestjs/mongoose`: MongoDB integration
- `@nestjs/jwt`: JWT authentication
- `@nestjs/config`: Configuration management
- `@nestjs/schedule`: Task scheduling
- `@nestjs/event-emitter`: Event handling
- `@google-cloud/storage`: Google Cloud Storage
- `@google-cloud/pubsub`: Google Cloud PubSub
- `@sendgrid/mail`: SendGrid email service

### Utility Libraries

- `bcrypt`: Password hashing
- `class-validator`, `class-transformer`: Data validation
- `moment`: Date manipulation
- `winston`: Logging
- `handlebars`: Template rendering
- `node-cache`: Caching
- `uuid`: Unique identifier generation

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/MonigerTech/moniger-backend-v2.git
cd moniger-backend-v2
```

2. Install dependencies:
```bash
yarn install
```

## 🚀 Running the Application

### Development Mode
```bash
# Watch mode
yarn start:dev

# Debug mode
yarn start:debug
```

### Production Mode
```bash
yarn start:prod
```

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 📦 Deployment

```bash
# push your changes and create a PR to main
```

## 📜 Available Scripts

| Script          | Description                                      |
| --------------- | ------------------------------------------------ |
| `prebuild`      | Clean build directory                            |
| `build`         | Build the application                            |
| `format`        | Format code using Prettier                       |
| `start`         | Start the application                            |
| `start:dev`     | Start in development watch mode                  |
| `start:debug`   | Start in debug mode                              |
| `start:prod`    | Start in production mode                         |
| `lint`          | Run ESLint                                       |
| `test`          | Run unit tests                                   |
| `test:watch`    | Run tests in watch mode                          |
| `test:cov`      | Generate test coverage report                    |
| `test:debug`    | Run tests in debug mode                          |
| `test:e2e`      | Run end-to-end tests                            |
| `deploy`        | Build and deploy the application                 |

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Request validation
- Secure file upload handling

