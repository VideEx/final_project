
import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {CommentType} from "../../../../types/comments-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {ReactionEnum} from "../../../../types/reaction.enum";
import {CommentsService} from "../../../shared/services/comment.service";
import {ReactionType} from "../../../../types/reaction.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less'],
  standalone: false
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() comment: CommentType;
  @Output() addToReactionEvent: EventEmitter<{ commentId: string, reaction: ReactionEnum | null }> = new EventEmitter<{ commentId: string, reaction: ReactionEnum | null }>();

  userIsLoggedIn: boolean;
  userReaction: ReactionEnum | null = null
  reactionEnum = ReactionEnum;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private commentsService: CommentsService, private _snackBar: MatSnackBar,) {
    this.userIsLoggedIn = this.authService.getIsLoggedIn();

    this.comment = {
      id: "",
      text: '',
      date: '',
      likesCount: 0,
      dislikesCount: 0,
      user: {
        id: '',
        name: ''
      }
    }
  }

  ngOnInit(): void {
    if (this.userIsLoggedIn) {
      this.subscription.add(this.commentsService.getReactionForComment(this.comment.id)
        .subscribe({
          next: (data) => {
            if ((data as DefaultResponseType).error) {
              throw new Error((data as DefaultResponseType).message)
            }
            if (data && (data as ReactionType[]).length > 0) {
              this.userReaction = (data as ReactionType[])[0].action;
            } else if ((data as ReactionType[]).length === 0) {
              this.userReaction = null
            }
          },
          error: (error: HttpErrorResponse) => {
            console.log(error)
          }
        }))
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  reactionToComment(reaction: ReactionEnum, commentsId: string) {
    if (this.userIsLoggedIn) {
      this.subscription.add(this.commentsService.sendReaction(reaction, commentsId)
        .subscribe({
          next: data => {
            if (data.error) {
              this._snackBar.open(data.message)
            } else {
              this._snackBar.open('Ваш голос учтен');
              this.getReaction();
            }
          },
          error: () => this._snackBar.open('Жалоба уже отправлена')
        }))
    }
  }

  getReaction(): void {
    if (this.userIsLoggedIn) {
      this.subscription.add(this.commentsService.getReactionForComment(this.comment.id)
        .subscribe({
          next: (data) => {
            if ((data as DefaultResponseType).error) {
              throw new Error((data as DefaultResponseType).message)
            }
            if (data && (data as ReactionType[]).length > 0) {
              this.userReaction = (data as ReactionType[])[0].action;
            } else if ((data as ReactionType[]).length === 0) {
              this.userReaction = null
            }
            this.changeReaction(this.userReaction)
          },
          error: (error: HttpErrorResponse) => {
            console.log(error)
          }
        }))
    }
  }

  changeReaction(reaction: ReactionEnum | null) {
    this.addToReactionEvent.emit({commentId: this.comment.id, reaction: reaction});
  }

}
