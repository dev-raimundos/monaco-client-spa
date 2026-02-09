import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const secureReq = req.clone({
    withCredentials: true,
    // url: `https://api.grupomonaco.com.br${req.url}`
  });

  return next(secureReq);
};
