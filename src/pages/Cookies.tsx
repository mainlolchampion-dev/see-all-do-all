import { Layout } from "@/components/layout/Layout";

export default function Cookies() {
  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-4xl font-bold mb-4">
            <span className="text-gradient-gold">Cookie Policy</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Learn how we use cookies to enhance your experience on L2 AllStars
          </p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. How We Use Cookies</h2>
              <p className="mb-3">L2 AllStars uses cookies to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Remember your preferences and settings</li>
                <li>Keep you logged in during your session</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Improve website functionality and user experience</li>
                <li>Provide personalized content and features</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Types of Cookies We Use</h2>

              <h3 className="font-display text-base font-semibold text-foreground mb-2">Essential Cookies</h3>
              <p className="mb-4">
                These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and user authentication.
              </p>

              <h3 className="font-display text-base font-semibold text-foreground mb-2">Performance Cookies</h3>
              <p className="mb-4">
                These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us improve website performance.
              </p>

              <h3 className="font-display text-base font-semibold text-foreground mb-2">Functionality Cookies</h3>
              <p className="mb-4">
                These cookies allow the website to remember choices you make and provide enhanced, personalized features.
              </p>

              <h3 className="font-display text-base font-semibold text-foreground mb-2">Analytics Cookies</h3>
              <p>
                We use analytics cookies to understand how our website is being used and to improve user experience.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Third-Party Cookies</h2>
              <p className="mb-3">We may use third-party services that place cookies on your device. These include:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Google Analytics for website analytics</li>
                <li>Social media platforms for sharing features</li>
                <li>Content delivery networks for improved performance</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Cookie Duration</h2>

              <h3 className="font-display text-base font-semibold text-foreground mb-2">Session Cookies</h3>
              <p className="mb-4">
                These are temporary cookies that expire when you close your browser.
              </p>

              <h3 className="font-display text-base font-semibold text-foreground mb-2">Persistent Cookies</h3>
              <p>
                These cookies remain on your device for a set period or until you delete them manually.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Managing Cookies</h2>
              <p className="mb-3">You can control and manage cookies in several ways:</p>

              <h3 className="font-display text-base font-semibold text-foreground mb-2">Browser Settings</h3>
              <p className="mb-3">Most browsers allow you to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-4">
                <li>View cookies stored on your device</li>
                <li>Delete existing cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies</li>
                <li>Delete cookies when you close your browser</li>
              </ul>

              <h3 className="font-display text-base font-semibold text-foreground mb-2">Browser-Specific Instructions</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-foreground">Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
                <li><strong className="text-foreground">Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
                <li><strong className="text-foreground">Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
                <li><strong className="text-foreground">Edge:</strong> Settings &gt; Cookies and site permissions</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">7. Impact of Disabling Cookies</h2>
              <p>
                Please note that disabling cookies may affect the functionality of our website. Some features may not work properly or may be unavailable if cookies are disabled.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">8. Cookie Consent</h2>
              <p>
                By continuing to use our website, you consent to our use of cookies as described in this policy. You can withdraw your consent at any time by adjusting your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">9. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">10. Contact Information</h2>
              <p>
                If you have any questions about our use of cookies, please contact us through our official Discord server or website contact form.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">11. More Information</h2>
              <p className="mb-3">For more information about cookies and how they work, visit:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    All About Cookies
                  </a>
                </li>
                <li>
                  <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Your Online Choices
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
