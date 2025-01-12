import {Component} from '@angular/core';
import {Subscription} from "rxjs";
import {CategoryType} from "../../../../types/category.type";
import {RequestService} from "../../services/request.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoriesService} from "../../services/categories.service";
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, NgForm, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-consultation-popup',
  standalone: false,
  templateUrl: './consultation-popup.component.html'
})
export class ConsultationPopupComponent {
  // requestForm = {
  //   name: '',
  //   phone: ''
  // }

  requestForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁа-яё '-]+$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+\d\d{3}\d{3}\d{4}$/)]]
  });

  private subscription: Subscription = new Subscription();

  public currentState: number = 1;

  public type = 'consultation';
  categories: CategoryType[] = [];

  constructor(private fb: FormBuilder,
              private requestService: RequestService,
              private _snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<ConsultationPopupComponent>,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick() {
    if (this.requestForm.valid && this.requestForm.value.name && this.requestForm.value.phone) {
      this.subscription.add(this.requestService.orderRequest(this.requestForm.value.name, this.requestForm.value.phone, this.type)
        .subscribe({
          next: (response: DefaultResponseType) => {
            if (response.error) {
              this._snackBar.open(response.message)
            }
            if (!response.error) {
              this.currentState = 2;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка отправки запроса');
            }
          }
        }));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
