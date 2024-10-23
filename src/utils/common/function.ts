export const parseRawDateToTime = (rawDate: string) => {
  // 일단 지금은 ISO form 으로 들어온다고 생각

  const regex = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/;
  const [, date, time] = rawDate.match(regex)!;

  return {
    date,
    time,
  };
};

export const hashString = (str: string, min: number, max: number) => {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  const remainder = hash % (max - min);

  return (remainder < 0 ? remainder + (max - min) : remainder) + min;
};

const addPaddingZero = (str: string, len: number) => {
  return ('00000000' + str).slice(-len);
};

export const calculateColor = (str: string) => {
  const hashedColor = `#${addPaddingZero(hashString(str, 0x000000, 0xffffff).toString(16), 6)}`;
  return hashedColor;
};

export const addColor = (
  color: string,
  diff: string,
  subtract: boolean = false,
) => {
  const hex = color.slice(1);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const diffHex = diff.slice(1);
  const diffR = parseInt(diffHex.substring(0, 2), 16);
  const diffG = parseInt(diffHex.substring(2, 4), 16);
  const diffB = parseInt(diffHex.substring(4, 6), 16);

  const resR = subtract ? Math.max(0, r - diffR) : Math.min(255, r + diffR);
  const resG = subtract ? Math.max(0, g - diffG) : Math.min(255, g + diffG);
  const resB = subtract ? Math.max(0, b - diffB) : Math.min(255, b + diffB);

  return `#${addPaddingZero(resR.toString(16), 2)}${addPaddingZero(resG.toString(16), 2)}${addPaddingZero(resB.toString(16), 2)}`;
};
