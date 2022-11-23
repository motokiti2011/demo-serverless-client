import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from './material/material/material.module';
import { HttpClientModule} from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { SingupComponent } from './singup/singup.component';
import { LoginComponent } from './modal/login/login.component';
import { ProductPostComponent } from './modal/product-post/product-post.component';
import { ProductDetailComponent } from './modal/product-detail/product-detail.component';
import { UserInfoComponent } from './modal/user-info/user-info.component';
import { ProductMenuComponent } from './product-menu/product-menu.component';
import { MessageDialogComponent } from './modal/message-dialog/message-dialog.component';
import { UploadComponent } from './modal/product-post/upload/upload.component';
import { S3UploadService } from './service/s3-upload.service';
import { POST_PROVIDER } from './service/interceptors/http-interceptors';

const ROUTE_TABLE: Routes = [
  { path: '', redirectTo: '/top', pathMatch: 'full' },
  { path: 'top', component: TopMenuComponent },
  { path: 'singup', component: SingupComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    SingupComponent,
    LoginComponent,
    ProductPostComponent,
    ProductDetailComponent,
    UserInfoComponent,
    ProductMenuComponent,
    MessageDialogComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    OverlayModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(ROUTE_TABLE),
  ],
  providers: [
    S3UploadService,
    POST_PROVIDER,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
