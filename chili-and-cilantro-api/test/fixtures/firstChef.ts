import { FirstChef } from '@chili-and-cilantro/chili-and-cilantro-lib';

export function getRandomFirstChef<FirstChef>(): FirstChef[keyof FirstChef] {
  const enumValues = Object.values(FirstChef) as FirstChef[keyof FirstChef][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}
