import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {Card, CARDS_COUNT, Deck} from '../models';
import {DeckRepository} from '../repositories';
import {DeckService} from '../services';

export class DeckController {
  constructor(
    @repository(DeckRepository)
    public deckRepository: DeckRepository,
    @service(DeckService)
    public deckService: DeckService,
  ) {}

  @post('/deck/create', {
    requestBodySpec: {
      description: 'Properties for a new deck',
      required: false,
      content: {
        'application/json': {
          uuid: {require: false, type: 'uuid', defaultFn: 'uuid'},
          remaining: {require: false, type: 'number', minValue: 0},
          shuffled: {require: false, type: 'boolean'},
        },
      },
    },
    responses: {
      '200': {
        description: 'New deck',
        content: {'application/json': {schema: getModelSchemaRef(Deck)}},
      },
    },
  })
  async create(
    @requestBody()
    deck: Partial<Deck>,
  ): Promise<Deck> {
    return this.deckService.createDeck(deck);
  }

  @get('/deck/open', {
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
    return this.deckService.open(uuid);
  }

  @get('/deck/draw', {
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
          minimum: 1,
          maximum: CARDS_COUNT,
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
