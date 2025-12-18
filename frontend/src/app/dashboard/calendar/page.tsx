"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal, Plus } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const calendarEvents = [
  {
    date: "2024-01-15",
    transactions: [
      {
        id: 1,
        description: "Grocery Store",
        amount: -85.5,
        category: "Food",
        type: "expense",
      },
      {
        id: 2,
        description: "Salary",
        amount: 3500.0,
        category: "Income",
        type: "income",
      },
    ],
  },
  {
    date: "2024-01-14",
    transactions: [
      {
        id: 3,
        description: "Gas Station",
        amount: -45.2,
        category: "Transport",
        type: "expense",
      },
      {
        id: 4,
        description: "Netflix",
        amount: -15.99,
        category: "Entertainment",
        type: "expense",
      },
    ],
  },
  {
    date: "2024-01-13",
    transactions: [
      {
        id: 5,
        description: "Coffee Shop",
        amount: -12.5,
        category: "Food",
        type: "expense",
      },
    ],
  },
  {
    date: "2024-01-12",
    transactions: [
      {
        id: 6,
        description: "Freelance Work",
        amount: 800.0,
        category: "Income",
        type: "income",
      },
    ],
  },
  {
    date: "2024-01-11",
    transactions: [
      {
        id: 7,
        description: "Electric Bill",
        amount: -120.0,
        category: "Bills",
        type: "expense",
      },
    ],
  },
];

const upcomingBills = [
  {
    id: 1,
    name: "Rent",
    amount: 1200,
    dueDate: "2024-01-28",
    category: "Bills",
    status: "upcoming",
  },
  {
    id: 2,
    name: "Internet",
    amount: 60,
    dueDate: "2024-01-30",
    category: "Bills",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Phone",
    amount: 45,
    dueDate: "2024-02-02",
    category: "Bills",
    status: "upcoming",
  },
  {
    id: 4,
    name: "Insurance",
    amount: 150,
    dueDate: "2024-02-05",
    category: "Bills",
    status: "upcoming",
  },
];

export default function Page() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15)); // January 15, 2024
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  const getTransactionsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEvents = calendarEvents.find((event) => event.date === dateStr);
    return dayEvents ? dayEvents.transactions : [];
  };

  const getDayTotal = (day: number) => {
    const transactions = getTransactionsForDate(day);
    return transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const transactions = getTransactionsForDate(day);
      const dayTotal = getDayTotal(day);
      const hasTransactions = transactions.length > 0;
      const isToday = day === 15;

      days.push(
        <div
          key={day}
          className={`p-2 min-h-[100px] border border-[var(--border)] rounded-lg ${isToday
              ? "bg-[#6366f1]/10 border-[#6366f1]/30"
              : "hover:bg-[var(--card-hover)]"
            } transition-colors cursor-pointer`}
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className={`text-sm font-medium ${isToday ? "text-[#6366f1]" : ""}`}
            >
              {day}
            </span>
            {hasTransactions && (
              <Badge
                variant="secondary"
                className="text-xs px-1 py-0 bg-[var(--card-hover)]"
              >
                {transactions.length}
              </Badge>
            )}
          </div>

          {hasTransactions && (
            <div className="space-y-1">
              {transactions.slice(0, 2).map((transaction) => (
                <div
                  key={transaction.id}
                  className={`text-xs p-1 rounded truncate ${transaction.type === "income"
                    ? "bg-[#4ade80]/10 text-[#4ade80]"
                    : "bg-[#f87171]/10 text-[#f87171]"
                    }`}
                >
                  {transaction.description}
                </div>
              ))}
              {transactions.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{transactions.length - 2} more
                </div>
              )}
              {dayTotal !== 0 && (
                <div
                  className={`text-xs font-medium ${dayTotal > 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}
                >
                  {dayTotal > 0 ? "+" : ""}${dayTotal.toFixed(2)}
                </div>
              )}
            </div>
          )}
        </div>,
      );
    }

    return days;
  };

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">
              Manage and track all your financial transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
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

        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">
                  {formatDate(currentDate)}
                </CardTitle>
                <CardDescription>
                  Track your daily expenses and income
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth("prev")}
                  className="rounded-full border-[var(--border)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentDate(new Date())}
                  className="rounded-full border-[var(--border)]"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth("next")}
                  className="rounded-full border-[var(--border)]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">{renderCalendarGrid()}</div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader>
              <CardTitle>Upcoming Bills</CardTitle>
              <CardDescription>
                Bills and recurring payments due soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--card)]"
                  >
                    <div>
                      <div className="font-medium">{bill.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Due {bill.dueDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#f87171]">
                        ₹{bill.amount}
                      </span>
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
                          <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[var(--card)]" />
                          <DropdownMenuItem className="text-[#f87171]">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
              <CardDescription>
                Your financial activity this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-[#4ade80]/10 border border-[#4ade80]/20">
                  <div>
                    <div className="font-medium text-[#4ade80]">
                      Total Income
                    </div>
                    <div className="text-sm text-muted-foreground">
                      15 transactions
                    </div>
                  </div>
                  <div className="text-xl font-bold text-[#4ade80]">₹4,300</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-[#f87171]/10 border border-[#f87171]/20">
                  <div>
                    <div className="font-medium text-[#f87171]">
                      Total Expenses
                    </div>
                    <div className="text-sm text-muted-foreground">
                      42 transactions
                    </div>
                  </div>
                  <div className="text-xl font-bold text-[#f87171]">₹3,080</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-[#60a5fa]/10 border border-[#60a5fa]/20">
                  <div>
                    <div className="font-medium text-[#60a5fa]">Net Income</div>
                    <div className="text-sm text-muted-foreground">
                      This month
                    </div>
                  </div>
                  <div className="text-xl font-bold text-[#60a5fa]">₹1,220</div>
                </div>

                <div className="pt-2">
                  <div className="text-sm text-muted-foreground mb-2">
                    Days with transactions: 12/31
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average daily spending: ₹99.35
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddTransactionDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
      />
    </>
  );
}
