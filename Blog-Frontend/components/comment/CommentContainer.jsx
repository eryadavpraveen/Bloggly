import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentCard from "./CommentCard";
import AddComment from "./AddComment";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import {
    COMMENT_LIMIT,
    deleteComment,
    fetchAllComments,
} from "@/src/features/comment/commentSlice";
import { openLoginDialog } from "@/src/features/dialog/dialogSlice";
import { fetchLoggedUser } from "@/src/features/auth/authSlice";
import { updateComment } from "@/src/features/comment/commentSlice";

const CommentContainer = () => {
    const dispatch = useDispatch();
    const { comments, isLoading, pagination } = useSelector((state) => state.comment);
    const blogId = useSelector((state) => state.article.currentArticle?._id);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (blogId) {
            dispatch(fetchAllComments({ page: 1, limit: COMMENT_LIMIT }));
        }
    }, [blogId, dispatch]);

    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(fetchLoggedUser());
        }
    }, [isAuthenticated, user, dispatch]);

    const isCommentOwner = (comment) => {
        if (!isAuthenticated || !user) return false;
        const commentUserId = comment.user?._id || comment.user;
        const currentUserId = user._id || user.id;
        return String(commentUserId) === String(currentUserId);
    };

    const handlePrev = () => {
        if (!pagination.hasPrevPage || isLoading) return;
        dispatch(
            fetchAllComments({
                page: pagination.currentPage - 1,
                limit: COMMENT_LIMIT,
            })
        );
    };

    const handleNext = () => {
        if (!pagination.hasNextPage || isLoading) return;
        dispatch(
            fetchAllComments({
                page: pagination.currentPage + 1,
                limit: COMMENT_LIMIT,
            })
        );
    };

    const handleDelete = (comment) => {
        if (!isAuthenticated) {
            dispatch(openLoginDialog());
            return;
        }

        if (!isCommentOwner(comment)) {
            return;
        }

        if (!confirm("Delete this comment?")) return;
        dispatch(deleteComment({ commentId: comment._id }));
    };

    const handleEdit = (comment, newContent) => {
        if (!isAuthenticated) {
            dispatch(openLoginDialog());
            return;
        }
        if (!isCommentOwner(comment)) return;
        dispatch(
            updateComment({
                commentId: comment._id,
                content: newContent,
            })
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Leave a Comment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <AddComment />
                </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">All Comments</h3>
                    <p className="text-sm text-muted-foreground">
                        {pagination.totalRecords ?? 0} comments
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <CommentCard
                            key={comment._id}
                            comment={comment}
                            canManage={isCommentOwner(comment)}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between gap-4">
                    <Button
                        variant="secondary"
                        onClick={handlePrev}
                        disabled={!pagination.hasPrevPage || isLoading}
                    >
                        Prev Comment
                    </Button>

                    <span className="text-sm text-muted-foreground">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    <Button
                        variant="secondary"
                        onClick={handleNext}
                        disabled={!pagination.hasNextPage || isLoading}
                    >
                        Next Comment
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CommentContainer;
