"use client";

import {
  DollarSign,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  Power,
  Search,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { AddTransactionDialog } from "@/components/dialog/AddTransactionDialog";
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
import { useGetTransactionsQuery } from "@/redux/api/transactionApi";
import type { Transaction } from "@/types/transaction";

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    [],
  );
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const defaultAccountId = useDefaultAccount();

  const {
    data: transactionsResponse,
    isLoading,
  } = useGetTransactionsQuery(
    defaultAccountId ? { accountId: defaultAccountId, isRecurring: "false" } : { isRecurring: "false" },
    {
      skip: !defaultAccountId,
    },
  );

  const {
    data: recurringTransactionsResponse,
  } = useGetTransactionsQuery(
    defaultAccountId ? { accountId: defaultAccountId, isRecurring: "true" } : { isRecurring: "true" },
    {
      skip: !defaultAccountId,
    },
  );

  const apiTransactions: Transaction[] = transactionsResponse?.data ?? [];
  const recurringTransactions: Transaction[] = recurringTransactionsResponse?.data ?? [];

  const filteredTransactions = apiTransactions.filter((transaction) => {
    const description = transaction.description?.toLowerCase() || "";
    return description.includes(searchQuery.toLowerCase());
  });

  const toggleTransaction = (id: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedTransactions(
      selectedTransactions.length === filteredTransactions.length
        ? []
        : filteredTransactions.map((t) => t.id),
    );
  };

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

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
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--border)]"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--border)]"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
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
                {filteredTransactions.length}
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
                {filteredTransactions.filter((t) => t.type === "INCOME").length}{" "}
                transactions
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
                {filteredTransactions.filter((t) => t.type === "EXPENSE").length}{" "}
                transactions
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
                          filteredTransactions.length
                        }
                        onCheckedChange={toggleAll}
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
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
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
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[#f87171]">
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
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Power className="mr-2 h-4 w-4" />
                                {transaction.isActive ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[#f87171]">
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
      />
    </>
  );
}
