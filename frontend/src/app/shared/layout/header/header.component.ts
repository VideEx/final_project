import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserType} from "../../../../types/user.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  standalone: false
})
export class HeaderComponent {
  isLogged: boolean = false;
  userName: string | undefined = '';

  constructor(private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar,) {
    this.isLogged = this.authService.getIsLoggedIn();

    if (this.isLogged) {
      this.userName = this.authService.getUserInfo()?.name;
    }
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
        this.isLogged = isLoggedIn;


        const accessToken = this.authService.getTokens().accessToken;
        if (isLoggedIn && accessToken) {
          this.authService.getUsersInfo(accessToken).subscribe((data: UserType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              console.log((data as DefaultResponseType).message);
              throw new Error((data as DefaultResponseType).message);
            }
            this.authService.setUserInfo(data as UserType);
            this.userName = (data as UserType).name;
          });
        } else {
          this.userName = '';
        }
      }
    );
  }

  logout():
    void {
    this.authService.logout().subscribe({
      next: () => {
        this.doLogout();
      },
      error: () => {
        this.doLogout();
      }
    });
  }

  doLogout()
    :
    void {
    this.authService.removeTokens();
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

}
