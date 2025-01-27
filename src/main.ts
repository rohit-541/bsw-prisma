import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials:true,
    origin:'http://127.0.0.1:5500',
  });
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
