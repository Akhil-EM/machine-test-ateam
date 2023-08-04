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
import { TokenType } from './token-type.entity';

@Table({ tableName: 'tokens' })
export class Token extends Model<Token> {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public token_id: number;

  //associations
  @ForeignKey(() => TokenType)
  @Column({ type: DataType.BIGINT })
  token_type_id: number;

  @BelongsTo(() => TokenType)
  token_type: TokenType;

  @Column({
    allowNull: false,
  })
  token: string;

  @Column({ allowNull: false, defaultValue: true })
  active: boolean;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
