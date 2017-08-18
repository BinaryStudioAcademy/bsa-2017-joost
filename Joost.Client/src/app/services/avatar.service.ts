import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

import { BaseApiService } from "./base-api.service";

@Injectable()
export class AvatarService extends BaseApiService{
  
    constructor(http : HttpClient) {
      super(http);
      this.parUrl = "avatars";
  }
  
    SetAvatar(img: File, id: number) {
      var formData: FormData = new FormData();
      formData.append("image", img, img.name);
      var xhr = new XMLHttpRequest();
      xhr.open("PUT", this.generateUrl() + '/' + id, true);
      xhr.send(formData);
    }

    
}