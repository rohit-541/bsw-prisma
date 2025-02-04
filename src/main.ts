import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import path, { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { static as static_ } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: "*", 
  });

  app.use('/uploads', static_(join(process.cwd(), 'public/uploads')));

  app.use(cookieParser());

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
