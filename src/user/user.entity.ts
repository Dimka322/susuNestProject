import {BaseEntity, Column, Entity, Index, JoinTable, ManyToMany, PrimaryColumn} from "typeorm";
import {Injectable} from "@nestjs/common";
import {Film} from "../film/film.entity";

@Entity()
@Injectable()
@Index(['login', 'password'], { unique: true })
export class User extends BaseEntity {
  public constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
  @PrimaryColumn({ update: false, name: 'id' })
  public readonly id: string;

  @Column({ name: 'name', type: 'varchar', default: null })
  public name: string;

  @Column({ name: 'login', type: 'varchar' })
  public login: string;

  @Column({ name: 'password', type: 'varchar' })
  public password: string;

  @Column({ name: 'session', type: 'varchar', default: null })
  public session: string;

  @ManyToMany((type) => Film, { eager: true })
  @JoinTable({ name: 'user_film' })
  public films: Film[];
}