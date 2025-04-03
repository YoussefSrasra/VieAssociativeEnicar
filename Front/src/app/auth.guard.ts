import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true; // Autorise l'accès
  } else {
    router.navigate(['/login']); // Redirige vers le login
    return false;
  }
};