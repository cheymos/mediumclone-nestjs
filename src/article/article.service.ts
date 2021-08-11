import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { UserEntity } from 'src/user/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-user.dto';
import { IArticleResponse } from './types/article-response.interface';

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(ArticleEntity) private readonly articleReposity: Repository<ArticleEntity>) {}

  create(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto);

    article.slug = this.generateSlug(article.title);
    article.author = currentUser;

    return this.articleReposity.save(article);
  }

  async findBySlag(slug: string): Promise<ArticleEntity> {
    const article = await this.articleReposity.findOne({ slug });

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async delete(slug: string, userId: number): Promise<DeleteResult> {
    const article = await this.checkOnAuthorship(slug, userId);

    return this.articleReposity.delete({ id: article.id });
  }

  async update(slug: string, updateArticleDto: UpdateArticleDto, userId: number): Promise<ArticleEntity> {
    const article = await this.checkOnAuthorship(slug, userId);

    Object.assign(article, updateArticleDto);

    return this.articleReposity.save(article);
  }

  // !: Maybe create guard?
  private async checkOnAuthorship(slug: string, userId: number): Promise<ArticleEntity> {
    const article = await this.findBySlag(slug);

    if (article.author.id !== userId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return article;
  }

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article };
  }

  private generateSlug(title: string): string {
    const postfix = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);

    return slugify(title, { lower: true }) + '-' + postfix;
  }
}
