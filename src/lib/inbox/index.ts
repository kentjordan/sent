import { DateTime } from "luxon";


export const getSeenTime = (created_at: string) => {
    const date_created = DateTime.fromISO(created_at);

    let dayPassed = DateTime.fromMillis(
        DateTime.now().diff(date_created).milliseconds,
    ).day;

    dayPassed -= 1;

    if (dayPassed >= 30) {
        return DateTime.fromISO(created_at).toFormat("MMM'.' dd', 't'");
    }

    if (dayPassed >= 1 && dayPassed < 30) {
        return DateTime.fromISO(created_at).toFormat("ccc t");
    }

    return DateTime.fromISO(created_at).toFormat("t");
};