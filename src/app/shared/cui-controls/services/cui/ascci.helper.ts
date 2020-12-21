export const CHAR_ROUND_BRACKET_OPEN = 40;
export const CHAR_ROUND_BRACKET_CLOSE = 41;
export const CHAR_COMA = 44;
export const CHAR_MINUS = 45;
export const CHAR_POINT = 46;
export const CHAR_0 = 48;
export const CHAR_9 = 58;


export function isDigit(char: number) {
  return char >= CHAR_0 && char <= CHAR_9;
}

