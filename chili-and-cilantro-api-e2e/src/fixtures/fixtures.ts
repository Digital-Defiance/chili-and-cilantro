import { IUserDocument } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { ISignedToken } from 'chili-and-cilantro-api/src/interfaces/signed-token';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';
import { App } from '../../../chili-and-cilantro-api/src/application';
import { JwtService } from '../../../chili-and-cilantro-api/src/services/jwt';

export interface ITestEnvironment {
  application: App;
  mongoServer: MongoMemoryReplSet;
  mongoUri: string;
}

export async function setupTestEnvironment(): Promise<ITestEnvironment> {
  // Start the in-memory MongoDB instance
  const mongoServer = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });
  const mongoUri = mongoServer.getUri();

  await mongoServer.waitUntilRunning();

  const application = App.getInstance();

  // Create and start your app
  await application.start(mongoUri);

  return {
    application,
    mongoServer,
    mongoUri,
  };
}

export async function teardownTestEnvironment(
  application: App,
  mongoServer: MongoMemoryReplSet,
) {
  await application.stop(false);
  await disconnect();
  await mongoServer.stop();
}

export async function makeJwtForUser(
  application: IApplication,
  user: IUserDocument,
): Promise<ISignedToken> {
  const jwtService: JwtService = new JwtService(application);
  return jwtService.signToken(user);
}
