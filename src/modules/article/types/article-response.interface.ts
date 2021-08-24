import { ArticleEntity } from '../article.entity';

export interface IArticleResponse {
  article: ArticleEntity;
}

export type ArticleType = Omit<ArticleEntity, 'updateDate'>;
