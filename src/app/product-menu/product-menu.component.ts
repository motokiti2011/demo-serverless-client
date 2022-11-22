import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../service/api.service';
import { MatDialog } from '@angular/material/dialog';
// import { ProductDetailComponent } from '../modal/user-info/product-detail/product-detail.component';
import { ProductDetailComponent } from '../modal/product-detail/product-detail.component';
import { ProductPostComponent } from '../modal/product-post/product-post.component';
import { product } from '../entity/product';
import { S3UploadService } from '../service/s3-upload.service';
import { LoginUserService } from '../service/login-user.service';
import { selectCategory } from '../entity/product-category';


/**
 * 商品リスト
 */
export interface productList {
  // 商品ID
  productId: String;
  // 商品名
  productName: String;
  // 商品登録者
  productContributor: String;
  // 商品画像URL
  productImageUrl: String;
}

@Component({
  selector: 'app-product-menu',
  templateUrl: './product-menu.component.html',
  styleUrls: ['./product-menu.component.css']
})
export class ProductMenuComponent implements OnInit {


  /** 表示商品一覧 */
  dispList: productList[] = [];
  /** 商品表示区分 */
  listDiv = false;

  remoteFiles: any;

  photoSrc: any;

  loading = false;

  /** 表示順セレクトボタン */
  selected = 'food';

  // 認証状態フラグ
  @Input() isLogin: boolean = true;

  selectCategory = selectCategory;

  constructor(
    private apiService: ApiService,
    public detail: MatDialog,
    public post: MatDialog,
    private s3: S3UploadService,
    private auth: LoginUserService,
  ) { }

  ngOnInit(): void {
    this.getProductList();
  }

  /**
   * 商品一覧情報を取得する
   */
  private getProductList() {
    this.loading = true;
    // 商品一覧を取得
    this.apiService.getProductList(this.selected).subscribe(result => {
      if (result) {
        // データ取得できた場合、表示内容をセット
        if (result.Items.length > 0) {
          this.dispList = result.Items;
          this.listDiv = true;
          this.loading = false;
          return;
        }
      }
      this.listDiv = false;
      this.loading = false;
    });
  }


  /**
   * 選択した商品の詳細表示画面に遷移する
   * @param productId 
   */
  onProductDetail(productId: String) {
    this.apiService.getProduct(productId).subscribe(prductData => {
      // モーダル展開
      const dialogRef = this.detail.open(ProductDetailComponent, {
        width: '300px',
        height: '400px',
        data: prductData.Items[0]
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    });
  }

  /**
   * 商品を登録するボタン押下時イベント
   */
  onProductPost() {
    const productDetial: product = { productId: '', productName: '', productCategory: '', productQuantity: '', productExplanation: '', productContributorId: '', productContributor: '', productImageUrl: '' };
    const postData: { product: product, input: boolean } = { product: productDetial, input: false };
    // モーダル展開
    const dialogRef = this.post.open(ProductPostComponent, {
      width: '500px',
      height: '500px',
      data: postData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  onDisplayList() {
    console.log(this.selected);
    this.getProductList();
  }

}
