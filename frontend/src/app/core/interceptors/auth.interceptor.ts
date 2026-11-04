import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  const token = authService.getStoredToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearToken();
        // Only redirect if not already on login/register/landing
        const currentUrl = router.url;
        if (!currentUrl.includes('/login') && !currentUrl.includes('/register') && currentUrl !== '/') {
          toast.warning('Session expired', 'Please sign in again to continue.');
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
