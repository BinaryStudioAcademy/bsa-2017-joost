import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tokens } from "../models/tokens";
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable()
export class HttpService  {

  private static readonly refreshUrl: string = "http://localhost:51248/api/account/refresh";

  constructor(private http: HttpClient) { }

  sendRequest<T>(req: HttpRequest<any>): Observable<T> {
    let accessToken = localStorage.getItem("joostUserAccessToken");
    if (accessToken === null) {
      return this._sendRequest<T>(req);
    } 
    else {
      const authReq = this.getRequestWithAuthToken(req, accessToken);
      return this._sendRequest<T>(authReq);
    }  
  }

  async handleTokenError(): Promise<boolean> {
    let refreshToken = localStorage.getItem('joostUserRefreshToken');
    if (refreshToken !== null) {
      await this.refreshTokens(refreshToken);
      return true;
    }
    else {
      return false;
    }
  }

  async handleTokenErrorIfExist(err: any): Promise<boolean> {
    if (this.isTokenError(err))
      return await this.handleTokenError();
    else false;
  }

  isTokenError(err: any) {
    return err.status === 426;
  }

  private _sendRequest<T>(req: HttpRequest<any>): Observable<T> {
    return this.http.request<T>(req.method, req.url, {
      body: req.body,
      headers: req.headers,
      observe: 'body',
      params: req.params,
      responseType: 'json',
      reportProgress: req.reportProgress,
      withCredentials: req.withCredentials,
    });
  }

  private async refreshTokens(refreshToken: string) {
    await this.http.get<Tokens>(HttpService.refreshUrl, { headers: new HttpHeaders().set('Authorization', refreshToken) })
      .toPromise().then(data => {
        localStorage.setItem('joostUserAccessToken', data.accessToken);
        localStorage.setItem('joostUserRefreshToken', data.refreshToken);
        console.log("Tokens were updated");
      });
  }

  private getRequestWithAuthToken(req: HttpRequest<any>, authToken: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', authToken).append('Content-Type', 'application/json')
    });
  }

}