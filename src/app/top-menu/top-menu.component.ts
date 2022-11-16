import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../modal/login/login.component';
import { UserInfoComponent } from '../modal/user-info/user-info.component';
import { CognitoService } from 'src/app/service/cognito.service';
import { ApiService } from '../service/api.service';
import { LoginUserService } from '../service/login-user.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {


  /** ログインユーザー名 */
  loginUser = '仮ユーザ';
  /** ログイン状態区分 */
  isLogin = true;

  loginData = {
    userName: '',
    passwd: '',
  }

  loadDiv = false;

  constructor(
    private router: Router,
    public login: MatDialog,
    public userInfo: MatDialog,
    private cognito: CognitoService,
    private apiService: ApiService,
    private auth: LoginUserService,
  ) { }

  ngOnInit(): void {
    this.authenticated();
  }

  /**
   * ログイン状態確認
   */
  private authenticated() {
    const authUser = this.cognito.initAuthenticated();
    
    if (authUser !== null) {
      // ログイン状態の場合
      this.isLogin = false;
      const log = this.cognito.getCurrentUserIdToken();
      console.log(log);
      // 認証済の場合表示するユーザー情報を取得
      this.setAuthUser(authUser);
    } else {
      this.isLogin = true;

    }
  }

  private setAuthUser(authUser: string) {
    // 認証済の場合表示するユーザー情報を取得
    this.apiService.getUser(authUser).subscribe(data => {
      console.log(data);
      if (data) {
        this.loginUser = data.Items[0].userName;
        // Subjectにてログイン状態を保持する。
        this.auth.login(data.Items[0]);
      }
    });
  }


  /**
   * ログインボタン押下時
   */
  onLogin() {
    const dialogRef = this.login.open(LoginComponent, {
      width: '300px',
      height: '300px',
      data: this.loginData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        const authUser = this.cognito.initAuthenticated();
        if (authUser !== null) {
          this.setAuthUser(authUser);
          this.isLogin = false;
        }
      } else {
        this.isLogin = true;
      }
    });
  }

  /**
   * ログアウト押下時イベント
   */
  onLogout() {
    this.cognito.logout();
    this.auth.logout();
    this.isLogin = true;
  }

  /**
   * ユーザー編集ボタン押下時
   */
  onUserInfo() {
    const dialogRef = this.userInfo.open(UserInfoComponent, {
      width: '400px',
      height: '450px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  /**
   * 新規登録ボタン押下時
   */
  onSingup() {
    this.router.navigate(["/singup"])
  }

}
