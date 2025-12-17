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
    recurringInterval: RecurringInterval;
}

export async function createRecurringTemplateWithFirstOccurrence(input: TemplateInput) {
    const { userId, accountId, categoryId, amount, type, description, recurringInterval } = input;

    // Create template transaction (recurring definition)
    const template = await prisma.transaction.create({
        data: {
            userId,
            accountId,
            categoryId: categoryId ?? null,
            amount,
            type,
            description: description ?? null,
            isRecurring: true,
            recurringInterval,
            isActive: true,
            nextExecutionDate: calculateNextExecutionDate(new Date(), recurringInterval),
        },
    });

    // Create first concrete occurrence (no balance update here)
    const occurrence = await createOccurrenceFromTemplate(template);

    return { template, occurrence };
}

export async function createOneTimeTransaction(options: {
    userId: string;
    accountId: string;
    categoryId?: string;
    amount: number;
    type: TransactionType;
    description?: string;
}) {
    const { userId, accountId, categoryId, amount, type, description } = options;

    const tx = await prisma.transaction.create({
        data: {
            userId,
            accountId,
            categoryId: categoryId ?? null,
            amount,
            type,
            description: description ?? null,
            isRecurring: false,
            recurringInterval: null,
            isActive: false,
            nextExecutionDate: null,
            parentRecurringId: null,
        },
    });

    return tx;
}

// Create a concrete occurrence from a template (used by cron and on first creation).
export async function createOccurrenceFromTemplate(template: Transaction) {
    const occurrence = await prisma.transaction.create({
        data: {
            userId: template.userId,
            accountId: template.accountId,
            categoryId: template.categoryId,
            amount: template.amount,
            type: template.type,
            description: template.description,
            isRecurring: false,
            recurringInterval: null,
            isActive: false,
            nextExecutionDate: null,
            parentRecurringId: template.id,
        },
    });

    return occurrence;
}
