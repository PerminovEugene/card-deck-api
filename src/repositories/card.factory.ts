import {FaceValue, MAX_RANK, MIN_RANK, Suit, TAG} from '../models';

export const buildFrenchCardsObjects = () => {
  const cards = [];
  const buildCode = (value: string, suit: Suit) => `${value[0]}${suit[0]}`;
  for (const suit of Object.values(Suit)) {
    for (const face of Object.values(FaceValue)) {
      cards.push({
        suit,
        value: face,
        code: buildCode(face, suit),
        tags: [TAG],
      });
    }
    for (let i = MIN_RANK; i <= MAX_RANK; i++) {
      cards.push({
        suit,
        value: `${i}`,
        code: buildCode(`${i}`, suit),
        tags: [TAG],
      });
    }
  }
  return cards;
};
