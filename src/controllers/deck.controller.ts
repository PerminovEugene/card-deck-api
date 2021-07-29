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
    responses: {
      '200': {
        description: 'New deck. Bottom cars are first, top cards are last',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Deck, {
              includeRelations: true,
              // TODO hide tags property, hide in model doesn't work in this case
            }),
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      description: 'Create a new deck',
      required: false,
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deck, {
            title: 'Configuration of deck creation',
            optional: ['uuid', 'remaining', 'shuffled'],
          }),
        },
      },
    })
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
        content: {
          'application/json': {
            schema: getModelSchemaRef(Deck, {
              title: 'Entire deck with cards. The top card is the last',
              includeRelations: true,
            }),
          },
        },
      },
    },
  })
  async open(uuid: string): Promise<Deck> {
    return this.deckService.open(uuid);
  }

  @get('/deck/draw', {
    description: 'Draw 1 or several cards from the top of the deck',
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
          type: 'integer',
          minimum: 1,
          maximum: CARDS_COUNT,
        },
        in: 'query',
      },
    ],
    responses: {
      '200': {
        description: 'Drawed cards. Top card in the end',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              cards: getModelSchemaRef(Card, {
                exclude: ['tags'],
              }),
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
