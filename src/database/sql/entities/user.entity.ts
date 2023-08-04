import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UserType } from './user-type.entity';
import { Image } from './image.enity';
@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public user_id: number;

  @ForeignKey(() => UserType)
  @Column({ type: DataType.BIGINT })
  public user_type_id: number;

  @BelongsTo(() => UserType)
  userType: UserType;

  @Column({
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  username: string;

  @Column({
    allowNull: false,
  })
  password: string;

  @Column({
    allowNull: false,
  })
  first_name: string;

  @Column({
    allowNull: false,
  })
  last_name: string;

  @Column({
    allowNull: false,
    defaultValue: true,
  })
  active: boolean;

  @ForeignKey(() => Image)
  @Column({ type: DataType.BIGINT })
  profile_image_id: number;

  @BelongsTo(() => Image)
  profileImage: Image;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
