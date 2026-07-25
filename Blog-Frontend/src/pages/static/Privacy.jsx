import React from "react";
import StaticPageShell from "./StaticPageShell";

const PrivacyPage = () => {
    return (
        <StaticPageShell
            title="Privacy Policy"
            description="How Bloggly collects, uses, and protects your information."
        >
            <p className="text-xs text-muted-foreground">
                Last updated: July 24, 2026
            </p>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">1. Information we collect</h2>
                <p>
                    We collect account details you provide (such as username and
                    email), content you publish (blogs and comments), and basic
                    usage data needed to run the service securely.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">2. How we use information</h2>
                <ul className="list-disc space-y-2 pl-5">
                    <li>To create and manage your account</li>
                    <li>To publish and display your blogs and comments</li>
                    <li>To keep the platform secure and reliable</li>
                    <li>To respond to support requests</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">3. Sharing</h2>
                <p>
                    We do not sell your personal data. Published blogs and
                    comments are visible to other users. We may share limited
                    data with infrastructure providers (for example hosting or
                    image storage) only as needed to operate Bloggly.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">4. Cookies and sessions</h2>
                <p>
                    We use authentication tokens and related storage to keep you
                    signed in and protect your account.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">5. Your choices</h2>
                <p>
                    You can update your profile content, delete blogs or comments
                    you own, and request account-related help through the contact
                    page.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
                <p>
                    For privacy questions, contact us at support@bloggly.app.
                </p>
            </section>
        </StaticPageShell>
    );
};

export default PrivacyPage;
