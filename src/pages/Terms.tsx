import { Layout } from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-4xl font-bold mb-4">
            <span className="text-gradient-gold">Terms of Service</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Please read these terms carefully before using the site and server.
          </p>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              By accessing the server, you agree to follow the rules and respect other players.
            </p>
            <p>
              We reserve the right to suspend or terminate accounts that violate the rules or abuse
              the service.
            </p>
            <p>
              Donations are optional and help support server costs. They do not grant ownership or
              guaranteed access.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
