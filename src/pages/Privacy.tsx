import { Layout } from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-4xl font-bold mb-4">
            <span className="text-gradient-gold">Privacy Policy</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            We respect your privacy. This page explains what data we collect and how we use it.
          </p>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              We collect only the information needed to create and manage your account, provide access
              to the User Control Panel, and process donations.
            </p>
            <p>
              We do not sell your personal data. Your email is used for account access, notifications,
              and password recovery.
            </p>
            <p>
              By using this site, you agree to this policy. If you have questions, contact us via the
              Contact page.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
