const nodemailer = require("nodemailer");
const KEYS = require("../constant/envVars");

const parseSender = (mailFrom = "") => {
    const trimmed = String(mailFrom).trim();
    const match = trimmed.match(/^(.*)<([^>]+)>$/);

    if (match) {
        const name = match[1].trim().replace(/^"|"$/g, "");
        return {
            name: name || undefined,
            email: match[2].trim(),
        };
    }

    return { email: trimmed };
};

const createSmtpTransporter = (port) => {
    const resolvedPort = Number(port) || 587;

    return nodemailer.createTransport({
        host: KEYS.BREVO_SMTP_HOST,
        port: resolvedPort,
        secure: resolvedPort === 465,
        auth: {
            user: KEYS.BREVO_SMTP_USER,
            pass: KEYS.BREVO_SMTP_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
};

const sendEmailViaBrevoApi = async ({ to, subject, html, text }) => {
    const sender = parseSender(KEYS.MAIL_FROM);

    if (!sender.email) {
        throw new Error("MAIL_FROM is not configured");
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": KEYS.BREVO_API_KEY,
        },
        body: JSON.stringify({
            sender,
            to: [{ email: to }],
            subject,
            htmlContent: html,
            textContent: text,
        }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const apiMessage =
            data?.message ||
            data?.error ||
            (Array.isArray(data?.message) ? data.message.join(", ") : null) ||
            `Brevo API error (${response.status})`;
        throw new Error(apiMessage);
    }

    return data;
};

const sendEmailViaSmtp = async ({ to, subject, html, text }) => {
    if (!KEYS.BREVO_SMTP_HOST || !KEYS.BREVO_SMTP_USER || !KEYS.BREVO_SMTP_PASS) {
        throw new Error("Email SMTP credentials are not configured");
    }

    if (!KEYS.MAIL_FROM) {
        throw new Error("MAIL_FROM is not configured");
    }

    const primaryPort = Number(KEYS.BREVO_SMTP_PORT) || 587;
    const portsToTry = [...new Set([primaryPort, 2525, 587])];

    let lastError;

    for (const port of portsToTry) {
        try {
            const transporter = createSmtpTransporter(port);
            const info = await transporter.sendMail({
                from: KEYS.MAIL_FROM,
                to,
                subject,
                text,
                html,
            });
            return info;
        } catch (error) {
            lastError = error;
            console.error(`SMTP send failed on port ${port}:`, error.message || error);
        }
    }

    throw lastError || new Error("Failed to send email via SMTP");
};

const sendEmail = async ({ to, subject, html, text }) => {
    // Prefer Brevo HTTPS API on hosts (e.g. Render) that block outbound SMTP
    if (KEYS.BREVO_API_KEY) {
        return sendEmailViaBrevoApi({ to, subject, html, text });
    }

    return sendEmailViaSmtp({ to, subject, html, text });
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
