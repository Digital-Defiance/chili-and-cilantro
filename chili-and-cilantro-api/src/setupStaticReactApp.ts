import { Application, static as expressStatic } from 'express';
import { environment } from './environment';
import path from 'path';

const serveStaticOptions = {
  index: ['index.html'],
};

export function setupStaticReactApp(app: Application) {
  app.use(expressStatic(environment.developer.reactDir, serveStaticOptions));
  app.use(
    '/assets',
    expressStatic(path.join(environment.developer.reactDir, 'src', 'assets')),
  );
}
