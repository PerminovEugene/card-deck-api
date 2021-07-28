import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {postgresql: {schema: 'public', table: 'deckcard'}},
})
export class DeckCard extends Entity {
  constructor(data?: Partial<DeckCard>) {
    super(data);
  }

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    generated: false,
    postgresql: {
      dataType: 'uuid',
      name: 'deck_uuid',
    },
  })
  deckUuid: string;

  // @belongsTo(() => Deck)
  // deck: Deck;

  @property({
    type: 'string',
    generated: false,
    postgresql: {
      dataType: 'varchar',
      name: 'card_code',
    },
  })
  cardCode: string;

  @property({
    type: 'number',
    postgresql: {
      dataType: 'integer',
      name: 'order',
      minValue: 0,
    },
  })
  order: number;
}

export interface DeckCardRelations {
  // card: CardWithRelations;
  // deck: DeckWithRelations;
}

export type DeckCardWithRelations = DeckCard & DeckCardRelations;
