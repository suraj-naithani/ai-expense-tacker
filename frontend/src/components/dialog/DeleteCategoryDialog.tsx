"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DeleteCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryName?: string;
    onConfirm: () => void;
}

export function DeleteCategoryDialog({
    open,
    onOpenChange,
    categoryName,
    onConfirm,
}: DeleteCategoryDialogProps) {
    const handleClose = (next: boolean) => {
        onOpenChange(next);
    };

    const handleConfirm = () => {
        onConfirm();
        handleClose(false);
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100" />
            )}
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[430px] bg-[var(--card)] border-[var(--border)] z-110">
                    <DialogHeader>
                        <DialogTitle>Delete category</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-foreground">
                                {categoryName ?? "this category"}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleClose(false)}
                            className="border-[var(--border)] hover:bg-[var(--card-hover)] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            className="bg-[#6366f1] hover:bg-[#4f46e5] cursor-pointer"
                        >
                            Delete category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

