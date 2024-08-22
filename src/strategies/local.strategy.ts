import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/user/model/user.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthService) {
    super({
      usernameField: 'identifier',
    });
  }

  async validate(identifier: string, password: string): Promise<User> {
    let user: User;

    user = await this.authenticationService.getAuthenticatedUser({
      identifier,
      password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
