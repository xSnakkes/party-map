import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsEmailOrNickname } from 'src/validate/nick-or-email.validate';

export class SignInDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmailOrNickname({ message: 'Identifier must be a valid email or a nickname' })
  identifier: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  rememberMe: boolean;
}