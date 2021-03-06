import {inject} from '@loopback/core';
import {DefaultCrudRepository, Options} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Card, CardRelations, CARDS_COUNT, TAG} from '../models';
import {buildFrenchCardsObjects} from './card.factory';

export class CardRepository extends DefaultCrudRepository<
  Card,
  typeof Card.prototype.code,
  CardRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Card, dataSource);
  }

  public async createFrenchCards() {
    const frenchCards = await this.findByTag(TAG);
    if (frenchCards.length === 0) {
      await this.createAll(buildFrenchCardsObjects());
    } else if (frenchCards.length !== CARDS_COUNT) {
      throw new Error('Invalid french cards in count in DB');
    }
  }

  public async findByTag(tag: string, options?: Options) {
    return this.find(
      {
        // Something wrong with working with arrays in connector
        // types missmatch
        // broken inq, doesn't work without "{}" wrapper :(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: {tags: {inq: [`"{${tag}}"`] as any}},
      },
      options,
    );
  }
}
