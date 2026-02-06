import { Layout } from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-4xl font-bold mb-4">
            <span className="text-gradient-gold">Privacy Policy</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Your privacy is important to us. Learn how we protect your data on L2 AllStars
          </p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p className="mb-3">
                We collect information you provide directly to us, such as when you create an account, participate in interactive features, or contact us for support.
              </p>
              <h3 className="font-display text-base font-semibold text-foreground mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Username and email address</li>
                <li>IP address and device information</li>
                <li>Game statistics and progress</li>
                <li>Communication logs for support purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect and prevent fraudulent activities</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Information Sharing</h2>
              <p className="mb-3">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>With service providers who assist us in operating our website and services</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
              <p className="mb-3">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">9. Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">12. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through our official Discord server or website contact form.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
