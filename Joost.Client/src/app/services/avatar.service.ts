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

  SetGroupAvatar(img: File, id: number){
    console.log("upload avatar - 1")
    return this.SetAvatar(img, this.generateUrl() + '/groups', id);
  }

  SetUserAvatar(img: File) {
    return this.SetAvatar(img, this.generateUrl(), -1);
  }

  private SetAvatar(img: File, url: string, groupId: number){
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
                xhr.open("PUT", url, true);
                xhr.setRequestHeader("Authorization", newAccessToken);
                if(groupId >= 0) // if group
                  xhr.setRequestHeader("GroupId", groupId.toString());
                xhr.send(formData);
            }
          } else {
            reject();
          }
        }
      }
      console.log("upload avatar - 2")
      let accessToken = localStorage.getItem("joostUserAccessToken");
      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Authorization", accessToken)
      if(groupId >= 0) // if group
        xhr.setRequestHeader("GroupId", groupId.toString());
      xhr.send(formData);
    }));
  }

  getFullUrl(id: number, isGroup: boolean) {
    let url = this.generateUrl() + '/';
    if(isGroup)
      url += 'groups/';
    url += id.toString();
    return url; 
  }
}