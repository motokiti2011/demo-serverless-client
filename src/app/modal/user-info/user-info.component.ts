import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { user } from 'src/app/entity/user';
import { CognitoService } from 'src/app/service/cognito.service';
import { ApiService } from 'src/app/service/api.service';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  /** ユーザーID */
  authUserId: string | null = '';
  /** ユーザー未登録区分 */
  anResister = false;
  // ログイン情報
  user: user = {
    userId: '',
    userName: '',
    mailAdress: ''
  }

  inputData = {
    userName: '',
    email: '',
  }

  oldPasswd = '';
  newPasswd = '';

  constructor(
    private cognito: CognitoService,
    private apiService: ApiService,
    public _dialogRef: MatDialogRef<UserInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: user,
  ) { }

  ngOnInit(): void {
    this.authUserId = this.cognito.initAuthenticated();
    if (!this.authUserId) {
      alert('ログインが必要です。');
      this.closeModal();
    } else {
      this.getUserInfo(this.authUserId);
    }
  }

  /**
   * ユーザー情報を取得
   * @param userId 
   */
  private getUserInfo(userId: string) {
    this.apiService.getUser(userId).subscribe(userInfo => {
      if(userInfo.Items[0]) {
        this.user.userName = userInfo.Items[0].userName
        this.user.mailAdress = userInfo.Items[0].mailAdress
        this.anResister = false;
      } else {
        // 未登録の場合登録用フォームを表示
        this.anResister = true;
      }
    })
  }

  /**
   * 登録ボタン押下イベント
   */
  onResister() {
    if (this.authUserId) {
      this.user = {
        userId: this.authUserId,
        userName: this.inputData.userName,
        mailAdress: this.inputData.email
      }
    } else {
      alert('ログインが必要です。');
      this.closeModal();
    }
    this.apiService.postUser(this.user).subscribe(data => {
      if (data) {
        alert('登録完了');
        this.anResister = false;
        this.closeModal();
      }
    })
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

  /**
   * パスワード変更
   */
  onChengePasswd() {
    this.cognito.changePassword(this.oldPasswd, this.newPasswd)
      .then((result: any) => {
        alert('パスワードを変更しました。');
        console.log(result);
        this.closeModal();
      }).catch((err: any) => {
        alert('パスワード変更に失敗しました。');
        console.log(err);
      });
  }

}
