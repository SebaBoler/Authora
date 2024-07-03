import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { IConfiguration } from './config/configuration';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { corsOptions } from './config/cors.config';
import { ErrorMessages } from '@common/error-messages.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const configService: ConfigService<IConfiguration> = app.get(ConfigService);

  // generate REST API documentation
  const config = new DocumentBuilder()
    .setTitle('Authora API')
    .setDescription('API for Authora service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(cors(corsOptions));

  // security
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 900000,
      max: 500,
      message: {
        status: 429,
        message: ErrorMessages.TOO_MANY_REQUESTS,
      },
    }),
  );

  const port = configService.get('basic.port', { infer: true });
  await app.listen(port);
  console.log(`🚀 Service Authora is running on : ${await app.getUrl()}`);
}
bootstrap();
