import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { CreateUserDTO } from './dto/create-user.dto';
import { Transaction } from 'sequelize';
import { PostgresErrorCode } from 'src/database/postgres-error-codes.enum';
import { AuthUser } from 'src/auth/model/auth_user.model';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User) private userRepository: typeof User) {}

  create = async (user: CreateUserDTO, t: Transaction): Promise<User> => {
    try {
      return await this.userRepository.create(user, { transaction: t });
    } catch (error: any) {
      this.logger.error(error);

      const errorField = error.errors[0].path;

      this.logger.error(errorField, `eeee`, error.stack);

      if (errorField === 'email') {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      if (errorField === 'nickname') {
        throw new HttpException(
          'Nickname already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorField === 'phone') {
        throw new HttpException('Phone already exists', HttpStatus.BAD_REQUEST);
      }

      if (error.parent.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  async findOne(id: number) {
    const user = await this.userRepository.findByPk(id, {
      attributes: { exclude: ['created_at', 'updated_at', 'password'] },
    });

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      include: [AuthUser],
    });
  }

  async findByNickname(nickname: string) {
    return await this.userRepository.findOne({
      where: { nickname },
      include: [AuthUser],
    });
  }

  async getAll() {
    const users = await this.userRepository.findAll();

    return users;
  }
}
