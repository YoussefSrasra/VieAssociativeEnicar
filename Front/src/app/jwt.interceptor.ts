import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Intercepteur qui ajoute le token JWT aux requêtes sortantes.
 * Utilisable en mode "standalone" (Angular 16+).
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Récupère le token depuis le localStorage
  const token = localStorage.getItem('token');

  // 2. Clone la requête et ajoute le header Authorization si le token existe
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // 3. Si pas de token, laisse passer la requête originale
  return next(req);
};