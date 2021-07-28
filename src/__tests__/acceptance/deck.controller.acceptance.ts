import {Client, expect} from '@loopback/testlab';
import {CardDeckApiApplication} from '../..';
import {CARDS_COUNT} from '../../models';
import {setupApplication} from './test-helper';

describe('DeckController', () => {
  let app: CardDeckApiApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /create method', async () => {
    const {body} = await client
      .post('/create')
      .send({
        shuffled: true,
      })
      .expect(200);
    expect(body).to.containEql({shuffled: true});
    expect(body).to.containEql({remaining: CARDS_COUNT});
  });
});
