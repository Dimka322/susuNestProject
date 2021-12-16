import {Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors} from "@nestjs/common";
import {CategoryRepository} from "./category.repository";
import { InjectEntityManager } from '@nestjs/typeorm';
import {EntityManager} from "typeorm";
import {Category} from "./category.entity";
import {Film} from "../film/film.entity";
import {FilmRepository} from "../film/film.repository";
import { v4 as uuidv4 } from 'uuid';
import {AuthInterceptor} from "../auth.interceptor";

@UseInterceptors(AuthInterceptor)
@Controller('category')
export class CategoryController {
  public constructor(
    private readonly categoryRepo: CategoryRepository,
    private readonly filmRepo: FilmRepository,
    @InjectEntityManager()
    private readonly saveService: EntityManager,
  ) {
  }
  @Get()
  public async getCategories() {
    return this.categoryRepo.find();
  }

  @Get(':categoryId')
  public async getCategory(
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoryRepo.findById(categoryId);
  }

  @Get(':categoryId/films')
  public async getCategoryFilms() {
    const categoryIds = await this.categoryRepo
      .find()
      .then((categories) => categories.map((category) => category.id));
    return this.filmRepo.findByCategoryIds(categoryIds);
  }

  @Post()
  public async createFilm(
    @Body() createCategoryRequest: Partial<Category>,
  ) {
    return this.saveService.save(new Category({
      id: uuidv4(),
      // передаю в конструктор все свойства пришедшие из запроса
      ...createCategoryRequest,
    }));
  }

  @Put(':categoryId')
  public async changeFilm(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryRequest: Partial<Category>
  ) {
    return this.saveService.save(
      new Category({
        id: categoryId,
        // передаю в конструктор все свойства пришедшие из запроса
        ...updateCategoryRequest,
      })
    );
  }

  @Delete(':categoryId')
  public async deleteFilm(
    @Param('categoryId') categoryId: string,
  ) {
    const categoryToDelete = await this.categoryRepo.findById(categoryId);
    await this.saveService.delete(
      Film,
      categoryToDelete.id,
    );
    return 'OK';
  }
}