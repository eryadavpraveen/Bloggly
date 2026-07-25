const userModel = require("../../models/user.model");
const blogModel = require("../../models/blog.model");
const {
    OK,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    NOT_FOUND,
} = require("../../constant/httpStatusCode");
const { Types } = require("mongoose");

const getPublicProfileByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username?.trim()) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Username is required",
            });
        }

        const user = await userModel
            .findOne({ username: username.trim() })
            .select("username createdAt updatedAt")
            .lean();

        if (!user) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: "User not found",
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;
        const userId = new Types.ObjectId(user._id);

        const blogs = await blogModel.aggregate([
            {
                $match: {
                    user: userId,
                    status: "published",
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "blog",
                    as: "comments",
                },
            },
            {
                $addFields: {
                    commentCount: { $size: "$comments" },
                },
            },
            {
                $project: {
                    comments: 0,
                    __v: 0,
                },
            },
        ]);

        const statsAgg = await blogModel.aggregate([
            {
                $match: {
                    user: userId,
                    status: "published",
                },
            },
            {
                $group: {
                    _id: null,
                    publishedBlogs: { $sum: 1 },
                    totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
                },
            },
        ]);

        const totalPublished = statsAgg[0]?.publishedBlogs || 0;
        const totalLikes = statsAgg[0]?.totalLikes || 0;
        const totalPages = Math.ceil(totalPublished / limit) || 1;

        return res.status(OK).json({
            status: "success",
            message: "Public profile fetched successfully",
            data: {
                user,
                stats: {
                    publishedBlogs: totalPublished,
                    totalLikes,
                },
                blogs,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalBlogs: totalPublished,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
        });
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error",
        });
    }
};

module.exports = {
    getPublicProfileByUsername,
};
