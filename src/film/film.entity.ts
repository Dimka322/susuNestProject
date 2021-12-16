import {Entity, Column, BaseEntity, PrimaryColumn, ManyToMany, JoinColumn, ManyToOne, JoinTable} from 'typeorm';
import {Injectable} from "@nestjs/common";
import {Category} from "../category/category.entity";
import {User} from "../user/user.entity";

@Entity()
@Injectable()
export class Film extends BaseEntity {
  public constructor(partial: Partial<Film>) {
    super();
    Object.assign(this, partial);
  }
  @PrimaryColumn({ update: false, name: 'id' })
  public readonly id: string;

  @Column({ name: 'rating', type: 'integer', default: null })
  public rating: number | null;

  @Column({ name: 'name', type: 'varchar', default: null })
  public name: string;

  @Column({ name: 'description', type: 'varchar', default: null })
  public description: string;

  @ManyToOne((type) => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  public category: Category;

  @Column({ name: 'category_id', type: 'varchar', default: null })
  public categoryId: string;

  @ManyToMany((type) => User, { eager: false })
  @JoinTable({ name: 'user_film' })
  public readonly users: User[];
}