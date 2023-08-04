import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';

@Table({ tableName: 'user_types' })
export class UserType extends Model<UserType> {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public user_type_id: number;

  @Column({
    allowNull: false,
  })
  public user_type: string;
}
