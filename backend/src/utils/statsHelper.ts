import moment from "moment";
import { TimeRange, DateRange, PreviousDateRange, ComparisonData } from "../types/stats.js";

export function calculateDateRange(
    timeRange: TimeRange,
    customStartDate?: string,
    customEndDate?: string
): DateRange {
    const now = moment();
    let startDate: moment.Moment;
    let endDate: moment.Moment = now.clone();

    switch (timeRange) {
        case "monthly":
            startDate = now.clone().startOf("month");
            endDate = now.clone().endOf("month");
            break;

        case "3months":
            startDate = now.clone().subtract(2, "months").startOf("month");
            endDate = now.clone().endOf("month");
            break;

        case "6months":
            startDate = now.clone().subtract(5, "months").startOf("month");
            endDate = now.clone().endOf("month");
            break;

        case "yearly":
            startDate = now.clone().startOf("year");
            endDate = now.clone().endOf("year");
            break;

        case "custom":
            if (!customStartDate || !customEndDate) {
                throw new Error("Custom date range requires both startDate and endDate");
            }
            startDate = moment(customStartDate).startOf("day");
            endDate = moment(customEndDate).endOf("day");
            if (!startDate.isValid() || !endDate.isValid()) {
                throw new Error("Invalid date format. Use YYYY-MM-DD");
            }
            if (startDate.isAfter(endDate)) {
                throw new Error("Start date must be before or equal to end date");
            }
            break;

        default:
            startDate = now.clone().startOf("month");
            endDate = now.clone().endOf("month");
    }

    return {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
    };
}

export function calculatePreviousDateRange(currentRange: DateRange): PreviousDateRange {
    const duration = moment(currentRange.endDate).diff(moment(currentRange.startDate), "days");
    const previousEndDate = moment(currentRange.startDate).subtract(1, "day").endOf("day");
    const previousStartDate = moment(previousEndDate).subtract(duration, "days").startOf("day");

    return {
        startDate: previousStartDate.toDate(),
        endDate: previousEndDate.toDate(),
    };
}

export function calculatePercentageChange(current: number, previous: number): ComparisonData {
    if (previous === 0) {
        return {
            change: current > 0 ? 100 : 0,
            type: current > 0 ? "increase" : "no-change",
        };
    }

    const change = ((current - previous) / previous) * 100;
    const roundedChange = Math.round(change * 100) / 100;

    return {
        change: roundedChange,
        type: roundedChange > 0 ? "increase" : roundedChange < 0 ? "decrease" : "no-change",
    };
}

