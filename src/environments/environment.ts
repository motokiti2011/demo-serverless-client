// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  /** リージョン */
  region: 'us-east-1',
  /** Cognito IdentityPoolId */
  identityPoolId: 'us-east-1:255efb6a-2ded-4eb0-9ea7-b34b8618cc52',
  /** ユーザープールID */
  userPoolId: 'us-east-1_bM6PT3pjg',
  /** アプリケーションクライアントID */
  clientId: '58ruihh3a8aetrtfa1guo3l9a4',
  /** S3バケット名 */
  bucketName: 'sample-cognito-test1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
