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
import { useState } from "react";
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
import { AddExpenseDialog } from "@/components/dialog/AddExpenseDialog";
import { QuickAddExpenseDialog } from "@/components/dialog/QuickAddExpenseDialog";

const spendingData = [
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 1398 },
  { month: "Mar", amount: 9800 },
  { month: "Apr", amount: 3908 },
  { month: "May", amount: 4800 },
  { month: "Jun", amount: 3800 },
  { month: "Jul", amount: 3462 },
  { month: "Aug", amount: 3198 },
  { month: "Sep", amount: 7593 },
  { month: "Nov", amount: 4860 },
  { month: "Dec", amount: 9800 },
];

const weeklyData = [
  { week: "Mon", amount: 1200 },
  { week: "Tues", amount: 1800 },
  { week: "Wed", amount: 1600 },
  { week: "Thurs", amount: 2200 },
  { week: "Fri", amount: 2200 },
  { week: "Sat", amount: 2200 },
  { week: "Sun", amount: 2200 },
];

const categoryData = [
  { category: "Food", amount: 450, percentage: 32.1, color: "#3b82f6" },
  { category: "Transport", amount: 280, percentage: 20.0, color: "#8b5cf6" },
  {
    category: "Entertainment",
    amount: 150,
    percentage: 10.7,
    color: "#10b981",
  },
  { category: "Shopping", amount: 320, percentage: 22.9, color: "#f59e0b" },
  { category: "Bills", amount: 200, percentage: 14.3, color: "#ef4444" },
];

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
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

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
            onClick={() => setIsAddExpenseOpen(true)}
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
              <div className="text-xl md:text-2xl font-bold text-[#4ade80]">
                ₹12,450.00
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-[#4ade80]">+2.5%</span> from last month
              </p>
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
              <div className="text-xl md:text-2xl font-bold">₹5,200.00</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-[#4ade80]">+12%</span> from last month
              </p>
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
              <div className="text-xl md:text-2xl font-bold text-[#f87171]">
                ₹3,840.00
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-[#f87171]">+8%</span> from last month
              </p>
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
              <div className="text-xl md:text-2xl font-bold text-[#60a5fa]">
                26%
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-[#4ade80]">+3%</span> from last month
              </p>
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
                onClick={() => setIsAddExpenseOpen(true)}
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
                Your monthly spending over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-3 border-[var(--border)] bg-[var(--card)]">
            <CardHeader>
              <CardTitle>Weekly Spending</CardTitle>
              <CardDescription>This last seven day breakdown</CardDescription>
            </CardHeader>
            <CardContent>
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
                  <BarChart data={weeklyData} barCategoryGap="20%" barGap={2}>
                    <XAxis
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#a1a1aa", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#a1a1aa", fontSize: 11 }}
                      tickFormatter={(value) => `${value}`}
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
                          className={`text-sm font-medium ${
                            transaction.type === "income"
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
                          ₹{item.amount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
      />
      <QuickAddExpenseDialog
        open={isQuickAddOpen}
        onOpenChange={setIsQuickAddOpen}
      />
    </main>
  );
};

export default Page;
