import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { HttpService } from '../services/http.service';
import { HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { BaseApiService } from "./base-api.service";
import { Observable } from "rxjs/Rx";

@Injectable()
export class FileService extends BaseApiService{
  
   constructor(http : HttpService) {
      super(http);
      this.parUrl = "files";
  }

  UploadImage(img: File, fileName: string) {
  return Observable.fromPromise(new Promise((resolve, reject) => {
    let formData: any = new FormData();
    let xhr = new XMLHttpRequest();
    formData.append("image", img, img.name);
    formData.append("fileName", fileName);
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve()
        } else {
          reject()
        }
      }
    }
    
    xhr.open("PUT", this.generateUrl(), true);
    xhr.send(formData);
  }));
}


}
    

    
