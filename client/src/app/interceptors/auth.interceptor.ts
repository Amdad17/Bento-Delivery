import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: HttpRequest<any>,
    next: HttpHandler,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');
    const isCloudinaryRequest = request.url.includes('cloudinary.com');

    if (token && !isCloudinaryRequest) {
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(authRequest);
    } else return next.handle(request);
  }
}
