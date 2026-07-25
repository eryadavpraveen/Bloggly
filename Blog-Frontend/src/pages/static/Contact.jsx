import React, { useState } from "react";
import StaticPageShell from "./StaticPageShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ShowDirectErrorMessage, ShowDirectSuccessMessage } from "@/src/utils/ShowToastNotification";

const ContactPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            ShowDirectErrorMessage("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Frontend-only for now — no contact API yet
            await new Promise((resolve) => setTimeout(resolve, 400));
            ShowDirectSuccessMessage("Thanks! Your message has been noted.");
            setName("");
            setEmail("");
            setMessage("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <StaticPageShell
            title="Contact"
            description="Questions, feedback, or ideas? Send us a message."
        >
            <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-card p-6 text-foreground">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                        Name
                    </label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                        Message
                    </label>
                    <Textarea
                        id="message"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="How can we help?"
                        disabled={isSubmitting}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send message"}
                </Button>
            </form>

            <p>
                You can also reach us at{" "}
                <a
                    href="mailto:support@bloggly.app"
                    className="font-medium text-foreground underline underline-offset-4"
                >
                    support@bloggly.app
                </a>
                .
            </p>
        </StaticPageShell>
    );
};

export default ContactPage;
