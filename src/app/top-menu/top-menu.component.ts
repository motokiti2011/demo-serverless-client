import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../modal/login/login.component';
import { UserInfoComponent } from '../modal/user-info/user-info.component';
import { CognitoService } from 'src/app/service/cognito.service';
import { ApiService } from '../service/api.service';
import { LoginUserService } from '../service/login-user.service';
import { ProductMenuComponent } from '../product-menu/product-menu.component';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {


  /** ログインユーザー名 */
  loginUser = 'ゲストユーザー';
  /** ログイン状態区分 */
  isLogin = true;
  /** ユーザー未登録区分 */
  unRegistered = false;

  /** 子コンポーネントを読み込む */
  @ViewChild(ProductMenuComponent) child!: ProductMenuComponent;


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
    this.authenticated();;
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

  /**
   * 認証情報からユーザー情報を取得
   * @param authUser
   */
  private setAuthUser(authUser: string) {
    // 認証済の場合表示するユーザー情報を取得
    this.apiService.getUser(authUser).subscribe(data => {
      console.log(data);
      if (data.Items[0]) {
        this.loginUser = data.Items[0].userName;
        this.unRegistered = false;
        // Subjectにてログイン状態を保持する。
        this.auth.login(data.Items[0]);
      } else {
        this.loginUser = 'ユーザー情報未設定'
        this.unRegistered = true;
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
      this.child.ngOnInit
      this.authenticated();
    });
  }

  /**
   * ログアウト押下時イベント
   */
  onLogout() {
    this.cognito.logout();
    this.auth.logout();
    this.isLogin = true;
    this.ngOnInit;
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
      this.child.ngOnInit;
      this.authenticated();
    });
  }

  /**
   * 新規登録ボタン押下時
   */
  onSingup() {
    this.router.navigate(["/singup"])
  }

}
