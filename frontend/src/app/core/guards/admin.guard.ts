import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (authService.getStoredToken() && authService.currentUser()?.role === 'ADMIN') {
    return true;
  }

  toast.error('Access Denied', 'Administrator privileges are required for this page.');
  router.navigate(['/dashboard']);
  return false;
};
