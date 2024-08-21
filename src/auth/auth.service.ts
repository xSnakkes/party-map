import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDTO } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async signIn(signInDTO: SignInDTO) {
    const user = await this.userService.findOne(
      signInDTO.nickname,
      signInDTO.email,
    );

    if (!user) {
      return null;
    }

    const isPasswordMatching = await this.comparePassword(
      signInDTO.password,
      user.password,
    );
  }

  async signUp() {}

  async logout() {}
}
