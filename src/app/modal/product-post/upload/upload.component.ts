import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { S3UploadService } from 'src/app/service/s3-upload.service';
import { Observable, } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  uploadFile:any;
  
  uploadResult = '';

  @Output() upload = new EventEmitter<boolean>();

  @Output() uploadUrl = new EventEmitter<String>();


  constructor(
    private s3: S3UploadService,
  ) { }

  ngOnInit(): void {
  }

  onInputChange(event: any) {
    const files = event.target.files;
    this.uploadFile = files[0];
    this.upload.emit(true);
  }

  onClickUpload() {
    if (this.uploadFile) {
    this.s3.onManagedUpload(this.uploadFile).then((data) => {
      if (data) {
        this.uploadUrl.emit(data.Location);
        this.uploadResult = 'アップロードが完了しました。';
      }
    }).catch((err) => {
      console.log(err);
      // return err;
      this.uploadResult = 'アップロードが失敗しました。';
    });
    } else {
      // return '';
      this.uploadResult = 'ファイルが選択されていません。';
    }
  }

  onClickLogout() {
    // this.cognito.logout();
    // this.router.navigate(['/login']);
  }

  onClickFile(
    // item: any
    ) {
    this.s3.getFile(
      // item.Key
      'テスト用.png'
      ).then((data) => {
      console.log(data);
      // if(data.Body === undefined) {
      //   return;
      // }
      // const blob = new Blob([data.Body], { type: data.ContentType });
      // const url = window.URL.createObjectURL(blob);
      // const linkElement = document.createElement('a');
      // linkElement.download = item.Key;
      // linkElement.href = url;
      // linkElement.click();
    }).catch((err) => {
      console.log(err);
    });
  }

}
