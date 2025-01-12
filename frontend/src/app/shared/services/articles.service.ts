import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AllArticleType, ArticleType} from "../../../types/article.type";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticlesInfoType} from "../../../types/articles-info.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  constructor(private http: HttpClient) { }

  getBestArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }
  getArticles(params: ActiveParamsType): Observable<AllArticleType> {
    return this.http.get<AllArticleType>(environment.api + 'articles', {
      params: params
    });
  }
  getArticle(url: string): Observable<ArticlesInfoType> {
    return this.http.get<ArticlesInfoType>(environment.api + 'articles/' + url);
  }
  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }
}
