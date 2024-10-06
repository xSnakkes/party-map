import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KeyService } from './keys.service';
import { UserService } from 'src/user/user.service';
import { ApiCreateKey, ApiGetKey } from './decorators/key.decorators';
import { RequestWithUser } from 'src/auth/interface/request-with-user.interface';
import { CreateKeyDTO } from './dto/create-key.dto';
import { Response } from 'express';

@ApiTags('key')
@Controller('key')
@UseInterceptors(ClassSerializerInterceptor)
export class KeyController {
  constructor(private keyService: KeyService) {}

  @ApiCreateKey()
  @Post()
  async createKey(
    @Req() req: RequestWithUser,
    @Body() body: CreateKeyDTO,
    @Res() res: Response,
  ) {
    try {
      const result = await this.keyService.createOrUpdateKey(req.user, body);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'An error occurred while creating or updating the key',
        });
      }
    }
  }

  @ApiGetKey()
  @Get()
  async getKey(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Query('service_name') serviceName: string,
  ) {
    const keys = await this.keyService.getKey(req.user, serviceName);
    res.status(HttpStatus.OK).json(keys);
  }
}
