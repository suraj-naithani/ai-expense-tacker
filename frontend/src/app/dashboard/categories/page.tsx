"use client";

import {
  DollarSign,
  MoreHorizontal,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { AddExpenseDialog } from "@/components/dialog/AddExpenseDialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cell, Pie, PieChart } from "recharts";

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

const categories = [
  {
    id: 1,
    name: "Food & Dining",
    budget: 800,
    spent: 650,
    transactions: 24,
    color: "#8b5cf6",
    trend: 5.2,
    icon: "🍽️",
  },
  {
    id: 2,
    name: "Transportation",
    budget: 400,
    spent: 320,
    transactions: 12,
    color: "#06b6d4",
    trend: -2.1,
    icon: "🚗",
  },
  {
    id: 3,
    name: "Shopping",
    budget: 600,
    spent: 480,
    transactions: 18,
    color: "#f59e0b",
    trend: 8.7,
    icon: "🛍️",
  },
  {
    id: 4,
    name: "Bills & Utilities",
    budget: 1200,
    spent: 1150,
    transactions: 8,
    color: "#ef4444",
    trend: 1.2,
    icon: "⚡",
  },
  {
    id: 5,
    name: "Entertainment",
    budget: 300,
    spent: 180,
    transactions: 15,
    color: "#10b981",
    trend: -12.5,
    icon: "🎬",
  },
  {
    id: 6,
    name: "Healthcare",
    budget: 500,
    spent: 220,
    transactions: 6,
    color: "#f97316",
    trend: 3.8,
    icon: "🏥",
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-muted-foreground">
              Manage and track all your financial transactions
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Budget
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalBudget.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {categories.length} categories
              </p>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#f97316]">
                ${totalSpent.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget used
              </p>
            </CardContent>
          </Card>

          <Card className="border-[var(--border)] bg-[var(--card)]  shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Remaining Budget
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#4ade80]">
                ${(totalBudget - totalSpent).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Available to spend
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 md:gap-6 lg:grid-cols-8">
          <Card className="col-span-full lg:col-span-5 border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-lg">Categories</CardTitle>
                <CardDescription className="text-sm">
                  Manage your expense categories
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white h-8 px-3"
                onClick={() => setIsAddExpenseOpen(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="group relative border border-[var(--border)] bg-[var(--card)] rounded-lg p-3 hover:bg-[var(--card-hover)] transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: category.color }}
                      >
                        {getInitials(category.name)}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[var(--border)] border-[var(--card)]"
                        >
                          <DropdownMenuItem className="text-xs">
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs">
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs text-red-400">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="font-medium text-sm mb-2 truncate">
                      {category.name}
                    </h3>

                    <div className="space-y-1">
                      <div className="text-lg font-bold">
                        ${category.spent.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {category.transactions} transactions
                      </div>
                    </div>

                    <div
                      className="absolute inset-x-0 bottom-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-3 border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader>
              <CardTitle>Spending Distribution</CardTitle>
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
      </div>

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
      />
    </>
  );
}
