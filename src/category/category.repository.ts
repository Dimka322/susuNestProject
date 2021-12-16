import {Injectable} from "@nestjs/common";
import { EntityRepository, AbstractRepository } from 'typeorm';
import {Category} from "./category.entity";

@Injectable()
@EntityRepository(Category)
export class CategoryRepository extends AbstractRepository<Category> {
  public async find(): Promise<Category[]> {
    return this.repository.find();
  }

  public async findById(id: string): Promise<Category> {
    return this.repository.findOne({ where: { id: id }});
  }
}