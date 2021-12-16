import {Injectable} from "@nestjs/common";
import {EntityRepository, AbstractRepository, Any} from 'typeorm';
import {Film} from "./film.entity";

@Injectable()
@EntityRepository(Film)
export class FilmRepository extends AbstractRepository<Film> {
  public async findById(id: string): Promise<Film> {
    return this.repository.findOne({ where: { id: id }});
  }

  public async find(): Promise<Film[]> {
    return this.repository.find();
  }

  public async findByCategoryIds(ids: string[]): Promise<Film[]> {
    return this.repository.find({ where: { categoryId: Any(ids) } });
  }
}