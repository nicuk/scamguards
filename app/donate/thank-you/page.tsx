import { Metadata } from "next";
import Link from "next/link";
import { Heart, ArrowRight, Share2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thank You for Your Donation | ScamGuards Malaysia",
  description: "Thank you for supporting ScamGuards Malaysia. Your donation helps us keep protecting Malaysians from scams.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-lg mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-500/10 mb-6">
          <Heart className="h-10 w-10 text-pink-500" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Thank You! 🙏
        </h1>

        <p className="text-lg text-muted-foreground mb-2">
          Your donation helps ScamGuards stay free for all Malaysians.
        </p>

        <p className="text-muted-foreground mb-8">
          Because of people like you, we can keep the AI running, the database
          growing, and more Malaysians protected from scammers.
        </p>

        <div className="space-y-3 mb-10">
          <p className="text-sm font-medium">One more thing you can do to help:</p>
          <p className="text-sm text-muted-foreground">
            Share ScamGuards with someone you care about. The more people who
            check before they pay, the fewer victims there are.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/" className="inline-flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/search" className="inline-flex items-center gap-2">
              Check Someone Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
