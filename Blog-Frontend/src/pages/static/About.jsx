import React from "react";
import { Link } from "react-router-dom";
import StaticPageShell from "./StaticPageShell";

const AboutPage = () => {
    return (
        <StaticPageShell
            title="About Bloggly"
            description="A simple place to read, write, and share stories that matter."
        >
            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Our mission</h2>
                <p>
                    Bloggly helps writers publish thoughtfully and helps readers
                    discover clear, useful content. We keep the experience
                    focused: create posts, engage with comments, and share what
                    you care about.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">What you can do</h2>
                <ul className="list-disc space-y-2 pl-5">
                    <li>Publish blogs with rich content and cover images</li>
                    <li>Like and comment on posts from the community</li>
                    <li>Manage drafts and published work from your dashboard</li>
                    <li>Share posts with a single link</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Built for makers</h2>
                <p>
                    Whether you are documenting a project, teaching a skill, or
                    telling a story, Bloggly gives you a clean workspace without
                    unnecessary noise.
                </p>
            </section>

            <div className="pt-4">
                <Link
                    to="/blogs"
                    className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                >
                    Explore blogs
                </Link>
            </div>
        </StaticPageShell>
    );
};

export default AboutPage;
