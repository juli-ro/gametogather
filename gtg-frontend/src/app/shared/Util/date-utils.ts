

export function toFullUtCDate(date: Date): Date{
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
}

export function getDateRange(starDate: Date, endDate: Date): Date[]{
  const dates: Date[] = [];
  const current = new Date(starDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
