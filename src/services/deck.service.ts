import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CARDS_COUNT, Deck, DeckWithRelations, TAG} from '../models';
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

  public async createDeck(deck: Deck): Promise<DeckWithRelations> {
    const cards = await this.cardRepository.findByTag(TAG);
    const deckModel = await this.deckRepository.create({
      ...deck,
      remaining: deck.remaining || CARDS_COUNT,
    });
    if (deckModel.shuffled) {
      this.shuffle(cards);
    }

    const deckCards = await this.deckCardRepository.createAll(
      cards.slice(0, deckModel.remaining).map(({code}, i) => ({
        cardCode: code,
        deckUuid: deckModel.uuid,
        order: i,
      })),
    );
    deckModel.cards = deckCards;
    return deckModel;
  }

  // Fisher-Yates shuffle algorithm
  private shuffle(array: Array<unknown>) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
  }
}
