import {Component, Input} from '@angular/core';
import {ServiceType} from "../../../../types/service.type";
import {OrderPopupComponent} from "../order-popup/order-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-services-card',
  standalone: false,
  templateUrl: './services-card.component.html',
  styleUrl: './services-card.component.less'
})
export class ServicesCardComponent {
  @Input() service: ServiceType;
  private subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog) {
    this.service = {
      id: '',
      title: '',
      description: '',
      image: '',
      category: '',
      price: ''
    }
  }
  openDialog(category?: string): void {
    console.log(category?.toLowerCase())
    const dialogRef = this.dialog.open(OrderPopupComponent, {
      data: {category}
    });
    this.subscription.add(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialog.open(OrderPopupComponent, {
          data: {}
        });
      }
    }));
  }
}
