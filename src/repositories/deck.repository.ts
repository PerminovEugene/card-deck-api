import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Card, Deck, DeckCard, DeckRelations} from '../models';
import {CardRepository} from './card.repository';
import {DeckCardRepository} from './deck-card.repository';

export class DeckRepository extends DefaultCrudRepository<
  Deck,
  typeof Deck.prototype.uuid,
  DeckRelations
> {
  public readonly cards: HasManyThroughRepositoryFactory<
    Card,
    typeof Card.prototype.code,
    DeckCard,
    typeof Deck.prototype.uuid
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('CardRepository')
    cardRepositoryGetter: Getter<CardRepository>,
    @repository.getter('DeckCardRepository')
    deckCardRepositoryGetter: Getter<DeckCardRepository>,
  ) {
    super(Deck, dataSource);
    this.cards = this.createHasManyThroughRepositoryFactoryFor(
      'cards',
      cardRepositoryGetter,
      deckCardRepositoryGetter,
    );
  }
}
