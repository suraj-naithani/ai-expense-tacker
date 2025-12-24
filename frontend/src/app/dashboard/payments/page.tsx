"use client";

import {
  Calendar,
  DollarSign,
  Edit,
  Filter,
  HandCoins,
  MoreHorizontal,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { AddPaymentDialog } from "@/components/dialog/AddPaymentDialog";

interface PaymentRecord {
  id: number;
  name: string;
  amount: number;
  date: string;
  dueDate: string;
  status: string;
  description: string;
  avatar: string;
  type: "lent" | "borrowed";
}

const allPayments: PaymentRecord[] = [
  {
    id: 1,
    name: "John Smith",
    amount: 500,
    date: "2024-01-10",
    dueDate: "2024-02-10",
    status: "pending",
    description: "Emergency loan",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "lent",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    amount: 250,
    date: "2024-01-05",
    dueDate: "2024-01-25",
    status: "overdue",
    description: "Car repair",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "lent",
  },
  {
    id: 3,
    name: "Mike Wilson",
    amount: 150,
    date: "2023-12-20",
    dueDate: "2024-01-20",
    status: "paid",
    description: "Dinner expenses",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "lent",
  },
  {
    id: 4,
    name: "Emily Davis",
    amount: 300,
    date: "2024-01-12",
    dueDate: "2024-02-12",
    status: "pending",
    description: "Medical bills",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "lent",
  },
  {
    id: 5,
    name: "Alex Thompson",
    amount: 800,
    date: "2024-01-08",
    dueDate: "2024-02-08",
    status: "pending",
    description: "Business investment",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "borrowed",
  },
  {
    id: 6,
    name: "Lisa Brown",
    amount: 200,
    date: "2023-12-15",
    dueDate: "2024-01-15",
    status: "overdue",
    description: "Rent assistance",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "borrowed",
  },
  {
    id: 7,
    name: "David Miller",
    amount: 450,
    date: "2023-11-20",
    dueDate: "2023-12-20",
    status: "new",
    description: "Laptop purchase",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "borrowed",
  },
];

const lentMoney = allPayments.filter((p) => p.type === "lent");
const borrowedMoney = allPayments.filter((p) => p.type === "borrowed");

export default function Page() {
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [isLendModalOpen, setIsLendModalOpen] = useState(false);
  const [modalType] = useState<"lent" | "borrowed">("lent");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20">
            Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="rounded-full bg-[#f87171]/10 text-[#f87171] border-[#f87171]/20">
            Overdue
          </Badge>
        );
      case "paid":
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

  const totalLent = lentMoney.reduce((sum, item) => sum + item.amount, 0);
  const totalBorrowed = borrowedMoney.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const pendingLent = lentMoney
    .filter((item) => item.status === "pending")
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingBorrowed = borrowedMoney
    .filter((item) => item.status === "pending")
    .reduce((sum, item) => sum + item.amount, 0);

  const togglePayment = (id: number) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedPayments(
      selectedPayments.length === allPayments.length
        ? []
        : allPayments.map((p) => p.id),
    );
  };

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
                Total Lent
              </CardTitle>
              <HandCoins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#4ade80]">
                ${totalLent.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {lentMoney.length} people
              </p>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Borrowed
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#f87171]">
                ${totalBorrowed.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {borrowedMoney.length} people
              </p>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending to Receive
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#f59e0b]">
                ${pendingLent.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Money to collect</p>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending to Pay
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#a78bfa]">
                ${pendingBorrowed.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Money to pay back</p>
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
                          selectedPayments.length === allPayments.length && allPayments.length > 0
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
                  {allPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        No payments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    allPayments.map((record) => (
                      <TableRow
                        key={record.id}
                        className="border-[var(--border)]"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedPayments.includes(record.id)}
                            onCheckedChange={() => togglePayment(record.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={record.avatar || "/placeholder.svg"}
                                  alt={record.name}
                                />
                                <AvatarFallback className="bg-[#6366f1] text-white">
                                  {record.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{record.name}</span>
                            </div>
                            <div className="sm:hidden text-xs text-muted-foreground mt-1">
                              {record.type === "lent" ? "Lent" : "Borrowed"} • ${record.amount} • {record.date}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant="secondary"
                            className={`bg-[var(--card-hover)] ${record.type === "lent"
                              ? "text-[#4ade80]"
                              : "text-[#f87171]"
                              }`}
                          >
                            {record.type === "lent" ? "Lent" : "Borrowed"}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`hidden sm:table-cell font-medium ${record.type === "lent"
                            ? "text-[#4ade80]"
                            : "text-[#f87171]"
                            }`}
                        >
                          {record.type === "lent" ? "+" : "-"}${record.amount}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {record.date}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {record.dueDate}
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {record.description}
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
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Mark as Paid
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-[var(--card)]" />
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
      <AddPaymentDialog
        open={isLendModalOpen}
        onOpenChange={setIsLendModalOpen}
        type={modalType}
      />
    </>
  );
}
