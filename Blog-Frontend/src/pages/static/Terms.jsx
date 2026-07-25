import React from "react";
import StaticPageShell from "./StaticPageShell";

const TermsPage = () => {
    return (
        <StaticPageShell
            title="Terms of Service"
            description="The rules for using Bloggly."
        >
            <p className="text-xs text-muted-foreground">
                Last updated: July 24, 2026
            </p>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">1. Acceptance</h2>
                <p>
                    By creating an account or using Bloggly, you agree to these
                    Terms of Service. If you do not agree, please do not use the
                    platform.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">2. Accounts</h2>
                <p>
                    You are responsible for keeping your login credentials secure
                    and for activity that happens under your account.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">3. Content</h2>
                <ul className="list-disc space-y-2 pl-5">
                    <li>You retain ownership of content you create</li>
                    <li>You grant Bloggly a license to host and display it</li>
                    <li>
                        Do not post illegal, harmful, or infringing material
                    </li>
                    <li>
                        We may remove content that violates these terms
                    </li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">4. Acceptable use</h2>
                <p>
                    Do not attempt to disrupt the service, abuse other users, or
                    misuse APIs and authentication features.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">5. Availability</h2>
                <p>
                    Bloggly is provided as-is. Features may change, and we may
                    experience downtime for maintenance or unexpected issues.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">6. Changes</h2>
                <p>
                    We may update these terms from time to time. Continued use of
                    Bloggly after changes means you accept the updated terms.
                </p>
            </section>
        </StaticPageShell>
    );
};

export default TermsPage;
