import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { config } from './swagger/swagger.config';
import cookieParser from 'cookie-parser';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import session from 'express-session';
import { SESSION_COOKIE_NAME } from './auth/constants';
import { randomUUID } from 'crypto';
import { User } from './user/model/user.model';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const configService = app.get(ConfigService);

  const NODE_ENV = configService.get('NODE_ENV');
  const PORT = configService.get('PORT');

  if (NODE_ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.enableCors();
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1.0',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(
    session({
      secret: configService.get('SESSION_SECRET') as string,
      resave: false,
      saveUninitialized: false,
      name: SESSION_COOKIE_NAME,
      proxy: true,
      cookie: {
        secure: NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
      genid: (req) => {
        const id = randomUUID();
        const userId = (req.user as User)?.id || 'anonymous';
        return `sid:${userId}:${id}`;
      }
    }),
  );

  app.set('trust proxy', 1);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(PORT, () => {
    const logger = new Logger();
    logger.verbose(`Server running, listening on port ${PORT}`);
  });
}
bootstrap();
