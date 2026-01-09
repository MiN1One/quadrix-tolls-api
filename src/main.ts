import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { appConfig } from './app.config';
import { AppModule } from './app.module';

const allowedOrigins = [
  'https://app.quadrix.ai',
  'http://localhost:5173',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'), false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  await app.listen(config.port);

  Logger.log(`Listening on port ${config.port}`);
}

bootstrap();
