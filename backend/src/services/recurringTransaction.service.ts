import { prisma } from "../utils/connection.js";
import { calculateNextExecutionDate } from "../utils/dateCalculator.js";
import { createOccurrenceFromTemplate } from "../utils/transactionHelper.js";
import { RecurringInterval } from "../types/transaction.js";

export async function processRecurringTransactions() {
    const now = new Date();

    const templates = await prisma.transaction.findMany({
        where: {
            isRecurring: true,
            isActive: true,
            nextExecutionDate: { lte: now },
        },
    });

    for (const template of templates) {
        let nextExecution = template.nextExecutionDate ? new Date(template.nextExecutionDate) : now;

        // Generate all missed occurrences up to now
        while (nextExecution <= now) {

            // Create occurrence for this execution time
            await createOccurrenceFromTemplate(template);

            if (!template.recurringInterval) break;

            nextExecution = calculateNextExecutionDate(nextExecution, template.recurringInterval as RecurringInterval);
        }

        // Update template's nextExecutionDate if still active and interval exists
        if (template.isActive && template.recurringInterval) {
            await prisma.transaction.update({
                where: { id: template.id },
                data: { nextExecutionDate: nextExecution },
            });
        }
    }
}
