import { SearchForm } from "@/components/search/search-form";
import { Shield, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata = {
  title: "Search - ScamGuard Malaysia",
  description: "Check if phone numbers, emails, or other details have been reported in scam incidents.",
};

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Check for Reports</h1>
          <p className="text-muted-foreground">
            Enter details to see if they&apos;ve been reported in scam incidents
          </p>
        </div>

        {/* Search Form */}
        <SearchForm />

        {/* Info Box */}
        <Alert className="mt-8">
          <Info className="h-4 w-4" />
          <AlertTitle>How this works</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>
              We search our database of community-submitted reports to find
              matches. Our system then analyzes the results to provide a risk
              assessment.
            </p>
            <p className="text-sm">
              <strong>Supported formats:</strong> Malaysian phone numbers
              (+60XX-XXX XXXX), email addresses, bank accounts, crypto wallets,
              social media profiles, and more.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
