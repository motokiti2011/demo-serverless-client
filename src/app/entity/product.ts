export interface product {
  // 商品ID
  productId:String;
  // 商品名
  productName:String;
  // 商品カテゴリー
  productCategory:String;
  // 商品数
  productQuantity:String;
  // 商品説明
  productExplanation:String;
  // 商品登録者ID
  productContributorId:String;
  // 商品登録者
  productContributor:String;
  // 商品画像URL
  productImageUrl:String;
}


export const defaltProduct: product = {
    // 商品ID
    productId:'',
    // 商品名
    productName:'',
    // 商品カテゴリー
    productCategory:'',
    // 商品数
    productQuantity:'',
    // 商品説明
    productExplanation:'',
    // 商品登録者ID
    productContributorId:'',
    // 商品登録者
    productContributor:'',
    // 商品画像URL
    productImageUrl:''
}


