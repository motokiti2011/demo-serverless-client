import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { S3UploadService } from 'src/app/service/s3-upload.service';
import { Observable, } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  uploadFile: any;
  
  uploadResult = '';

  @Output() upload = new EventEmitter<boolean>();

  @Output() uploadUrl = new EventEmitter<String>();

  constructor(
    private s3: S3UploadService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * アップロードファイル選択時イベント
   * @param event 
   */
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
      this.uploadResult = 'アップロードが失敗しました。';
    });
    } else {
      this.uploadResult = 'ファイルが選択されていません。';
    }
  }

}
