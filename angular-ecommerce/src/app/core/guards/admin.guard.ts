import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

export const adminGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  const token = authState.authToken();
  const user = authState.authUser();

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (user?.role !== 'admin') {
    router.navigate(['/']);
    return false;
  }

  return true;
};
