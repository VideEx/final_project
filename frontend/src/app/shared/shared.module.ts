import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArticleCardComponent} from "./components/article-card/article-card.component";
import {RouterLink} from "@angular/router";
import {ServicesCardComponent} from "./components/services-card/services-card.component";
import {ReviewCardComponent} from "./components/review-card/review-card.component";
import {FilterComponent} from "./components/filter/filter.component";
import {DatePipePipe} from "./pipe/date-pipe.pipe";
import {OrderPopupComponent} from "./components/order-popup/order-popup.component";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ConsultationPopupComponent} from "./components/consultation-popup/consultation-popup.component";

@NgModule({
  declarations: [
    ArticleCardComponent,
    ServicesCardComponent,
    ReviewCardComponent,
    FilterComponent,
    DatePipePipe,
    OrderPopupComponent,
    ConsultationPopupComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    ArticleCardComponent,
    ServicesCardComponent,
    ReviewCardComponent,
    FilterComponent,
    DatePipePipe,
    OrderPopupComponent,
    ConsultationPopupComponent
  ]
})
export class SharedModule { }
