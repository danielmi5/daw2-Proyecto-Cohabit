import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req: any, next: any) => {
  const token = localStorage.getItem('auth_token');

  // No añadir token a endpoints públicos.
  const esAuthUrl =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/public');

  if (!token || esAuthUrl) {
    return next(req);
  }

  req = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(req);
};