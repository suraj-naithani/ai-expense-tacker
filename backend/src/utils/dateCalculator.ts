import { RecurringInterval } from "../types/transaction.js";

// Always operate in UTC to avoid timezone drift.
export function calculateNextExecutionDate(current: Date, interval: RecurringInterval): Date {
    const next = new Date(current.getTime());

    switch (interval) {
        case "DAILY": {
            next.setUTCDate(next.getUTCDate() + 1);
            break;
        }
        case "WEEKLY": {
            next.setUTCDate(next.getUTCDate() + 7);
            break;
        }
        case "MONTHLY": {
            const month = next.getUTCMonth();
            next.setUTCMonth(month + 1);
            break;
        }
        case "YEARLY": {
            const year = next.getUTCFullYear();
            next.setUTCFullYear(year + 1);
            break;
        }
        default: {
            break;
        }
    }

    return next;
}
