import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Key } from './models/keys.model';
import { User } from 'src/user/model/user.model';
import { CreateKeyDTO } from './dto/create-key.dto';

@Injectable()
export class KeyService {
  private readonly logger = new Logger(KeyService.name);

  constructor(
    @InjectModel(Key) private keyRepository: typeof Key,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async createOrUpdateKey(user: User, createKeyDto: CreateKeyDTO) {
    try {
      const existingKey = await this.keyRepository.findOne({
        where: {
          service_name: createKeyDto.serviceName,
          user_id: user.id,
        },
        attributes: {
          exclude: ['user_id'],
        },
      });

      if (existingKey) {
        const credentialExists = existingKey.credentials.some(
          (credential) => credential.name === createKeyDto.credentials.name,
        );

        if (credentialExists) {
          throw new HttpException(
            'Credential with this name already exists',
            HttpStatus.BAD_REQUEST,
          );
        }

        const updatedCredentials = [
          ...existingKey.credentials,
          createKeyDto.credentials,
        ];
        existingKey.credentials = updatedCredentials;
        await existingKey.save();

        return existingKey;
      } else {
        const keys = await this.keyRepository.create({
          service_name: createKeyDto.serviceName,
          credentials: [createKeyDto.credentials],
          user_id: user.id,
        });

        return keys;
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'An error occurred while creating or updating the key',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getKey(user: User, serviceName?: string) {
    return await this.keyRepository.findAll({
      where: {
        user_id: user.id,
        ...(serviceName && { service_name: serviceName }),
      },
    });
  }
}
