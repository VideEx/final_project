import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticleType} from "../../../../types/article.type";
import {CategoriesService} from "../../../shared/services/categories.service";
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../../shared/utils/activeParams.util";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {FilterType} from "../../../../types/filter.type";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  standalone: false,
  styleUrls: ['./blog.component.less']
})
export class BlogComponent implements OnInit, OnDestroy {
  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  filters: FilterType[] = [];
  pages: number[] = [];

  private subscription: Subscription = new Subscription();
  constructor(private articleService: ArticlesService,
              private categoryService: CategoriesService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }



  ngOnInit(): void {
    this.subscription.add( this.categoryService.getCategories()
      .subscribe(data => {
        this.categories = data;
        this.subscription.add(this.activatedRoute.queryParams
          .subscribe(params => {
            this.activeParams = ActiveParamsUtil.processParams(params);
            this.filters = [];
            this.activeParams.categories.forEach(url => {
              const foundName = this.categories.find(item => item.url === url);
              if (foundName) {
                this.filters.push({
                  name: foundName.name,
                  urlParam: url
                })
              }
            });
            this.subscription.add(this.articleService.getArticles(this.activeParams)
              .subscribe(data => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }
                this.articles = data.items;
              }))
          }))
      }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  removeFilter(appliedFilter: FilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  }

  openNextPage() {
    if (!this.activeParams.page) {
      this.activeParams.page = 1
    }

    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  }

}
