import React from "react";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash } from "lucide-react";

const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const CommentCard = ({ comment, onEdit, onDelete, canManage = false }) => {
    if (!comment) return null;

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    useEffect(() => {
        setEditContent(comment.content);
    }, [comment.content]);

    const handleSave = () => {
        if (!editContent.trim()) return;
        onEdit?.(comment, editContent);
        setIsEditing(false);
    };
    const handleCancel = () => {
        setEditContent(comment.content);
        setIsEditing(false);
    };

    return (
        <Card className="border-border bg-background">
            <CardContent className="space-y-4 p-5">
                <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback>{comment.user?.username?.charAt(0) ?? "U"}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold text-foreground">{comment.user?.username}</p>
                                <time className="text-xs text-muted-foreground">{formatCommentDate(comment.createdAt)}</time>
                            </div>

                            {canManage && (
                                <div className="shrink-0">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent side="bottom" align="end" className="w-40">
                                            <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Update
                                            </DropdownMenuItem>
                                            <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(comment)}>
                                                <Trash className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="mt-3 space-y-2">
                                <Textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows={4}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleSave} disabled={!editContent.trim()}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-3 text-sm leading-7 text-foreground">{comment.content}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CommentCard;
