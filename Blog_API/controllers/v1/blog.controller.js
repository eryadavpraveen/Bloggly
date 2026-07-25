const blogModel = require("../../models/blog.model");
const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CREATED, NOT_FOUND, UNAUTHORISED } = require("../../constant/httpStatusCode");
const { isValidObjectId, Types } = require("mongoose");
const cloudinary = require('cloudinary').v2;
const envVars = require("../../constant/envVars");
const { slugify } = require("../../utils/slug.helper");

cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
});

const getAllBlogs = async (req, res) => { //only published not drafted
    try {
        // Pagination Parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const { searchQuery, sortBy } = req.query;

        let query = {};
        let sort = { createdAt: -1 }; // Default: Newest First

        // Search filter
        if (searchQuery?.trim()) {
            query = {
                $or: [
                    { title: { $regex: searchQuery, $options: "i" } },
                    { shortDescription: { $regex: searchQuery, $options: "i" } },
                    { content: { $regex: searchQuery, $options: "i" } },
                ],
            };
        }

        // Sorting
        switch (sortBy) {
            case "newest":
                sort = { createdAt: -1 };
                break;

            case "oldest":
                sort = { createdAt: 1 };
                break;

            case "alphabetical":
                sort = { title: 1 };
                break;

            default:
                sort = { createdAt: -1 };
        }


        const blogs = await blogModel.aggregate([
            { $match: { ...query, status: "published" } },
            { $sort: sort },
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
                $lookup: {
                    from: "users",
                    let: { userId: "$user" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                        { $project: { username: 1 } },
                    ],
                    as: "user",
                },
            },
            {
                $addFields: {
                    commentCount: { $size: "$comments" },
                    user: { $arrayElemAt: ["$user", 0] },
                },
            },
            {
                $project: {
                    comments: 0,
                    __v: 0,
                },
            },
        ]);

        const totalRecords = await blogModel.countDocuments({ ...query, status: "published" });
        const totalPages = Math.ceil(totalRecords / limit);



        res.status(OK).json({
            status: "Success",
            message: "Blogs Fetched Successfully",
            data: blogs,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: page,
                pageSize: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1

            }
        });

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
}

const getBlogsByUserId = async (req, res) => {
    try {
        const reqUser = req.user;
        const userId = reqUser?._id || reqUser?.id;



        if (!userId) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "User ID is required",
            });
        }

        if (!isValidObjectId(userId)) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid User ID",
            });
        }

        const { searchQuery, status, sortBy } = req.query;

        let query = {};
        let sort = { createdAt: -1 }; // Default: Newest First

        // search filter
        if (searchQuery && searchQuery.trim() !== "") {
            query = {
                $or: [
                    { title: { $regex: searchQuery, $options: "i" } },
                    { shortDescription: { $regex: searchQuery, $options: "i" } },
                    { content: { $regex: searchQuery, $options: "i" } },
                ],
            }
        };

        // query filter for status (draft or published)
        if (status && ["draft", "published"].includes(status)) {
            query.status = status;
        }

        // Sorting
        switch (sortBy) {
            case "newest":
                sort = { createdAt: -1 };
                break;

            case "oldest":
                sort = { createdAt: 1 };
                break;

            case "alphabetical":
                sort = { title: 1 };
                break;

            default:
                sort = { createdAt: -1 };
        }



        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const matchStage = {
            $match: {
                ...query,
                user: new Types.ObjectId(userId),
            },
        };

        const blogs = await blogModel.aggregate([
            matchStage,
            { $sort: sort },
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
                $lookup: {
                    from: "users",
                    let: { userId: "$user" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                        { $project: { username: 1 } },
                    ],
                    as: "user",
                },
            },
            {
                $addFields: {
                    commentCount: { $size: "$comments" },
                    user: { $arrayElemAt: ["$user", 0] },
                },
            },
            {
                $project: {
                    comments: 0,
                    __v: 0,
                },
            },
        ]);

        const totalRecords = await blogModel.countDocuments({ ...query, user: userId });
        const totalPages = Math.ceil(totalRecords / limit);

        res.status(OK).json({
            status: "Success",
            message: "User blogs fetched successfully",
            data: blogs,
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

const getBlogBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        if (!slug) {
            res.status(BAD_REQUEST).json({
                status: "error",
                message: "slug is required"
            })
        }
        const blog = await blogModel.find({ slug: slug }).populate("user", "username").select("-__v");
        if (blog.length === 0) {
            res.status(NOT_FOUND).json({
                status: "error",
                message: "Blog Not found"
            })
        }

        res.status(200).json({
            status: "Success",
            message: "Blog Fetched Successfully",
            data: blog,
        });

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
}

const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;

        if (!blogId) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Blog ID is required",
            });
        }

        if (!isValidObjectId(blogId)) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid Blog ID",
            });
        }

        const blog = await blogModel
            .findById(blogId)
            .populate("user", "username")
            .select("-__v");

        if (!blog) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: "Blog Not Found",
            });
        }

        res.status(OK).json({
            status: "Success",
            message: "Blog Fetched Successfully",
            data: blog,
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error",
        });
    }
};

const createBlog = async (req, res) => {
    try {
        let { title, content, tags, shortDescription, status } = req.body;

        // Convert JSON string to array
        if (typeof tags === "string") {
            tags = JSON.parse(tags);
        }

        const reqUser = req.user;

        if (!title || !content || !shortDescription) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Title, Content and Short Description are required."
            });
        }

        const baseSlug = slugify(title) || "blog";
        let slug = baseSlug;
        const existingWithSlug = await blogModel.findOne({ slug });
        if (existingWithSlug) {
            slug = `${baseSlug}-${Date.now()}`;
        }

        const newBlog = new blogModel({
            slug,
            title,
            content,
            shortDescription,
            tags,
            user: reqUser.id,
            image: req.file?.path,
            status: status || "draft",
        });

        await newBlog.save();

        res.status(CREATED).json({
            status: "success",
            message: "Blog Created Successfully",
            data: newBlog,
        });

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error",
        });
    }
};

const updateBlog = async (req, res) => {
    try {
        const reqUser = req.user;
        const blogId = req.params.id;

        if (!blogId) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Blog ID is required"
            });
        }
        if (!isValidObjectId(blogId)) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid Blog ID"
            });
        }

        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: "Blog Not Found"
            });
        }

        const ownerId = reqUser._id || reqUser.id;
        if (blog.user.toString() !== ownerId.toString()) {
            return res.status(UNAUTHORISED).json({
                status: "error",
                message: "You are not authorised to update this blog"
            });
        }

        let { title, content, shortDescription, tags } = req.body;
        if (!title || !content || !shortDescription) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Title , Content and Short Description are required."
            });
        }

        if (typeof tags === "string") {
            try {
                tags = JSON.parse(tags);
            } catch {
                tags = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
            }
        }
        if (!Array.isArray(tags)) {
            tags = blog.tags || [];
        }

        const baseSlug = slugify(title) || "blog";
        let newSlug = baseSlug;
        const existingWithSlug = await blogModel.findOne({
            slug: baseSlug,
            _id: { $ne: blogId },
        });
        if (existingWithSlug) {
            newSlug = `${baseSlug}-${Date.now()}`;
        }

        if (req.file && blog.image) {
            const imagePublicId = blog.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(
                `${envVars.CLOUDINARY_FOLDER}/${imagePublicId}`
            );
        }

        const updatedBlog = await blogModel.findByIdAndUpdate(
            blogId,
            {
                $set: {
                    title,
                    content,
                    shortDescription,
                    tags,
                    slug: newSlug,
                    image: req.file?.path || blog.image,
                },
            },
            { new: true }
        ).populate("user", "username").select("-__v");

        res.status(OK).json({
            status: "success",
            message: "Blog Updated Successfully",
            data: updatedBlog,
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const reqUser = req.user;
        const blogId = req.params.id;

        if (!blogId) {
            res.status(BAD_REQUEST).json({
                status: "error",
                message: "Blog ID is required"
            })
        }
        if (!isValidObjectId(blogId)) {
            res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid Blog ID"
            })
        }

        const blog = await blogModel.findById(blogId);
        if (!blog) {
            res.status(NOT_FOUND).json({
                status: "error",
                message: "Blog Not Found"
            })
        }

        // article can only be deleted by the author of the article
        if (blog.user.toString() !== reqUser.id) {
            res.status(UNAUTHORISED).json({
                status: "error",
                message: "You are not authorised to delete this blog"
            })
        }

        // delete image from cloudinary if it exists
        if (blog.image) {
            const imagePublicId = blog.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`${envVars.CLOUDINARY_FOLDER}/${imagePublicId}`);
        }


        await blogModel.findByIdAndDelete(blogId);

        res.status(OK).json({
            status: "success",
            message: "Blog Deleted Successfully",
        })

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
}

const publishBlog = async (req, res) => {
    try {
        const { blogId } = req.body;
        const reqUser = req.user
        if (!blogId) {
            res.status(BAD_REQUEST).json({
                status: "error",
                message: "Blog ID is required to publish a blog"
            })
        }

        if (!isValidObjectId(blogId)) {
            res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid Blog ID"
            })
        }

        const blog = await blogModel.findById(blogId);
        if (!blog) {
            res.status(NOT_FOUND).json({
                status: "error",
                message: "Blog Not Found"
            })
        }

        if (blog.status === "published") {
            res.status(BAD_REQUEST).json({
                status: "error",
                message: "Blog is already published"
            })
        }

        // article can only be updated by the author of the article
        if (blog.user.toString() !== reqUser.id) {
            res.status(UNAUTHORISED).json({
                status: "error",
                message: "You are not authorised to publish this blog"
            })
        }

        blog.status = "published";
        await blog.save();

        res.status(OK).json({
            status: "success",
            message: "Blog Published Successfully",
            data: blog,
        })

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
}

const unPublishBlog = async (req, res) => {
    try {
        const { blogId } = req.body;
        const reqUser = req.user
        if (!blogId) {
            res.status(BAD_REQUEST).json({
                status: "error",
                message: "Blog ID is required to publish a blog"
            })
        }

        if (!isValidObjectId(blogId)) {
            res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid Blog ID"
            })
        }

        const blog = await blogModel.findById(blogId);
        if (!blog) {
            res.status(NOT_FOUND).json({
                status: "error",
                message: "Blog Not Found"
            })
        }

        // article can only be updated by the author of the article
        if (blog.user.toString() !== reqUser.id) {
            res.status(UNAUTHORISED).json({
                status: "error",
                message: "You are not authorised to draft this blog"
            })
        }

        if (blog.status === "draft") {
            res.status(BAD_REQUEST).json({
                status: "error",
                message: "Blog is not Published Yet"
            })
        }

        blog.status = "draft";
        await blog.save();

        res.status(OK).json({
            status: "success",
            message: "Blog drafted Successfully",
            data: blog,
        })

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
}

const likeBlog = async (req, res) => {
    try {
        const reqUser = req.user;
        const blogId = req.params.id;
        const userId = (reqUser._id || reqUser.id).toString();

        if (!blogId) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Blog ID is required",
            });
        }

        if (!isValidObjectId(blogId)) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid Blog ID",
            });
        }

        if (!reqUser) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "User is required to like blog",
            });
        }

        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: "Blog not found",
            });
        }

        const alreadyLiked = (blog.likes || []).some(
            (id) => id.toString() === userId
        );

        if (alreadyLiked) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "You have already liked the blog",
            });
        }

        const updatedBlog = await blogModel.findByIdAndUpdate(
            blogId,
            { $addToSet: { likes: reqUser._id || reqUser.id } },
            { new: true }
        );

        res.status(OK).json({
            status: "success",
            message: "Blog Liked Successfully",
            data: {
                blogId: updatedBlog._id,
                totalLikes: updatedBlog.likes.length,
            },
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error",
        });
    }
};

const unlikeBlog = async (req, res) => {
    try {
        const reqUser = req.user;
        const blogId = req.params.id;
        const userId = (reqUser._id || reqUser.id).toString();

        if (!blogId) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Blog ID is required",
            });
        }

        if (!isValidObjectId(blogId)) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid Blog ID",
            });
        }

        if (!reqUser) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "User is required to unlike blog",
            });
        }

        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: "Blog not found",
            });
        }

        const hasLiked = (blog.likes || []).some(
            (id) => id.toString() === userId
        );

        if (!hasLiked) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "You have not liked this blog",
            });
        }

        const updatedBlog = await blogModel.findByIdAndUpdate(
            blogId,
            { $pull: { likes: reqUser._id || reqUser.id } },
            { new: true }
        );

        res.status(OK).json({
            status: "success",
            message: "Blog Unliked Successfully",
            data: {
                blogId: updatedBlog._id,
                totalLikes: updatedBlog.likes.length,
            },
        });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error",
        });
    }
};

module.exports = {
    getAllBlogs,
    getBlogsByUserId,
    createBlog,
    getBlogBySlug,
    getBlogById,
    updateBlog,
    deleteBlog,
    publishBlog,
    unPublishBlog,
    likeBlog,
    unlikeBlog,
}