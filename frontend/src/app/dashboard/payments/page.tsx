"use client";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit,
  Filter,
  HandCoins,
  MoreHorizontal,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { AddPaymentDialog } from "@/components/dialog/AddPaymentDialog";
import { DeletePaymentDialog } from "@/components/dialog/DeletePaymentDialog";
import { UpdatePaymentDialog } from "@/components/dialog/UpdatePaymentDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDefaultAccount } from "@/hooks/useDefaultAccount";
import { usePagination } from "@/hooks/usePagination";
import {
  useBulkDeletePaymentsMutation,
  useCreatePaymentMutation,
  useDeletePaymentMutation,
  useGetPaymentsQuery,
  useUpdatePaymentMutation,
  useUpdatePaymentStatusMutation,
} from "@/redux/api/paymentApi";
import { useGetPaymentStatsQuery } from "@/redux/api/statsApi";
import type { CreatePaymentFormValues, Payment, UpdatePaymentFormValues, UpdatePaymentPayload } from "@/types/payment";

export default function Page() {
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [isLendModalOpen, setIsLendModalOpen] = useState(false);
  const [isUpdatePaymentOpen, setIsUpdatePaymentOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState<Payment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const [modalType] = useState<"lent" | "borrowed">("lent");

  const defaultAccountId = useDefaultAccount();

  const {
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination({
    defaultPageSize: 10,
    onPageSizeChange: () => setSelectedPayments([]),
  });

  const {
    data: paymentsResponse,
    isLoading,
    error,
    isError,
  } = useGetPaymentsQuery(
    { page: currentPage, limit: pageSize },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [createPayment] = useCreatePaymentMutation();
  const [updatePayment] = useUpdatePaymentMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const [deletePayment] = useDeletePaymentMutation();
  const [bulkDeletePayments] = useBulkDeletePaymentsMutation();

  // Get payment stats
  const {
    data: statsResponse,
    isLoading: isStatsLoading,
  } = useGetPaymentStatsQuery(
    {
      accountId: defaultAccountId || "",
    },
    {
      skip: !defaultAccountId,
      refetchOnMountOrArgChange: true,
    }
  );

  const payments: Payment[] = useMemo(
    () => paymentsResponse?.data ?? [],
    [paymentsResponse?.data]
  );

  const pagination = paymentsResponse?.pagination;

  // Get stats from API
  const statsData = statsResponse?.data;
  const unpaidLent = statsData?.unpaidLent ?? 0;
  const unpaidBorrowed = statsData?.unpaidBorrowed ?? 0;
  const activePaymentsCount = statsData?.activePaymentsCount ?? 0;
  const netBalance = statsData?.netBalance ?? 0;

  const handlePageChangeWithClear = useCallback(
    (newPage: number) => {
      handlePageChange(newPage);
      setSelectedPayments([]);
    },
    [handlePageChange]
  );

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return (
          <Badge className="rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20">
            Pending
          </Badge>
        );
      case "OVERDUE":
        return (
          <Badge className="rounded-full bg-[#f87171]/10 text-[#f87171] border-[#f87171]/20">
            Overdue
          </Badge>
        );
      case "PAID":
        return (
          <Badge className="rounded-full bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20">
            Paid
          </Badge>
        );
      default:
        return (
          <Badge className="rounded-full" variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  const togglePayment = (id: string) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedPayments(
      selectedPayments.length === payments.length
        ? []
        : payments.map((p) => p.id),
    );
  };

  const handleEditPayment = useCallback((payment: Payment) => {
    setUpdatingPayment(payment);
    setIsUpdatePaymentOpen(true);
  }, []);

  const handleDeletePayment = useCallback((payment: Payment) => {
    setPaymentToDelete(payment);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleBulkDelete = useCallback(() => {
    if (selectedPayments.length === 0) return;
    setIsBulkDeleteDialogOpen(true);
  }, [selectedPayments.length]);

  const handleCreate = useCallback(async (values: CreatePaymentFormValues) => {
    const loadingToast = toast.loading("Creating payment...");

    try {
      const payload = {
        amount: values.amount,
        personName: values.personName,
        type: values.type,
        description: values.description || undefined,
        dueDate: values.dueDate || undefined,
        status: values.status || undefined,
      };

      await createPayment(payload).unwrap();
      toast.success("Payment created successfully", {
        description: "Your new payment has been added to your list.",
      });
      setIsLendModalOpen(false);
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to create payment", {
        description: "Please check your input and try again.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  }, [createPayment]);

  const handleUpdate = useCallback(async (values: UpdatePaymentFormValues) => {
    if (!updatingPayment) return;

    const loadingToast = toast.loading("Updating payment...");

    try {
      const payload: UpdatePaymentPayload = {
        amount: values.amount,
        personName: values.personName,
        type: values.type,
        description: values.description || undefined,
        dueDate: values.dueDate || undefined,
        status: values.status || undefined,
      };

      await updatePayment({ id: updatingPayment.id, body: payload }).unwrap();
      toast.success("Payment updated successfully", {
        description: "Your payment changes have been saved.",
      });
      setIsUpdatePaymentOpen(false);
      setUpdatingPayment(null);
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to update payment", {
        description: "Please check your input and try again.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  }, [updatePayment, updatingPayment]);

  const handleUpdateStatus = useCallback(async (payment: Payment, status: "PENDING" | "PAID" | "OVERDUE") => {
    const loadingToast = toast.loading(`Updating payment status to ${status}...`);

    try {
      await updatePaymentStatus({ id: payment.id, status }).unwrap();
      toast.success("Payment status updated successfully", {
        description: `Payment status has been changed to ${status}.`,
      });
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to update payment status", {
        description: "Please try again later.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  }, [updatePaymentStatus]);

  const handleConfirmDelete = useCallback(async () => {
    if (!paymentToDelete) return;

    const loadingToast = toast.loading("Deleting payment...");

    try {
      await deletePayment(paymentToDelete.id).unwrap();
      toast.success("Payment deleted successfully", {
        description: "This payment has been removed from your list.",
      });
      setIsDeleteDialogOpen(false);
      setPaymentToDelete(null);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete payment. Please try again.";
      toast.error(errorMessage, {
        description: "The payment could not be removed. Please try again.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  }, [paymentToDelete, deletePayment]);

  const handleConfirmBulkDelete = useCallback(async () => {
    if (selectedPayments.length === 0) return;

    const loadingToast = toast.loading(`Deleting ${selectedPayments.length} payment(s)...`);

    try {
      const result = await bulkDeletePayments({ ids: selectedPayments }).unwrap();
      toast.success(result.message, {
        description: `${result.data.deletedCount} payment(s) have been removed from your list.`,
      });
      setIsBulkDeleteDialogOpen(false);
      setSelectedPayments([]);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete payments. Please try again.";
      toast.error(errorMessage, {
        description: "The payments could not be removed. Please try again.",
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  }, [selectedPayments, bulkDeletePayments]);

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment</h1>
            <p className="text-muted-foreground">
              Manage and track all your financial transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--border)] hover:bg-[#f59e0b]/10 hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Send Reminders
            </Button>
            <Button
              size="sm"
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
              onClick={() => setIsLendModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unpaid Lent
              </CardTitle>
              <HandCoins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <div className="text-xl md:text-2xl font-bold text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div className="text-xl md:text-2xl font-bold text-[#f59e0b]">
                    ₹{unpaidLent.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Money not yet received
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unpaid Borrowed
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <div className="text-xl md:text-2xl font-bold text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div className="text-xl md:text-2xl font-bold text-[#a78bfa]">
                    ₹{unpaidBorrowed.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Money not yet paid back
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Payments
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <div className="text-xl md:text-2xl font-bold text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div className="text-xl md:text-2xl font-bold">
                    {activePaymentsCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Unpaid transactions
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Balance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <div className="text-xl md:text-2xl font-bold text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div className={`text-xl md:text-2xl font-bold ${netBalance >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                    ₹{netBalance.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {netBalance >= 0 ? "You're a net lender" : "You're a net borrower"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Money Management</CardTitle>
              <CardDescription>
                Track money you&apos;ve lent to others and borrowed from others
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedPayments.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--border)]"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedPayments.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-[var(--border)]"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
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
                          selectedPayments.length === payments.length && payments.length > 0
                        }
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead>Person</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Description</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6">
                        Loading payments...
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-destructive">
                            Failed to load payments
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(error as { data?: { message?: string } })?.data?.message || "Please try again later."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6">
                        No payments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow
                        key={payment.id}
                        className="border-[var(--border)]"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedPayments.includes(payment.id)}
                            onCheckedChange={() => togglePayment(payment.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[#6366f1] text-white">
                                  {payment.personName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{payment.personName}</span>
                            </div>
                            <div className="sm:hidden text-xs text-muted-foreground mt-1">
                              {payment.type === "LENT" ? "Lent" : "Borrowed"} • ₹{payment.amount.toFixed(2)} • {moment(payment.createdAt).format("MMM DD, YYYY")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant="secondary"
                            className={`bg-[var(--card-hover)] ${payment.type === "LENT"
                              ? "text-[#4ade80]"
                              : "text-[#f87171]"
                              }`}
                          >
                            {payment.type === "LENT" ? "Lent" : "Borrowed"}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`hidden sm:table-cell font-medium ${payment.type === "LENT"
                            ? "text-[#4ade80]"
                            : "text-[#f87171]"
                            }`}
                        >
                          {payment.type === "LENT" ? "+" : "-"}₹{payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {moment(payment.createdAt).format("MMM DD, YYYY")}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {payment.dueDate ? moment(payment.dueDate).format("MMM DD, YYYY") : "-"}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {payment.description || "-"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-[var(--card)] border-[var(--border)]"
                            >
                              <DropdownMenuItem onClick={() => handleEditPayment(payment)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {payment.status !== "PAID" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(payment, "PAID")}>
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
                              {payment.status !== "PENDING" && payment.status !== "PAID" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(payment, "PENDING")}>
                                  Mark as Pending
                                </DropdownMenuItem>
                              )}
                              {payment.status !== "OVERDUE" && payment.status !== "PAID" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(payment, "OVERDUE")}>
                                  Mark as Overdue
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator className="bg-[var(--card)]" />
                              <DropdownMenuItem
                                className="text-[#f87171]"
                                onClick={() => handleDeletePayment(payment)}
                              >
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
            {pagination && pagination.total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)] pt-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
                  <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-[80px] h-8 border-[var(--border)] bg-[var(--card)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} payments
                  </div>
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[var(--border)]"
                        onClick={() => handlePageChangeWithClear(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-[#6366f1] hover:bg-[#4f46e5] text-white cursor-default pointer-events-none"
                      >
                        {currentPage}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[var(--border)]"
                        onClick={() => handlePageChangeWithClear(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <AddPaymentDialog
        open={isLendModalOpen}
        onOpenChange={setIsLendModalOpen}
        type={modalType}
        onSave={handleCreate}
      />
      <UpdatePaymentDialog
        open={isUpdatePaymentOpen}
        onOpenChange={setIsUpdatePaymentOpen}
        payment={updatingPayment}
        onSave={handleUpdate}
      />
      <DeletePaymentDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        paymentPersonName={paymentToDelete?.personName}
        paymentAmount={paymentToDelete?.amount}
        onConfirm={handleConfirmDelete}
      />
      <DeletePaymentDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
        onConfirm={handleConfirmBulkDelete}
        bulkDeleteCount={selectedPayments.length}
      />
    </>
  );
}
