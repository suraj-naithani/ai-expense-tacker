"use client";

import {
  DollarSign,
  Download,
  Edit,
  MoreHorizontal,
  Plus,
  Power,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDefaultAccount } from "@/hooks/useDefaultAccount";
import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
} from "@/redux/api/transactionApi";
import type {
  CreateTransactionFormValues,
  Transaction,
  UpdateTransactionFormValues,
  UpdateTransactionPayload,
} from "@/types/transaction";

export default function Page() {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    [],
  );
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isUpdateTransactionOpen, setIsUpdateTransactionOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [updatingTransaction, setUpdatingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const defaultAccountId = useDefaultAccount();

  const {
    data: transactionsResponse,
    isLoading,
  } = useGetTransactionsQuery(
    defaultAccountId ? { accountId: defaultAccountId, isRecurring: "false" } : { isRecurring: "false" },
    {
      skip: !defaultAccountId,
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    data: recurringTransactionsResponse,
  } = useGetTransactionsQuery(
    defaultAccountId ? { accountId: defaultAccountId, isRecurring: "true" } : { isRecurring: "true" },
    {
      skip: !defaultAccountId,
      refetchOnMountOrArgChange: true,
    },
  );

  const [createTransaction] = useCreateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();

  const transactions: Transaction[] = useMemo(
    () => transactionsResponse?.data ?? [],
    [transactionsResponse?.data]
  );
  const recurringTransactions: Transaction[] = useMemo(
    () => recurringTransactionsResponse?.data ?? [],
    [recurringTransactionsResponse?.data]
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

  // Calculate totals with useMemo for performance
  const { totalIncome, totalExpenses, totalBalance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: income - expenses,
    };
  }, [transactions]);

  const incomeCount = useMemo(
    () => transactions.filter((t) => t.type === "INCOME").length,
    [transactions]
  );
  const expenseCount = useMemo(
    () => transactions.filter((t) => t.type === "EXPENSE").length,
    [transactions]
  );

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
          <Button
            size="sm"
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
            onClick={() => setIsAddTransactionOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
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
              <div className={`text-xl md:text-2xl font-bold ${totalBalance >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                ₹{totalBalance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className={totalBalance >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}>
                  {totalBalance >= 0 ? "+" : ""}
                </span> from transactions
              </p>
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
              <div className="text-xl md:text-2xl font-bold">
                {transactions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                All transactions
              </p>
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
              <div className="text-2xl font-bold text-[#4ade80]">
                ₹{totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {incomeCount} transactions
              </p>
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
              <div className="text-2xl font-bold text-[#f87171]">
                ₹{totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {expenseCount} transactions
              </p>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--border)]">
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          selectedTransactions.length ===
                          transactions.length
                        }
                        onCheckedChange={() => toggleAll()}
                      />
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Account
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        Loading transactions...
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="border-[var(--border)]"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedTransactions.includes(
                              transaction.id,
                            )}
                            onCheckedChange={() =>
                              toggleTransaction(transaction.id)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div>{transaction.description || "No description"}</div>
                            <div className="sm:hidden text-xs text-muted-foreground mt-1">
                              {transaction.category ? `${transaction.category.icon} ${transaction.category.name}` : "Uncategorized"} • {new Date(transaction.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant="secondary"
                            className="bg-[var(--card-hover)]"
                          >
                            {transaction.category ? `${transaction.category.icon} ${transaction.category.name}` : "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {transaction.account.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${transaction.type === "INCOME"
                            ? "text-[#4ade80]"
                            : "text-[#f87171]"
                            }`}
                        >
                          {transaction.type === "INCOME" ? "+" : "-"}₹
                          {Math.abs(transaction.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-[var(--card)] border-[var(--border)]"
                            >
                              <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[#f87171]" onClick={() => handleOpenDeleteDialog(transaction)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
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
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--border)]">
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Account
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">Frequency</TableHead>
                    <TableHead className="hidden sm:table-cell">Next Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recurringTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No recurring transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recurringTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="border-[var(--border)]"
                      >
                        <TableCell className="font-medium">
                          <div>
                            <div>{transaction.description || "No description"}</div>
                            <div className="sm:hidden text-xs text-muted-foreground mt-1">
                              {transaction.category ? `${transaction.category.icon} ${transaction.category.name}` : "Uncategorized"} • {transaction.nextExecutionDate ? new Date(transaction.nextExecutionDate).toLocaleDateString() : "Not set"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant="secondary"
                            className="bg-[var(--card-hover)]"
                          >
                            {transaction.category ? `${transaction.category.icon} ${transaction.category.name}` : "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {transaction.account.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {transaction.recurringInterval ?
                              transaction.recurringInterval.charAt(0).toUpperCase() + transaction.recurringInterval.slice(1).toLowerCase()
                              : "Once"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {transaction.nextExecutionDate ? new Date(transaction.nextExecutionDate).toLocaleDateString() : "Not set"}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${transaction.type === "INCOME"
                            ? "text-[#4ade80]"
                            : "text-[#f87171]"
                            }`}
                        >
                          {transaction.type === "INCOME" ? "+" : "-"}₹
                          {Math.abs(transaction.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-[var(--card)] border-[var(--border)]"
                            >
                              <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleActiveStatus(transaction)}>
                                <Power className="mr-2 h-4 w-4" />
                                {transaction.isActive ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[#f87171]" onClick={() => handleOpenDeleteDialog(transaction)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
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
    </>
  );
}
