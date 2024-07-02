import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(cors());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
