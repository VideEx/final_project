import {Component, Input} from '@angular/core';
import {ReviewType} from "../../../../types/review.type";

@Component({
  selector: 'app-review-card',
  standalone: false,
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.less'
})
export class ReviewCardComponent {
  @Input() review: ReviewType;

  constructor() {
    this.review = {
      name: '',
      image: '',
      text: ''
    }
  }

}
