import {Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {Film} from "./film.entity";
import {FilmRepository} from "./film.repository";
import { v4 as uuidv4 } from 'uuid';
import {AuthInterceptor} from "../auth.interceptor";

@UseInterceptors(AuthInterceptor)
@Controller('film')
export class FilmController {
  public constructor(
    private readonly filmRepo: FilmRepository,
    @InjectEntityManager()
    private readonly saveService: EntityManager,
  ) {
  }
  @Get()
  public async getFilms() {
    return this.filmRepo.find();
  }

  @Get(':filmId')
  public async getFilm(
    @Param('filmId') filmId: string,
  ) {
    return this.filmRepo.findById(filmId);
  }

  @Post()
  public async createFilm(
    @Body() createFilmRequest: Partial<Film>,
  ) {
    return this.saveService.save(new Film({
      id: uuidv4(),
      // передаю в конструктор все свойства пришедшие из запроса
      ...createFilmRequest,
    }));
  }

  @Put(':filmId')
  public async changeFilm(
    @Param('filmId') filmId: string,
    @Body() updateFilmRequest: Partial<Film>
  ) {
    return this.saveService.save(
      new Film({
        id: filmId,
        // передаю в конструктор все свойства пришедшие из запроса
        ...updateFilmRequest,
      })
    );
  }

  @Delete(':filmId')
  public async deleteFilm(
    @Param('filmId') filmId: string,
  ) {
    const filmToDelete = await this.filmRepo.findById(filmId);
    await this.saveService.delete(
      Film,
      filmToDelete.id,
    );
    return 'OK';
  }
}