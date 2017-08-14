import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('joostUserToken')
    if (token===null) {
      return next.handle(req);
    }
    const authReq = req.clone({
      headers: req.headers.set('Authorization', token).append('Content-Type', 'application/json')
    });
    return next.handle(authReq);
  }
}