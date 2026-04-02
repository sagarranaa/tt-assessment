import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe — transforms query params, validates DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,   // strip unknown fields
      transform: true,   // auto-convert types (string "1" → number 1)
    }),
  );

  // Q2: wrap all responses in standard envelope
  app.useGlobalInterceptors(new TransformInterceptor());

  // Q2: format all errors consistently
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`✅ Server running on http://localhost:${port}`);
}
bootstrap();