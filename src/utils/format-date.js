import { DateTime } from "luxon";

export default function formatDate(dateIso) {
  return DateTime.fromISO(dateIso).toLocaleString(DateTime.DATETIME_SHORT);
}
