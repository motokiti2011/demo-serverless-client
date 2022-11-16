import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { selectCategory, selectQuantity } from 'src/app/entity/product-category';
import { product } from 'src/app/entity/product';
import { defaltProduct } from 'src/app/entity/product';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadComponent } from './upload/upload.component';
import { ApiService } from 'src/app/service/api.service';
import { LoginUserService } from 'src/app/service/login-user.service';

export interface DialogData {
  userName: string;
  passwd: string;
}

@Component({
  selector: 'app-pridyct-post',
  templateUrl: './product-post.component.html',
  styleUrls: ['./product-post.component.css']
})
export class ProductPostComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<ProductPostComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData,
    private api: ApiService,
    private authUser: LoginUserService,
  ) { }

  @ViewChild(UploadComponent) child!: UploadComponent;

  /** インプットデータ*/
  postInputData: product = defaltProduct;
  /** カテゴリー初期値 */
  selectedCategory = 'food';
  /** カテゴリー数量初期値 */
  selectedQuantity = '1';
  /** カテゴリーセレクトボックス */
  selectCategory = selectCategory;
  /** 数量セレクトボックス */
  selectQuantity = selectQuantity;
  /** 登録ボタン活性制御フラグ */
  invalid = true;
  /** アップロードファイルの有無 */
  isUploadFile = false;
  /** ローディング制御 */
  loading = false;



  ngOnInit(): void {
    this.loading = true;
    // 認証ユーザー情報取得
    this.authUser.user$.subscribe(user => {
      if (user) {
        this.postInputData.productContributorId = user.userId;
        this.postInputData.productContributor = user.userName;
        // カテゴリーと数量は初期値があるので設定する。
        this.postInputData.productCategory = this.selectedCategory;
        this.postInputData.productQuantity = this.selectedQuantity;
      } else {
        alert('ログインが必要です。');
        this.closeModal();
      }
      this.loading = false;
    });
  }


  /**
   * 入力状況のチェックを行う
   */
  onInputCheck() {
    if (this.postInputData.productName !== ''
      && this.postInputData.productExplanation !== '') {
      this.invalid = false;
    } else {
      this.invalid = true;
    }
  }

  /**
   * アップロードファイルの有無をチェック
   */
  onUpload(e: any) {
    this.isUploadFile = e;
    console.log(e);
    console.log(this.isUploadFile);
  }

  /**
   * 確定ボタン押下時のイベント
   */
  getResult() {
    // 画像アップロードが必要な場合
    if (this.isUploadFile) {
      // 先にS3ファイルアップロードを実施、結果URLをDBへ保管する
      this.child.onClickUpload();
    } else {
      this.postProduct();
    }
  }

  /**
   * アップロード後の情報を商品データに書き込みし商品登録処理を行う
   * @param e 
   */
  onDataPost(e: String) {
    this.postInputData.productImageUrl = e;
    this.postProduct();
  }

  /**
   * 商品登録処理
   */
  private postProduct() {
    this.loading = true;
    this.api.postProduct(this.postInputData).subscribe(result => {
      if (result) {
        alert('登録成功')
        this.closeModal();
      } else {
        alert('登録失敗')
      }
      this.loading = false;
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


  /**
   * 商品名入力イベント
   */
  onNameInput() {
    console.log(this.postInputData.productName);
  }

  /**
   * 説明入力イベント
   */
  onExplanationInput() {
    console.log(this.postInputData.productExplanation);
  }

  /**
   * カテゴリー変更イベント
   */
  onCategory() {
    this.postInputData.productCategory = this.selectedCategory;
  }
  /**
   * 数量変更イベント
   */
  onQuantity() {
    this.postInputData.productQuantity = this.selectedQuantity;
  }

}
