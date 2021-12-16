import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Request,
  UnauthorizedException
} from "@nestjs/common";
import { Observable } from "rxjs";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "./user/user.repository";
import {User} from "./user/user.entity";

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  public constructor(
    // @InjectRepository(User)
    private readonly userRepo: UserRepository,
  ) {
  }
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const session = request.headers['session'];
    const user = await this.userRepo.findBySession(session);
    if (!user) {
      throw new UnauthorizedException('User with such session not found');
    }
    return next.handle();
  }
}