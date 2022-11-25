import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { product } from '../entity/product';
import { user } from '../entity/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiEndPoint: string = environment.apiEmdPoint;

  /**
   * 商品リストをGSIで取得する
   * @param 商品カテゴリー
   * @return productList[]
   */
  getProductList(category: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "productCategory": category
      }
    };
    return this.http.post<product>(this.apiEndPoint + '/productlist', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: product) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 商品リストをPKで取得する
   * @param 商品ID
   * @return product
   */
  getProduct(id: String): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "productId": id
      }
    };
    return this.http.post<product>(this.apiEndPoint + '/productitem/postitem', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: product) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 商品情報を登録
   * @param 商品情報  
   * @returns status
   */
  public postProduct(product: product): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "PUT",
      "Keys": {
        "productName": product.productName,
        "productCategory": product.productCategory,
        "productContributor": product.productContributor,
        "productContributorId": product.productContributorId,
        "productExplanation": product.productExplanation,
        "productImageUrl": product.productImageUrl,
        "productQuantity": product.productQuantity
      }
    }
    return this.http.post<product>(this.apiEndPoint + '/productitem/postitem', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: product) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 商品情報を更新
   * @param 商品情報  
   * @returns status
   */
  public putProduct(product: product): Observable<any> {
    return this.http.put<product>(this.apiEndPoint + product.productId, product, { observe: 'response' });
  }

  /**
   * 商品情報を削除
   * @param 商品情報  
   * @returns status
   */
  public deleteProduct(product: product): Observable<number> {
    return this.http.delete(this.apiEndPoint + product.productId, { observe: 'response' }).pipe(
      // HTTPステータスコードを戻す
      map((res: HttpResponse<any>) => res.status),
      // エラー時もHTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(err.status))
    );
  }

  /**
   * ユーザーIDからユーザー情報を取得する。
   * @param userId 
   * @returns 
   */
  public getUser(userId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "userId": userId
      }
    };
    return this.http.post<user>(this.apiEndPoint + '/users', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: user) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

    /**
     * CognitoユーザーIDをPKにユーザー情報をDynamoDBに登録する
     * @param user 
     * @returns 
     */
     public postUser(user: user): Observable<any> {
      // リクエストボディ生成
      const body = {
        "OperationType": "PUT",
        "Keys": {
          "userId": user.userId,
          "userName": user.userName,
          "mailAdress": user.mailAdress
        }
      };
      return this.http.post<user>(this.apiEndPoint + '/users', body).pipe(
        // 取得できた場合ユーザー情報を返却
        map((res: user) => res),
        // エラー時HTTPステータスコードを戻す
        catchError((err: HttpErrorResponse) => of(undefined))
      );
    }

}