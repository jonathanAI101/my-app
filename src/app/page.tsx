import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Github,
  Twitter,
  Mail,
  Linkedin,
  Phone,
  MapPin,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
];

const contactInfo = [
  { icon: Phone, value: "+86 138 0000 0000", label: "Phone" },
  { icon: MessageCircle, value: "johndoe", label: "WeChat" },
  { icon: MapPin, value: "Shanghai, China", label: "Location" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-4 py-16 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-2xl">
        {/* Header Section */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
          <Avatar className="h-32 w-32 shrink-0 border-4 border-background shadow-xl transition-transform duration-300 hover:scale-105">
            <AvatarImage src="/avatar.jpg" alt="John Doe" />
            <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
              JD
            </AvatarFallback>
          </Avatar>

          <div className="mt-6 text-center sm:mt-0 sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              John Doe
            </h1>
            <p className="mt-2 text-lg font-medium text-primary">
              Full-Stack Developer
            </p>
            <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
              Building digital products with a focus on clean code and
              thoughtful design. Currently crafting experiences at Acme Inc.
            </p>

            {/* Social Links - Desktop */}
            <div className="mt-6 hidden gap-1 sm:flex">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  asChild
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links - Mobile */}
        <div className="mt-6 flex justify-center gap-1 sm:hidden">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <Button
              key={label}
              variant="ghost"
              size="icon"
              className="text-muted-foreground transition-colors hover:text-foreground"
              asChild
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            </Button>
          ))}
        </div>

        <Separator className="my-10" />

        {/* Contact Section */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Contact
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {contactInfo.map(({ icon: Icon, value, label }) => (
              <Card
                key={label}
                className="group cursor-default p-4 transition-all duration-200 hover:bg-muted/50 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">
                      {value}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Let&apos;s work together
          </h2>
          <p className="mt-2 text-muted-foreground">
            Have a project in mind? I&apos;d love to hear about it.
          </p>
          <Button size="lg" className="mt-6 gap-2" asChild>
            <a href="mailto:hello@example.com">
              Get in Touch
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} John Doe. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
