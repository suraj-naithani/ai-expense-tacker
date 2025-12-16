import { Transaction } from "@prisma/client";
import { prisma } from "./connection.js";
import { calculateNextExecutionDate } from "./dateCalculator.js";
import { RecurringInterval, TransactionType } from "../types/transaction.js";

interface TemplateInput {
    userId: string;
    accountId: string;
    categoryId?: string;
    amount: number;
    type: TransactionType;
    description?: string;
    date: Date;
    recurringInterval: RecurringInterval;
}

export async function createRecurringTemplateWithFirstOccurrence(input: TemplateInput) {
    const { userId, accountId, categoryId, amount, type, description, date, recurringInterval } = input;

    const initialDate = date;

    // Create template transaction (recurring definition)
    const template = await prisma.transaction.create({
        data: {
            userId,
            accountId,
            categoryId: categoryId ?? null,
            amount,
            type,
            description: description ?? null,
            date: initialDate,
            isRecurring: true,
            recurringInterval,
            isActive: true,
            endDate: null,
            nextExecutionDate: calculateNextExecutionDate(initialDate, recurringInterval),
        },
    });

    // Create first concrete occurrence (no balance update here)
    const occurrence = await createOccurrenceFromTemplate(template, initialDate);

    return { template, occurrence };
}

export async function createOneTimeTransaction(options: {
    userId: string;
    accountId: string;
    categoryId?: string;
    amount: number;
    type: TransactionType;
    description?: string;
    date: Date;
}) {
    const { userId, accountId, categoryId, amount, type, description, date } = options;

    const tx = await prisma.transaction.create({
        data: {
            userId,
            accountId,
            categoryId: categoryId ?? null,
            amount,
            type,
            description: description ?? null,
            date,
            isRecurring: false,
            recurringInterval: null,
            isActive: false,
            endDate: null,
            nextExecutionDate: null,
            parentRecurringId: null,
        },
    });

    return tx;
}

// Create a concrete occurrence from a template (used by cron and on first creation).
export async function createOccurrenceFromTemplate(template: Transaction, occurrenceDate: Date) {
    const occurrence = await prisma.transaction.create({
        data: {
            userId: template.userId,
            accountId: template.accountId,
            categoryId: template.categoryId,
            amount: template.amount,
            type: template.type,
            description: template.description,
            date: occurrenceDate,
            isRecurring: false,
            recurringInterval: null,
            isActive: false,
            endDate: null,
            nextExecutionDate: null,
            parentRecurringId: template.id,
        },
    });

    return occurrence;
}
