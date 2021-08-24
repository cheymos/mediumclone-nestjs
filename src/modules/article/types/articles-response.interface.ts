import { ArticleType } from './article-response.interface';

export interface IArticlesResponse {
  articles: ArticleType[];
  articlesCount: number;
}
