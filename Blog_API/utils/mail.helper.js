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
    // No connectionTimeout / greetingTimeout / socketTimeout configured
    // (Nodemailer defaults can leave sendMail pending indefinitely on bad SMTP paths)
});

const sendEmail = async ({ to, subject, html, text }) => {
    console.log("[DEBUG sendEmail] entry", {
        to,
        from: KEYS.MAIL_FROM,
        host: KEYS.BREVO_SMTP_HOST,
        port: KEYS.BREVO_SMTP_PORT,
        hasUser: Boolean(KEYS.BREVO_SMTP_USER),
        hasPass: Boolean(KEYS.BREVO_SMTP_PASS),
    });

    if (!KEYS.BREVO_SMTP_HOST || !KEYS.BREVO_SMTP_USER || !KEYS.BREVO_SMTP_PASS) {
        console.error("[DEBUG sendEmail] missing SMTP credentials");
        throw new Error("Email SMTP credentials are not configured");
    }

    // TEMP DEBUG — detect hang if sendMail never resolves on Render
    const startedAt = Date.now();
    const hangTimer = setInterval(() => {
        console.error(
            `[DEBUG sendEmail] transporter.sendMail() STILL PENDING after ${Date.now() - startedAt}ms`
        );
    }, 5000);

    console.log("[DEBUG sendEmail] Before transporter.sendMail()");
    try {
        const info = await transporter.sendMail({
            from: KEYS.MAIL_FROM,
            to,
            subject,
            text,
            html,
        });
        clearInterval(hangTimer);
        console.log("[DEBUG sendEmail] Immediately after transporter.sendMail()", {
            messageId: info?.messageId,
            response: info?.response,
            elapsedMs: Date.now() - startedAt,
        });
        return info;
    } catch (sendMailError) {
        clearInterval(hangTimer);
        console.error("[DEBUG sendEmail] Catch transporter.sendMail():", sendMailError);
        throw sendMailError;
    }
};

const sendResetPasswordEmail = async (to, resetLink) => {
    console.log("[DEBUG sendResetPasswordEmail] entry", { to, resetLink });

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

    try {
        const result = await sendEmail({ to, subject, html, text });
        console.log("[DEBUG sendResetPasswordEmail] sendEmail resolved");
        return result;
    } catch (error) {
        console.error("[DEBUG sendResetPasswordEmail] Catch:", error);
        throw error;
    }
};

module.exports = {
    sendEmail,
    sendResetPasswordEmail,
};