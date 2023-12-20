import { DateTime } from "luxon";

export const getInboxMessageTime = (created_at: string): String => {
    const date_created = DateTime.fromISO(created_at);

    let dayPassed = DateTime.fromMillis(
        DateTime.now().diff(date_created).milliseconds,
    ).day;

    dayPassed -= 1;

    if (dayPassed >= 365) {
        return DateTime.fromISO(created_at).toFormat("MMM. dd, yyyy");
    }

    if (dayPassed >= 30 && dayPassed <= 364) {
        return DateTime.fromISO(created_at).toFormat("MMM'.' dd");
    }

    if (dayPassed >= 7 && dayPassed < 30) {
        return DateTime.fromISO(created_at).toFormat("MMM. dd");
    }

    if (dayPassed > 1 && dayPassed < 7) {
        return DateTime.fromISO(created_at).toFormat("ccc");
    }

    if (dayPassed == 1) {
        return `Yesterday`
    }

    return DateTime.fromISO(created_at).toFormat("t");
};

export const getMessageTime = (created_at: string): String => {
    const date_created = DateTime.fromISO(created_at);

    let dayPassed = DateTime.fromMillis(
        DateTime.now().diff(date_created).milliseconds,
    ).day;

    dayPassed -= 1;

    if (dayPassed >= 365) {
        return DateTime.fromISO(created_at).toFormat("ccc. MMM. dd, yyyy t");
    }

    if (dayPassed >= 30 && dayPassed <= 364) {
        return DateTime.fromISO(created_at).toFormat("MMM. dd', ' t");
    }

    if (dayPassed >= 7 && dayPassed < 30) {
        return DateTime.fromISO(created_at).toFormat("ccc. MMM. dd, t");
    }

    if (dayPassed > 1 && dayPassed < 7) {
        return DateTime.fromISO(created_at).toFormat("ccc. tt");
    }

    if (dayPassed == 1) {
        return `Yesterday ${DateTime.fromISO(created_at).toFormat("t")}`
    }

    return DateTime.fromISO(created_at).toFormat("t");
};