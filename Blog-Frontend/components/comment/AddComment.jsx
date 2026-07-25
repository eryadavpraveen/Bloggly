import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { openLoginDialog } from "@/src/features/dialog/dialogSlice";
import { addComment } from "@/src/features/comment/commentSlice";

const AddComment = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { isLoadingWhileAdding } = useSelector((state) => state.comment);
    const [content, setContent] = useState("");

    const handleSubmit = () => {
        if (!isAuthenticated) {
            dispatch(openLoginDialog());
            return;
        }

        if (!content.trim()) return;

        dispatch(addComment({ content })).then((result) => {
            if (addComment.fulfilled.match(result)) {
                setContent("");
            }
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-base font-semibold">Add comment</h2>
                <p className="text-sm text-muted-foreground">
                    Share your thoughts on this post.
                </p>
            </div>

            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onClick={() => {
                    if (!isAuthenticated) dispatch(openLoginDialog());
                }}
                placeholder="Write your comment here..."
                rows={5}
                className="min-h-[100px]"
            />

            <div className="flex justify-end">
                <Button
                    onClick={handleSubmit}
                    disabled={isLoadingWhileAdding || !content.trim()}
                    className="mt-2"
                    type="button"
                >
                    {isLoadingWhileAdding ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </div>
    );
};

export default AddComment;