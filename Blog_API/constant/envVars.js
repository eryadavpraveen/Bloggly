const KEYS = {
    MONGO_URL: `${process.env.MONGO_URL}`,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER,

    CLIENT_URL: process.env.CLIENT_URL?.trim().replace(/\/$/, ""),
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST,
    BREVO_SMTP_PORT: process.env.BREVO_SMTP_PORT || 587,
    BREVO_SMTP_USER: process.env.BREVO_SMTP_USER,
    BREVO_SMTP_PASS: process.env.BREVO_SMTP_PASS,
    MAIL_FROM: process.env.MAIL_FROM,
};

module.exports = KEYS;