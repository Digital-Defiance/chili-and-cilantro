/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
import express, { Application } from 'express';
import https from 'https';
import fs from 'fs';
import { environment } from './environment';
import { setupDatabase } from './setupDatabase';
import { setupMiddlewares } from './setupMiddlewares';
import { setupRoutes } from './setupRoutes';
import { setupStaticReactApp } from './setupStaticReactApp';

declare global {
  namespace Express {
    interface User {}
  }
}
const app: Application = express();

async function configureApplication(app: Application): Promise<void> {
  await setupDatabase();
  await setupMiddlewares(app);
  await setupRoutes(app);
  await setupStaticReactApp(app);
}

configureApplication(app).then(() => {
  if (environment.developer.sslEnabled) {
    const path =
      (process.env.NX_WORKSPACE_ROOT ?? '.') +
      '/apps/chili-and-cilantro-api/localdev/';
    const httpsOptions = {
      key: fs.readFileSync(path + 'cert.key'),
      cert: fs.readFileSync(path + 'cert.pem'),
    };
    https
      .createServer(httpsOptions, app)
      .listen(environment.developer.port, () => {
        console.log(
          `[ ready ] https://${environment.developer.host}:${environment.developer.port}`,
        );
      });
  } else {
    app.listen(environment.developer.port, environment.developer.host, () => {
      console.log(
        `[ ready ] http://${environment.developer.host}:${environment.developer.port}`,
      );
    });
  }
});
