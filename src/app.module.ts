import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./user/user.entity";
import {Film} from "./film/film.entity";
import {Category} from "./category/category.entity";
import {CategoryController} from "./category/category.controller";
import {UserController} from "./user/user.controller";
import {FilmController} from "./film/film.controller";
import {AuthInterceptor} from "./auth.interceptor";
import {CategoryRepository} from "./category/category.repository";
import {UserRepository} from "./user/user.repository";
import {FilmRepository} from "./film/film.repository";
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'dima',
      entities: [User, Film, Category,],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      CategoryRepository,
      FilmRepository,
    ])
  ],
  controllers: [AppController, CategoryController, UserController, FilmController],
  providers: [
    AppService,
    AuthInterceptor,
  ],
})
export class AppModule {}
