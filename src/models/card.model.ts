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

  // This field was added for cards presets management
  // If want to use not only french decks, but decks with 36 cards (cards 2-5 are excluded)
  // or decks with jokers or custom decks, or even custom cards with new ranks or suit
  // we can add new tags and add tag property into deck management requests
  @property({
    type: 'array',
    itemType: 'string',
    postgresql: {
      dataType: 'varchar[]',
    },
  })
  tags?: string[];
}

export interface CardRelations {}

export type CardWithRelations = Card & CardRelations;
