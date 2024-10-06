import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/model/user.model';
import { AuthModule } from './auth/auth.module';
import { AuthUser } from './auth/model/auth_user.model';
import { UserModule } from './user/user.module';
import pg from 'pg';
import passport from 'passport';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './common/configs/redis.config';
import { Key } from './keys/models/keys.model';
import { KeyModule } from './keys/keys.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        dialectModule: pg,
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        dialectOptions:
          configService.get('NODE_ENV') === 'production'
            ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: true,
                },
              }
            : {},
        define: {
          underscored: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
        models: [User, AuthUser, Key],
      }),
    }),
    AuthModule,
    UserModule,

    KeyModule,

    CacheModule.registerAsync(RedisOptions),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(passport.initialize(), passport.session()).forRoutes('*');
  }
}
