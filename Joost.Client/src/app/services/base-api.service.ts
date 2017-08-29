import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class BaseApiService {
  
  protected baseUrl: string = "http://localhost:51248/api/";
  protected parUrl: string;

  constructor(protected http : HttpService){ }

  protected generateUrl():string{
      return this.baseUrl + this.parUrl;
  }

  async handleTokenErrorIfExist(err: any): Promise<boolean> {
    if (this.http.isTokenError(err))
      return await this.http.handleTokenError();
    else false;
  }
  
}
