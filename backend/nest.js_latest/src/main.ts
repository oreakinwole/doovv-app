import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppOptions } from '@utils/app.options.utils';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  process.env.TZ = 'Africa/Lagos'; //set timezone to africa/lagos

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    AppOptions,
  );

  app.setGlobalPrefix('/api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException({
          statusText: 'bad request',
          status: 400,
          message:
            errors[0]?.children[0]?.children[0]?.constraints[
              Object?.keys(errors[0]?.children[0]?.children[0]?.constraints)[0]
            ] ||
            errors[0]?.children[0]?.constraints[
              Object?.keys(errors[0]?.children[0]?.constraints)[0]
            ] ||
            errors[0]?.constraints[Object?.keys(errors[0]?.constraints)[0]] ||
            'Unable to validate request',
        });
      },
    }),
  );

  const logger = new Logger(NestApplication.name);
  const port = process.env.PORT || 8080
  await app.listen(port, () => {
    logger.log(`Server is now listening on port ${port}`);
  });
}
bootstrap();
