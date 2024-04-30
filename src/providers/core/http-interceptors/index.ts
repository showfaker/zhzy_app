import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './error-interceptor';

import { JwtInterceptor } from './jwt-interceptor';
import { ResponseHandlerInterceptor } from './response-handler-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ResponseHandlerInterceptor,
    multi: true,
  },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];
