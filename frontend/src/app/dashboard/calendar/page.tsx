"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCalendarTransactionsQuery, useGetUpcomingRecurringTransactionsQuery } from "@/redux/api/transactionApi";
import { useDefaultAccount } from "@/hooks/useDefaultAccount";
import moment from "moment";
import { CalendarDateTransactionsDialog } from "@/components/dialog/CalendarDateTransactionsDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export default function Page() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const defaultAccountId = useDefaultAccount();

  // Fetch upcoming recurring transactions
  const {
    data: upcomingRecurringResponse,
    isLoading: isUpcomingLoading,
  } = useGetUpcomingRecurringTransactionsQuery();

  // Fetch calendar data for the current month
  const {
    data: calendarDataResponse,
    isLoading: isCalendarLoading,
  } = useGetCalendarTransactionsQuery(
    {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      ...(defaultAccountId && { accountId: defaultAccountId }),
    },
    {
      skip: !defaultAccountId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Transform API data to calendar events format
  const calendarEvents = useMemo(() => {
    if (!calendarDataResponse?.data?.dailyData) return [];
    return calendarDataResponse.data.dailyData.map((dayData) => ({
      date: dayData.date,
      transactions: dayData.latestTransactions.map((t) => ({
        id: `${dayData.date}-${t.description}`,
        description: t.description || "No description",
        amount: t.amount,
        type: t.type.toLowerCase(),
      })),
      count: dayData.count,
      sum: dayData.sum,
    }));
  }, [calendarDataResponse]);

  // Get monthly summary from API
  const monthlySummary = useMemo(() => {
    return calendarDataResponse?.data?.monthlySummary;
  }, [calendarDataResponse]);

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
    const dateStr = moment(currentDate).date(day).format("YYYY-MM-DD");
    const dayEvents = calendarEvents.find((event) => event.date === dateStr);
    return dayEvents ? dayEvents.transactions : [];
  };

  const getDayTotal = (day: number) => {
    const dateStr = moment(currentDate).date(day).format("YYYY-MM-DD");
    const dayEvents = calendarEvents.find((event) => event.date === dateStr);
    return dayEvents ? dayEvents.sum : 0;
  };

  const getDayCount = (day: number) => {
    const dateStr = moment(currentDate).date(day).format("YYYY-MM-DD");
    const dayEvents = calendarEvents.find((event) => event.date === dateStr);
    return dayEvents ? dayEvents.count : 0;
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
      const dayCount = getDayCount(day);
      const hasTransactions = dayCount > 0;
      const today = new Date();
      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => {
            const dateStr = moment(currentDate).date(day).format("YYYY-MM-DD");
            setSelectedDate(dateStr);
            setIsDateDialogOpen(true);
          }}
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
                {dayCount}
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
              {dayCount > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{dayCount - 2} more
                </div>
              )}
              {dayTotal !== 0 && (
                <div
                  className={`text-xs font-medium ${dayTotal > 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}
                >
                  {dayTotal > 0 ? "+" : ""}₹{Math.abs(dayTotal).toFixed(2)}
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
              onClick={() => {
                // TODO: Implement transaction dialog
              }}
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
            {isCalendarLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading calendar data...
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2">{renderCalendarGrid()}</div>
            )}
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
              {isUpcomingLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading upcoming bills...
                </div>
              ) : upcomingRecurringResponse?.data && upcomingRecurringResponse.data.length > 0 ? (
                <div className="space-y-1">
                  {upcomingRecurringResponse.data.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-start justify-between py-2 hover:bg-[var(--card-hover)] transition-colors rounded px-1"
                    >
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        {transaction.category?.icon && (
                          <span className="text-base mt-0.5">{transaction.category.icon}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {transaction.description || "No description"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Due {moment(transaction.nextExecutionDate).format("MMM DD, YYYY")}
                          </div>
                        </div>
                      </div>
                      <div className="ml-3 text-right flex-shrink-0">
                        <div className="text-xs text-muted-foreground mb-0.5">
                          {transaction.category?.name || "Uncategorized"}
                        </div>
                        <div
                          className={`text-sm font-semibold ${transaction.type === "EXPENSE"
                            ? "text-[#f87171]"
                            : "text-[#4ade80]"
                            }`}
                        >
                          {transaction.type === "EXPENSE" ? "-" : "+"}₹{transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming recurring transactions
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
              <CardDescription>
                Your financial activity for {formatDate(currentDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCalendarLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading monthly summary...
                </div>
              ) : monthlySummary ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-[#4ade80]/10 border border-[#4ade80]/20">
                    <div>
                      <div className="font-medium text-[#4ade80]">
                        Total Income
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {monthlySummary.totalIncome.count} transactions
                      </div>
                    </div>
                    <div className="text-xl font-bold text-[#4ade80]">
                      ₹{monthlySummary.totalIncome.amount.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-[#f87171]/10 border border-[#f87171]/20">
                    <div>
                      <div className="font-medium text-[#f87171]">
                        Total Expenses
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {monthlySummary.totalExpenses.count} transactions
                      </div>
                    </div>
                    <div className="text-xl font-bold text-[#f87171]">
                      ₹{monthlySummary.totalExpenses.amount.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-[#60a5fa]/10 border border-[#60a5fa]/20">
                    <div>
                      <div className="font-medium text-[#60a5fa]">Net Income</div>
                      <div className="text-sm text-muted-foreground">
                        This month
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${monthlySummary.netIncome >= 0 ? "text-[#60a5fa]" : "text-[#f87171]"}`}>
                      ₹{monthlySummary.netIncome.toFixed(2)}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">
                      Days with transactions: {monthlySummary.daysWithTransactions}/{moment(currentDate).daysInMonth()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average daily spending: ₹{monthlySummary.averageDailySpending.toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CalendarDateTransactionsDialog
        open={isDateDialogOpen}
        onOpenChange={setIsDateDialogOpen}
        date={selectedDate || ""}
      />
    </>
  );
}
