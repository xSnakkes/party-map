import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      store: redisStore,
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      ttl: configService.get('REDIS_TTL'),
    };
  }
};
