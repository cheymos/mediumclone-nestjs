import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
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
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
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
