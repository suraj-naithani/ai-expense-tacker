"use client";

import { Calendar, Download, TrendingUp } from "lucide-react";
import { useState } from "react";

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
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const monthlyData = [
  { month: "Jan", income: 4000, expenses: 2400, savings: 1600 },
  { month: "Feb", income: 3000, expenses: 1398, savings: 1602 },
  { month: "Mar", income: 2000, expenses: 980, savings: 1020 },
  { month: "Apr", income: 2780, expenses: 3908, savings: -1128 },
  { month: "May", income: 1890, expenses: 4800, savings: -2910 },
  { month: "Jun", income: 2390, expenses: 3800, savings: -1410 },
  { month: "Jul", income: 3490, expenses: 4300, savings: -810 },
  { month: "Aug", income: 4200, expenses: 2800, savings: 1400 },
  { month: "Sep", income: 3800, expenses: 2100, savings: 1700 },
  { month: "Oct", income: 4500, expenses: 3000, savings: 1500 },
  { month: "Nov", income: 5000, expenses: 3500, savings: 1500 },
  { month: "Dec", income: 5500, expenses: 4000, savings: 1500 },
];

const categoryTrends = [
  { month: "Jan", Food: 4000, Transport: 320, Shopping: 2400, Bills: 1600 },
  { month: "Feb", Food: 3000, Transport: 280, Shopping: 1398, Bills: 1602 },
  { month: "Mar", Food: 2000, Transport: 350, Shopping: 980, Bills: 1020 },
  { month: "Apr", Food: 2780, Transport: 300, Shopping: 3908, Bills: 1128 },
  { month: "May", Food: 1890, Transport: 380, Shopping: 4800, Bills: 2910 },
  { month: "Jun", Food: 2390, Transport: 320, Shopping: 3800, Bills: 1410 },
  { month: "Jul", Food: 3490, Transport: 520, Shopping: 4300, Bills: 810 },
  { month: "Aug", Food: 4200, Transport: 620, Shopping: 2800, Bills: 1400 },
  { month: "Sep", Food: 3800, Transport: 720, Shopping: 2100, Bills: 1700 },
  { month: "Oct", Food: 4500, Transport: 920, Shopping: 3000, Bills: 1500 },
  { month: "Nov", Food: 5000, Transport: 220, Shopping: 3500, Bills: 1500 },
  { month: "Dec", Food: 5500, Transport: 320, Shopping: 4000, Bills: 1500 },
];

const weeklySpending = [
  { week: "Week 1", amount: 850 },
  { week: "Week 2", amount: 920 },
  { week: "Week 3", amount: 780 },
  { week: "Week 4", amount: 1100 },
  { week: "Week 5", amount: 1100 },
];

const pieData = [
  { name: "Income", amount: 5500, percentage: 33, color: "#10b981" },
  { name: "Expenses", amount: 4000, percentage: 40, color: "#ef4444" },
  { name: "Savings", amount: 1500, percentage: 27, color: "#8b5cf6" },
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your financial data and trends
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px] border-[var(--border)] bg-[var(--card)]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent className="border-[var(--border)] bg-[var(--card)]">
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--border)]"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--border)]"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-[#4ade80]">
              $5,350
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-[#4ade80]" />
              <span className="text-[#4ade80]">+5.2%</span> vs last period
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-[#f87171]">
              $4,033
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-[#f87171]" />
              <span className="text-[#f87171]">+2.8%</span> vs last period
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Monthly Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-[#60a5fa]">
              $1,317
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-[#4ade80]" />
              <span className="text-[#4ade80]">+12.5%</span> vs last period
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Savings Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-[#a78bfa]">
              24.6%
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-[#4ade80]" />
              <span className="text-[#4ade80]">+3.1%</span> vs last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:gap-6 lg:grid-cols-8">
        <Card className="col-span-full lg:col-span-5 border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader>
            <CardTitle>Income vs Expenses Trend</CardTitle>
            <CardDescription>
              Monthly comparison of income, expenses, and savings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                income: {
                  label: "Income",
                  color: "#10b981",
                },
                expenses: {
                  label: "Expenses",
                  color: "#ef4444",
                },
                savings: {
                  label: "Savings",
                  color: "#6366f1",
                },
              }}
              className="h-[400px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={monthlyData}
                barSize={10}
                barCategoryGap="30%"
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend
                  verticalAlign="bottom"
                  wrapperStyle={{ bottom: -10 }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-3 border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader>
            <CardTitle>Financial Breakdown</CardTitle>
            <CardDescription>
              How your money is distributed across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
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
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="space-y-3 flex-1 w-full">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">₹{item.amount}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Trends and Weekly Spending */}
      <div className="grid gap-4 grid-cols-1 md:gap-6 lg:grid-cols-8">
        <Card className="col-span-full lg:col-span-3 border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Spending Pattern</CardTitle>
            <CardDescription>
              Your spending pattern throughout the month
            </CardDescription>
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
                <BarChart data={weeklySpending} barCategoryGap="20%" barGap={2}>
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
        <Card className="col-span-full lg:col-span-5 border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader>
            <CardTitle>Category Spending Trends</CardTitle>
            <CardDescription>
              How spending in each category has changed over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Food: {
                  label: "Food",
                  color: "#8b5cf6",
                },
                Transport: {
                  label: "Transport",
                  color: "#06b6d4",
                },
                Shopping: {
                  label: "Shopping",
                  color: "#f59e0b",
                },
                Bills: {
                  label: "Bills",
                  color: "#ef4444",
                },
              }}
              className="h-[300px] w-full"
            >
              <LineChart data={categoryTrends}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend wrapperStyle={{ bottom: -10 }} />
                <Line
                  type="monotone"
                  dot={false}
                  dataKey="Food"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dot={false}
                  dataKey="Transport"
                  stroke="#06b6d4"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dot={false}
                  dataKey="Shopping"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dot={false}
                  dataKey="Bills"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
