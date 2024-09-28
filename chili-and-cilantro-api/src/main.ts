import { App } from './application';
import { environment } from './environment';
import { validateEnvironment } from './interfaces/environment';

const app: App = App.getInstance();

validateEnvironment(environment, async () => {
  await app.start();
});
