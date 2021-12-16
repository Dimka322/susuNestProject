import {AbstractRepository, EntityRepository} from "typeorm";
import {User} from "./user.entity";
import {Injectable} from "@nestjs/common";

@Injectable()
@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  public async findByLogin(login: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { login: login } });
  }

  public async findByLoginAndPassword(login: string, password: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { login: login, password: password } });
  }

  public async findBySession(session: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { session: session } });
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { id: id } });
  }

  public async find() {
    return this.repository.find();
  }
}