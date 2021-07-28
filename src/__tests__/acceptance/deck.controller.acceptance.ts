import {Client, expect} from '@loopback/testlab';
import {CardDeckApiApplication} from '../..';
import {CARDS_COUNT} from '../../models';
import {givenDeck} from '../database.helpers';
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

  it('invokes POST /deck/create method', async () => {
    const {body} = await client.post('/deck/create').send({}).expect(200);
    expect(body).to.containEql({shuffled: true});
    expect(body).to.containEql({remaining: CARDS_COUNT});
  });

  it('invokes POST /deck/create method with defined uuid', async () => {
    const {body} = await client
      .post('/deck/create')
      .send({
        uuid: '123e4567-e89b-12d3-a456-426614174000',
      })
      .expect(200);
    expect(body).to.containEql({shuffled: true});
    expect(body).to.containEql({remaining: CARDS_COUNT});
  });

  it('invokes POST /deck/create method with defined shuffled', async () => {
    const {body} = await client
      .post('/deck/create')
      .send({
        shuffled: false,
      })
      .expect(200);
    expect(body).to.containEql({shuffled: false});
    expect(body).to.containEql({remaining: CARDS_COUNT});
  });

  it('invokes POST /deck/create method with defined remainings', async () => {
    const {body} = await client
      .post('/deck/create')
      .send({
        remaining: 3,
      })
      .expect(200);
    expect(body).to.containEql({remaining: 3});
    expect(body.cards.length).to.be.equal(3);
  });

  it('invokes GET /deck/open method', async () => {
    const remaining = 5;
    const {uuid, cards} = await givenDeck({
      shuffled: false,
      remaining,
      uuid: '123e4567-e89b-12d3-a456-426614174001',
    });

    const {body} = await client
      .get('/deck/open')
      .query({
        uuid: uuid,
      })
      .expect(200);
    expect(body).to.containEql({shuffled: false});
    expect(body).to.containEql({remaining});
    expect(body).to.containEql({cards});
  });

  it('invokes GET /deck/open method, check cards order', async () => {
    const {uuid, cards} = await givenDeck({
      shuffled: true,
      uuid: '123e4567-e89b-12d3-a456-426614174002',
    });

    const {body} = await client
      .get('/deck/open')
      .query({
        uuid: uuid,
      })
      .expect(200);
    expect(body).to.containEql({shuffled: true});
    expect(body).to.containEql({cards});
    expect(body).to.containEql({uuid});
  });

  it('invokes GET /deck/draw method, check cards order', async () => {
    const {uuid, cards} = await givenDeck({
      uuid: '123e4567-e89b-12d3-a456-426614174003',
      shuffled: true,
    });
    const count = 5;
    const topCards = cards?.slice(cards.length - count, cards?.length);

    const {body} = await client
      .get('/deck/draw')
      .query({
        uuid: uuid,
        count: 5,
      })
      .expect(200);
    expect(body).to.containEql({cards: topCards});
  });

  it('invokes GET /deck/draw 52 times, should draw entire deck', async () => {
    const {uuid, cards} = await givenDeck({
      uuid: '123e4567-e89b-12d3-a456-426614174004',
      shuffled: true,
    });
    for (let i = 0; i < 52; i++) {
      const {body} = await client
        .get('/deck/draw')
        .query({
          uuid: uuid,
          count: 1,
        })
        .expect(200);
      expect(body).to.containEql({cards: [cards?.pop()]});
    }
  });
});
