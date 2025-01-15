import {Component, Input, OnDestroy} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-article-card',
  standalone: false,
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.less'
})
export class ArticleCardComponent implements OnDestroy {
  @Input() article!: ArticleType;
  serverStaticPath = environment.serverStaticPath;
  private subscription: Subscription | null = null;
  constructor(public dialog: MatDialog, private router: Router) {
    this.article = {
      id: '',
      title: '',
      description: '',
      image: '',
      category: '',
    }
  }

  goToArticle(url: string | undefined): void {
    if (url) {
      this.router.navigate(['/article/' + url]);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
