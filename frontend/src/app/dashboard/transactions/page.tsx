"use client";

import {
  DollarSign,
  Download,
  Plus,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { AddTransactionDialog } from "@/components/dialog/AddTransactionDialog";
import { DeleteTransactionDialog } from "@/components/dialog/DeleteTransactionDialog";
import { UpdateTransactionDialog } from "@/components/dialog/UpdateTransactionDialog";
import { TransactionsTable } from "@/components/TransactionsTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDefaultAccount } from "@/hooks/useDefaultAccount";
import { usePagination } from "@/hooks/usePagination";
import {
  useBulkDeleteTransactionsMutation,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
} from "@/redux/api/transactionApi";
import { useGetTransactionStatsQuery } from "@/redux/api/statsApi";
import type {
  CreateTransactionFormValues,
  Transaction,
  UpdateTransactionFormValues,
  UpdateTransactionPayload,
} from "@/types/transaction";
import type { TimeRange } from "@/types/stats";

export default function Page() {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    [],
  );
  const [selectedRecurringTransactions, setSelectedRecurringTransactions] = useState<string[]>(
    [],
  );
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isUpdateTransactionOpen, setIsUpdateTransactionOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isBulkDeleteRecurringDialogOpen, setIsBulkDeleteRecurringDialogOpen] = useState(false);
  const [updatingTransaction, setUpdatingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");

  const defaultAccountId = useDefaultAccount();

  const {
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination({
    defaultPageSize: 10,
    resetDependencies: [defaultAccountId],
    onPageSizeChange: () => setSelectedTransactions([]),
  });

  const {
    currentPage: currentRecurringPage,
    pageSize: recurringPageSize,
    handlePageChange: handleRecurringPageChange,
    handlePageSizeChange: handleRecurringPageSizeChange,
  } = usePagination({
    defaultPageSize: 10,
    resetDependencies: [defaultAccountId],
    onPageSizeChange: () => setSelectedRecurringTransactions([]),
  });

  const {
    data: transactionsResponse,
    isLoading,
  } = useGetTransactionsQuery(
    defaultAccountId
      ? { accountId: defaultAccountId, isRecurring: "false", page: currentPage, limit: pageSize }
      : { isRecurring: "false", page: currentPage, limit: pageSize },
    {
      skip: !defaultAccountId,
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    data: recurringTransactionsResponse,
  } = useGetTransactionsQuery(
    defaultAccountId
      ? { accountId: defaultAccountId, isRecurring: "true", page: currentRecurringPage, limit: recurringPageSize }
      : { isRecurring: "true", page: currentRecurringPage, limit: recurringPageSize },
    {
      skip: !defaultAccountId,
      refetchOnMountOrArgChange: true,
    },
  );

  const [createTransaction] = useCreateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [bulkDeleteTransactions] = useBulkDeleteTransactionsMutation();
  const [updateTransaction] = useUpdateTransactionMutation();

  // Get transaction stats
  const {
    data: statsResponse,
    isLoading: isStatsLoading,
  } = useGetTransactionStatsQuery(
    {
      timeRange,
      accountId: defaultAccountId || "",
    },
    {
      skip: !defaultAccountId,
      refetchOnMountOrArgChange: true,
    }
  );

  const transactions: Transaction[] = useMemo(
    () => transactionsResponse?.data ?? [],
    [transactionsResponse?.data]
  );

  const pagination = transactionsResponse?.pagination;

  const recurringTransactions: Transaction[] = useMemo(
    () => recurringTransactionsResponse?.data ?? [],
    [recurringTransactionsResponse?.data]
  );

  const recurringPagination = recurringTransactionsResponse?.pagination;

  // Wrapper to clear selections when changing pages for regular transactions
  const handlePageChangeWithClear = useCallback(
    (newPage: number) => {
      handlePageChange(newPage);
      setSelectedTransactions([]);
    },
    [handlePageChange]
  );

  // Wrapper to clear selections when changing pages for recurring transactions
  const handleRecurringPageChangeWithClear = useCallback(
    (newPage: number) => {
      handleRecurringPageChange(newPage);
      setSelectedRecurringTransactions([]);
    },
    [handleRecurringPageChange]
  );

  const toggleTransaction = (id: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((t: string) => t !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedTransactions(
      selectedTransactions.length === transactions.length
        ? []
        : transactions.map((t) => t.id),
    );
  };

  const toggleRecurringTransaction = (id: string) => {
    setSelectedRecurringTransactions((prev) =>
      prev.includes(id) ? prev.filter((t: string) => t !== id) : [...prev, id],
    );
  };

  const toggleAllRecurring = () => {
    setSelectedRecurringTransactions(
      selectedRecurringTransactions.length === recurringTransactions.length
        ? []
        : recurringTransactions.map((t) => t.id),
    );
  };

  const handleOpenDeleteDialog = useCallback((transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setUpdatingTransaction(transaction);
    setIsUpdateTransactionOpen(true);
  }, []);

  const handleCreate = useCallback(async (values: CreateTransactionFormValues) => {
    if (!defaultAccountId) return;

    const loadingToast = toast.loading("Creating transaction...");

    try {
      const payload = {
        accountId: defaultAccountId,
        categoryId: values.categoryId,
        amount: values.amount,
        type: values.type,
        description: values.description || undefined,
        isRecurring: values.isRecurring || undefined,
        recurringInterval: values.isRecurring ? values.recurringInterval : undefined,
      };

      await createTransaction(payload).unwrap();
      toast.success("Transaction created successfully", {
        description: "Your new transaction has been added to your list.",
      });
      setIsAddTransactionOpen(false);
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to create transaction", {
        description: "Please check your input and try again.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  }, [createTransaction, defaultAccountId]);

  const handleUpdate = useCallback(async (values: UpdateTransactionFormValues) => {
    if (!updatingTransaction) return;

    const loadingToast = toast.loading("Updating transaction...");

    try {
      const payload: UpdateTransactionPayload = {
        categoryId: values.categoryId,
        amount: values.amount,
        type: values.type,
        description: values.description || undefined,
        isActive: values.isActive,
        recurringInterval: values.recurringInterval,
      };

      await updateTransaction({ id: updatingTransaction.id, body: payload }).unwrap();
      toast.success("Transaction updated successfully", {
        description: "Your transaction changes have been saved.",
      });
      setIsUpdateTransactionOpen(false);
      setUpdatingTransaction(null);
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to update transaction", {
        description: "Please check your input and try again.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  }, [updateTransaction, updatingTransaction]);

  const handleToggleActiveStatus = useCallback(async (transaction: Transaction) => {
    const loadingToast = toast.loading(`${transaction.isActive ? "Deactivating" : "Activating"} transaction...`);

    try {
      const payload = {
        isActive: !transaction.isActive,
      };

      await updateTransaction({ id: transaction.id, body: payload }).unwrap();
      toast.success(`Transaction ${transaction.isActive ? "deactivated" : "activated"} successfully`, {
        description: transaction.isActive
          ? "This recurring transaction will no longer execute automatically."
          : "This recurring transaction will now execute automatically.",
      });
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to update transaction status", {
        description: "Please try again later.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  }, [updateTransaction]);

  const handleConfirmDelete = useCallback(async () => {
    if (!transactionToDelete) return;

    const loadingToast = toast.loading("Deleting transaction...");

    try {
      await deleteTransaction(transactionToDelete.id).unwrap();
      toast.success("Transaction deleted successfully", {
        description: "This transaction has been removed from your list.",
      });
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete transaction. Please try again.";
      toast.error(errorMessage, {
        description: "The transaction could not be removed. Please try again.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  }, [transactionToDelete, deleteTransaction]);

  const handleBulkDelete = useCallback(() => {
    if (selectedTransactions.length === 0) return;
    setIsBulkDeleteDialogOpen(true);
  }, [selectedTransactions.length]);

  const handleConfirmBulkDelete = useCallback(async () => {
    if (selectedTransactions.length === 0) return;

    const loadingToast = toast.loading(`Deleting ${selectedTransactions.length} transaction(s)...`);

    try {
      const result = await bulkDeleteTransactions({ ids: selectedTransactions }).unwrap();
      toast.success(result.message, {
        description: `${result.data.deletedCount} transaction(s) have been removed from your list.`,
      });
      setIsBulkDeleteDialogOpen(false);
      setSelectedTransactions([]);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete transactions. Please try again.";
      toast.error(errorMessage, {
        description: "The transactions could not be removed. Please try again.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  }, [selectedTransactions, bulkDeleteTransactions]);

  const handleBulkDeleteRecurring = useCallback(() => {
    if (selectedRecurringTransactions.length === 0) return;
    setIsBulkDeleteRecurringDialogOpen(true);
  }, [selectedRecurringTransactions.length]);

  const handleConfirmBulkDeleteRecurring = useCallback(async () => {
    if (selectedRecurringTransactions.length === 0) return;

    const loadingToast = toast.loading(`Deleting ${selectedRecurringTransactions.length} recurring transaction(s)...`);

    try {
      const result = await bulkDeleteTransactions({ ids: selectedRecurringTransactions }).unwrap();
      toast.success(result.message, {
        description: `${result.data.deletedCount} recurring transaction(s) have been removed from your list.`,
      });
      setIsBulkDeleteRecurringDialogOpen(false);
      setSelectedRecurringTransactions([]);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete recurring transactions. Please try again.";
      toast.error(errorMessage, {
        description: "The recurring transactions could not be removed. Please try again.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  }, [selectedRecurringTransactions, bulkDeleteTransactions]);

  // Get stats from API
  const statsData = statsResponse?.data;
  const totalBalance = statsData?.totalBalance ?? 0;
  const totalTransactions = statsData?.totalTransactions ?? 0;
  const totalIncome = statsData?.totalIncome ?? 0;
  const totalExpenses = statsData?.totalExpenses ?? 0;
  const incomeCount = statsData?.incomeCount ?? 0;
  const expenseCount = statsData?.expenseCount ?? 0;
  const comparisons = statsData?.comparisons;

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">
              Manage and track all your financial transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="w-[140px] border-[var(--border)] bg-[var(--card)]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent className="border-[var(--border)] bg-[var(--card)]">
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
              onClick={() => setIsAddTransactionOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4">
          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <div className="text-xl md:text-2xl font-bold text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div className={`text-xl md:text-2xl font-bold ${totalBalance >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                    ₹{totalBalance.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {comparisons?.totalBalance ? (
                      <span className={comparisons.totalBalance.type === "increase" ? "text-[#4ade80]" : comparisons.totalBalance.type === "decrease" ? "text-[#f87171]" : ""}>
                        {comparisons.totalBalance.type === "increase" ? "+" : ""}
                        {comparisons.totalBalance.change.toFixed(1)}% from last period
                      </span>
                    ) : (
                      <span className={totalBalance >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}>
                        {totalBalance >= 0 ? "+" : ""} from transactions
                      </span>
                    )}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transactions
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <div className="text-xl md:text-2xl font-bold text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div className="text-xl md:text-2xl font-bold">
                    {totalTransactions}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {comparisons?.totalTransactions ? (
                      <span className={comparisons.totalTransactions.type === "increase" ? "text-[#4ade80]" : comparisons.totalTransactions.type === "decrease" ? "text-[#f87171]" : ""}>
                        {comparisons.totalTransactions.type === "increase" ? "+" : ""}
                        {comparisons.totalTransactions.change.toFixed(1)}% from last period
                      </span>
                    ) : (
                      "All transactions"
                    )}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-[#4ade80]">
                    ₹{totalIncome.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {comparisons?.totalIncome ? (
                      <span className={comparisons.totalIncome.type === "increase" ? "text-[#4ade80]" : comparisons.totalIncome.type === "decrease" ? "text-[#f87171]" : ""}>
                        {comparisons.totalIncome.type === "increase" ? "+" : ""}
                        {comparisons.totalIncome.change.toFixed(1)}% from last period
                      </span>
                    ) : (
                      `${incomeCount} transaction${incomeCount !== 1 ? "s" : ""}`
                    )}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-[#f87171]">
                    ₹{totalExpenses.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {comparisons?.totalExpenses ? (
                      <span className={comparisons.totalExpenses.type === "increase" ? "text-[#f87171]" : comparisons.totalExpenses.type === "decrease" ? "text-[#4ade80]" : ""}>
                        {comparisons.totalExpenses.type === "increase" ? "+" : ""}
                        {comparisons.totalExpenses.change.toFixed(1)}% from last period
                      </span>
                    ) : (
                      `${expenseCount} transaction${expenseCount !== 1 ? "s" : ""}`
                    )}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                Manage and track all your financial transactions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedTransactions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--border)]"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedTransactions.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-[var(--border)]"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TransactionsTable
              transactions={transactions}
              isLoading={isLoading}
              variant="regular"
              selectedTransactions={selectedTransactions}
              onSelectTransaction={toggleTransaction}
              onSelectAll={toggleAll}
              onEdit={handleEditTransaction}
              onDelete={handleOpenDeleteDialog}
              pagination={pagination}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChangeWithClear}
              onPageSizeChange={handlePageSizeChange}
            />
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Recurring Transactions</CardTitle>
              <CardDescription>
                Manage and track your recurring transactions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedRecurringTransactions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--border)]"
                  onClick={handleBulkDeleteRecurring}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedRecurringTransactions.length})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <TransactionsTable
              transactions={recurringTransactions}
              isLoading={false}
              variant="recurring"
              selectedTransactions={selectedRecurringTransactions}
              onSelectTransaction={toggleRecurringTransaction}
              onSelectAll={toggleAllRecurring}
              onEdit={handleEditTransaction}
              onDelete={handleOpenDeleteDialog}
              onToggleActive={handleToggleActiveStatus}
              pagination={recurringPagination}
              currentPage={currentRecurringPage}
              pageSize={recurringPageSize}
              onPageChange={handleRecurringPageChangeWithClear}
              onPageSizeChange={handleRecurringPageSizeChange}
            />
          </CardContent>
        </Card>
      </div>


      <AddTransactionDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onSave={handleCreate}
      />
      <UpdateTransactionDialog
        open={isUpdateTransactionOpen}
        onOpenChange={setIsUpdateTransactionOpen}
        transaction={updatingTransaction}
        onSave={handleUpdate}
      />
      <DeleteTransactionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        transactionDescription={transactionToDelete?.description || undefined}
        transactionAmount={transactionToDelete?.amount}
        transactionType={transactionToDelete?.type}
        onConfirm={handleConfirmDelete}
      />
      <DeleteTransactionDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
        bulkDeleteCount={selectedTransactions.length}
        onConfirm={handleConfirmBulkDelete}
      />
      <DeleteTransactionDialog
        open={isBulkDeleteRecurringDialogOpen}
        onOpenChange={setIsBulkDeleteRecurringDialogOpen}
        bulkDeleteCount={selectedRecurringTransactions.length}
        onConfirm={handleConfirmBulkDeleteRecurring}
      />
    </>
  );
}
