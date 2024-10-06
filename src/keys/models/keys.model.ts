import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/model/user.model';

export enum Service {
  BINANCE = 'binance',
}

interface ApiCredential {
  name: string;
  apiKey: string;
  apiSecret: string;
}

interface KeyCreationAttrs {
  service_name: Service;
  credentials: ApiCredential[];
  user_id: number;
}

@Table({ tableName: 'keys', underscored: true, timestamps: true })
export class Key extends Model<Key, KeyCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  service_name: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  credentials: ApiCredential[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
