import {Entity, model, property} from '@loopback/repository';

export enum Suit {
  SPADES = 'SPADES',
  HEARTS = 'HEARTS',
  CLUBS = 'CLUBS',
  DIAMONDS = 'DIAMONDS',
}
export enum FaceValue {
  ACE = 'ACE',
  KING = 'KING',
  QUEEN = 'QUEEN',
  JACK = 'JACK',
}
export const MIN_RANK = 2;
export const MAX_RANK = 10;
export const CARDS_COUNT = 52;
export const TAG = 'french';

@model({
  settings: {postgresql: {schema: 'public', table: 'card'}},
})
export class Card extends Entity {
  constructor(data?: Partial<Card>) {
    super(data);
  }

  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    postgresql: {
      dataType: 'varchar(2)',
    },
  })
  code: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(Suit),
    },
  })
  suit?: string;

  @property({
    type: 'string',
  })
  value: string;

  @property({
    type: 'array',
    itemType: 'string',
    postgresql: {
      dataType: 'varchar[]',
    },
  })
  tags?: string[];
}

export interface CardRelations {
  // describe navigational properties here
}

export type CardWithRelations = Card & CardRelations;
