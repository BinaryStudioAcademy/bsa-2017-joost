import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { HttpService } from '../services/http.service';

import { BaseApiService } from "./base-api.service";

@Injectable()
export class AvatarService extends BaseApiService{
  
   constructor(http : HttpService) {
      super(http);
      this.parUrl = "avatars";
  }
  
  SetAvatar(img: File) {
    var formData: FormData = new FormData();
    formData.append("image", img, img.name);
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", this.generateUrl(), true);
    xhr.send(formData);
  }

    
}