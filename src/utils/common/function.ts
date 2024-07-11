export const parseRawDateToTime = (rawDate: string) => {
  // 일단 지금은 ISO form 으로 들어온다고 생각

  const regex = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/;
  const [, date, time] = rawDate.match(regex)!;

  console.log(date, time);

  return {
    date,
    time,
  };
};
