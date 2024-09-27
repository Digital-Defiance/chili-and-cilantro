import { Application, static as expressStatic } from 'express';
import path from 'path';
import { environment } from './environment';

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
