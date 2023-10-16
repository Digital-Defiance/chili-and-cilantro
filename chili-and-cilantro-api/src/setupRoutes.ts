import express from 'express';
import { apiRouter } from './routes/api.route';
import { environment } from './environment';

export function setupRoutes(app: express.Application) {
  app.use('/', express.static(environment.developer.reactDir));
  //app.use('/auth', authRouter);
  app.use('/api', apiRouter); // TODO: ensureAuthenticated
  // fallback to index.html for anything unknown
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: environment.developer.reactDir });
  });
}
