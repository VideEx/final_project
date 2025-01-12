import {Component, Input, OnInit} from '@angular/core';
import {ServiceType} from "../../../../types/service.type";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {OrderPopupComponent} from "../../components/order-popup/order-popup.component";
import {ConsultationPopupComponent} from "../../components/consultation-popup/consultation-popup.component";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.less'],
    standalone: false
})
export class FooterComponent {

  @Input() service!: ServiceType;
  private subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog) {
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ConsultationPopupComponent, {
      data: {}
    });
    this.subscription.add(dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        this.dialog.open(OrderPopupComponent, {
          data: {}
        });
      }
    }));
  }

}
