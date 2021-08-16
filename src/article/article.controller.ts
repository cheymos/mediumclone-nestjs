import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { BackandValidationPipe } from 'src/shared/pipes/backend-validation.pipe';
import { User } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-user.dto';
import { IArticleResponse } from './types/article-response.interface';
import { IArticlesResponse } from './types/articles-response.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  getArticles(@Query() query: any, @User() currentUserId: number | null): Promise<IArticlesResponse> {
    return this.articleService.findAll(query, currentUserId);
  }

  @Get(':feed')
  @UseGuards(AuthGuard)
  async getFeed(@User() currentUser: UserEntity, @Query() query: any): Promise<IArticlesResponse> {
    return this.articleService.getFeed(currentUser, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackandValidationPipe())
  async create(@User() currentUser: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<IArticleResponse> {
    const article = await this.articleService.create(currentUser, createArticleDto);

    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string): Promise<IArticleResponse> {
    const article = await this.articleService.findBySlag(slug);

    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  deleteArticle(@Param('slug') slug: string, @User('id') currentUserId: number) {
    return this.articleService.delete(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackandValidationPipe())
  async updateArticle(
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
    @User('id') currentUserId: number,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.update(slug, updateArticleDto, currentUserId);

    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(@Param('slug') slug: string, @User('id') currentUserId: number): Promise<IArticleResponse> {
    const article = await this.articleService.addToFavorites(slug, currentUserId);

    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(@Param('slug') slug: string, @User('id') currentUserId: number): Promise<IArticleResponse> {
    const article = await this.articleService.deleteFromFavorites(slug, currentUserId);

    return this.articleService.buildArticleResponse(article);
  }
}
