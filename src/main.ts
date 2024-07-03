import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { IConfiguration } from './config/configuration';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<IConfiguration> = app.get(ConfigService);

  // generate REST API documentation
  const documentation = new DocumentBuilder()
    .setTitle('Authora API documentation')
    .setVersion('1.0');
  documentation.addBearerAuth();
  SwaggerModule.setup(
    '',
    app,
    SwaggerModule.createDocument(app, documentation.build(), {
      extraModels: [],
    }),
  );

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.use(cors());

  // security
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 900000,
      max: 500,
      message: {
        status: 429,
        message: 'Too many requests, please try again later.',
      },
    }),
  );

  await app.listen(configService.get('basic.port', { infer: true }));
}
bootstrap();
