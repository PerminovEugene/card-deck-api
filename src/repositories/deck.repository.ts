import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Deck, DeckRelations} from '../models';

export class DeckRepository extends DefaultCrudRepository<
  Deck,
  typeof Deck.prototype.id,
  DeckRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Deck, dataSource);
  }
}
