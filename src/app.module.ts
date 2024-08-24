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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV || 'dev'}.env`,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        dialectModule: pg,
        host: configService.get('POSTGRES_HOST'),
        port: Number(configService.get('POSTGRES_PORT')),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: true,
          },
        },
        define: {
          underscored: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
        models: [User, AuthUser],
      }),
    }),
    AuthModule,
    UserModule,

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
