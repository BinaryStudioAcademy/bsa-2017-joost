import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

@Injectable()
export class BaseApiService {
  
  protected baseUrl: string = "http://localhost:51248/api/";
  protected parUrl: string;

  constructor(protected http : HttpClient){ }

  protected generateUrl():string{
      return this.baseUrl + this.parUrl;
  }
}
