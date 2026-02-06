import { Layout } from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-4xl font-bold mb-4">
            <span className="text-gradient-gold">Terms and Conditions</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Please read our terms and conditions carefully before using L2 AllStars
          </p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using L2 AllStars ("the Server"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. Game Rules and Conduct</h2>
              <p className="mb-3">Players must adhere to the following rules:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>No cheating, hacking, or use of third-party software</li>
                <li>No harassment, offensive language, or toxic behavior</li>
                <li>No real money trading (RMT) of in-game items</li>
                <li>No exploitation of game bugs or glitches</li>
                <li>Respect all players and staff members</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Account Responsibility</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Intellectual Property</h2>
              <p>
                The Server and its original content, features, and functionality are owned by L2 AllStars and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Prohibited Uses</h2>
              <p className="mb-3">You may not use our service:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">7. Disclaimer</h2>
              <p>
                The information on this server is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">8. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">9. Contact Information</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us through our official Discord server or website contact form.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
