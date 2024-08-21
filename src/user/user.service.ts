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

  async getById(id: number) {
    const user = await this.userRepository.findByPk(id);

    return user;
  }

  async findOne(nickname?: string, email?: string) {
    if(nickname) {
      return await this.userRepository.findOne({ where: { nickname } });
    }
    if(email) {
      return await this.userRepository.findOne({ where: { email } });
    }

    return null;
  }

  async getAll() {
    const users = await this.userRepository.findAll();

    return users;
  }
}
