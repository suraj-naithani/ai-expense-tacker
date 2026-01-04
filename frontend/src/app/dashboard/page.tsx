"use client";

import {
  Briefcase,
  Car,
  Coffee,
  DollarSign,
  Film,
  Plus,
  ShoppingCart,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { QuickAddExpenseDialog } from "@/components/dialog/QuickAddExpenseDialog";
import { useGetDashboardStatsQuery, useGetAllAccountsDailySpendingQuery, useGetAllAccountsCategorySpendingQuery, useGetAllAccountsYearlyMonthlySpendingQuery } from "@/redux/api/statsApi";

const recentTransactions = [
  {
    id: 1,
    description: "Starbucks Coffee",
    category: "Food & Dining",
    amount: -4.85,
    date: "Today",
    type: "expense",
    icon: Coffee,
    color: "#8b5cf6",
  },
  {
    id: 2,
    description: "Uber Ride",
    category: "Transportation",
    amount: -12.4,
    date: "Today",
    type: "expense",
    icon: Car,
    color: "#06b6d4",
  },
  {
    id: 3,
    description: "Salary Deposit",
    category: "Income",
    amount: 3500.0,
    date: "Yesterday",
    type: "income",
    icon: Briefcase,
    color: "#10b981",
  },
  {
    id: 4,
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: -15.99,
    date: "2 days ago",
    type: "expense",
    icon: Film,
    color: "#f59e0b",
  },
  {
    id: 5,
    description: "Grocery Store",
    category: "Food & Dining",
    amount: -87.32,
    date: "3 days ago",
    type: "expense",
    icon: ShoppingCart,
    color: "#8b5cf6",
  },
];

const Page = () => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Get dashboard stats
  const {
    data: dashboardStatsResponse,
    isLoading: isDashboardStatsLoading,
  } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const dashboardStats = dashboardStatsResponse?.data;

  // Get daily spending for all accounts
  const {
    data: dailySpendingResponse,
    isLoading: isDailySpendingLoading,
  } = useGetAllAccountsDailySpendingQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Use API data for weekly spending, fallback to empty array if loading or no data
  const weeklySpendingData = dailySpendingResponse?.data || [];

  // Get yearly monthly spending for all accounts
  const {
    data: yearlyMonthlySpendingResponse,
    isLoading: isYearlyMonthlySpendingLoading,
  } = useGetAllAccountsYearlyMonthlySpendingQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Use API data for spending trend, fallback to empty array if loading or no data
  const spendingData = yearlyMonthlySpendingResponse?.data || [];

  // Get category spending for all accounts
  const {
    data: categorySpendingResponse,
    isLoading: isCategorySpendingLoading,
  } = useGetAllAccountsCategorySpendingQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Transform category spending data for current month
  const categoryData = useMemo(() => {
    const categoryTrends = categorySpendingResponse?.data || [];
    if (categoryTrends.length === 0) return [];

    // Get current month (last item in array)
    const currentMonth = categoryTrends[categoryTrends.length - 1];
    if (!currentMonth) return [];

    // Get all category names (excluding 'month')
    const categoryNames = Object.keys(currentMonth).filter((key) => key !== "month");

    // Calculate total for percentage calculation
    const total = categoryNames.reduce((sum, catName) => {
      return sum + (Number(currentMonth[catName]) || 0);
    }, 0);

    // Colors for categories
    const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#6366f1"];

    // Transform to pie chart format
    return categoryNames
      .map((catName, index) => {
        const amount = Number(currentMonth[catName]) || 0;
        return {
          category: catName,
          amount: amount,
          percentage: total > 0 ? Math.round((amount / total) * 100 * 10) / 10 : 0,
          color: colors[index % colors.length],
        };
      })
      .filter((item) => item.amount > 0) // Only show categories with spending
      .sort((a, b) => b.amount - a.amount); // Sort by amount descending
  }, [categorySpendingResponse?.data]);


  // Get change color based on type
  const getChangeColor = (type: "increase" | "decrease" | "no-change") => {
    switch (type) {
      case "increase":
        return "text-[#4ade80]";
      case "decrease":
        return "text-[#f87171]";
      default:
        return "text-muted-foreground";
    }
  };

  // Get change symbol
  const getChangeSymbol = (type: "increase" | "decrease" | "no-change") => {
    switch (type) {
      case "increase":
        return "+";
      case "decrease":
        return "";
      default:
        return "";
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Track spending, monitor income, and stay financially organized
            </p>
          </div>
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

        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isDashboardStatsLoading ? (
                <div className="text-xl md:text-2xl font-bold text-[#4ade80]">
                  Loading...
                </div>
              ) : (
                <>
                  <div className="text-xl md:text-2xl font-bold text-[#4ade80]">
                    {dashboardStats?.totalBalance
                      ? `₹${dashboardStats.totalBalance.amount.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
                      : "₹0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats?.totalBalance && (
                      <span
                        className={getChangeColor(
                          dashboardStats.totalBalance.type
                        )}
                      >
                        {getChangeSymbol(dashboardStats.totalBalance.type)}
                        {dashboardStats.totalBalance.change.toFixed(1)}%
                      </span>
                    )}{" "}
                    from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isDashboardStatsLoading ? (
                <div className="text-xl md:text-2xl font-bold">Loading...</div>
              ) : (
                <>
                  <div className="text-xl md:text-2xl font-bold">
                    {dashboardStats?.monthlyIncome
                      ? `₹${dashboardStats.monthlyIncome.amount.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
                      : "₹0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats?.monthlyIncome && (
                      <span
                        className={getChangeColor(
                          dashboardStats.monthlyIncome.type
                        )}
                      >
                        {getChangeSymbol(dashboardStats.monthlyIncome.type)}
                        {dashboardStats.monthlyIncome.change.toFixed(1)}%
                      </span>
                    )}{" "}
                    from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Expense
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isDashboardStatsLoading ? (
                <div className="text-xl md:text-2xl font-bold text-[#f87171]">
                  Loading...
                </div>
              ) : (
                <>
                  <div className="text-xl md:text-2xl font-bold text-[#f87171]">
                    {dashboardStats?.monthlyExpense
                      ? `₹${dashboardStats.monthlyExpense.amount.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
                      : "₹0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats?.monthlyExpense && (
                      <span
                        className={getChangeColor(
                          dashboardStats.monthlyExpense.type
                        )}
                      >
                        {getChangeSymbol(dashboardStats.monthlyExpense.type)}
                        {dashboardStats.monthlyExpense.change.toFixed(1)}%
                      </span>
                    )}{" "}
                    from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Savings Rate
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isDashboardStatsLoading ? (
                <div className="text-xl md:text-2xl font-bold text-[#60a5fa]">
                  Loading...
                </div>
              ) : (
                <>
                  <div className="text-xl md:text-2xl font-bold text-[#60a5fa]">
                    {dashboardStats?.savingsRate
                      ? `${dashboardStats.savingsRate.percentage.toFixed(1)}%`
                      : "0%"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats?.savingsRate && (
                      <span
                        className={getChangeColor(
                          dashboardStats.savingsRate.type
                        )}
                      >
                        {getChangeSymbol(dashboardStats.savingsRate.type)}
                        {dashboardStats.savingsRate.change.toFixed(1)}%
                      </span>
                    )}{" "}
                    from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-[var(--border)] bg-[var(--card)]">
          <CardHeader>
            <CardTitle>Quick Add Expense</CardTitle>
            <CardDescription>
              Add frequently used expenses quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[var(--border)] hover:bg-[#6366f1] hover:text-white"
                onClick={() => setIsQuickAddOpen(true)}
              >
                <Coffee className="h-4 w-4 mr-2" />
                Coffee ₹5
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[var(--border)] hover:bg-[#6366f1] hover:text-white"
                onClick={() => setIsQuickAddOpen(true)}
              >
                <Car className="h-4 w-4 mr-2" />
                Gas ₹50
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[var(--border)] hover:bg-[#6366f1] hover:text-white"
                onClick={() => setIsQuickAddOpen(true)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Groceries ₹100
              </Button>
              <Button
                size="sm"
                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white cursor-pointer"
                onClick={() => {
                  // TODO: Implement transaction dialog
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Custom
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-4 border-[var(--border)] bg-[var(--card)]">
            <CardHeader>
              <CardTitle>Spending Trend</CardTitle>
              <CardDescription>
                Your monthly spending over the last 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isYearlyMonthlySpendingLoading ? (
                <div className="h-[250px] md:h-[300px] flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              ) : spendingData.length === 0 ? (
                <div className="h-[250px] md:h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              ) : (
                <ChartContainer
                  config={{
                    amount: {
                      label: "Amount",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[250px] md:h-[300px] w-full"
                >
                  <AreaChart data={spendingData}>
                    <defs>
                      <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#fillAmount)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-3 border-[var(--border)] bg-[var(--card)]">
            <CardHeader>
              <CardTitle>Weekly Spending</CardTitle>
              <CardDescription>This last seven day breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {isDailySpendingLoading ? (
                <div className="h-[250px] md:h-[300px] flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              ) : weeklySpendingData.length === 0 ? (
                <div className="h-[250px] md:h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              ) : (
                <ChartContainer
                  config={{
                    amount: {
                      label: "Amount",
                      color: "#6366f1",
                    },
                  }}
                  className="h-[250px] md:h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklySpendingData} barCategoryGap="20%" barGap={2}>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#a1a1aa", fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#a1a1aa", fontSize: 11 }}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="amount"
                        fill="#6366f1"
                        radius={[6, 6, 0, 0]}
                        barSize={10}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest financial activity
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${transaction.color}20` }}
                    >
                      <transaction.icon
                        className="h-5 w-5"
                        style={{ color: transaction.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {transaction.description}
                        </p>
                        <p
                          className={`text-sm font-medium ${transaction.type === "income"
                            ? "text-[#4ade80]"
                            : "text-[#f87171]"
                            }`}
                        >
                          {transaction.type === "income" ? "+" : ""}₹
                          {Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {transaction.date}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0 bg-[var(--card-hover)]"
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4 text-[#6366f1] p-0">
                View all transactions →
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>{`This month's breakdown`}</CardDescription>
            </CardHeader>
            <CardContent>
              {isCategorySpendingLoading ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              ) : categoryData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              ) : (
                <div className="flex items-center justify-center mb-6 w-full flex-col lg:flex-row gap-4">
                  <div className="h-full w-full lg:h-[200px] lg:w-[200px] flex-1">
                    <ChartContainer
                      config={{
                        amount: {
                          label: "Amount",
                        },
                      }}
                      className="h-full w-full"
                    >
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="amount"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                  <div className="space-y-3 flex-1 w-full">
                    {categoryData.map((item) => (
                      <div
                        key={item.category}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            ₹{item.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <AddTransactionDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
      /> */}
      <QuickAddExpenseDialog
        open={isQuickAddOpen}
        onOpenChange={setIsQuickAddOpen}
      />
    </main>
  );
};

export default Page;
