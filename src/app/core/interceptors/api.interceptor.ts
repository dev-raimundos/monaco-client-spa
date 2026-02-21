import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env';


export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const trustedDomains = ['localhost:8080', 'monaco-api.grupomonaco.com.br'];

    let url = req.url;
    if (url.startsWith('/api')) {
        url = `${environment.apiUrl}${url.replace('/api', '')}`;
    }

    const isTrustedDomain = trustedDomains.some((domain) => url.includes(domain));

    const secureReq = req.clone({
        url,
        withCredentials: isTrustedDomain,
    });

    return next(secureReq);
};
