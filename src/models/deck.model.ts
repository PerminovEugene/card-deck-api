import {Entity, hasMany, model, property} from '@loopback/repository';
import {Card} from './card.model';
import {DeckCard} from './deck-card.model';

@model({
  settings: {postgresql: {schema: 'public', table: 'deck'}},
})
export class Deck extends Entity {
  constructor(data?: Partial<Deck>) {
    super(data);
  }

  @property({
    id: true,
    type: 'String',
    defaultFn: 'uuid',
    required: false,
    jsonSchema: {
      type: 'string',
      format: 'uuid',
    },
    postgresql: {
      dataType: 'uuid',
    },
  })
  uuid: string;

  @property({
    type: 'boolean',
    generated: false,
    jsonSchema: {
      type: 'boolean',
    },
    default: true,
    postgresql: {
      dataType: 'boolean',
    },
  })
  shuffled: boolean;

  @property({
    type: 'number',
    required: false,
    generated: false,
    jsonSchema: {
      type: 'number',
    },
    postgresql: {
      require: true,
      dataType: 'integer',
    },
  })
  remaining: number;

  @hasMany(() => Card, {
    through: {model: () => DeckCard, keyFrom: 'deckUuid', keyTo: 'cardCode'},
  })
  cards?: Card[];

  // @property({
  //   type: 'Date',
  //   required: true,
  //   postgresql: {
  //     columnName: 'created_at',
  //     dataType: 'TIMESTAMP WITH TIME ZONE',
  //     dataLength: null,
  //     dataPrecision: null,
  //     dataScale: 0,
  //     nullable: 'NO',
  //   },
  // })
  // createdAt: Date;
}

export interface DeckRelations {
  deckCards: DeckCard;
}

export type DeckWithRelations = Deck & DeckRelations;
