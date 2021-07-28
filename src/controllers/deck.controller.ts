import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {Card, Deck} from '../models';
import {DeckRepository} from '../repositories';
import {DeckService} from '../services';

export class DeckController {
  constructor(
    @repository(DeckRepository)
    public deckRepository: DeckRepository,
    @service(DeckService)
    public deckService: DeckService,
  ) {}

  @post('/create', {
    responses: {
      '200': {
        description: 'New deck is created',
        content: {'application/json': {schema: getModelSchemaRef(Deck)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deck, {
            title: 'NewDeck',
          }),
        },
      },
    })
    deck: Deck,
  ): Promise<Deck> {
    // throw new HttpErrors.BadRequest(
    //   `Address not found: ${deck.remindAtAddress}`,
    // );
    return this.deckService.createDeck(deck);
  }

  @get('/open', {
    parameters: [
      {
        name: 'uuid',
        schema: {
          type: 'string',
          format: 'uuid',
        },
        in: 'query',
      },
    ],
    responses: {
      '200': {
        description: 'Open entire deck',
        content: {'application/json': {schema: getModelSchemaRef(Deck)}},
      },
    },
  })
  async open(uuid: string): Promise<Deck> {
    // throw new HttpErrors.BadRequest(
    //   `Address not found: ${deck.remindAtAddress}`,
    // );
    return this.deckService.open(uuid);
  }

  @get('/draw', {
    parameters: [
      {
        name: 'uuid',
        schema: {
          type: 'string',
          format: 'uuid',
        },
        in: 'query',
      },
      {
        name: 'count',
        schema: {
          type: 'number',
        },
        in: 'query',
      },
    ],
    responses: {
      '200': {
        description: 'Drawed cards',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              cards: getModelSchemaRef(Card),
            },
          },
        },
      },
    },
  })
  async draw(uuid: string, count: number): Promise<{cards: Card[]}> {
    return this.deckService.draw(uuid, count);
  }
}
