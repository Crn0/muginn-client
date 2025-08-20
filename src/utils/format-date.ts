import { DateTime } from "luxon";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return DateTime.fromISO(date.toISOString()).toLocaleString(DateTime.DATETIME_SHORT);
};
