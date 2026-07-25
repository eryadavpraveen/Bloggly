const { INTERNAL_SERVER_ERROR, OK, BAD_REQUEST, NOT_FOUND, UNAUTHORISED } = require("../../constant/httpStatusCode");
const commentModel = require("../../models/comment.model")
const { isValidObjectId } = require("mongoose");


const getAllCommentsForBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;

        if (!blogId) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "BlogId is required",
            });
        }

        if (!isValidObjectId(blogId)) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid Blog ID",
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 7;
        const skip = (page - 1) * limit;

        const filter = { blog: blogId };

        const comments = await commentModel
            .find(filter)
            .select("-__v")
            .populate("user", "username")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalRecords = await commentModel.countDocuments(filter);
        const totalPages = Math.ceil(totalRecords / limit);

        res.status(OK).json({
            status: "Success",
            message: "Comments Fetched Successfully",
            data: comments,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: page,
                pageSize: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error",
        });
    }
};


const addCommentToBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const reqUser = req.user;
        const { content } = req.body;
        if (!blogId) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "BlogId is required"
            })
        }

        if (!isValidObjectId(blogId)) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid Blog ID"
            })
        }

        if (!reqUser) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "User is required to comment"
            })
        }

        if (!content) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Content is required to comment"
            })
        }


        const newComment = new commentModel({
            blog: blogId,
            user: reqUser.id,
            content,
        })

        await newComment.save();

        res.status(OK).json({
            status: "Success",
            message: "Comments Added Successfully",
            data: newComment,
        });

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
};

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const reqUser = req.user;
        if (!commentId) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Comment Id  is required to delete"
            })
        }

        if (!isValidObjectId(commentId)) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid comment ID"
            })
        }

        if (!reqUser) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "User is required to delete comment"
            })
        }

        const comment = await commentModel.findById(commentId);


        if (!comment) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: "COMMENT NOT FOUND"
            })
        }

        if (comment.user.toString() !== reqUser._id.toString()) {
            return res.status(UNAUTHORISED).json({
                status: "error",
                message: "You are not authorised to delete this comment"
            })
        }

        await commentModel.findByIdAndDelete(commentId);

        res.status(OK).json({
            status: "Success",
            message: "Comment Deleted Successfully",
        });

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
};

const updateComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const reqUser = req.user;
        const { content } = req.body;
        if (!commentId) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Comment Id  is required to update"
            })
        }

        if (!isValidObjectId(commentId)) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid comment ID"
            })
        }

        if (!reqUser) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "User is required to update comment"
            })
        }
        if (!content) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Content is required to update comment"
            })
        }

        const comment = await commentModel.findById(commentId);


        if (!comment) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: "COMMENT NOT FOUND"
            })
        }

        if (comment.user.toString() !== reqUser.id) {
            return res.status(UNAUTHORISED).json({
                status: "error",
                message: "You are not authorised to update this comment"
            })
        }

        await commentModel.findByIdAndUpdate(commentId, {
            $set: {
                content
            }
        });

        res.status(OK).json({
            status: "Success",
            message: "Comment Updated Successfully",
        });

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
}

module.exports = { getAllCommentsForBlog, addCommentToBlog, deleteComment, updateComment };