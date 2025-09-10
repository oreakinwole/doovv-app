// ============ MAIN APPLICATION ============

// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // const config = new DocumentBuilder()
  //   .setTitle('Doovo Car Wash API')
  //   .setDescription('Car wash booking and management system')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  // writeFileSync('./docs/swagger.json', JSON.stringify(document, null, 2));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Doovo API running on http://localhost:${port}`);
  // console.log(`📚 Swagger docs: http://localhost:${port}/api`);
}
bootstrap();
