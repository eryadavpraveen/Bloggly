const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CREATED, NOT_FOUND, UNAUTHORISED } = require("../../constant/httpStatusCode");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/user.model");
const KEYS = require("../../constant/envVars");
const { generateAcessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require("../../utils/token.helper");
const { sendResetPasswordEmail } = require("../../utils/mail.helper");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic Validation
        if (!email || !password) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Email and Password are Required"
            })
        }

        // check if user exist
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: "User Not Found, Please Register First"
            })
        }

        // validate password
        const isPasswordMatching = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatching) {
            return res.status(UNAUTHORISED).json({
                status: "error",
                message: "Invalid Credentials. Please try again."
            })
        }

        // PayLoad
        const payload = {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email
        };


        // Generate access and refresh tokens
        const accessToken = await generateAcessToken(payload);
        const refreshToken = await generateRefreshToken(payload);


        // save refresh token in DB
        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        // response
        res.status(OK).json({
            status: "success",
            message: "Login successful",
            data: {
                accessToken,
                refreshToken
            }
        })

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Username , Email And Password are required"
            })
        }

        // check if user already exist
        const existingemail = await userModel.findOne({ email });
        if (existingemail) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Email Already exist"
            })
        }

        const existingUsername = await userModel.findOne({ username });
        if (existingUsername) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Username Already exist"
            })
        }

        const newUser = new userModel({
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        newUser.password = hashedPassword;

        await newUser.save();

        res.status(CREATED).json({
            status: "success",
            message: "User Successfully Registered",
            data: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        })
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Email is required"
            });
        }

        const user = await userModel.findOne({ email: String(email).trim() });

        // Prevent email enumeration
        if (!user) {
            return res.status(OK).json({
                status: "success",
                message: "If an account exists with this email, a password reset link has been sent."
            });
        }

        // Generate reset token (10 min)
        const resetToken = jwt.sign(
            { id: user._id.toString() },
            KEYS.JWT_SECRET,
            { expiresIn: "10m" }
        );

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Frontend route is /auth/reset-password
        const resetLink = `${KEYS.CLIENT_URL}/auth/reset-password?token=${encodeURIComponent(resetToken)}`;

        try {
            await sendResetPasswordEmail(user.email, resetLink);
        } catch (mailError) {
            // Don't leave a usable token if email failed
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            console.error("Forgot-password email failed:", mailError);

            return res.status(INTERNAL_SERVER_ERROR).json({
                status: "error",
                message: mailError.message || "Failed to send reset email",
            });
        }

        return res.status(OK).json({
            status: "success",
            message: "If an account exists with this email, a password reset link has been sent.",
        });

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Token and new password are required."
            });
        }

        // Password validation
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message:
                    "Password must be at least 8 characters long and include uppercase, lowercase, number and special character."
            });
        }

        let decodedToken;

        try {
            decodedToken = jwt.verify(token, KEYS.JWT_SECRET);
        } catch {
            // 400 (not 401) so clients don't treat this as a session logout
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid or expired reset link."
            });
        }

        const user = await userModel.findOne({
            _id: decodedToken.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Invalid or expired reset link."
            });
        }

        // Prevent reusing old password
        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (isSamePassword) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "New password cannot be the same as your current password."
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Logout from all sessions
        user.refreshToken = null;

        // Invalidate reset token
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        // TODO:
        // Send password changed confirmation email

        return res.status(OK).json({
            status: "success",
            message: "Password reset successfully. Please log in with your new password."
        });

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Old Password and New Password are required"
            });
        }

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(NOT_FOUND).json({
                status: "error",
                message: "User not found"
            });
        }

        // Verify old password
        const isPasswordMatching = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isPasswordMatching) {
            return res.status(UNAUTHORISED).json({
                status: "error",
                message: "Old password is incorrect"
            });
        }

        // Prevent using the same password again
        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (isSamePassword) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "New password cannot be the same as the old password"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return res.status(OK).json({
            status: "success",
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Refresh Token is Required"
            })
        }

        // verify refresh token
        const decodedToken = await verifyRefreshToken(refreshToken);
        const userId = decodedToken.id;
        const user = await userModel.findById(userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(UNAUTHORISED).json({
                status: "error",
                message: "Invalid refresh token"
            })
        }

        // generate new access token
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        const newAccessToken = await generateAcessToken(payload);

        res.status(OK).json({
            status: "success",
            message: "Access token refreshed successfully",
            data: {
                accessToken: newAccessToken
            }
        })


    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }

}

const logOut = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(BAD_REQUEST).json({
                status: "error",
                message: "Refresh Token is Required"
            })
        }

        // find user by refresh token
        const user = await userModel.findOne({ refreshToken });
        if (!user) {
            return res.status(UNAUTHORISED).json({
                status: "error",
                message: "Invalid refresh token"
            })
        }

        // Invalidate the refresh token by removing it from the user's record
        user.refreshToken = null;
        await user.save();

        res.status(OK).json({
            status: "success",
            message: "Logged Out successfully",
            data: null
        })


    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }

}

const getLoggedinUserProfile = async (req, res) => {
    try {
        const user = req.user;

        res.status(OK).json({
            status: "success",
            message: "User Profile Fetched Successful",
            data: user
        })

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
}

module.exports = { login, register, refreshAccessToken, forgotPassword, resetPassword, changePassword, getLoggedinUserProfile, logOut };