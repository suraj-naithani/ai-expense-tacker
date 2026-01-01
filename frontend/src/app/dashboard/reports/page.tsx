"use client";

import { Calendar as CalendarIcon, Download, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useDefaultAccount } from "@/hooks/useDefaultAccount";
import { useGetTransactionStatsQuery, useGetTransactionGraphQuery, useGetIncomeExpenseSavingsQuery, useGetDailySpendingQuery } from "@/redux/api/statsApi";
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



export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "3months" | "6months" | "yearly" | "custom">("6months");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCustomDatePickerOpen, setIsCustomDatePickerOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(undefined);
  const defaultAccountId = useDefaultAccount();

  const timeRange = dateRange ? "custom" : selectedPeriod;

  // Get period label for card titles
  const getPeriodLabel = () => {
    if (dateRange?.from && dateRange?.to) {
      return "Custom Range";
    }
    switch (selectedPeriod) {
      case "monthly":
        return "Monthly";
      case "3months":
        return "3 Month";
      case "6months":
        return "6 Month";
      case "yearly":
        return "Yearly";
      case "custom":
        return "Custom";
      default:
        return "Monthly";
    }
  };

  const periodLabel = getPeriodLabel();

  // Open popover when custom is selected
  useEffect(() => {
    if (selectedPeriod === "custom") {
      const timer = setTimeout(() => {
        setIsCustomDatePickerOpen(true);
        setTempDateRange(dateRange || undefined);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsCustomDatePickerOpen(false);
    }
  }, [selectedPeriod, dateRange]);

  // Get transaction stats
  const {
    data: statsResponse,
    isLoading: isStatsLoading,
  } = useGetTransactionStatsQuery(
    {
      timeRange: timeRange as "monthly" | "3months" | "6months" | "yearly" | "custom",
      accountId: defaultAccountId || "",
      ...(timeRange === "custom" && dateRange?.from && dateRange?.to && {
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
      }),
    },
    {
      skip: !defaultAccountId || (timeRange === "custom" && (!dateRange?.from || !dateRange?.to)),
      refetchOnMountOrArgChange: true,
    }
  );

  // Get transaction graph data
  const {
    data: graphResponse,
    isLoading: isGraphLoading,
  } = useGetTransactionGraphQuery(
    {
      accountId: defaultAccountId || undefined,
    },
    {
      skip: !defaultAccountId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Get income, expense, savings stats
  const {
    data: incomeExpenseSavingsResponse,
    isLoading: isIncomeExpenseSavingsLoading,
  } = useGetIncomeExpenseSavingsQuery(
    {
      timeRange: timeRange as "monthly" | "3months" | "6months" | "yearly" | "custom",
      accountId: defaultAccountId || "",
      ...(timeRange === "custom" && dateRange?.from && dateRange?.to && {
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
      }),
    },
    {
      skip: !defaultAccountId || (timeRange === "custom" && (!dateRange?.from || !dateRange?.to)),
      refetchOnMountOrArgChange: true,
    }
  );

  // Get daily spending stats (last 7 days)
  const {
    data: dailySpendingResponse,
    isLoading: isDailySpendingLoading,
  } = useGetDailySpendingQuery(
    {
      accountId: defaultAccountId || "",
    },
    {
      skip: !defaultAccountId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Use API data for graph, fallback to empty array if loading or no data
  const monthlyData = graphResponse?.data || [];

  // Use API data for daily spending, fallback to empty array if loading or no data
  const dailySpending = dailySpendingResponse?.data || [];

  // Transform API data for pie chart
  const pieData = incomeExpenseSavingsResponse?.data
    ? [
      {
        name: "Income",
        amount: incomeExpenseSavingsResponse.data.income.total,
        percentage: Math.round(incomeExpenseSavingsResponse.data.income.percentage),
        color: "#10b981",
      },
      {
        name: "Expenses",
        amount: incomeExpenseSavingsResponse.data.expenses.total,
        percentage: Math.round(incomeExpenseSavingsResponse.data.expenses.percentage),
        color: "#ef4444",
      },
      {
        name: "Savings",
        amount: incomeExpenseSavingsResponse.data.savings.total,
        percentage: Math.round(incomeExpenseSavingsResponse.data.savings.percentage),
        color: "#8b5cf6",
      },
    ]
    : [];

  // Calculate stats from API
  const statsData = statsResponse?.data;
  const totalIncome = statsData?.totalIncome ?? 0;
  const totalExpenses = statsData?.totalExpenses ?? 0;
  const periodSavings = statsData?.periodSavings ?? 0; // Period savings (income - expenses)
  const comparisons = statsData?.comparisons;

  // Calculate savings rate using period savings
  const savingsRate = totalIncome > 0 ? (periodSavings / totalIncome) * 100 : 0;

  // Calculate savings rate comparison using balance comparison as proxy
  // Since savings rate = balance/income, we use balance change as an approximation
  const savingsRateChange = comparisons?.totalBalance?.change ?? 0;
  const savingsRateChangeType = comparisons?.totalBalance?.type ?? "no-change";

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
          <Popover open={isCustomDatePickerOpen} onOpenChange={setIsCustomDatePickerOpen}>
            <div className="flex items-center gap-2">
              <Select
                value={dateRange ? "custom" : selectedPeriod}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setSelectedPeriod("custom");
                    setIsCustomDatePickerOpen(true);
                    setTempDateRange(dateRange || undefined);
                  } else {
                    setSelectedPeriod(value as "monthly" | "3months" | "6months" | "yearly");
                    setDateRange(undefined);
                    setIsCustomDatePickerOpen(false);
                  }
                }}
              >
                <SelectTrigger className="w-[140px] border-[var(--border)] bg-[var(--card)]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent className="border-[var(--border)] bg-[var(--card)]">
                  <SelectItem value="monthly">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="yearly">Last Year</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              {(selectedPeriod === "custom" || dateRange?.from) && (
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[240px] justify-start text-left font-normal border-[var(--border)] bg-[var(--card)]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from && dateRange?.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      "Select date range"
                    )}
                  </Button>
                </PopoverTrigger>
              )}
            </div>
            <PopoverContent className="w-auto p-0 border-[var(--border)] bg-[var(--card)]" align="start">
              <div className="p-4">
                <div className="flex items-center gap-4 text-sm pb-4 border-b border-[var(--border)]">
                  <div>
                    <span className="text-muted-foreground">From: </span>
                    <span className="font-medium">
                      {tempDateRange?.from ? format(tempDateRange.from, "MMM dd, yyyy") : "Not selected"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">To: </span>
                    <span className="font-medium">
                      {tempDateRange?.to ? format(tempDateRange.to, "MMM dd, yyyy") : "Not selected"}
                    </span>
                  </div>
                </div>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={tempDateRange?.from || new Date()}
                  selected={tempDateRange}
                  onSelect={setTempDateRange}
                  numberOfMonths={1}
                  classNames={{
                    day_range_start: "bg-[#6366f1] text-white rounded-l-md",
                    day_range_end: "bg-[#6366f1] text-white rounded-r-md",
                    day_range_middle: "bg-[#6366f1]/20 text-foreground",
                    day_selected: "bg-[#6366f1] text-white hover:bg-[#6366f1] hover:text-white",
                  }}
                />
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)]">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[var(--border)]"
                    onClick={() => {
                      setIsCustomDatePickerOpen(false);
                      if (dateRange?.from && dateRange?.to) {
                        setTempDateRange(dateRange);
                      } else {
                        setTempDateRange(undefined);
                        if (selectedPeriod === "custom") {
                          setSelectedPeriod("6months");
                        }
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                    disabled={!tempDateRange?.from || !tempDateRange?.to}
                    onClick={() => {
                      if (tempDateRange?.from && tempDateRange?.to) {
                        setDateRange(tempDateRange);
                        setSelectedPeriod("custom");
                        setIsCustomDatePickerOpen(false);
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
              {periodLabel} Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <div className="text-xl md:text-2xl font-bold text-muted-foreground">Loading...</div>
            ) : (
              <>
                <div className="text-xl md:text-2xl font-bold text-[#4ade80]">
                  ₹{totalIncome.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {comparisons?.totalIncome ? (
                    <>
                      {comparisons.totalIncome.type === "increase" ? (
                        <TrendingUp className="h-3 w-3 text-[#4ade80]" />
                      ) : comparisons.totalIncome.type === "decrease" ? (
                        <TrendingUp className="h-3 w-3 text-[#f87171] rotate-180" />
                      ) : null}
                      <span className={comparisons.totalIncome.type === "increase" ? "text-[#4ade80]" : comparisons.totalIncome.type === "decrease" ? "text-[#f87171]" : ""}>
                        {comparisons.totalIncome.type === "increase" ? "+" : ""}
                        {comparisons.totalIncome.change.toFixed(1)}%
                      </span>
                      {" vs last period"}
                    </>
                  ) : (
                    <span>No comparison data</span>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {periodLabel} Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <div className="text-xl md:text-2xl font-bold text-muted-foreground">Loading...</div>
            ) : (
              <>
                <div className="text-xl md:text-2xl font-bold text-[#f87171]">
                  ₹{totalExpenses.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {comparisons?.totalExpenses ? (
                    <>
                      {comparisons.totalExpenses.type === "increase" ? (
                        <TrendingUp className="h-3 w-3 text-[#f87171]" />
                      ) : comparisons.totalExpenses.type === "decrease" ? (
                        <TrendingUp className="h-3 w-3 text-[#4ade80] rotate-180" />
                      ) : null}
                      <span className={comparisons.totalExpenses.type === "increase" ? "text-[#f87171]" : comparisons.totalExpenses.type === "decrease" ? "text-[#4ade80]" : ""}>
                        {comparisons.totalExpenses.type === "increase" ? "+" : ""}
                        {comparisons.totalExpenses.change.toFixed(1)}%
                      </span>
                      {" vs last period"}
                    </>
                  ) : (
                    <span>No comparison data</span>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {periodLabel} Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <div className="text-xl md:text-2xl font-bold text-muted-foreground">Loading...</div>
            ) : (
              <>
                <div className={`text-xl md:text-2xl font-bold ${periodSavings >= 0 ? "text-[#60a5fa]" : "text-[#f87171]"}`}>
                  ₹{periodSavings.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {comparisons?.totalBalance ? (
                    <>
                      {comparisons.totalBalance.type === "increase" ? (
                        <TrendingUp className="h-3 w-3 text-[#4ade80]" />
                      ) : comparisons.totalBalance.type === "decrease" ? (
                        <TrendingUp className="h-3 w-3 text-[#f87171] rotate-180" />
                      ) : null}
                      <span className={comparisons.totalBalance.type === "increase" ? "text-[#4ade80]" : comparisons.totalBalance.type === "decrease" ? "text-[#f87171]" : ""}>
                        {comparisons.totalBalance.type === "increase" ? "+" : ""}
                        {comparisons.totalBalance.change.toFixed(1)}%
                      </span>
                      {" vs last period"}
                    </>
                  ) : (
                    <span>No comparison data</span>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {periodLabel} Savings Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <div className="text-xl md:text-2xl font-bold text-muted-foreground">Loading...</div>
            ) : (
              <>
                <div className="text-xl md:text-2xl font-bold text-[#a78bfa]">
                  {savingsRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {comparisons?.totalBalance ? (
                    <>
                      {savingsRateChangeType === "increase" ? (
                        <TrendingUp className="h-3 w-3 text-[#4ade80]" />
                      ) : savingsRateChangeType === "decrease" ? (
                        <TrendingUp className="h-3 w-3 text-[#f87171] rotate-180" />
                      ) : null}
                      <span className={savingsRateChangeType === "increase" ? "text-[#4ade80]" : savingsRateChangeType === "decrease" ? "text-[#f87171]" : ""}>
                        {savingsRateChangeType === "increase" ? "+" : ""}
                        {savingsRateChange.toFixed(1)}%
                      </span>
                      {" vs last period"}
                    </>
                  ) : (
                    <span>No comparison data</span>
                  )}
                </p>
              </>
            )}
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
            {isGraphLoading ? (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Loading graph data...
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            ) : (
              <ChartContainer
                config={{
                  income: {
                    label: "Income",
                    color: "#10b981",
                  },
                  expense: {
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
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend
                    verticalAlign="bottom"
                    wrapperStyle={{ bottom: -10 }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="savings" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-3 border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader>
            <CardTitle>Financial Breakdown</CardTitle>
            <CardDescription>
              How your money is distributed across {periodLabel.toLowerCase()} income, expenses, and savings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isIncomeExpenseSavingsLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Loading financial breakdown...
              </div>
            ) : pieData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            ) : (
              <>
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
                        <div className="text-sm font-medium">₹{item.amount.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Trends and Daily Spending */}
      <div className="grid gap-4 grid-cols-1 md:gap-6 lg:grid-cols-8">
        <Card className="col-span-full lg:col-span-3 border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader>
            <CardTitle>Daily Spending Pattern</CardTitle>
            <CardDescription>
              Your spending pattern for the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isDailySpendingLoading ? (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center text-muted-foreground">
                Loading daily spending...
              </div>
            ) : dailySpending.length === 0 ? (
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
                  <BarChart data={dailySpending} barCategoryGap="20%" barGap={2}>
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
