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

  imageExtensions: string[] = [
    "jpg", "gif", "png", "bmp"
  ]

  // UploadImage(img: File, fileName: string) {
  //   return Observable.fromPromise(new Promise((resolve, reject) => {
  //     let formData: any = new FormData();
  //     let xhr = new XMLHttpRequest();
  //     formData.append("image", img, img.name);
  //     formData.append("fileName", fileName);
      
  //     xhr.onreadystatechange = function () {
  //       if (xhr.readyState === 4) {
  //         if (xhr.status === 200) {
  //           resolve()
  //         } else {
  //           reject()
  //         }
  //       }
  //     }
      
  //     xhr.open("PUT", this.generateUrl(), true);
  //     xhr.send(formData);
  //   }));
  // }

  UploadFile(file: File, fileName: string) {
    let extThis = this; // "this" in UploadFile scope

    return Observable.fromPromise(new Promise((resolve, reject) => {
      let formData: any = new FormData();
      let xhr = new XMLHttpRequest();
      formData.append("file", file, file.name);
      formData.append("fileName", fileName);
      
      xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve()
          } else if (xhr.status === 426) { // expired token response
            let refreshToken = localStorage.getItem('joostUserRefreshToken');
            if (refreshToken !== null) {
              await extThis.http.refreshTokens(refreshToken);
                let newAccessToken = localStorage.getItem("joostUserAccessToken");
                xhr.open("PUT", extThis.generateUrl(), true);
                xhr.setRequestHeader("Authorization", newAccessToken)
                xhr.send(formData);
            }
          } else {
            reject();
          }
        }
      }
      
      let accessToken = localStorage.getItem("joostUserAccessToken");
      xhr.open("PUT", this.generateUrl(), true);
      xhr.setRequestHeader("Authorization", accessToken)
      xhr.send(formData);
    }));
  }

  // getFullFileUrl(fileName: string): string{
  //   return this.generateUrl() + '/' + fileName;
  // }

  getFullFileUrlWithOutEx(fileName: string): string{
    return this.generateUrl() + '/' + this.getFileName(fileName);
  }

  getFileExtensions(fileName: string): string {
    if(fileName)
      return fileName.split('.').pop().toLowerCase();
    return null;
  }

  getFileName(fileName: string): string{
    if(fileName)
      return fileName.substring(0, fileName.lastIndexOf('.'));
    else
      return null;
  }

  isImage(fileName: string): boolean{
    if(this.imageExtensions.find((item) => item == this.getFileExtensions(fileName)))
      return true;
    else
      return false;
  }
}
    

    
