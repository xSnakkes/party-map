import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async create(userDTO: CreateUserDTO) {
    const user = await this.userRepository.create(userDTO);

    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findByPk(id, {
      attributes: { exclude: ['created_at', 'updated_at', 'password'] },
    });

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByNickname(nickname: string) {
    return await this.userRepository.findOne({ where: { nickname } });
  }

  async getAll() {
    const users = await this.userRepository.findAll();

    return users;
  }
}
