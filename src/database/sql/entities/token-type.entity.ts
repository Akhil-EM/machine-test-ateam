import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'token_types' })
export class TokenType extends Model<TokenType> {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public token_type_id: number;

  @Column({
    allowNull: false,
  })
  public token_type: string;
}
