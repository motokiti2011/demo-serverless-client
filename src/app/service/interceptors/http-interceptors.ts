import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CognitoService } from '../cognito.service';

@Injectable({
  providedIn: 'root'
})
export class PostInterceptor implements HttpInterceptor {
    constructor(private cognito: CognitoService) {}
    
    // intercept(
    //     req: HttpRequest<any>,
    //     next: HttpHandler
    // ): Observable<HttpEvent<any>> {
    //     const newReq = req.clone(
    //         {headers: req.headers.set('Authorization', this.service.getCurrentUserIdToken)}
    //     );
    //     // cloneされてヘッダーを付与したリクエストを次の処理に引き渡す
    //     return next.handle(newReq);
    // }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      //👇現在のIDトークンを取得
      const authHeader = this.cognito.getCurrentUserIdToken();
      //👇オリジナルのリクエストヘッダーを複製し、IDトークンを追加したものに差替え
      const authReq = req.clone({
          headers: req.headers.set('Authorization', authHeader)
      });
      //👇変形したリクエストとして送信側へ流す
      return next.handle(authReq);
  }
}

export const POST_PROVIDER = {
  provide: HTTP_INTERCEPTORS,
  useClass: PostInterceptor,
  multi: true
};