import {inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  Options,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Card, DeckCard, DeckCardRelations} from '../models';

export class DeckCardRepository extends DefaultCrudRepository<
  DeckCard,
  typeof DeckCard.prototype.id,
  DeckCardRelations
> {
  public readonly card: BelongsToAccessor<Card, typeof Card.prototype.code>;

  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(DeckCard, dataSource);
  }

  public async getDeckCards(
    deckUuid: string,
    remainingCards: number,
    options?: Options,
  ): Promise<Card[]> {
    return this.dataSource.execute(
      `SELECT card.code, card.value, card.suit
       FROM card
       INNER JOIN deckcard ON card.code = deckcard.cardCode
       WHERE deckCard.deckUuid = ($1) AND deckcard.order < ($2)
       ORDER BY deckcard.order
      `,
      [deckUuid, remainingCards],
      options,
    );
  }

  public async getTopDeckCards(
    deckUuid: string,
    remainingCards: number,
    count: number,
    options?: Options,
  ): Promise<Card[]> {
    const reversedDeck = await this.dataSource.execute(
      `SELECT card.code, card.value, card.suit
       FROM card
       INNER JOIN deckcard ON card.code = deckcard.cardCode
       WHERE deckCard.deckUuid = ($1)
             AND deckcard.order < ($2)
       ORDER BY deckcard.order desc
       LIMIT ($3)
      `,
      [deckUuid, remainingCards, count],
      options,
    );
    return reversedDeck.reverse();
  }
}
