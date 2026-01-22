import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Mail, Linkedin, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex w-full max-w-md flex-col items-center px-6 py-16">
        {/* Avatar */}
        <Avatar className="h-28 w-28 ring-2 ring-border">
          <AvatarImage src="/avatar.jpg" alt="Profile" />
          <AvatarFallback className="text-2xl font-medium">JD</AvatarFallback>
        </Avatar>

        {/* Name & Title */}
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            John Doe
          </h1>
          <p className="mt-1 text-muted-foreground">
            Full-Stack Developer
          </p>
        </div>

        {/* Bio */}
        <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
          Building digital products with a focus on clean code and thoughtful design.
          Currently crafting experiences at Acme Inc.
        </p>

        {/* Contact Info */}
        <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4" />
            <span>+86 138 0000 0000</span>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="h-4 w-4" />
            <span>WeChat: johndoe</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4" />
            <span>Shanghai, China</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="mailto:hello@example.com" aria-label="Email">
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>

        {/* CTA */}
        <Button className="mt-8" asChild>
          <a href="mailto:hello@example.com">Get in Touch</a>
        </Button>
      </main>
    </div>
  );
}
