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

interface DeletePaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    paymentPersonName?: string;
    paymentAmount?: number;
    paymentType?: "LENT" | "BORROWED";
    onConfirm: () => void;
    bulkDeleteCount?: number;
}

export function DeletePaymentDialog({
    open,
    onOpenChange,
    paymentPersonName,
    paymentAmount,
    paymentType,
    onConfirm,
    bulkDeleteCount,
}: DeletePaymentDialogProps) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    const getPaymentInfo = () => {
        if (bulkDeleteCount && bulkDeleteCount > 0) {
            return `${bulkDeleteCount} payment${bulkDeleteCount > 1 ? "s" : ""}`;
        }
        if (paymentPersonName && paymentAmount) {
            return `payment to ${paymentPersonName} of ₹${paymentAmount.toFixed(2)}`;
        }
        if (paymentPersonName) {
            return `payment to ${paymentPersonName}`;
        }
        return "this payment";
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
            )}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[430px] bg-[var(--card)] border-[var(--border)] z-[110]">
                    <DialogHeader>
                        <DialogTitle>
                            {bulkDeleteCount && bulkDeleteCount > 0 ? "Delete payments" : "Delete payment"}
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-foreground">
                                {getPaymentInfo()}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-[var(--border)] hover:bg-[var(--card-hover)] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            className="bg-[#6366f1] hover:bg-[#4f46e5] cursor-pointer"
                        >
                            {bulkDeleteCount && bulkDeleteCount > 0 ? "Delete payments" : "Delete payment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

