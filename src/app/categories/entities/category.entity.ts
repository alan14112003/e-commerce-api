import { Product } from 'src/app/products/entities/product.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Unique(['slug'])
  slug: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
