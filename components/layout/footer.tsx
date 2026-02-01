import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">ScamGuard</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Community-powered scam detection for Malaysia. Together, we can
              help protect each other from fraud.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/search"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Report a Scam
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/disclaimer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer#privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/dispute"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dispute a Report
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                Help protect Malaysians from scams by reporting suspicious
                activity.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ScamGuard Malaysia. All rights
            reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2 md:mt-0">
            Information provided is community-submitted and should not be
            treated as definitive proof of fraud.
          </p>
        </div>
      </div>
    </footer>
  );
}
