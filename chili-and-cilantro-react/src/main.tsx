import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider, Auth0ProviderOptions } from '@auth0/auth0-react';
import { environment } from './environments/environment';

import App from './app/app';

const providerConfig: Auth0ProviderOptions = {
  domain: environment.auth0.domain,
  clientId: environment.auth0.clientId,
  authorizationParams: {
    redirect_uri: environment.auth0.callbackUrl,
    audience: environment.auth0.audience,
  },
  cacheLocation: 'localstorage',
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider {...providerConfig}>
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>,
);
