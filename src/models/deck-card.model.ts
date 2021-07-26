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

  @property({
    type: 'string',
    postgresql: {
      dataType: 'varchar(2)',
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
  // describe navigational properties here
}

export type DeckCardWithRelations = DeckCard & DeckCardRelations;
