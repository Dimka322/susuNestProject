import {
  BadRequestException,
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseInterceptors
} from "@nestjs/common";
import {InjectEntityManager} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {UserRepository} from "./user.repository";
import {EntityManager} from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import {AuthInterceptor} from "../auth.interceptor";
import {FilmRepository} from "../film/film.repository";

@Controller('user')
export class UserController {
  public constructor(
    private readonly userRepo: UserRepository,
    @InjectEntityManager()
    private readonly saveService: EntityManager,
    private readonly filmRepo: FilmRepository,
  ) {}

  @Get()
  public getUsers() {
    return this.userRepo.find()
  }

  @Get(':userId')
  public getUser(
    @Param('userId') userId: string,
  ) {
    return this.userRepo.findById(userId);
  }

  @Post('register')
  public async registerUser(
    @Body() registerRequest: { login: string, password: string },
  ) {
    const { login, password } = registerRequest;
    const userExists = await this.userRepo.findByLogin(login)
      .then((user) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      });
    if (userExists) {
      throw new BadRequestException('user with such login exists');
    } else {
      return this.saveService.save(new User({
        id: uuidv4(),
        login: login,
        password: password,
      }))
    }
  }

  @Post('login')
  public async loginUser(
    @Body() loginRequest: { login: string, password: string },
  ) {
    const { login, password } = loginRequest;
    const user = await this.userRepo.findByLoginAndPassword(login, password);
    if (!user) {
      throw new UnauthorizedException('User with this login and password not found');
    } else {
      user.session = uuidv4();
      return this.saveService.save(user);
    }
  }

  @Put(':userId')
  @UseInterceptors(AuthInterceptor)
  public async changeUser(
    @Param('userId') userId: string,
    @Body() changeUserRequest: Partial<User>,
  ) {
    return this.saveService.save(new User({
      id: userId,
      ...changeUserRequest,
    }))
  }

  @Delete(':userId')
  public async deleteUser(
    @Param('userId') userId: string,
  ) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new BadRequestException('user with such id not found');
    }
    await this.saveService.delete(User, userId);
    return 'OK';
  }

  @Post(':userId/film')
  public async addFilmToUser(
    @Param('userId') userId: string,
    @Body() addFilmRequest: { filmId: string }
  ) {
    const film = await this.filmRepo.findById(addFilmRequest.filmId);
    if (!film) {
      throw new BadRequestException('film with such id not exists');
    }
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new BadRequestException('user with such id not exists');
    }
    user.films.push(film);
    return this.saveService.save(user);
  }
}