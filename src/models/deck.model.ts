import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {postgresql: {schema: 'public', table: 'deck'}},
})
export class Deck extends Entity {
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

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
    id: true,
    type: 'boolean',
    defaultFn: 'uuid',
    required: false,
    generated: false,
    jsonSchema: {
      type: 'boolean',
    },
    postgresql: {
      dataType: 'boolean',
    },
  })
  shuffled: boolean;

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
  // describe navigational properties here
}

export type DeckWithRelations = Deck & DeckRelations;
