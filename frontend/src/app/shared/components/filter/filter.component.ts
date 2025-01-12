
import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../utils/activeParams.util";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
  standalone: false
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() categories: CategoryType[] | null = null;
  open = false;
  activeParams: ActiveParamsType = {categories: []};
  private subscription: Subscription | null = null;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.open && (event.target as HTMLElement).className.indexOf('catalog-sorting') === -1) {
      this.open = false;
    }
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParams.subscribe( params => {
      this.activeParams = ActiveParamsUtil.processParams(params);
      if (params['categories']) {
        this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']]
      }
    })
  }

  toggle():void {
    this.open = !this.open;
  }

  updateFilterParam (url: string, checked: boolean) {

    if(this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParams = this.activeParams.categories.find(item => item === url);
      if (existingCategoryInParams && !checked) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingCategoryInParams && checked) {
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else if (checked) {
      this.activeParams.categories = [url]
    }
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }

}
