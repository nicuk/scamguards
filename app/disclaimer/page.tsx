import { AlertTriangle, Shield, FileText, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Disclaimer - ScamGuard Malaysia",
  description:
    "Legal disclaimer and privacy policy for ScamGuard Malaysia.",
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Legal Disclaimer</h1>
          <p className="text-muted-foreground">
            Please read this disclaimer carefully before using ScamGuard
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                ScamGuard is a community-driven platform that aggregates
                user-submitted reports about suspected scam activity. The
                information provided through this service is for informational
                purposes only and should not be treated as definitive proof of
                fraud or criminal activity.
              </p>
              <p>
                <strong>ScamGuard does not:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Verify the accuracy of user-submitted reports</li>
                <li>Confirm or deny that any individual or entity is engaged in fraud</li>
                <li>Replace official law enforcement or financial institution verification</li>
                <li>Guarantee the safety of any transaction</li>
              </ul>
              <p>
                Results showing &quot;suspicious&quot; activity indicate that matching
                reports exist in our database, not that fraud has been proven.
                Results showing &quot;clear&quot; or &quot;no known information&quot; do not
                guarantee safety.
              </p>
            </CardContent>
          </Card>

          {/* User-Submitted Data */}
          <Card>
            <CardHeader>
              <CardTitle>User-Submitted Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                All reports on ScamGuard are submitted by community members. By
                submitting a report, you confirm that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>The information provided is accurate to the best of your knowledge</li>
                <li>You have a genuine belief that scam activity occurred</li>
                <li>You understand that false reports may harm innocent parties</li>
                <li>You accept responsibility for the accuracy of your submission</li>
              </ul>
              <p>
                ScamGuard reserves the right to remove or modify reports that
                appear to be false, malicious, or in violation of our terms.
              </p>
            </CardContent>
          </Card>

          {/* PDPA Compliance */}
          <Card id="privacy">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Policy (PDPA Compliance)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                ScamGuard complies with Malaysia&apos;s Personal Data Protection Act
                (PDPA) 2010. This section explains how we handle data.
              </p>

              <h4 className="font-semibold text-foreground">Data We Collect</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Report Data:</strong> Information you voluntarily
                  submit in scam reports (phone numbers, emails, bank accounts,
                  etc.)
                </li>
                <li>
                  <strong>Search Queries:</strong> Data you search for (used
                  anonymously for analysis)
                </li>
                <li>
                  <strong>Technical Data:</strong> Anonymous usage statistics
                  and error logs
                </li>
              </ul>

              <h4 className="font-semibold text-foreground mt-4">
                How We Use Data
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>To provide scam risk assessments to users</li>
                <li>To improve our analysis algorithms</li>
                <li>To detect and prevent abuse of the platform</li>
              </ul>

              <h4 className="font-semibold text-foreground mt-4">
                Data Protection
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Sensitive data is masked in search results</li>
                <li>We do not sell or share data with third parties</li>
                <li>Data is stored securely with encryption</li>
              </ul>

              <h4 className="font-semibold text-foreground mt-4">Your Rights</h4>
              <p>Under PDPA 2010, you have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access data held about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Dispute & Takedown */}
          <Card>
            <CardHeader>
              <CardTitle>Dispute & Takedown Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you believe you have been incorrectly reported on ScamGuard,
                you can submit a dispute through our{" "}
                <a href="/dispute" className="text-primary hover:underline">
                  dispute form
                </a>
                .
              </p>
              <p>When submitting a dispute, please provide:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>The specific information you are disputing</li>
                <li>Your reason for believing the report is incorrect</li>
                <li>Any evidence supporting your claim</li>
                <li>A valid email address for communication</li>
              </ul>
              <p>
                We will review all disputes and may remove or modify reports
                that are found to be inaccurate or malicious.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                To the fullest extent permitted by law, ScamGuard and its
                operators shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Any decisions made based on information from this service</li>
                <li>Financial losses resulting from reliance on our assessments</li>
                <li>Damages arising from inaccurate or incomplete data</li>
                <li>Any harm caused by user-submitted reports</li>
              </ul>
              <p>
                Users are advised to verify all information through official
                channels before making important decisions.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                For questions about this disclaimer, privacy concerns, or
                takedown requests, please use our{" "}
                <a href="/dispute" className="text-primary hover:underline">
                  dispute form
                </a>{" "}
                or contact us through the appropriate channels.
              </p>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <p className="text-sm text-muted-foreground text-center">
            Last updated: {new Date().toLocaleDateString("en-MY", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
