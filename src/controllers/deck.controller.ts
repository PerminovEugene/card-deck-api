import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {Deck} from '../models';
import {DeckRepository} from '../repositories';

export class DeckController {
  constructor(
    @repository(DeckRepository)
    public deckRepository: DeckRepository,
  ) {}

  @post('/decks', {
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
            exclude: ['id'],
          }),
        },
      },
    })
    deck: Omit<Deck, 'id'>,
  ): Promise<Deck> {
    // if (todo.remindAtAddress) {
    // ignoring because if the service is down, the following section will
    // not be covered
    /* istanbul ignore next */
    // if (!geo[0]) {
    // address not found
    // throw new HttpErrors.BadRequest(
    //   `Address not found: ${deck.remindAtAddress}`,
    // );
    // }
    // }
    return this.deckRepository.create(deck);
  }

  @get('/decks', {
    responses: {
      '200': {
        description: 'New deck is created',
        content: {'application/json': {schema: getModelSchemaRef(Deck)}},
      },
    },
  })
  async open(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deck, {
            title: 'NewDeck',
            exclude: ['id'],
          }),
        },
      },
    })
    deck: Omit<Deck, 'id'>,
  ): Promise<Deck> {
    // if (todo.remindAtAddress) {
    // ignoring because if the service is down, the following section will
    // not be covered
    /* istanbul ignore next */
    // if (!geo[0]) {
    // address not found
    // throw new HttpErrors.BadRequest(
    //   `Address not found: ${deck.remindAtAddress}`,
    // );
    // }
    // }
    return this.deckRepository.create(deck);
  }
}