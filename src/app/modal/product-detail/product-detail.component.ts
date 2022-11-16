import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { product } from 'src/app/entity/product';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  /** 表示内容 */
  productDetial: product = {productId: '', productName: '',productCategory:'', productQuantity: '', productExplanation: '', productContributorId: '', productContributor: '', productImageUrl: ''}

  photoSrc:any;

  constructor(
    public _dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: product
  ) { }

  ngOnInit(): void {
    this.productDetial = this.data;
    this.photoSrc = this.data.productImageUrl;
  }

  /**
   * モーダルクローズ
   */
  closeModal() {
    this._dialogRef.close();
  }

}
