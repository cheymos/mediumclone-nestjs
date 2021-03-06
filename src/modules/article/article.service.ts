import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { FollowEntity } from '../profile/follow.entity';
import { UserEntity } from '../user/user.entity';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-user.dto';
import { IArticleResponse } from './types/article-response.interface';
import { IArticlesResponse } from './types/articles-response.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleReposity: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async findAll(query: any, userId: number): Promise<IArticlesResponse> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere(':tag = ANY("tagList")', { tag: query.tag });
    }

    if (query.author) {
      const author = await getRepository(UserEntity).findOne({ username: query.author });

      queryBuilder.andWhere('articles.authorId = :id', { id: author?.id ?? -1 });
    }

    if (query.favorited) {
      const user = await this.userRepository.findOne({ username: query.favorited }, { relations: ['favorites'] });

      const ids = user?.favorites.map((article) => article.id) ?? [];

      queryBuilder.andWhere('articles.id = ANY(:ids)', { ids });
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoritesIds: number[] = [];

    if (userId) {
      const currentUser = await this.userRepository.findOne(userId, { relations: ['favorites'] });

      favoritesIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = articles.map((article) => {
      const favorited = favoritesIds.includes(article.id);

      return { ...article, favorited };
    });

    return { articles: articlesWithFavorites, articlesCount };
  }

  async getFeed(currentUser: UserEntity, query: any): Promise<IArticlesResponse> {
    const follows = await this.followRepository.find({ follower: currentUser });

    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const followingUserIds = follows.map((follow) => follow.following.id);

    const queryBuilder = this.articleReposity
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN(:...ids)', { ids: followingUserIds })
      .orderBy('articles.createdAt', 'DESC');

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const [articles, articlesCount] = await queryBuilder.getManyAndCount();

    return { articles, articlesCount };
  }

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

  async addToFavorites(slug: string, userId: number): Promise<ArticleEntity> {
    const user = await this.userRepository.findOne({ id: userId }, { relations: ['favorites'] });
    const article = await this.findBySlag(slug);

    const isNotFavotited = user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id) === -1;

    if (isNotFavotited) {
      article.favoritesCount++;
      user.favorites.push(article);

      await this.userRepository.save(user);
      await this.articleReposity.save(article);
    }

    return article;
  }

  async deleteFromFavorites(slug: string, userId: number): Promise<ArticleEntity> {
    const user = await this.userRepository.findOne({ id: userId }, { relations: ['favorites'] });
    const article = await this.findBySlag(slug);

    const articleIdx = user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id);

    if (articleIdx >= 0) {
      user.favorites.splice(articleIdx, 1);
      article.favoritesCount--;

      await this.articleReposity.save(article);
      await this.userRepository.save(user);
    }

    return article;
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
