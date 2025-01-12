import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import {BlogComponent} from "./blog/blog.component";
import {SharedModule} from "../../shared/shared.module";
import {ArticleComponent} from "./article/article.component";
import {CommentsComponent} from "./comments/comments.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    BlogComponent,
    ArticleComponent,
    CommentsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticleRoutingModule,
    FormsModule
  ]
})
export class ArticleModule { }
