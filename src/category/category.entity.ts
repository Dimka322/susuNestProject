import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';
import {Injectable} from "@nestjs/common";

@Entity()
@Injectable()
export class Category extends BaseEntity {
  public constructor(partial: Partial<Category>) {
    super();
    Object.assign(this, partial)
  }
  @PrimaryColumn({ update: false, name: 'id' })
  public readonly id: string;

  @Column({ name: 'name', type: 'varchar' })
  public name: string;
}