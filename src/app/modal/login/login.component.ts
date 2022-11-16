import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CognitoService } from 'src/app/service/cognito.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { LoginUserService } from 'src/app/service/login-user.service';

export interface DialogData {
  userName: string;
  passwd: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // ログイン情報
  loginData = {
    userName: '',
    passwd: '',
  }

  hoge = '';

  lading = false;

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private cognito: CognitoService,
    private loginUser: LoginUserService,
    private overlay: Overlay,
    public _dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData
  ) { }

  ngOnInit(): void {
    this.data = this.loginData;
  }

  /**
   * ログインボタン押下イベント
   */
  btnAction() {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.lading = true;
    this.login(this.data.userName, this.data.passwd)
      .then((result) => {
        console.log(result);
        this.lading = false;
        this.overlayRef.detach();
      }).catch((err) => {
        console.log(err);
        this.lading = false;
        this.overlayRef.detach();
      });
  }

  /**
   * ✖ボタン押下
   */
  onClose(): void {
    this._dialogRef.close();
  }

  /**
   * モーダルクローズ
   */
  closeModal() {
    this._dialogRef.close(true);
  }

  async login(username: string, password: string): Promise<any> {
    try {
      const isLogin = await this.cognito.isAuthenticated();
      console.log(isLogin);
      if (isLogin === null) {
        const result = await this.cognito.login(username, password);
        this.hoge = JSON.stringify(result);
        this.closeModal();
        this.hoge = 'ログインしました。';
      } else {
        this.cognito.logout();
        // this.buttonTitle = 'ログイン';
        this.hoge = 'ログアウトしました。';
      }
    } catch (e) {
      if (e === null) {
        this.cognito.logout();
        // this.buttonTitle = 'ログイン';
        this.hoge = 'セッションの有効期限切れです。';
      }
    }
  }







}
