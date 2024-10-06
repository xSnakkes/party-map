import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Key } from './models/keys.model';
import { KeyService } from './keys.service';
import { KeyController } from './keys.controller';
import { User } from 'src/user/model/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Key, User])],
  controllers: [KeyController],
  providers: [KeyService],
  exports: [],
})
export class KeyModule {}
