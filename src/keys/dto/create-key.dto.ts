import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Service } from '../models/keys.model';
import { Type } from 'class-transformer';

class ApiCredential {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  apiSecret: string;
}

export class CreateKeyDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Service)
  serviceName: Service;

  @ApiProperty({ type: ApiCredential })
  @ValidateNested({ each: true })
  @Type(() => ApiCredential)
  credentials: ApiCredential;
}
