import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CognitoService } from 'src/app/service/cognito.service';
import { errorMsg } from 'src/app/entity/error';
import { user } from 'src/app/entity/user';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent implements OnInit {

  title = '新規登録';

  /** 表示切替区分 */
  confirmationDiv = false;
  /** エラーメッセージ */
  dispMsg: any = '';
  userInfo: user = { userId: '', userName: '', mailAdress: '' }

  constructor(
    private cognito: CognitoService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {

  }

  /**
   * 新規ユーザー登録を行う
   * @param email 
   * @param password 
   * @param userId 
   */
  onSignup(email: string, password: string, userId: string) {
    this.cognito.signUp(userId, password, email)
      .then((result) => {
        this.confirmationDiv = true;
        this.dispMsg = '';
        this.userInfo.userId = userId;
        this.userInfo.userName = '';
        this.userInfo.mailAdress = email;
        console.log(result);
      }).catch((err) => {
        this.dispMsg = errorMsg[0].value;
        if (err == errorMsg[1].message) {
          this.dispMsg = errorMsg[1].value;
        }
      });
  }

  /**
   * ユーザー登録後、確認コード入力を行いユーザー登録を完了させる。
   * @param confirmationEmail 
   * @param confirmationCode 
   */
  onConfirmation(confirmationEmail: string, confirmationCode: string) {
    console.log(confirmationEmail);
    this.cognito.confirmation(confirmationEmail, confirmationCode)
      .then((result) => {
        this.dispMsg = '';
        console.log(result);
        if (result) {
          alert('登録完了！！')
          this.router.navigate(["/"])
        } else {
          alert('失敗')
        }
      });
  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }

}
