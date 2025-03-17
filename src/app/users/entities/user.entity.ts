import { Role } from 'src/app/roles/entities/role.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  fullName: string;
  @Column()
  @Unique(['email'])
  email: string;
  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
