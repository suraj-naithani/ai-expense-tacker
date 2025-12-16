import cron from "node-cron";
import { processRecurringTransactions } from "../services/recurringTransaction.service.js";

// Runs every 6 hours at minute 0 (00:00, 06:00, 12:00, 18:00).
export function startRecurringTransactionsCron() {
    // In production you might guard with an env flag if needed.
    cron.schedule("0 */6 * * *", async () => {
        try {
            await processRecurringTransactions();
            console.log("[cron] Recurring transactions processed");
        } catch (error) {
            console.error("[cron] Error processing recurring transactions", error);
        }
    });
}
