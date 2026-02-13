import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env';

/**
 * @description Normaliza requisições para a API e gerencia credenciais de segurança.
 * 1. Converte caminhos relativos '/api/...' para a URL absoluta do ambiente.
 * 2. Injeta 'withCredentials' apenas em domínios confiáveis do Grupo Mônaco.
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const trustedDomains = ['localhost:8080', 'monaco-api.grupomonaco.com.br'];

    let url = req.url;
    // Substitui o alias /api pelo endpoint real definido no environment
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
