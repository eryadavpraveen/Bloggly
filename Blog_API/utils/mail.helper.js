const nodemailer = require("nodemailer");
const KEYS = require("../constant/envVars");

const transporter = nodemailer.createTransport({
    host: KEYS.BREVO_SMTP_HOST,
    port: Number(KEYS.BREVO_SMTP_PORT),
    secure: false, // port 587 uses STARTTLS
    auth: {
        user: KEYS.BREVO_SMTP_USER,
        pass: KEYS.BREVO_SMTP_PASS,
    },
});

const sendEmail = async ({ to, subject, html, text }) => {
    if (!KEYS.BREVO_SMTP_HOST || !KEYS.BREVO_SMTP_USER || !KEYS.BREVO_SMTP_PASS) {
        throw new Error("Email SMTP credentials are not configured");
    }

    const info = await transporter.sendMail({
        from: KEYS.MAIL_FROM,
        to,
        subject,
        text,
        html,
    });

    return info;
};

const sendResetPasswordEmail = async (to, resetLink) => {
    const subject = "Reset your Bloggly password";
    const text = `Reset your password using this link (valid for 10 minutes):\n\n${resetLink}\n\nIf you did not request this, ignore this email.`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Reset your Bloggly password</h2>
        <p>We received a request to reset your password.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">
            Reset password
          </a>
        </p>
        <p>Or copy this link:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `;

    return sendEmail({ to, subject, html, text });
};

module.exports = {
    sendEmail,
    sendResetPasswordEmail,
};