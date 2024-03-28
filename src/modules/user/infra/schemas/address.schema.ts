import { Table, Column, Model, PrimaryKey, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.schema';

@Table
export class Address extends Model {
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;
  
  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  cep: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  address: string;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  addressNumber: number;
  
  @Column({
    type: DataType.STRING,
  })
  complement?: string;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  neighborhood: string;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  city: string;
  
  @Column({
    allowNull: false,
    type: DataType.CHAR(2),
  })
  state: string;
  
  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  userId: string;
}
