import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";
import {CategoryType} from "../../../../types/category.type";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RequestService} from "../../services/request.service";
import {CategoriesService} from "../../services/categories.service";
import {FormBuilder, NgForm, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {CategoriesUtil} from "../../utils/categories.util";

@Component({
  selector: 'app-order-popup',
  standalone: false,
  templateUrl: './order-popup.component.html'
})
export class OrderPopupComponent implements OnInit {

  requestForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁа-яё '-]+$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+\d\d{3}\d{3}\d{4}$/)]],
    category: ['']
  });
  private subscription: Subscription = new Subscription();

  public currentState: number = 1;

  categories: CategoryType[] = [];

  constructor(private fb: FormBuilder,
              private requestService: RequestService,
              @Inject(MAT_DIALOG_DATA) public data: { category: "" },
              private _snackBar: MatSnackBar,
              private categoryService: CategoriesService,
              public dialogRef: MatDialogRef<OrderPopupComponent>
  ) {

    if (this.data.category) {
      let category: string = this.data.category;
      this.requestForm.patchValue({ category: CategoriesUtil.getCategoriesValue(category.toLowerCase())});
    } else if (!this.data.category) {
      this.requestForm.patchValue({ category: 'undefined'});
    }
  }

  ngOnInit(): void {
    if (this.currentState === 1) {
      this.subscription.add(this.categoryService.getCategories().subscribe(data => {
        this.categories = data
      }));
    }
  }

  parsCategoryValue(url: string): string {
    return this.categories.find(item => item.url === url) ? this.categories.find(item => item.url === url)!.name : ''
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(): void {
    if (this.requestForm.valid && this.requestForm.value.name && this.requestForm.value.phone && this.requestForm.value.category) {
      const service = this.requestForm.value.category === 'undefined' || '' ? '' : this.parsCategoryValue(this.requestForm.value.category);
      this.subscription.add(this.requestService.orderRequest(this.requestForm.value.name, this.requestForm.value.phone, 'order', service)
        .subscribe({
          next: (response: DefaultResponseType) => {
            if (response.error) {
              this._snackBar.open(response.message)
            }
            if (!response.error) {
              // this.dialogRef.close('second');
              this.currentState = 2;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка заказа');
            }
          }
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
