import {DbDataSource} from '../datasources';
import {Deck} from '../models';
import {
  CardRepository,
  DeckCardRepository,
  DeckRepository,
} from '../repositories';
import {DeckService} from '../services';

export function givenDeckData(data?: Partial<Deck>) {
  return Object.assign(
    {
      uuid: 'foo',
      shuffled: true,
    },
    data,
  );
}

export async function givenDeck(data?: Partial<Deck>) {
  const {cardRepository, deckCardRepository, deckRepository} =
    createRepositories();
  return new DeckService(
    deckRepository,
    cardRepository,
    deckCardRepository,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ).createDeck(givenDeckData(data) as any);
}

export function createRepositories() {
  const testDb = new DbDataSource();
  const deckCardRepository = new DeckCardRepository(testDb);
  const cardRepository = new CardRepository(testDb);
  const deckRepository = new DeckRepository(
    testDb,
    async () => cardRepository, // repository getter
    async () => deckCardRepository, // repository getter
  );
  return {
    testDb,
    cardRepository,
    deckCardRepository,
    deckRepository,
  };
}
