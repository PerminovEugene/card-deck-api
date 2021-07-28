import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {CardDeckApiApplication} from '../..';
import {createRepositories} from '../database.helpers';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new CardDeckApiApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  await cleanDatabase();

  return {app, client};
}

export async function cleanDatabase() {
  const {deckCardRepository, deckRepository} = createRepositories();

  await deckCardRepository.deleteAll();
  await deckRepository.deleteAll();
}

export interface AppWithClient {
  app: CardDeckApiApplication;
  client: Client;
}
