import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticlesInfoType} from "../../../../types/articles-info.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {CommentsResponseType, CommentType} from "../../../../types/comments-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {UserType} from "../../../../types/user.type";
import {NgForm} from "@angular/forms";
import {CommentsService} from "../../../shared/services/comment.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ReactionEnum} from "../../../../types/reaction.enum";
import {ReactionType} from "../../../../types/reaction.type";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  standalone: false,
  styleUrls: ['./article.component.less']
})
export class ArticleComponent implements OnInit, OnDestroy {
  article!: ArticlesInfoType;
  commentsOnPage: CommentType[] = [];
  articleCommentsReactions: ReactionType[] = []
  relatedArticle: ArticleType[] = [];
  serverStaticPath: string = environment.serverStaticPath;
  userIsLoggedIn: boolean = false;
  isLoading: boolean = false;
  userInfo: UserType | null = null;
  commentForm = {
    text: '',
  };
  commentCountOnPage: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(private articleService: ArticlesService, private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private commentService: CommentsService,
              private _snackBar: MatSnackBar
  ) {
    this.userIsLoggedIn = this.authService.getIsLoggedIn();
    if (this.authService.getIsLoggedIn()) {
      this.userInfo = this.authService.getUserInfo();
    }
  }

  ngOnInit(): void {
    this.subscription.add(this.authService.isLogged$.subscribe((data: boolean) => {
        if (data) {
          this.userInfo = this.authService.getUserInfo();
          this.userIsLoggedIn = true;
        } else {
          this.userInfo = null;
          this.userIsLoggedIn = false;
        }
      })
    )
    this.subscription.add(this.activatedRoute.params.subscribe(params => {
        if (params) {

          this.articleService.getArticle(params['url'])
            .subscribe(data => {
              this.article = data;
              this.commentsOnPage = data.comments;
              this.article.text = this.replaceDuplicateText(data.text);
              this.commentCountOnPage = data.commentsCount >= 3 ? 3 : data.commentsCount;
              if (this.userIsLoggedIn) {
                this.commentService.getArticleCommentsReactions(this.article.id)
                  .subscribe(data => {
                    if ((data as DefaultResponseType).error) {
                      throw new Error((data as DefaultResponseType).message)
                    }
                    this.articleCommentsReactions = data as ReactionType[]
                  })
              }
            });

          this.articleService.getRelatedArticles(params['url'])
            .subscribe(data => {
              this.relatedArticle = data
            });
        }
      })
    )
  };

  replaceDuplicateText(text: string): string {
    const textWithoutH1 = text.replace(/\s?<h1[^>]*?>.*?<\/h1>\s?/si, ' ');
    const description = `<p>${this.article.description}</p>`;
    return textWithoutH1.replace(description, ' ')
  }

  submitForm(writeComment: NgForm) {
    if (writeComment.valid && this.article.id) {
      this.subscription.add(this.commentService.sendNewComment(this.commentForm.text, this.article.id)
        .subscribe({
          next: (data) => {
            if (data.error) {
              this._snackBar.open(data.message);
              console.log(data.message);
              throw new Error(data.message);
            }
            this.commentForm.text = '';
            writeComment.reset();
            this.updateDataArticle();
          },
          error: (error) => {
            console.log(error.error.message);
          }
        })
      )
    }
  }

  downloadComments() {
    this.isLoading = true;
    this.subscription.add(this.commentService.getComments(this.commentCountOnPage, this.article.id)
      .subscribe(data => {
        if ((data as DefaultResponseType).error) {
          console.log((data as DefaultResponseType).message);
          this.isLoading = false;
          throw new Error((data as DefaultResponseType).message);
        }
        this.commentsOnPage = [...this.commentsOnPage, ...(data as CommentsResponseType).comments];
        this.article.commentsCount = (data as CommentsResponseType).allCount;
        this.commentCountOnPage += (data as CommentsResponseType).comments.length;
        this.isLoading = false;
      })
    )
  }

  changeReaction(event: { commentId: string, reaction: ReactionEnum | null }) {
    if (this.userIsLoggedIn) {
      this.commentsOnPage.forEach(itemComment => {
        if (itemComment.id === event.commentId) {
          const oldReaction: ReactionType | undefined = this.articleCommentsReactions.find(item => item.comment === event.commentId);
          if (oldReaction) {
            if (event.reaction && event.reaction === ReactionEnum.like && oldReaction.action === ReactionEnum.dislike) {
              itemComment.likesCount++
              itemComment.dislikesCount--
            } else if (event.reaction && event.reaction === ReactionEnum.dislike && oldReaction.action === ReactionEnum.like) {
              itemComment.dislikesCount++
              itemComment.likesCount--
            } else if (!event.reaction && oldReaction.action === ReactionEnum.dislike) {
              itemComment.dislikesCount--
            } else if (!event.reaction && oldReaction.action === ReactionEnum.like) {
              itemComment.likesCount--
            }
          } else {
            if (event.reaction && event.reaction === ReactionEnum.like) {
              itemComment.likesCount++
            } else if (event.reaction && event.reaction === ReactionEnum.dislike) {
              itemComment.dislikesCount++
            }
          }
          this.subscription.add(this.commentService.getArticleCommentsReactions(this.article.id)
            .subscribe(data => {
              if ((data as DefaultResponseType).error) {
                throw new Error((data as DefaultResponseType).message)
              }
              this.articleCommentsReactions = data as ReactionType[]
            })
          )
        }
      })
    }
  }

  updateDataArticle() {
    this.subscription.add(this.articleService.getArticle(this.article.url)
      .subscribe({
        next: (data) => {
          // this.commentsOnPage = [data.comments[0], ...this.commentsOnPage]
          // this.article.comments = data.comments;
          this.article.commentsCount = data.commentsCount;
          this.commentCountOnPage++;
        },
        error: (error) => {
          console.log(error.error.message);
        }
      })
    )
  }


  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
