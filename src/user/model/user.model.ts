import { Column, DataType, Model, Table } from 'sequelize-typescript';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export enum OnlineStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
}

interface UserCreationAttrs {
  nickname: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}

@Table({ tableName: 'users', underscored: true, timestamps: true })
export class User extends Model<User, UserCreationAttrs> {
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
    unique: true,
  })
  nickname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserStatus),
    defaultValue: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: DataType.ENUM,
    values: Object.values(OnlineStatus),
    defaultValue: OnlineStatus.OFFLINE,
  })
  online_status: OnlineStatus;
}
