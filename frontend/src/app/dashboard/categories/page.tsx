"use client";

import {
  DollarSign,
  Loader2,
  MoreVertical,
  Plus,
  TrendingDown,
  TrendingUp,
  Trash2,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AddCategoryDialog } from "@/components/dialog/AddCategoryDialog";
import { DeleteCategoryDialog } from "@/components/dialog/DeleteCategoryDialog";
import { UpdateCategoryDialog } from "@/components/dialog/UpdateCategoryDialog";
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
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/api/categoryApi";
import type { Category } from "@/types/category";

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
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { data: categoriesResponse, isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const apiCategories: Category[] = categoriesResponse?.data || [];

  const totalBudget = 3800;
  const totalSpent = 3000;

  const handleCreateCategory = async (categoryData: {
    name: string;
    icon: string;
  }) => {
    const loadingToast = toast.loading("Creating category...");

    try {
      const payload = {
        name: categoryData.name,
        icon: categoryData.icon,
      };

      await createCategory(payload).unwrap();
      toast.success("Category created successfully", {
        description: "You can now use this category for your expenses.",
      });
      setIsAddCategoryOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to create category. Please try again.";
      toast.error(errorMessage);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleSaveEdit = async (updated: { id: string; name: string; icon: string }) => {
    if (!updated.id) return;

    const loadingToast = toast.loading("Updating category...");

    try {
      const payload = {
        name: updated.name,
        icon: updated.icon,
      };

      await updateCategory({ id: updated.id, body: payload }).unwrap();
      toast.success("Category updated successfully", {
        description: "Your changes have been saved.",
      });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update category. Please try again.";
      toast.error(errorMessage);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    const loadingToast = toast.loading("Deleting category...");

    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      toast.success("Category deleted successfully", {
        description: "This category has been removed from your list.",
      });
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete category. Please try again.";
      toast.error(errorMessage);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

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

        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Your Categories</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {isLoading ? "Loading..." : `${apiCategories.length} ${apiCategories.length === 1 ? "category" : "categories"} created`}
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white h-9 px-4"
                onClick={() => setIsAddCategoryOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : apiCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-[var(--border)] rounded-lg bg-[var(--card-hover)]/50">
                <div className="w-14 h-14 rounded-full bg-[var(--card-hover)] flex items-center justify-center mb-4">
                  <DollarSign className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-1">No categories yet</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Create your first category to get started
                </p>
                <Button
                  size="sm"
                  className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                  onClick={() => setIsAddCategoryOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Create Category
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                {apiCategories.map((category) => {
                  return (
                    <div
                      key={category.id}
                      className="relative p-3 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:shadow-lg hover:border-[var(--card-hover)] transition-all duration-300 group cursor-pointer"
                    >
                      {/* 3-dot menu - subtle on hover */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[var(--card-hover)]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[var(--card)] border-[var(--border)] w-32"
                          >
                            <DropdownMenuItem
                              className="text-xs cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEdit(category);
                              }}
                            >
                              <Pencil className="h-3 w-3 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-xs text-red-400 focus:text-red-400 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDelete(category);
                              }}
                            >
                              <Trash2 className="h-3 w-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Circular icon */}
                      <div className="flex justify-center mb-3 mt-1">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-[var(--card-hover)] border border-[var(--border)] shadow-sm group-hover:shadow-md transition-shadow">
                          {category.icon || "📁"}
                        </div>
                      </div>

                      {/* Category Name - bold */}
                      <h3 className="font-semibold text-sm text-center text-foreground truncate mb-2 px-1">
                        {category.name}
                      </h3>

                      {/* Date badge */}
                      <div className="flex items-center justify-center">
                        <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-[var(--card-hover)] border border-[var(--border)] text-muted-foreground">
                          {new Date(category.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 md:gap-6 lg:grid-cols-8">
          <Card className="col-span-full lg:col-span-5 border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-lg">Categories</CardTitle>
                <CardDescription className="text-sm">
                  Manage your expense categories
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-[var(--border)] bg-[var(--card)] rounded-lg p-3"
                  >
                    <div className="flex items-center mb-2">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: category.color }}
                      >
                        {getInitials(category.name)}
                      </div>
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

      <AddCategoryDialog
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onSave={handleCreateCategory}
      />

      <UpdateCategoryDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={editingCategory}
        onSave={handleSaveEdit}
      />

      <DeleteCategoryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        categoryName={categoryToDelete?.name}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
