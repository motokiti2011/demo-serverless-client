import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import { errorMsg } from '../entity/error';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  private userPool: CognitoUserPool;
  constructor() {
    AWS.config.region = environment.region;//👈AWSサービスを配置したリージョンを指定
    this.userPool = new CognitoUserPool({
      UserPoolId: environment.userPoolId, //👈ユーザープールIDに書きかえ
      ClientId: environment.clientId//👈アプリクライアントIDに書きかえ
    });
  }


  /**
   * ログイン
   * @param username 
   * @param password 
   * @returns 
   */
  login(username: string, password: string): Promise<any> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool,
      Storage: localStorage
    });
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          alert('ログインしました。');
          let msg = `Id token: ${result.getIdToken().getJwtToken()}\n`;
          msg += `Access token: ${result.getAccessToken().getJwtToken()}\n`;
          msg += `Refresh token: ${result.getRefreshToken().getToken()}`;
          console.log(msg);
          resolve(msg);
        },
        onFailure: (err) => {
          if (err.message == errorMsg[3].message) {
            alert(errorMsg[3].value);
          } else {
            alert(err.message);
          }
          reject(err);
        }
      });
    });
  }

  /**
   * 認証状態確認
   * @returns 
   */
  isAuthenticated(): Promise<any> {
    const cognitoUser = this.userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      cognitoUser === null && resolve(cognitoUser);
      if (cognitoUser == null) {
        return;
      }
      cognitoUser.getSession((err: any, session: any) => {
        err ? reject(err) : (!session.isValid() ? reject(session) : resolve(session));
      });
    });
  }

  /**
   * 認証者情報を確認し取得できた場合その情報を取得する
   * @returns 
   */
  initAuthenticated(): string | null {
    const cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser === null) {
      return null;
    }
    console.log(sessionStorage)
    // ユーザー名を取得する
    return cognitoUser.getUsername();
  }

  /**
   * IDトークン取得
   * @returns 
   */
  getCurrentUserIdToken(): any {
    const cognitoUser = this.userPool.getCurrentUser();
    let rslt = null;
    cognitoUser != null && cognitoUser.getSession((err: any, session: any) => {
      if (err) {
        alert(err);
      } else {
        rslt = session.getIdToken().getJwtToken();
      }
    });
    return rslt;
  }

  /**
 * パスワード変更
 * @param oldPasswd 
 * @param newPasswd
 * @returns 
 */
  changePassword(oldPasswd: string, newPasswd: string): any {
    const cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser == null) {
      return;
    }
    return new Promise<any>((resolve, err) => {
      cognitoUser.getSession(() => {
        cognitoUser.changePassword(oldPasswd, newPasswd, (error, result) => {
          resolve({ result, error });
        });
      });
    });
  }

  /**
   * ログアウト
   */
  logout() {
    alert('Logout');
    const currentUser = this.userPool.getCurrentUser();
    currentUser && currentUser.signOut();
  }

  /**
   * 新規ユーザー登録
   * @param username 
   * @param password 
   * @param mail 
   * @returns 
   */
  signUp(username: string, password: string, mail: string): Promise<any> {
    const dataEmail = { Name: 'email', Value: mail };
    const attributeList: CognitoUserAttribute[] = [];
    const validationData: CognitoUserAttribute[] = [];
    attributeList.push(new CognitoUserAttribute(dataEmail));
    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, attributeList, validationData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * 確認コード入力
   * @param username 
   * @param confirmation_code 
   * @returns 
   */
  confirmation(username: string, confirmation_code: string): Promise<any> {
    const userData = { Username: username, Pool: this.userPool };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmation_code, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getCredentials(): Promise<AWS.CognitoIdentityCredentials> {
    const cognitoUser = this.userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      if (cognitoUser === null) {
        reject(cognitoUser);
        return;
      }
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          reject(err);
        } else {
          const creds = this.buildCognitoCreds(session);
          AWS.config.credentials = creds;
          resolve(creds);
        }
      });
    });
  }

  buildCognitoCreds(session: any): AWS.CognitoIdentityCredentials {
    const logins: AWS.CognitoIdentity.LoginsMap = {};
    const url = `cognito-idp.${environment.region}.amazonaws.com/${environment.userPoolId}`;
    logins[url] = session.getIdToken().getJwtToken();
    return new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.identityPoolId,
      Logins: logins
    });
  }



}
