export interface Category {
    id: string;
    name: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetCategoriesResponse {
    success: boolean;
    message: string;
    data: Category[];
}

export interface CreateCategoryPayload {
    name: string;
    icon: string;
}

export interface UpdateCategoryPayload {
    name?: string;
    icon?: string;
}

export interface CreateOrUpdateCategoryResponse {
    success: boolean;
    message: string;
    data: Category;
}

export interface DeleteCategoryResponse {
    success: boolean;
    message: string;
}

export interface AddCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (category: { name: string; icon: string }) => void;
}

export interface UpdateCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | null;
    onSave: (payload: { id: string; name: string; icon: string }) => void;
}

