"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import EmojiPicker, {
    EmojiStyle,
    Theme,
    type EmojiClickData,
} from "emoji-picker-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UpdateCategoryDialogProps } from "@/types/category";

export function UpdateCategoryDialog({
    open,
    onOpenChange,
    category,
    onSave,
}: UpdateCategoryDialogProps) {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState<string>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        if (open && category) {
            setName(category.name);
            setIcon(category.icon);
        }
    }, [open, category]);

    const handleClose = (next: boolean) => {
        if (!next) {
            setName("");
            setIcon("");
            setShowEmojiPicker(false);
        }
        onOpenChange(next);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !name || !icon) return;

        onSave({
            id: category.id,
            name: name.trim(),
            icon,
        });

        handleClose(false);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setIcon(emojiData.emoji);
        setShowEmojiPicker(false);
    };

    if (!category) return null;

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100" />
            )}
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[425px] bg-[var(--card)] border-[var(--border)] z-110">
                    <DialogHeader>
                        <DialogTitle>Update Category</DialogTitle>
                        <DialogDescription>
                            Update your category information.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="category-icon">Icon</Label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="h-10 w-full border-[var(--border)] hover:bg-[var(--card-hover)] cursor-pointer flex items-center justify-center text-xl"
                                    >
                                        {icon || <Plus className="h-4 w-4 text-muted-foreground" />}
                                    </Button>
                                    {showEmojiPicker && (
                                        <div className="absolute top-full left-0 mt-2 z-50">
                                            <EmojiPicker
                                                className="epr-compact"
                                                onEmojiClick={handleEmojiClick}
                                                theme={Theme.DARK}
                                                emojiStyle={EmojiStyle.NATIVE}
                                                width={300}
                                                height={300}
                                                searchPlaceHolder="Search emoji"
                                                lazyLoadEmojis
                                                previewConfig={{ showPreview: false }}
                                                style={{
                                                    background: "var(--card)",
                                                    color: "var(--foreground)",
                                                    border: "1px solid var(--border)",
                                                    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                                                    borderRadius: "12px",
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {icon && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIcon("")}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category-name">Category Name</Label>
                            <Input
                                id="category-name"
                                placeholder="e.g., Food & Dining, Transportation..."
                                className="bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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
                                type="submit"
                                className="bg-[#6366f1] hover:bg-[#4f46e5] cursor-pointer"
                            >
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

