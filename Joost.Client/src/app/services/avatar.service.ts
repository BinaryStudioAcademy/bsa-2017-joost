import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { HttpService } from '../services/http.service';

import { BaseApiService } from "./base-api.service";
import { Observable } from "rxjs/Rx";

@Injectable()
export class AvatarService extends BaseApiService{
  
   constructor(http : HttpService) {
      super(http);
      this.parUrl = "avatars";
  }
    
  // SetAvatar(img: File) {
  //   let extThis = this; // "this" in SetAvatar scope

  //   var formData: FormData = new FormData();
  //   formData.append("image", img, img.name);
  //   var xhr = new XMLHttpRequest();
    
  //   xhr.onreadystatechange = async function () {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status === 426) { // expired token response
  //         let refreshToken = localStorage.getItem('joostUserRefreshToken');
  //         if (refreshToken !== null) {
  //           await extThis.http.refreshTokens(refreshToken);
  //           let newAccessToken = localStorage.getItem("joostUserAccessToken");
  //           xhr.open("PUT", extThis.generateUrl(), true);
  //           xhr.setRequestHeader("Authorization", newAccessToken)
  //           xhr.send(formData);
  //         }
  //       } 
  //     }
  //   }
    
  //   let accessToken = localStorage.getItem("joostUserAccessToken");
  //   xhr.open("PUT", this.generateUrl(), true);
  //   xhr.setRequestHeader("Authorization", accessToken)
  //   xhr.send(formData);
  // }



  SetAvatar(img: File) {
    let extThis = this; // "this" in SetAvatar scope

    return Observable.fromPromise(new Promise((resolve, reject) => {
    var formData: FormData = new FormData();
    formData.append("image", img, img.name);
    var xhr = new XMLHttpRequest();
      
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

}