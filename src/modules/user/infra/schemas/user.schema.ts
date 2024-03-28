import { Table, Column, Model, PrimaryKey, DataType, HasMany, Index, Unique } from 'sequelize-typescript';
import { Address } from './address.schema';

@Table
export class User extends Model {
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  name: string

  @Column({
    allowNull: false,
    type: DataType.CHAR(2),
  })
  type: 'PF' | 'PJ';

  @Column({
    type: DataType.STRING,
  })
  cnpj?: string;

  @Index
  @Unique
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  cpf: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  phone: string;
  
  @Column({
    type: DataType.STRING,
  })
  telephone?: string;
  
  @Index
  @Unique
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  email: string;

  @HasMany(() => Address)
  address: Address[];
}
