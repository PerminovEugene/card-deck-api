import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {IsolationLevel, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Card, CARDS_COUNT, Deck, TAG} from '../models';
import {
  CardRepository,
  DeckCardRepository,
  DeckRepository,
} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class DeckService {
  constructor(
    @repository(DeckRepository)
    public deckRepository: DeckRepository,
    @repository(CardRepository)
    public cardRepository: CardRepository,
    @repository(DeckCardRepository)
    public deckCardRepository: DeckCardRepository,
  ) {}

  public async createDeck(deck: Partial<Deck>): Promise<Deck> {
    const transaction = await this.deckRepository.dataSource.beginTransaction(
      IsolationLevel.SERIALIZABLE,
    );
    const cards = await this.cardRepository.findByTag(TAG, {
      transaction,
    });
    const deckModel = await this.deckRepository.create(
      {
        ...deck,
        remaining: deck.remaining ?? CARDS_COUNT,
      },
      {transaction},
    );
    if (deckModel.shuffled) {
      this.shuffle(cards);
    }
    await this.deckCardRepository.createAll(
      cards.slice(0, deckModel.remaining).map(({code}, i) => ({
        cardCode: code,
        deckUuid: deckModel.uuid,
        order: i,
      })),
      {transaction},
    );
    deckModel.cards = await this.deckCardRepository.getDeckCards(
      deckModel.uuid,
      deckModel.remaining,
      {transaction},
    );
    await transaction.commit();
    return deckModel;
  }

  public async open(uuid: string) {
    const deck = await this.deckRepository.findById(uuid);
    deck.cards = await this.deckCardRepository.getDeckCards(
      deck.uuid,
      deck.remaining,
    );
    return deck;
  }

  public async draw(uuid: string, count: number): Promise<{cards: Card[]}> {
    const transaction = await this.deckRepository.dataSource.beginTransaction(
      IsolationLevel.SERIALIZABLE,
    );
    const deck = await this.deckRepository.findById(uuid, undefined, {
      transaction,
    });
    if (!deck) {
      throw new HttpErrors.NotFound(`Deck with uuid ${uuid} is not found`);
    }
    const newRemaining = deck.remaining - count;
    if (newRemaining < 0) {
      throw new HttpErrors.BadRequest(`Not enough cards in the deck`);
    }
    const cards = await this.deckCardRepository.getTopDeckCards(
      uuid,
      deck.remaining,
      count,
      {
        transaction,
      },
    );
    deck.remaining = newRemaining;
    await this.deckRepository.updateById(deck.uuid, deck, {transaction});
    await transaction.commit();
    return {cards};
  }

  // Fisher-Yates shuffle algorithm
  private shuffle(array: Array<unknown>) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
  }
}
