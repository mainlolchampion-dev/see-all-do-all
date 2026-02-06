import { Layout } from "@/components/layout/Layout";

export default function Contact() {
  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-4xl font-bold mb-4">
            <span className="text-gradient-gold">Contact</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Need help? Reach out through the channels below.
          </p>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Email: LineageAllstars@gmail.com</p>
            <p>Discord: Use the invite link in the footer to join our community.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
