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
import { User } from './user.entity';
@Table({ tableName: 'vegetables' })
export class Vegetable extends Model<Vegetable> {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public vegetable_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT })
  added_user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column({
    allowNull: false,
  })
  color: string;

  @Column({
    allowNull: false,
  })
  price: number;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
