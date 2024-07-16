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
