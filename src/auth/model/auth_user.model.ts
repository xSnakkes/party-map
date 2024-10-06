import { Column, DataType, Model, Table, HasOne } from 'sequelize-typescript';
import { User } from 'src/user/model/user.model';

interface AuthUserCreationAttribute {
  nickname: string;
  email: string;
  password: string;
}

@Table({ tableName: 'auth_user' })
export class AuthUser extends Model<AuthUser, AuthUserCreationAttribute> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nickname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasOne(() => User, 'auth_user_id')
  user: User;
}
