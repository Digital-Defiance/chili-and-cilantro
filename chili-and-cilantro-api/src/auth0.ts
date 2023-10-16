import { ManagementClient } from 'auth0';
import { environment } from './environment';

export const managementClient = new ManagementClient({
  domain: environment.auth0.domain,
  clientId: environment.auth0.clientId,
  clientSecret: environment.auth0.clientSecret,
});
