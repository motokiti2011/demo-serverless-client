import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { user } from 'src/app/entity/user';
import { CognitoService } from 'src/app/service/cognito.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {


  // ログイン情報
  user = {
    userName: '',
    email: '',
  }

  oldPasswd = '';
  newPasswd = '';

  constructor(
    private cognito: CognitoService,
    public _dialogRef: MatDialogRef<UserInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: user,
  ) { }

  ngOnInit(): void {
  }

  /**
   * ログインボタン押下イベント
   */
  actionFunction() {
    // this.data = this.login;
    this.closeModal();
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
    this._dialogRef.close();
  }

  /**
   * パスワード変更
   */
  onChengePasswd() {
    this.cognito.changePassword(this.oldPasswd, this.newPasswd)
      .then((result:any) => {
        alert('パスワードを変更しました。');
        console.log(result);
      }).catch((err:any) => {
        alert('パスワード変更に失敗しました。');
        console.log(err);
        // if (err == errorMsg[1].message) {
        //   this.dispMsg = errorMsg[1].value;
        // }
      });
  }

}
