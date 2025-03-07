import { Role } from 'src/app/roles/entities/role.entity';
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Unique(['code'])
  code: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
